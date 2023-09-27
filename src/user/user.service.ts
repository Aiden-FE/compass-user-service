import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';
import {
  BusinessStatus,
  convertObjectToSQLWhere,
  encodeHMAC,
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
    const whereSql = queryUsersDto.name ? `WHERE \`name\` LIKE '%${queryUsersDto.name}%' ` : '';
    const subSql = `(SELECT COUNT(*) FROM \`users\` ${whereSql}) as total`;
    const sql = `SELECT \`id\`, \`uid\`, \`name\`, \`nickname\`, \`gender\`, \`birthday\`, ${subSql} FROM \`users\` ${whereSql}LIMIT ? OFFSET ?`;
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
    return result?.[0] || null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let sql = 'UPDATE `users` SET';
    const values: unknown[] = [];
    Object.keys(updateUserDto).forEach((key) => {
      if (key === 'id') return;
      sql += ` \`${key}\` = ?,`;
      values.push(updateUserDto[key]);
    });
    sql = sql.slice(0, -1);
    sql += ' WHERE id = ?';
    values.push(id);
    await this.mysqlService.mainPool.query(sql, values);
    return true;
  }

  async remove(id: number) {
    await this.mysqlService.mainPool.query('DELETE FROM `users` WHERE `id` = ?', id);
    return true;
  }
}
