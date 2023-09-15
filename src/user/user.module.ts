import { Module } from '@nestjs/common';
import { MysqlService } from '@app/mysql';
import { RedisService } from '@app/redis';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, MysqlService, RedisService],
})
export class UserModule {}
