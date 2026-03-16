import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    if (!process.env.REDIS_HOST) {
      return { module: RedisModule };
    }

    const ioRedis = IoRedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`,
    });

    return {
      module: RedisModule,
      imports: [ioRedis],
      exports: [ioRedis],
      global: true,
    };
  }
}
