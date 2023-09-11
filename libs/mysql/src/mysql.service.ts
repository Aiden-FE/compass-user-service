import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, createPool } from 'mysql2';
import { getEnvConfig } from '@app/common';

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  public mainPool: Pool;

  async onModuleInit() {
    const user = getEnvConfig('MYSQL_USER');
    const password = getEnvConfig('MYSQL_PASSWORD');
    const database = getEnvConfig('MYSQL_DATABASE');
    if (user && password && database) {
      this.mainPool = createPool({
        host: getEnvConfig('MYSQL_HOST'),
        user,
        password,
        database,
        connectionLimit: getEnvConfig('MYSQL_CONNECTION_LIMIT'),
      });
      Logger.log('Connected to MySQL database successfully', 'MySQL');
    }
  }

  async onModuleDestroy() {
    if (this.mainPool) {
      this.mainPool.end();
      Logger.log('Disconnected MySQL database successfully', 'MySQL');
    }
  }
}
