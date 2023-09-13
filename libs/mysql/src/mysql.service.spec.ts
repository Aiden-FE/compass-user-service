import { Test, TestingModule } from '@nestjs/testing';
import { MysqlModule } from '@app/mysql/mysql.module';
import { getEnvConfig } from '@app/common';
import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  let service: MysqlService;

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
    }).compile();

    service = module.get<MysqlService>(MysqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
