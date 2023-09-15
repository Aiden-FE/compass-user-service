import { Test, TestingModule } from '@nestjs/testing';
import { EmailModule } from '@app/email';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { RedisModule, RedisService } from '@app/redis';
import { getEnvConfig } from '@app/common';
import { GoogleRecaptchaModule } from '@app/google-recaptcha';
import { OauthService } from './oauth.service';
import { REDIS_KEYS } from '../common';

describe('OauthService', () => {
  let service: OauthService;
  const data = {
    type: 'email',
    account: 'agilityjin@gmail.com',
  };

  beforeEach(async () => {
    const emailService = getEnvConfig('EMAIL_SERVICE');
    const emailAuthUser = getEnvConfig('EMAIL_AUTH_USER');
    const emailAuthPass = getEnvConfig('EMAIL_AUTH_PASS');
    const redisConnectionUrl = getEnvConfig('REDIS_CONNECTION_URL');

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EmailModule.forRoot({
          service: emailService,
          auth: {
            user: emailAuthUser,
            pass: emailAuthPass,
          },
        } as SMTPTransport.Options),
        RedisModule.forRoot(redisConnectionUrl as string),
        GoogleRecaptchaModule.forRoot({ secret: 'example' }),
      ],
      providers: [OauthService],
    }).compile();

    service = module.get<OauthService>(OauthService);
    const redisService = module.get<RedisService>(RedisService);
    // 还原缓存数据
    await redisService.del(REDIS_KEYS.CAPTCHA, { params: data });
    await redisService.del(REDIS_KEYS.CAPTCHA_LOCK, { params: data });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(
    'should send email',
    async () => {
      expect(await service.sendEmailCaptcha({ recaptcha: 'example', email: data.account })).toBe(true);
      expect(await service.sendEmailCaptcha({ recaptcha: 'example', email: data.account })).toBe(false);
    },
    1000 * 10,
  );
});
