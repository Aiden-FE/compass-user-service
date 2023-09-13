import { Test, TestingModule } from '@nestjs/testing';
import { MysqlModule } from '@app/mysql';
import { getEnvConfig } from '@app/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
