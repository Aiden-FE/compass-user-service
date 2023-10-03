import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from '@app/common';

export class QueryPermissionDto extends PaginationQueryDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  name?: string;
}

export class QueryPermissionInfoDto {
  @MinLength(1)
  @MaxLength(128)
  key: string;
}

export class DeletePermissionDto {
  @MinLength(1)
  @MaxLength(128)
  key: string;
}
