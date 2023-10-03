import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Auth, MSPayload, PERMISSIONS } from '@app/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto, QueryRoleInfoDto, QueryRolesDto } from './role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Auth(PERMISSIONS.ROLE_CREATE)
  @MessagePattern({
    method: 'POST',
    url: '/role',
  })
  create(@MSPayload('body') createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Auth(PERMISSIONS.ROLE_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/role/all',
  })
  findAll(@MSPayload('query') query: QueryRolesDto) {
    return this.roleService.findAll(query);
  }

  @Auth(PERMISSIONS.ROLE_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/role',
  })
  findOne(@MSPayload('query') query: QueryRoleInfoDto) {
    return this.roleService.findOne(query.id);
  }

  @Auth(PERMISSIONS.ROLE_UPDATE)
  @MessagePattern({
    method: 'PUT',
    url: '/role',
  })
  update(@MSPayload('body') body: UpdateRoleDto) {
    return this.roleService.update(body.id, body);
  }

  @Auth(PERMISSIONS.ROLE_DELETE)
  @MessagePattern({
    method: 'DELETE',
    url: '/role',
  })
  remove(@MSPayload('body') body: DeleteRoleDto) {
    return this.roleService.remove(body.id);
  }
}
