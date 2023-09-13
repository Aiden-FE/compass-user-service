import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: ReturnType<typeof createTransport<any>>;

  constructor(
    private option: Parameters<typeof createTransport<any>>[0],
    mailOption?: Parameters<typeof createTransport<any>>[1],
  ) {
    this.transporter = createTransport(option, mailOption);
    Logger.log('Email service is ready', 'EmailService');
  }

  sendEmail(option: Mail.Options) {
    return this.transporter.sendMail(option);
  }

  getTransporter() {
    return this.transporter;
  }
}
