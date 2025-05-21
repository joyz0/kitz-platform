import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class RedisService extends BaseService {
  private isRedisActive = true;

  constructor(@InjectRedis() private readonly redisClient: Redis) {
    super(RedisService.name);
    redisClient.on('error', (error) => {
      this.isRedisActive = false;
      this.handleError(error, 'Invalid redis service');
    });
    redisClient.on('ready', () => (this.isRedisActive = true));
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (this.isRedisActive) {
      try {
        await this.redisClient.set(
          key,
          JSON.stringify(value),
          'EX',
          ttl || 3600,
        );
        return;
      } catch (err) {
        this.isRedisActive = false;
      }
    }
  }

  async get(key: string): Promise<any> {
    if (this.isRedisActive) {
      try {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        this.isRedisActive = false;
      }
    }
    return null;
  }
}
