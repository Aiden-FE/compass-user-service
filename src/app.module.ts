import { DynamicModule, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getEnvConfig } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { MysqlModule } from '@app/mysql';
import { EmailModule } from '@app/email';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { RedisModule } from '@app/redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { OauthModule } from './oauth/oauth.module';
import { SYSTEM_EMAIL_DISPLAY_ACCOUNT } from './common';
import { RoleModule } from './role/role.module';

const dynamicModules: DynamicModule[] = [];

const emailService = getEnvConfig('EMAIL_SERVICE');
const emailAuthUser = getEnvConfig('EMAIL_AUTH_USER');
const emailAuthPass = getEnvConfig('EMAIL_AUTH_PASS');
const redisConnectionUrl = getEnvConfig('REDIS_CONNECTION_URL');

if (emailService && emailAuthUser && emailAuthPass) {
  dynamicModules.push(
    EmailModule.forRoot({
      service: emailService,
      auth: {
        user: emailAuthUser,
        pass: emailAuthPass,
      },
      from: SYSTEM_EMAIL_DISPLAY_ACCOUNT,
    } as SMTPTransport.Options),
  );
}

if (redisConnectionUrl) {
  dynamicModules.push(RedisModule.forRoot(redisConnectionUrl));
}

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
    ...dynamicModules,
    UserModule,
    PermissionModule,
    OauthModule,
    RoleModule,
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
