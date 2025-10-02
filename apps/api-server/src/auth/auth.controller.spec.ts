import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomException } from '../exceptions/custom.exception';
import { StatusCodeMap } from '@repo/types/enums/status-code';
import { User } from '@repo/types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockLoginResult = {
    ...mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResult);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResult);
    });

    it('should throw CustomException when credentials are invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(CustomException);
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockRefreshResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(mockRefreshResult);

      const result = await controller.refreshToken(refreshToken);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(mockRefreshResult);
    });

    it('should handle invalid refresh token', async () => {
      const refreshToken = 'invalid-token';

      jest.spyOn(authService, 'refreshToken').mockRejectedValue(
        new CustomException(
          StatusCodeMap.REFRESH_TOKEN_INVALID,
          'Invalid refresh token',
          StatusCodeMap.UNAUTHORIZED
        )
      );

      await expect(controller.refreshToken(refreshToken)).rejects.toThrow(
        CustomException
      );
    });
  });
});
