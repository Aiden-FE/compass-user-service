import { PaginationQueryDto } from '@app/common';
import { IsEmail, IsMobilePhone, IsOptional, IsString, MaxLength } from 'class-validator';

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
  uid: string;
}

export class DeleteUserDto extends QueryUserDto {}
