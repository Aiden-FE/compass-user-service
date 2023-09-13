import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, createPool, PoolOptions } from 'mysql2/promise';

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  public mainPool: Pool;

  constructor(private options: PoolOptions) {}

  async onModuleInit() {
    if (this.options?.user && this.options.password && this.options.database) {
      this.mainPool = createPool(this.options);
      Logger.log('Connected to MySQL database successfully', 'MySQL');
    }
  }

  async onModuleDestroy() {
    if (this.mainPool) {
      try {
        await this.mainPool.end();
        Logger.log('Disconnected MySQL database successfully', 'MySQL');
      } catch (e) {
        Logger.warn(e);
      }
    }
  }
}
