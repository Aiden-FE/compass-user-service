import { Module } from '@nestjs/common';
import { GoogleRecaptchaModule } from '@app/google-recaptcha';
import { RedisService } from '@app/redis';
import { getEnvConfig } from '@app/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [GoogleRecaptchaModule.forRoot({ secret: getEnvConfig('APP_GOOGLE_RECAPTCHA_SECRET') })],
  controllers: [OauthController],
  providers: [OauthService, RedisService, UserService],
})
export class OauthModule {}
