import { PaginationQueryDto } from '@app/common';
import { IsNumber, IsOptional, MaxLength } from 'class-validator';

export class QueryRolesDto extends PaginationQueryDto {
  @IsOptional()
  @MaxLength(24)
  name?: string;
}

export class QueryRoleInfoDto {
  @IsNumber()
  id: number;
}

export class DeleteRoleDto extends QueryRoleInfoDto {}
