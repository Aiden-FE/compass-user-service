import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth, MSPayload, PERMISSIONS } from '@app/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto, QueryUserDto, QueryUsersDto } from './user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(PERMISSIONS.USER_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/user/all',
  })
  findAll(@MSPayload('query') query: QueryUsersDto) {
    return this.userService.findAll(query);
  }

  @Auth(PERMISSIONS.USER_QUERY)
  @MessagePattern({
    method: 'GET',
    url: '/user',
  })
  findOne(@MSPayload('query') query: QueryUserDto) {
    return this.userService.find({ uid: query.uid });
  }

  @Auth(PERMISSIONS.USER_UPDATE)
  @MessagePattern({
    method: 'PUT',
    url: '/user',
  })
  update(@MSPayload('body') updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.uid, updateUserDto);
  }

  @Auth(PERMISSIONS.USER_DELETE)
  @MessagePattern({
    method: 'DELETE',
    url: '/user',
  })
  remove(@MSPayload('body') body: DeleteUserDto) {
    return this.userService.remove(body.uid);
  }
}
