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

  /**
   * @description 创建角色
   * @param createRoleDto
   */
  async create(createRoleDto: CreateRoleDto) {
    return new Promise((resolve) => {
      this.mysqlService.transaction(async (connection) => {
        const roleSql = 'INSERT INTO `roles` (`name`, `description`) VALUES (?, ?)';
        Logger.debug(roleSql);
        const [result] = await connection.query(roleSql, [createRoleDto.name, createRoleDto.description]);
        const { insertId } = result as { insertId: number };
        if (createRoleDto.permissions?.length) {
          const ptrSql = 'INSERT INTO `_permissions_to_roles` (A, B) VALUES ?';
          Logger.debug(ptrSql);
          await connection.query(ptrSql, [createRoleDto.permissions.map((pid) => [pid, insertId])]);
        }
        resolve(insertId);
      });
    });
  }

  /**
   * @description 查询角色列表
   * @param findRoleDto
   */
  async findAll(findRoleDto: QueryRolesDto) {
    const whereSql = findRoleDto.name ? `WHERE \`name\` LIKE '%${findRoleDto.name}%' ` : '';
    const subSql = `(SELECT COUNT(*) FROM \`roles\` ${whereSql}) as total`;
    const sql = `SELECT \`id\`, \`name\`, \`description\`, ${subSql} FROM \`roles\` ${whereSql}LIMIT ? OFFSET ?`;
    Logger.debug(sql);
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

  /**
   * @description 查询角色信息
   * @param id
   */
  async findOne(id: number) {
    const sql = `SELECT r.id, r.name, r.description, GROUP_CONCAT(ptr.A) as permissions
      FROM \`roles\` r
      LEFT JOIN \`_permissions_to_roles\` ptr
      ON r.id = ptr.B
      WHERE r.id = ?
      GROUP BY r.id`;
    Logger.debug(sql);
    const [result] = await this.mysqlService.mainPool.query(sql, id);
    const roleInfo = result?.[0] || null;
    if (roleInfo?.permissions) {
      roleInfo.permissions = roleInfo.permissions.split(',').map(Number);
    } else if (roleInfo) {
      roleInfo.permissions = [];
    }
    return roleInfo;
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

  /**
   * @description Update role info
   * @param id
   * @param updateRoleDto
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.mysqlService.transaction(async (connection) => {
      const sql = 'UPDATE `roles` SET ? WHERE id = ?';
      Logger.debug(sql);
      await connection.query(sql, [
        {
          name: updateRoleDto.name,
          description: updateRoleDto.description,
        },
        id,
      ]);
      if (updateRoleDto.permissions) {
        // 移除原关系表
        const sqlRelation = 'DELETE FROM `_permissions_to_roles` WHERE B = ?';
        Logger.debug(sqlRelation);
        await connection.query(sqlRelation, id);
        // 插入新关系表
        const values = updateRoleDto.permissions.map((pid) => [pid, id]);
        if (values.length) {
          const sqlInsertRelation = 'INSERT INTO `_permissions_to_roles` (A, B) VALUES ?';
          Logger.debug(sqlInsertRelation);
          await connection.query(sqlInsertRelation, [values]);
        }
      }
      return true;
    });
  }

  /**
   * @description Delete role by ID
   * @param id
   */
  async remove(id: number) {
    await this.mysqlService.mainPool.query('DELETE FROM `roles` WHERE `id` = ?', id);
    return true;
  }
}
