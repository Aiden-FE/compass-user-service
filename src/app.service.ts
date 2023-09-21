import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  replyPing(): string {
    return 'RBAC service is ok';
  }

  getHello(): string {
    return 'Hello World!';
  }
}
