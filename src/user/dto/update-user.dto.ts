import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { UserGender } from '../user.dto';

export class UpdateUserDto {
  @IsString()
  @IsUUID()
  uid: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  nickname?: string;

  @IsOptional()
  @IsNumber()
  @IsEnum(UserGender)
  gender?: number;

  @IsOptional()
  @IsNumber()
  birthday?: string | number | Date;

  @IsOptional()
  @IsArray()
  roles?: number[];
}
