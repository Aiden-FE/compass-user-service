import { Test, TestingModule } from '@nestjs/testing';
import { MysqlModule, MysqlService } from '@app/mysql';
import { isNumber } from 'lodash';
import { getEnvConfig, PaginationReply } from '@app/common';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let mysqlService: MysqlService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MysqlModule.forRoot({
          host: getEnvConfig('MYSQL_HOST'),
          user: getEnvConfig('MYSQL_USER'),
          password: getEnvConfig('MYSQL_PASSWORD'),
          database: getEnvConfig('MYSQL_DATABASE'),
          connectionLimit: getEnvConfig('MYSQL_CONNECTION_LIMIT'),
          debug: getEnvConfig('MYSQL_DEBUG'),
        }),
      ],
      providers: [PermissionService],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    mysqlService = module.get<MysqlService>(MysqlService);
    await mysqlService.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let insertId: number;
  it('should create a permission data', async () => {
    insertId = await service.create({
      key: 'test_permission',
      name: '权限测试',
    });
    expect(isNumber(insertId)).toBe(true);
  });

  it('should return a permission data', async () => {
    expect(await service.findOne(insertId)).toMatchObject({
      key: 'test_permission',
      name: '权限测试',
    });
  });

  it('should return null', async () => {
    expect(await service.findOne(-1000)).toBeNull();
  });

  it('should update a permission data', async () => {
    expect(await service.update(insertId, { id: insertId, description: '测试更新' })).toBe(true);
    const data = await service.findOne(insertId);
    expect(data.description).toBe('测试更新');
  });

  it('should return all permissions data', async () => {
    const result = await service.findAll({
      name: '',
      pageNum: 0,
      pageSize: 20,
    });
    expect(result).toBeInstanceOf(PaginationReply);
    expect(result.list).toBeInstanceOf(Array);
    expect(result.pageNum).toBe(0);
    expect(result.pageSize).toBe(20);
    expect(result.total).toBeGreaterThanOrEqual(13);
    expect(result.list.length).toBeGreaterThanOrEqual(13);
  });

  it('should filtered data using LIKE', async () => {
    const result = await service.findAll({
      name: '测试',
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

  it('should delete a permission data', async () => {
    expect(await service.remove(insertId)).toBe(true);
  });

  afterAll(async () => {
    await mysqlService.onModuleDestroy();
    await module.close();
  });
});
