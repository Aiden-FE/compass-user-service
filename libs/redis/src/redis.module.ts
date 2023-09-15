import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule as IORedisModule } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(url: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        IORedisModule.forRoot({
          closeClient: true,
          readyLog: true,
          errorLog: true,
          config: {
            url,
          },
        }),
      ],
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
