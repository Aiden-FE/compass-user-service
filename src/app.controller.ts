import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @MessagePattern('/ping')
  ping(): string {
    return this.appService.replyPing();
  }
}
