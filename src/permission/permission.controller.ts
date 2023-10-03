import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Auth, MSPayload, PERMISSIONS } from '@app/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DeletePermissionDto, QueryPermissionDto, QueryPermissionInfoDto } from './dto/query-permission.dto';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Auth(PERMISSIONS.PERMISSION_CREATE)
  @MessagePattern({
    method: 'POST',
    url: '/permission',
  })
  create(@MSPayload('body') createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Auth(PERMISSIONS.PERMISSION_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/permission/all',
  })
  findAll(@MSPayload('query') params: QueryPermissionDto) {
    return this.permissionService.findAll(params);
  }

  @Auth(PERMISSIONS.PERMISSION_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/permission',
  })
  findOne(@MSPayload('query') query: QueryPermissionInfoDto) {
    return this.permissionService.findOne(query.key);
  }

  @Auth(PERMISSIONS.PERMISSION_UPDATE)
  @MessagePattern({
    method: 'PUT',
    url: '/permission',
  })
  update(@MSPayload('body') updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(updatePermissionDto);
  }

  @Auth(PERMISSIONS.PERMISSION_DELETE)
  @MessagePattern({
    method: 'DELETE',
    url: '/permission',
  })
  remove(@MSPayload('body') body: DeletePermissionDto) {
    return this.permissionService.remove(body.key);
  }
}
