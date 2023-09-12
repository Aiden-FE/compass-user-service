import { Injectable } from '@nestjs/common';
import { MysqlService } from '@app/mysql';
import { PaginationReply } from '@app/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private mysqlService: MysqlService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const [result] = await this.mysqlService.mainPool.query(
      'INSERT INTO `permissions` (`key`, `name`, `description`) VALUES (?, ?, ?)',
      [createPermissionDto.key, createPermissionDto.name, createPermissionDto.description],
    );
    return (result as { insertId: number }).insertId;
  }

  async findAll(findPermissionDto: QueryPermissionDto) {
    const whereSql = findPermissionDto.name ? `WHERE \`name\` LIKE '%${findPermissionDto.name}%' ` : '';
    const subSql = `(SELECT COUNT(*) FROM \`permissions\` ${whereSql}) as total`;
    const sql = `SELECT \`id\`, \`key\`, \`name\`, \`description\`, ${subSql} FROM \`permissions\` ${whereSql}LIMIT ? OFFSET ?`;
    const [result] = await this.mysqlService.mainPool.query(sql, [
      findPermissionDto.pageSize,
      findPermissionDto.pageNum * findPermissionDto.pageSize,
    ]);
    return new PaginationReply({
      pageNum: findPermissionDto.pageNum,
      pageSize: findPermissionDto.pageSize,
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
      'SELECT `id`, `key`, `name`, `description` FROM `permissions` WHERE `id` = ?',
      id,
    );
    return result?.[0] || null;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    let sql = 'UPDATE `permissions` SET';
    const values: unknown[] = [];
    Object.keys(updatePermissionDto).forEach((key) => {
      if (key === 'id') return;
      sql += ` \`${key}\` = ?,`;
      values.push(updatePermissionDto[key]);
    });
    sql = sql.slice(0, -1);
    sql += ' WHERE id = ?';
    values.push(id);
    await this.mysqlService.mainPool.query(sql, values);
    return true;
  }

  async remove(id: number) {
    await this.mysqlService.mainPool.query('DELETE FROM `permissions` WHERE `id` = ?', id);
    return true;
  }
}
