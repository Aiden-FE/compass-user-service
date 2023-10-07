import { PaginationQueryDto } from '@app/common';
import { IsEmail, IsMobilePhone, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/** User gender */
export enum UserGender {
  WOMAN,
  MAN,
}

export class QueryUsersDto extends PaginationQueryDto {
  @IsOptional()
  @IsMobilePhone()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MaxLength(24)
  name?: string;

  @IsOptional()
  @MaxLength(24)
  nickname?: string;
}

export class QueryUserDto {
  @IsString()
  @IsUUID()
  uid: string;
}

export class DeleteUserDto extends QueryUserDto {}
