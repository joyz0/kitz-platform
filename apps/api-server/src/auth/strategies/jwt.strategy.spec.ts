import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AUTH_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with id and email', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should handle different payload structures', async () => {
      const payload = {
        sub: '456',
        email: 'another@example.com',
        iat: 1234567890,
        exp: 1234567890,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: '456',
        email: 'another@example.com',
      });
    });
  });
});
