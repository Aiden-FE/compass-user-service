import { DynamicModule, Module } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {
  static forRoot(
    option: Parameters<typeof createTransport<any>>[0],
    mailOption?: Parameters<typeof createTransport<any>>[1],
  ): DynamicModule {
    return {
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
