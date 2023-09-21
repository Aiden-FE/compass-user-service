import { Module } from '@nestjs/common';
import { RedisService } from '@app/redis';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, RedisService],
})
export class UserModule {}
