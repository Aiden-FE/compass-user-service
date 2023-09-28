import { Module } from '@nestjs/common';
import { RedisService } from '@app/redis';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RedisService],
})
export class RoleModule {}
