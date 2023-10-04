import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth, MSPayload, PERMISSIONS } from '@app/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './user.dto';

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

  @MessagePattern('findOneUser')
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
