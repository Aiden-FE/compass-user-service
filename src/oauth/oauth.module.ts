import { Module } from '@nestjs/common';
import { GoogleRecaptchaModule } from '@app/google-recaptcha';
import { RedisService } from '@app/redis';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';

@Module({
  imports: [GoogleRecaptchaModule.forRoot({ secret: 'example' })],
  controllers: [OauthController],
  providers: [OauthService, RedisService],
})
export class OauthModule {}
