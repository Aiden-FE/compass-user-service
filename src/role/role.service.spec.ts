import { Test, TestingModule } from '@nestjs/testing';
import { getEnvConfig, PaginationReply } from '@app/common';
import { MysqlModule } from '@app/mysql';
import { isNumber } from 'lodash';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

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
      imports: [MysqlModule.forRoot(mysqlOption)],
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let insertId: number;
  it('should create a role data', async () => {
    insertId = await service.create({
      name: '单元测试',
      description: '仅供单元测试使用的角色',
    });
    expect(isNumber(insertId)).toBe(true);
  });

  it('should return a role data', async () => {
    expect(await service.findOne(insertId)).toMatchObject({
      name: '单元测试',
      description: '仅供单元测试使用的角色',
    });
  });

  it('should return null', async () => {
    expect(await service.findOne(-1000)).toBeNull();
  });

  it('should update a role data', async () => {
    expect(await service.update(insertId, { id: insertId, description: '测试更新' })).toBe(true);
    const data = await service.findOne(insertId);
    expect(data.description).toBe('测试更新');
  });

  it('should return all roles data', async () => {
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

  it('should delete a role data', async () => {
    expect(await service.remove(insertId)).toBe(true);
  });
});
