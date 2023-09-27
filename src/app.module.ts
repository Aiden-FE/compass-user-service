import { DynamicModule, Module } from '@nestjs/common';
import { getEnvConfig } from '@app/common';
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

@Module({
  imports: [
    MysqlModule.forRoot({
      host: getEnvConfig('MYSQL_HOST'),
      user: getEnvConfig('MYSQL_USER'),
      password: getEnvConfig('MYSQL_PASSWORD'),
      database: getEnvConfig('MYSQL_DATABASE'),
      connectionLimit: getEnvConfig('MYSQL_CONNECTION_LIMIT'),
      debug: getEnvConfig('MYSQL_DEBUG'),
    }),
    RedisModule.forRoot({
      host: getEnvConfig('REDIS_HOST'),
      port: getEnvConfig('REDIS_PORT'),
      password: getEnvConfig('REDIS_PASSWORD'),
    }),
    ...dynamicModules,
    UserModule,
    PermissionModule,
    OauthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
