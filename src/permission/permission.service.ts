import { Injectable, Logger } from '@nestjs/common';
import { MysqlService } from '@app/mysql';
import { filterObjectBy, PaginationReply } from '@app/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * @description 创建权限
   * @param createPermissionDto
   */
  async create(createPermissionDto: CreatePermissionDto) {
    const sql = 'INSERT INTO `permissions` (`key`, `name`, `description`) VALUES (?, ?, ?)';
    Logger.debug(sql);
    const [result] = await this.mysqlService.mainPool.query(sql, [
      createPermissionDto.key,
      createPermissionDto.name,
      createPermissionDto.description,
    ]);
    return (result as { insertId: number }).insertId;
  }

  /**
   * @description 根据条件查询所有权限
   * @param findPermissionDto
   */
  async findAll(findPermissionDto: QueryPermissionDto) {
    const whereSql = findPermissionDto.name ? `WHERE \`name\` LIKE '%${findPermissionDto.name}%' ` : '';
    const subSql = `(SELECT COUNT(*) FROM \`permissions\` ${whereSql}) as total`;
    const sql = `SELECT \`id\`, \`key\`, \`name\`, \`description\`, ${subSql} FROM \`permissions\` ${whereSql}LIMIT ? OFFSET ?`;
    Logger.debug(sql);
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

  /**
   * @description 根据key查询权限具体信息
   * @param key
   */
  async findOne(key: string) {
    const sql = 'SELECT `id`, `key`, `name`, `description` FROM `permissions` WHERE `key` = ?';
    Logger.debug(sql);
    const [result] = await this.mysqlService.mainPool.query(sql, key);
    return result?.[0] || null;
  }

  /**
   * @description 更新权限
   * @param updatePermissionDto
   */
  async update(updatePermissionDto: UpdatePermissionDto) {
    const sql = 'UPDATE `permissions` SET ? WHERE `key` = ?';
    Logger.debug(sql);
    await this.mysqlService.mainPool.query(sql, [
      filterObjectBy(updatePermissionDto, {
        excludeKeys: ['key'],
      }),
      updatePermissionDto.key,
    ]);
    return true;
  }

  /**
   * @description 删除权限
   * @param key
   */
  async remove(key: string) {
    const sql = 'DELETE FROM `permissions` WHERE `key` = ?';
    Logger.debug(sql);
    await this.mysqlService.mainPool.query(sql, key);
    return true;
  }
}
