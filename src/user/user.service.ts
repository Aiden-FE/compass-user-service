import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@app/redis';
import {
  BusinessStatus,
  convertObjectToSQLWhere,
  encodeHMAC,
  filterObjectBy,
  generateUUID,
  HttpResponse,
  PaginationReply,
} from '@app/common';
import { MysqlService } from '@app/mysql';
import { CreateUserByEmailDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { REDIS_KEYS } from '../common';
import { QueryUsersDto } from './user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private redisService: RedisService,
    private mysqlService: MysqlService,
  ) {}

  async createByEmail(params: CreateUserByEmailDto) {
    const captcha = await this.redisService.get(REDIS_KEYS.CAPTCHA, {
      params: { type: 'email', account: params.email },
    });
    if (!captcha) {
      return new HttpResponse({
        statusCode: BusinessStatus.PRECONDITION_REQUIRED,
        message: '请先获取验证码',
      });
    }
    if (Number(captcha) !== params.captcha) {
      return new HttpResponse({
        statusCode: BusinessStatus.PRECONDITION_FAILED,
        message: '验证码错误',
      });
    }
    const [userEmail] = await this.mysqlService.mainPool.query(
      `SELECT * FROM \`users\` WHERE 'email' = ?`,
      params.email,
    );

    if ((userEmail as any[])?.length) {
      return new HttpResponse({
        statusCode: BusinessStatus.ER_DUP_ENTRY,
        message: '该邮箱用户已存在',
      });
    }
    // 验证通过需要创建账户
    const [result] = await this.mysqlService.mainPool.query(
      `INSERT INTO \`users\` (\`uid\`, \`email\`, \`password\`) VALUES (?, ?, ?)`,
      [generateUUID(), params.email, encodeHMAC(params.password)],
    );
    return new HttpResponse({
      message: '用户创建成功',
      data: (result as any).insertId,
    });
  }

  create(createUserDto: CreateUserDto) {
    return `This action adds a new user ${JSON.stringify(createUserDto)}`;
  }

  async findAll(queryUsersDto: QueryUsersDto) {
    const whereSql = convertObjectToSQLWhere({
      name: queryUsersDto.name && {
        type: 'sql',
        value: queryUsersDto.name,
        like: true,
      },
      nickname: queryUsersDto.nickname && {
        type: 'sql',
        value: queryUsersDto.nickname,
        like: true,
      },
      telephone: queryUsersDto.telephone,
      email: queryUsersDto.email,
    });
    const sql = `SELECT uid, name, nickname, gender, birthday, enabled, (SELECT COUNT(*) FROM \`users\` ${
      whereSql ? `WHERE ${whereSql}` : ''
    }) as total FROM \`users\` ${whereSql ? `WHERE ${whereSql}` : ''} LIMIT ? OFFSET ?`;
    const [result] = await this.mysqlService.mainPool.query(sql, [
      queryUsersDto.pageSize,
      queryUsersDto.pageNum * queryUsersDto.pageSize,
    ]);
    return new PaginationReply({
      pageNum: queryUsersDto.pageNum,
      pageSize: queryUsersDto.pageSize,
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
      'SELECT `u.id`, `u.uid`, `u.email`, `u.name`, `u.nickname`, `u.gender`, `u.birthday`, GROUP_CONCAT(`rtu.A`) as `roles` FROM `users u` JOIN `_roles_to_users rtu` ON `u.id` = `rtu.B` WHERE `u.id` = ? AND `u.enabled` = true GROUP BY `u.id`',
      id,
    );
    return result?.[0] || null;
  }

  async find(params: Partial<User>) {
    const [result] = await this.mysqlService.mainPool.query(
      `SELECT u.id, u.uid, u.name, u.nickname, u.gender, u.birthday, GROUP_CONCAT(rtu.A) as roles
       FROM \`users\` u
       LEFT JOIN \`_roles_to_users\` rtu
       on u.id = rtu.B
       WHERE ${convertObjectToSQLWhere({ ...params, enabled: true }, { prefix: 'u.' })}
       GROUP BY u.id;
      `,
    );
    const userInfo = result?.[0] || null;
    if (userInfo?.roles) {
      userInfo.roles = userInfo.roles.split(',').map(Number);
    } else if (userInfo) {
      userInfo.roles = [];
    }
    return userInfo;
  }

  /**
   * @description 更新用户信息
   * @param uid
   * @param updateUserDto
   */
  async update(uid: string, updateUserDto: UpdateUserDto) {
    return this.mysqlService.transaction(async (connection) => {
      const queryUserSql = 'SELECT id FROM `users` WHERE uid = ?';
      Logger.debug(queryUserSql);
      const [userResult] = await connection.query(queryUserSql, [uid]);
      const userId = userResult?.[0]?.id;
      if (!userId) {
        return new HttpResponse({
          statusCode: BusinessStatus.FORBIDDEN,
          message: 'Not found user info',
        });
      }
      const updateSql = 'UPDATE `users` SET ? WHERE id = ?';
      Logger.debug(updateSql);
      await connection.query(updateSql, [
        filterObjectBy(updateUserDto, {
          excludeKeys: ['uid', 'roles'],
          before: (value, key) => {
            if (key === 'birthday') {
              return new Date(value);
            }
            return value;
          },
        }),
        userId,
      ]);
      if (updateUserDto.roles) {
        const clearRelationSql = 'DELETE FROM `_roles_to_users` WHERE B = ?';
        Logger.debug(clearRelationSql);
        await connection.query(clearRelationSql, userId);
        // 插入新关系表
        const values = updateUserDto.roles.map((rid) => [rid, userId]);
        if (values.length) {
          const insertRelationSql = 'INSERT INTO `_roles_to_users` (A, B) VALUES ?';
          Logger.debug(insertRelationSql);
          await connection.query(insertRelationSql, [values]);
        }
      }
      return true;
    });
  }

  async remove(uid: string) {
    await this.mysqlService.mainPool.query('DELETE FROM `users` WHERE `uid` = ?', uid);
    return true;
  }
}
