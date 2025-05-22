import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'single',
        url: config.get('REDIS_HOST'),
        options: {
          retryStrategy: (times: number) => {
            if (times >= 3) {
              return null; // 停止重试
            }
            return Math.min(times * 1000, 5000);
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class LocalRedisModule {}
