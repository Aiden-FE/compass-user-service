import { MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @MinLength(1)
  @MaxLength(24)
  name: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: number[];
}
