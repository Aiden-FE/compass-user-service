import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth, MSPayload, PERMISSIONS } from '@app/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Auth(PERMISSIONS.PERMISSION_QUERY)
@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @MessagePattern('createPermission')
  create(@Payload() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @MessagePattern({
    method: 'GET',
    url: '/permission/all',
  })
  findAll(@MSPayload('query') params: QueryPermissionDto) {
    return this.permissionService.findAll(params);
  }

  @MessagePattern('findOnePermission')
  findOne(@Payload() id: number) {
    return this.permissionService.findOne(id);
  }

  @MessagePattern('updatePermission')
  update(@Payload() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(updatePermissionDto.id, updatePermissionDto);
  }

  @MessagePattern('removePermission')
  remove(@Payload() id: number) {
    return this.permissionService.remove(id);
  }
}
