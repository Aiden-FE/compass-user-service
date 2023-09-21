import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from '@app/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @MessagePattern({ url: '/ping', method: 'GET' })
  ping(): string {
    return this.appService.replyPing();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
