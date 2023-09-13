import { IsEmail, IsString } from 'class-validator';

export class OAuthEmailCaptchaDto {
  /** google recaptcha token */
  @IsString()
  recaptcha: string;

  @IsEmail()
  email: string;
}
