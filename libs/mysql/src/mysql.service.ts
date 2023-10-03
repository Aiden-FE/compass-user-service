import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, createPool, PoolOptions, PoolConnection } from 'mysql2/promise';

@Injectable()
export class MysqlService implements OnModuleDestroy {
  public mainPool: Pool;

  constructor(private options: PoolOptions) {
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

  /**
   * @description 使用事务
   * @param callback
   * @example
   * const res = await transaction(async (connection) => {
   *   const [result] = await connection.query('SELECT * FROM `demo`');
   *   return result;
   * });
   * console.log('Response: ', res);
   */
  async transaction<Result = any>(callback: (connection: PoolConnection) => Promise<Result>) {
    const connection = await this.mainPool.getConnection();
    let result: any;
    try {
      await connection.beginTransaction();
      result = await callback(connection);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      Logger.warn('发生错误,已回滚事务');
      throw e;
    } finally {
      connection.release();
    }
    return result as Result;
  }
}
