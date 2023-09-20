import { DynamicModule, Module } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { EmailService } from './email.service';

@Module({})
export class EmailModule {
  static forRoot(
    option: Parameters<typeof createTransport>[0],
    mailOption?: Parameters<typeof createTransport>[1],
  ): DynamicModule {
    return {
      global: true,
      module: EmailModule,
      providers: [
        {
          provide: EmailService,
          useValue: new EmailService(option, mailOption),
        },
      ],
      exports: [EmailService],
    };
  }
}
