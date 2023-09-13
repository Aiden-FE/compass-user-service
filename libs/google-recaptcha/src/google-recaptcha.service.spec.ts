import { Test, TestingModule } from '@nestjs/testing';
import { GoogleRecaptchaModule } from '@app/google-recaptcha/google-recaptcha.module';
import { GoogleRecaptchaService } from './google-recaptcha.service';

describe('GoogleRecaptchaService', () => {
  let service: GoogleRecaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoogleRecaptchaModule.forRoot({ secret: 'test_token' })],
    }).compile();

    service = module.get<GoogleRecaptchaService>(GoogleRecaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
