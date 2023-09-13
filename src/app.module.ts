import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getEnvConfig } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { MysqlModule } from '@app/mysql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    // 局部可以通过 SkipThrottle Throttle 跳过或覆盖全局配置
    ThrottlerModule.forRoot([
      {
        // 单位毫秒
        ttl: getEnvConfig('APP_THROTTLE_TTL'),
        // 单位时间内限制的次数
        limit: getEnvConfig('APP_THROTTLE_LIMIT'),
      },
    ]),
    MysqlModule.forRoot({
      host: getEnvConfig('MYSQL_HOST'),
      user: getEnvConfig('MYSQL_USER'),
      password: getEnvConfig('MYSQL_PASSWORD'),
      database: getEnvConfig('MYSQL_DATABASE'),
      connectionLimit: getEnvConfig('MYSQL_CONNECTION_LIMIT'),
      debug: getEnvConfig('MYSQL_DEBUG'),
    }),
    UserModule,
    PermissionModule,
  ],
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
