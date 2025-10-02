import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { CustomException } from '../exceptions/custom.exception';
import { StatusCodeMap } from '@repo/types/enums/status-code';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let redisService: RedisService;
  let configService: ConfigService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
  };

  const mockUserWithoutPassword = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'REFRESH_TOKEN_EXPIRES_IN_DAYS') return '7';
              return 'test-secret';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toEqual(mockUserWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate tokens and store refresh token in Redis', async () => {
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';

      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.login(mockUserWithoutPassword);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenNthCalledWith(1, {
        sub: mockUserWithoutPassword.id,
        email: mockUserWithoutPassword.email,
      });
      expect(jwtService.sign).toHaveBeenNthCalledWith(2, {
        sub: mockUserWithoutPassword.id,
        email: mockUserWithoutPassword.email,
      }, { expiresIn: '7d' });
      expect(redisService.set).toHaveBeenCalledWith(
        `refresh_token:${mockUserWithoutPassword.id}`,
        refreshToken,
        7 * 24 * 60 * 60
      );
      expect(result).toEqual({
        ...mockUserWithoutPassword,
        accessToken,
        refreshToken,
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully when valid', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';
      const userId = '1';

      jest.spyOn(jwtService, 'verify').mockReturnValue({
        sub: userId,
        email: 'test@example.com',
      });
      jest.spyOn(redisService, 'get').mockResolvedValue(oldRefreshToken);
      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce(newAccessToken)
        .mockReturnValueOnce(newRefreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.refreshToken(oldRefreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(oldRefreshToken);
      expect(redisService.get).toHaveBeenCalledWith(`refresh_token:${userId}`);
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });

    it('should throw exception when refresh token is not a string', async () => {
      await expect(service.refreshToken(null as any)).rejects.toThrow(CustomException);
    });

    it('should throw exception when refresh token has no userId', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        email: 'test@example.com',
      });

      await expect(service.refreshToken('token')).rejects.toThrow(CustomException);
    });

    it('should throw exception when refresh token is not found in Redis', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        sub: '1',
        email: 'test@example.com',
      });
      jest.spyOn(redisService, 'get').mockResolvedValue(null);

      await expect(service.refreshToken('token')).rejects.toThrow(CustomException);
    });

    it('should throw exception when refresh tokens do not match', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        sub: '1',
        email: 'test@example.com',
      });
      jest.spyOn(redisService, 'get').mockResolvedValue('different-token');

      await expect(service.refreshToken('token')).rejects.toThrow(CustomException);
    });

    it('should throw exception when JWT token is expired', async () => {
      const error = new Error('TokenExpiredError');
      error.name = 'TokenExpiredError';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw error;
      });

      await expect(service.refreshToken('expired-token')).rejects.toThrow(CustomException);
    });

    it('should throw exception when JWT token is invalid', async () => {
      const error = new Error('JsonWebTokenError');
      error.name = 'JsonWebTokenError';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw error;
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(CustomException);
    });
  });
});
