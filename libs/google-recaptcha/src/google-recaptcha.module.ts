import { DynamicModule, Module } from '@nestjs/common';
import { GoogleRecaptchaService } from './google-recaptcha.service';
import { GRModuleOptions } from './interfaces';

@Module({})
export class GoogleRecaptchaModule {
  static forRoot(option: GRModuleOptions): DynamicModule {
    return {
      module: GoogleRecaptchaModule,
      providers: [
        {
          provide: GoogleRecaptchaService,
          useValue: new GoogleRecaptchaService(option),
        },
      ],
      exports: [GoogleRecaptchaService],
    };
  }
}
