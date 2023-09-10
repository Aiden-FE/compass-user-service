import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  replyPing(): string {
    return 'ok';
  }

  getHello(): string {
    return 'Hello World!';
  }
}
