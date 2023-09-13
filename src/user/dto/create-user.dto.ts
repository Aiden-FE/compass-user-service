import {IsEmail, IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreateUserDto {
  telephone?: string;

  password?: string;

  email?: string;

  name?: string;

  nickname?: string;

  gender?: string;

  birthday?: string;
}

export class CreateUserByEmailDto {
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
