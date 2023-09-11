import { getEnvConfig } from '@app/common';
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';

// ts-node -r tsconfig-paths/register libs/mysql/src/migrations/20230911798645/main.ts

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

  await connection.query(readFileSync(join(__dirname, './main.sql'), { encoding: 'utf-8' }));

  await connection.end();
}

main();
