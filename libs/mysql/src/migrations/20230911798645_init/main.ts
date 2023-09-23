import { getEnvConfig } from '@app/common';
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';

// ts-node -r tsconfig-paths/register libs/mysql/src/migrations/20230911798645_init/main.ts

const user = getEnvConfig('MYSQL_USER');
const password = getEnvConfig('MYSQL_PASSWORD');
const database = getEnvConfig('MYSQL_DATABASE');

async function main() {
  const connection = await createConnection({
    host: getEnvConfig('MYSQL_HOST'),
    user,
    password,
    database,
    multipleStatements: true, // 允许多语句,以便读取sql文件执行
  });

  try {
    const [result] = await connection.query(`SELECT id, version as v FROM migrations WHERE version = '0.0.1' LIMIT 1`);

    if (result[0]) {
      await connection.end();
      Logger.log('已执行过0.0.1的迁移任务');
      return;
    }
  } catch (e) {
    Logger.log(e);
  }

  await connection.query(readFileSync(join(__dirname, './main.sql'), { encoding: 'utf-8' }));
  await connection.end();
  Logger.log('0.0.1的迁移任务执行完成');
}

main();
