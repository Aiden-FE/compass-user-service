import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('/ping')
  ping(): string {
    return this.appService.replyPing();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
