import { IsEmail, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

// 发送验证码
export class OAuthEmailCaptchaDto {
  /** google recaptcha token */
  @IsString()
  recaptcha: string;

  @IsEmail()
  email: string;
}

// 邮箱登录
export class OAuthEmailLoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(255)
  password: string;

  /** 邮箱验证码 */
  @Min(100000)
  @Max(999999)
  captcha: number;
}
