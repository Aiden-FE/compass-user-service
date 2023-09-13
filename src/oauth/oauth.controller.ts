import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';

@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @MessagePattern('createOauth')
  create(@Payload() createOauthDto: CreateOauthDto) {
    return this.oauthService.create(createOauthDto);
  }

  @MessagePattern('findAllOauth')
  findAll() {
    return this.oauthService.findAll();
  }

  @MessagePattern('findOneOauth')
  findOne(@Payload() id: number) {
    return this.oauthService.findOne(id);
  }

  @MessagePattern('updateOauth')
  update(@Payload() updateOauthDto: UpdateOauthDto) {
    return this.oauthService.update(updateOauthDto.id, updateOauthDto);
  }

  @MessagePattern('removeOauth')
  remove(@Payload() id: number) {
    return this.oauthService.remove(id);
  }
}
