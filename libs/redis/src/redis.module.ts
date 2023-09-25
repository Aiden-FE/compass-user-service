import { DynamicModule, Module } from '@nestjs/common';
import { RedisClientOptions, RedisModule as IORedisModule } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(options: RedisClientOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        IORedisModule.forRoot({
          closeClient: true,
          readyLog: true,
          errorLog: true,
          config: options,
        }),
      ],
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
