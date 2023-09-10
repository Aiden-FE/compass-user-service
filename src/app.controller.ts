import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @MessagePattern('/ping')
  ping(): string {
    return this.appService.replyPing();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
