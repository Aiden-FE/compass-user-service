import { DynamicModule, Module } from '@nestjs/common';
import { PoolOptions } from 'mysql2/promise';
import { MysqlService } from './mysql.service';

@Module({
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {
  static forRoot(options: PoolOptions): DynamicModule {
    return {
      module: MysqlModule,
      providers: [
        {
          provide: MysqlService,
          useValue: new MysqlService(options),
        },
      ],
      exports: [MysqlService],
    };
  }
}
