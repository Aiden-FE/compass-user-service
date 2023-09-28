import { Module } from '@nestjs/common';
import { GoogleRecaptchaModule } from '@app/google-recaptcha';
import { RedisService } from '@app/redis';
import { getEnvConfig } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    JwtModule.register({ secret: getEnvConfig('APP_JWT_SECRET') }),
    GoogleRecaptchaModule.forRoot({ secret: getEnvConfig('APP_GOOGLE_RECAPTCHA_SECRET') }),
  ],
  controllers: [OauthController],
  providers: [OauthService, RedisService, UserService, RoleService],
})
export class OauthModule {}
