import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({ type: 'single', url: process.env.REDIS_HOST }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class LocalRedisModule {}
