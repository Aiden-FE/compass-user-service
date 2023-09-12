import { MaxLength, IsOptional, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @MinLength(2)
  @MaxLength(128)
  key: string;

  @MinLength(1)
  @MaxLength(24)
  name: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;
}
