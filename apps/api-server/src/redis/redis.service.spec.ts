import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: any;
  let errorHandler: (err: any) => void;
  let readyHandler: () => void;

  beforeEach(async () => {
    mockRedisClient = {
      on: jest.fn((event: string, handler: any) => {
        if (event === 'error') errorHandler = handler;
        if (event === 'ready') readyHandler = handler;
        return mockRedisClient;
      }),
      set: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set', () => {
    it('should set value with default TTL', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('testKey', { data: 'testValue' });

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify({ data: 'testValue' }),
        'EX',
        3600
      );
    });

    it('should set value with custom TTL', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('testKey', 'testValue', 7200);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify('testValue'),
        'EX',
        7200
      );
    });

    it('should handle Redis error and mark Redis as inactive', async () => {
      mockRedisClient.set.mockRejectedValue(new Error('Redis error'));

      await service.set('testKey', 'testValue');

      expect(mockRedisClient.set).toHaveBeenCalled();
    });

    it('should not attempt to set when Redis is inactive', async () => {
      errorHandler(new Error('Connection failed'));

      await service.set('testKey', 'testValue');

      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get and parse value', async () => {
      const mockData = { data: 'testValue' };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await service.get('testKey');

      expect(mockRedisClient.get).toHaveBeenCalledWith('testKey');
      expect(result).toEqual(mockData);
    });

    it('should return null when key does not exist', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('nonExistentKey');

      expect(result).toBeNull();
    });

    it('should handle Redis error and return null', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));

      const result = await service.get('testKey');

      expect(result).toBeNull();
    });

    it('should not attempt to get when Redis is inactive', async () => {
      errorHandler(new Error('Connection failed'));

      const result = await service.get('testKey');

      expect(mockRedisClient.get).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('Redis connection events', () => {
    it('should mark Redis as inactive on error event', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('testKey', 'testValue');
      expect(mockRedisClient.set).toHaveBeenCalled();

      jest.clearAllMocks();

      errorHandler(new Error('Connection error'));

      await service.set('testKey', 'testValue');
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });

    it('should mark Redis as active on ready event', async () => {
      errorHandler(new Error('Connection error'));

      await service.set('testKey', 'testValue');
      expect(mockRedisClient.set).not.toHaveBeenCalled();

      readyHandler();

      mockRedisClient.set.mockResolvedValue('OK');
      await service.set('testKey', 'testValue');
      expect(mockRedisClient.set).toHaveBeenCalled();
    });
  });
});
