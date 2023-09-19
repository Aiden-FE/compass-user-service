import { Injectable } from '@nestjs/common';
import { MysqlService } from '@app/mysql';
import { PaginationReply } from '@app/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRolesDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(private mysqlService: MysqlService) {}

  async create(createRoleDto: CreateRoleDto) {
    const [result] = await this.mysqlService.mainPool.query(
      'INSERT INTO `roles` (`name`, `description`) VALUES (?, ?)',
      [createRoleDto.name, createRoleDto.description],
    );
    return (result as { insertId: number }).insertId;
  }

  async findAll(findRoleDto: QueryRolesDto) {
    const whereSql = findRoleDto.name ? `WHERE \`name\` LIKE '%${findRoleDto.name}%' ` : '';
    const subSql = `(SELECT COUNT(*) FROM \`roles\` ${whereSql}) as total`;
    const sql = `SELECT \`id\`, \`name\`, \`description\`, ${subSql} FROM \`roles\` ${whereSql}LIMIT ? OFFSET ?`;
    const [result] = await this.mysqlService.mainPool.query(sql, [
      findRoleDto.pageSize,
      findRoleDto.pageNum * findRoleDto.pageSize,
    ]);
    return new PaginationReply({
      pageNum: findRoleDto.pageNum,
      pageSize: findRoleDto.pageSize,
      list: (result as any[]).map((item) => {
        const data = { ...item };
        delete data.total;
        return data;
      }),
      total: result?.[0]?.total || 0,
    });
  }

  async findOne(id: number) {
    const [result] = await this.mysqlService.mainPool.query(
      'SELECT `id`, `name`, `description` FROM `roles` WHERE `id` = ?',
      id,
    );
    return result?.[0] || null;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let sql = 'UPDATE `roles` SET';
    const values: unknown[] = [];
    Object.keys(updateRoleDto).forEach((key) => {
      if (key === 'id') return;
      sql += ` \`${key}\` = ?,`;
      values.push(updateRoleDto[key]);
    });
    sql = sql.slice(0, -1);
    sql += ' WHERE id = ?';
    values.push(id);
    await this.mysqlService.mainPool.query(sql, values);
    return true;
  }

  async remove(id: number) {
    await this.mysqlService.mainPool.query('DELETE FROM `roles` WHERE `id` = ?', id);
    return true;
  }
}
