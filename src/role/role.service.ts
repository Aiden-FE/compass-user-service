import { Injectable, Logger } from '@nestjs/common';
import { MysqlService } from '@app/mysql';
import { convertArrayToSQLWhere, PaginationReply } from '@app/common';
import { RedisService } from '@app/redis';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRolesDto } from './role.dto';
import { REDIS_KEYS } from '../common';

@Injectable()
export class RoleService {
  constructor(
    private mysqlService: MysqlService,
    private redisService: RedisService,
  ) {}

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

  /**
   * @description 在Redis 缓存中查找对应角色权限
   * @param roleId
   */
  async findPermissionsInRedisByRoleId(roleId: number) {
    // 不使用枚举方式是为了尽可能最快的读取目标值
    const originPermissions = await this.redisService.get(`role/${roleId}`);
    if (originPermissions) {
      this.redisService.refresh(REDIS_KEYS.ROLE_PERMISSIONS, { params: { roleId } });
      return JSON.parse(originPermissions);
    }
    return null;
  }

  /**
   * @description 在Redis 缓存中存储对应角色权限
   * @param roleId
   * @param permissions
   */
  async setPermissionsToRedisByRoleId(roleId: number, permissions: string[] = []) {
    return this.redisService.set(REDIS_KEYS.ROLE_PERMISSIONS, JSON.stringify(permissions), {
      params: { roleId },
    });
  }

  /**
   * @description Find all matching roles by role IDs
   * @param ids
   */
  async findRolesByIds(ids: number[]) {
    if (!ids || !ids.length) {
      return [];
    }
    const sql = `SELECT r.id, r.name, r.description, r.is_system as isSystem, GROUP_CONCAT(p.key) as permissions
      FROM \`roles\` r
      LEFT JOIN \`_permissions_to_roles\` ptr
          ON r.id = ptr.B
      LEFT JOIN \`permissions\` p
          ON ptr.A = p.id
      WHERE ${convertArrayToSQLWhere(ids, { prefix: 'r.id' })}
      GROUP BY r.id;`;
    Logger.debug(sql);
    const [result] = await this.mysqlService.mainPool.query(sql);
    if (!result) {
      return [];
    }
    return (result as any[]).map((data) => {
      const role = { ...data };
      if (role.permissions) {
        role.permissions = role.permissions.split(',');
      } else {
        role.permissions = [];
      }
      return role;
    });
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
