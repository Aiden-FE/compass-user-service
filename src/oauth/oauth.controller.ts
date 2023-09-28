import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSPayload, Public } from '@app/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { OAuthEmailCaptchaDto } from './oauth.dto';
import { CreateUserByEmailDto, LoginByEmailDto } from '../user/dto/create-user.dto';

@Public()
@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @MessagePattern({
    method: 'POST',
    url: '/oauth/captcha/email',
  })
  async getEmailCaptcha(@MSPayload('body') payload: OAuthEmailCaptchaDto, @MSPayload('ip') ip?: string) {
    return this.oauthService.sendEmailCaptcha(payload, ip);
  }

  @MessagePattern({
    method: 'POST',
    url: '/oauth/register/email',
  })
  registerEmail(@MSPayload('body') payload: CreateUserByEmailDto) {
    return this.oauthService.createEmailAccount(payload);
  }

  // 用户登录
  @MessagePattern({
    method: 'POST',
    url: '/oauth/login/email',
  })
  loginByEmail(@MSPayload('body') payload: LoginByEmailDto) {
    return this.oauthService.loginByEmail(payload);
  }

  @MessagePattern({
    method: 'GET',
    url: '/oauth/user-info',
  })
  getUserInfo(@MSPayload('user') user: any, @MSPayload('headers.authorization') token?: string) {
    if (user) {
      return user;
    }
    return this.oauthService.getUserInfoByToken(token);
  }

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
