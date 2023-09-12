import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from '@app/common';

export class QueryPermissionDto extends PaginationQueryDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  name?: string;
}
