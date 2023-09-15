import { Test, TestingModule } from '@nestjs/testing';
import { MysqlModule } from '@app/mysql';
import { getEnvConfig, HttpResponse, PaginationReply } from '@app/common';
import { RedisModule, RedisService } from '@app/redis';
import { UserService } from './user.service';
import { REDIS_KEYS } from '../common';

describe('UserService', () => {
  let service: UserService;
  let insertId: number;
  const data = {
    email: 'example_fsfsdf@gmail.com',
    password: 'example123456',
    captcha: 105974,
  };

  beforeEach(async () => {
    const mysqlOption = {
      host: getEnvConfig('MYSQL_HOST'),
      user: getEnvConfig('MYSQL_USER'),
      password: getEnvConfig('MYSQL_PASSWORD'),
      database: getEnvConfig('MYSQL_DATABASE'),
      connectionLimit: getEnvConfig('MYSQL_CONNECTION_LIMIT'),
      debug: getEnvConfig('MYSQL_DEBUG'),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [MysqlModule.forRoot(mysqlOption), RedisModule.forRoot(getEnvConfig('REDIS_CONNECTION_URL') as string)],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    const redisService = module.get<RedisService>(RedisService);
    // 设置验证码
    await redisService.set(REDIS_KEYS.CAPTCHA, data.captcha, { params: { type: 'email', account: data.email } });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should statusCode is 100428', async () => {
    const result = await service.createByEmail({
      email: 'example_fsafsffs@gmail.com',
      password: 'example123456',
      captcha: 105974,
    });
    expect(result).toBeInstanceOf(HttpResponse);
    expect(result.getHttpStatus()).toBe(200);
    expect(result.getStatusCode()).toBe(100428);
    expect(result.getResponse().data).toBeNull();
  });

  it('should statusCode is 100412', async () => {
    const result = await service.createByEmail({
      ...data,
      captcha: 878778,
    });
    expect(result).toBeInstanceOf(HttpResponse);
    expect(result.getHttpStatus()).toBe(200);
    expect(result.getStatusCode()).toBe(100412);
    expect(result.getResponse().data).toBeNull();
  });

  it('should create a user', async () => {
    const result = await service.createByEmail(data);
    expect(result).toBeInstanceOf(HttpResponse);
    expect(result.getHttpStatus()).toBe(200);
    expect(result.getStatusCode()).toBe(100200);
    insertId = result.getResponse().data;
    expect(insertId).toBeGreaterThan(0);
  });

  it('should find this user', async () => {
    expect(await service.findOne(-1000)).toBeNull();
    const result = await service.findOne(insertId);
    expect(result).toMatchObject({
      id: insertId,
      email: data.email,
      name: null,
      nickname: null,
      gender: null,
      birthday: null,
    });
    expect(typeof result.uid).toBe('string');
  });

  it('should update this user', async () => {
    const birthday = '1999-09-09';
    expect(
      await service.update(insertId, {
        id: insertId,
        name: 'test',
        nickname: 'example',
        gender: 1,
        birthday,
      }),
    ).toBe(true);
    const result = await service.findOne(insertId);
    expect(result).toMatchObject({
      id: insertId,
      name: 'test',
      nickname: 'example',
      gender: 1,
    });
    const resultDate = new Date(result.birthday);
    expect(resultDate.getFullYear()).toBe(1999);
    expect(resultDate.getMonth()).toBe(8);
    expect(resultDate.getDate()).toBe(9);
  });

  it('should return all users data', async () => {
    const result = await service.findAll({
      name: '',
      pageNum: 0,
      pageSize: 20,
    });
    expect(result).toBeInstanceOf(PaginationReply);
    expect(result.list).toBeInstanceOf(Array);
    expect(result.pageNum).toBe(0);
    expect(result.pageSize).toBe(20);
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.list.length).toBeGreaterThanOrEqual(1);
  });

  it('should remove a user', async () => {
    expect(await service.remove(insertId)).toBe(true);
  });
});
