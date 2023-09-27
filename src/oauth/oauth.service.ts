import { Injectable, Logger } from '@nestjs/common';
import {
  BusinessStatus,
  encodeHMAC,
  getEnvConfig,
  HttpResponse,
  replaceVariablesInString,
  wrapUnknownError,
} from '@app/common';
import { GoogleRecaptchaService } from '@app/google-recaptcha';
import { EmailService } from '@app/email';
import { random } from 'lodash';
import { RedisService } from '@app/redis';
import { JwtService } from '@nestjs/jwt';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { OAuthEmailCaptchaDto } from './oauth.dto';
import { EMAIL_CAPTCHA_TEMPLATE, REDIS_KEYS, SYSTEM_EMAIL_DISPLAY_ACCOUNT } from '../common';
import { CreateUserByEmailDto, LoginByEmailDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OauthService {
  constructor(
    private grService: GoogleRecaptchaService,
    private emailService: EmailService,
    private redisService: RedisService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /** 发送邮箱验证码 */
  async sendEmailCaptcha(params: OAuthEmailCaptchaDto, ip?: string) {
    const data = {
      type: 'email',
      account: params.email,
    };
    const hasLock = await this.redisService.get(REDIS_KEYS.CAPTCHA_LOCK, {
      params: data,
    });
    if (hasLock === 'true') {
      Logger.log(`邮箱${data.account}已发送过邮件,3分钟内不允许重复发送`);
      return new HttpResponse({
        statusCode: BusinessStatus.TOO_MANY_REQUESTS,
        message: '已发送过邮件,最少3分钟内不允许重复发送',
      });
    }
    let valid: boolean;
    if (getEnvConfig('NODE_ENV') === 'development') {
      valid = true;
    } else {
      valid = await this.grService.verifyRecaptcha({
        score: 0.9, // 登录需要较高准确度,避免被恶意刷邮件
        response: params.recaptcha,
        remoteip: ip,
      });
    }
    if (!valid) {
      Logger.log(`Google recaptcha 验证失败: ${params.recaptcha}`);
      return new HttpResponse({
        statusCode: BusinessStatus.FORBIDDEN,
        message: '人机验证不通过',
      });
    }
    const code = random(100000, 999999);
    if (getEnvConfig('NODE_ENV') === 'production') {
      try {
        await this.emailService.sendEmail({
          from: SYSTEM_EMAIL_DISPLAY_ACCOUNT,
          to: params.email,
          subject: 'Compass 邮件验证',
          html: replaceVariablesInString(EMAIL_CAPTCHA_TEMPLATE, {
            context: 'Compass',
            code: code.toString(),
          }),
        });
      } catch (e) {
        return new HttpResponse({
          statusCode: BusinessStatus.INTERNAL_SERVER_ERROR,
          message: e.toString(),
        });
      }
    } else {
      Logger.log(`已生成邮箱验证码: ${code}`);
    }
    return Promise.all([
      // 将code存入redis缓存
      this.redisService.set(REDIS_KEYS.CAPTCHA, code, {
        params: data,
      }),
      // 锁定下一次发送的间隔
      this.redisService.set(REDIS_KEYS.CAPTCHA_LOCK, 'true', {
        params: data,
        expiresIn: 1000 * 60 * 3,
      }),
    ])
      .then(
        () =>
          new HttpResponse({
            message: '已发送邮件验证码',
          }),
      )
      .catch((e) => {
        Logger.error(e);
        return new HttpResponse({
          statusCode: BusinessStatus.ER_REDIS_WRITE,
          message: '服务器内部异常',
        });
      });
  }

  /** 创建邮箱账号 */
  async createEmailAccount(params: CreateUserByEmailDto) {
    return this.userService.createByEmail(params).catch((err) => wrapUnknownError(err));
  }

  /** 邮箱登录 */
  async loginByEmail(params: LoginByEmailDto, ip?: string) {
    let valid: boolean;
    if (getEnvConfig('NODE_ENV') === 'development') {
      valid = true;
    } else {
      valid = await this.grService.verifyRecaptcha({
        score: 0.9, // 登录需要较高准确度,避免被恶意刷邮件
        response: params.recaptcha,
        remoteip: ip,
      });
    }
    if (!valid) {
      Logger.log(`Google recaptcha 验证失败: ${params.recaptcha}`);
      return new HttpResponse({
        statusCode: BusinessStatus.FORBIDDEN,
        message: '人机验证不通过',
      });
    }
    const result = await this.userService.find({
      email: params.email,
      password: encodeHMAC(params.password),
    });
    if (!result) {
      return new HttpResponse({
        statusCode: BusinessStatus.FORBIDDEN,
        message: '邮箱或密码错误',
      });
    }
    return {
      ...result,
      token: this.jwtService.sign(result, { expiresIn: getEnvConfig('APP_JWT_EXPIRES') }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createOauthDto: CreateOauthDto) {
    return 'This action adds a new oauth';
  }

  findAll() {
    return `This action returns all oauth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauth`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateOauthDto: UpdateOauthDto) {
    return `This action updates a #${id} oauth`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth`;
  }
}
