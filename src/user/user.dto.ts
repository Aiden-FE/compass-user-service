import { PaginationQueryDto } from '@app/common';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class QueryUsersDto extends PaginationQueryDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  name?: string;
}
