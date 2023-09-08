import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getYAMLConfig } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@app/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

const config = getYAMLConfig();

const extraDynamicImports = [];

if (config.env.DATABASE_URL) {
  extraDynamicImports.push(PrismaModule);
}

@Module({
  imports: [
    // 局部可以通过 SkipThrottle Throttle 跳过或覆盖全局配置
    ThrottlerModule.forRootAsync({
      useFactory() {
        return [
          {
            // 单位毫秒
            ttl: config.throttle?.ttl || 1000 * 60,
            // 单位时间内限制的次数
            limit: config.throttle?.limit || 60,
          },
        ];
      },
      inject: [],
    }),
    UserModule,
  ].concat(extraDynamicImports),
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
