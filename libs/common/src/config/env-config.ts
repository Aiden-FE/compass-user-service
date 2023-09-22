import { cloneDeep, get, merge } from 'lodash';
import { EnvironmentVariables } from '@app/common/interfaces';
import Ajv from 'ajv';
import { parse as dotenvParse } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';

const ajv = new Ajv({
  removeAdditional: true, // 移除未定义属性
  useDefaults: true, // 使用默认值
  coerceTypes: true, // 类型转换
});

const schema = {
  type: 'object',
  properties: {
    NODE_ENV: {
      type: 'string',
      default: process.env.NODE_ENV || 'production',
    },
    APP_THROTTLE_TTL: {
      type: 'integer',
      default: 1000 * 60,
    },
    APP_THROTTLE_LIMIT: {
      type: 'integer',
      default: 60,
    },
    APP_HMAC_SECRET: {
      type: 'string',
      default: 'example',
    },
    APP_MYSQL_HOST: {
      type: 'string',
      nullable: true,
    },
    APP_MYSQL_USER: {
      type: 'string',
      nullable: true,
    },
    APP_MYSQL_PASSWORD: {
      type: 'string',
      nullable: true,
    },
    APP_MYSQL_DATABASE: {
      type: 'string',
      nullable: true,
    },
    APP_MYSQL_CONNECTION_LIMIT: {
      type: 'string',
      default: 10,
    },
    MYSQL_DEBUG: {
      type: 'boolean',
      default: false,
    },
    EMAIL_SERVICE: {
      type: 'string',
      nullable: true,
    },
    EMAIL_AUTH_USER: {
      type: 'string',
      nullable: true,
    },
    EMAIL_AUTH_PASS: {
      type: 'string',
      nullable: true,
    },
    APP_JWT_SECRET: {
      type: 'string',
      default: 'example',
    },
    APP_GOOGLE_RECAPTCHA_SECRET: {
      type: 'string',
      default: 'example',
    },
  },
};

const validateEnv = ajv.compile(schema);
let isInit = false;
let config: EnvironmentVariables;

function initEnvConfig() {
  if (isInit) {
    return;
  }

  let data: any = {};
  try {
    data = dotenvParse(readFileSync(process.env.ENV_FILE_PATH || join(process.cwd(), '.env')));
  } catch (e) {
    Logger.warn('配置文件读取异常,使用默认值设置环境变量', e);
  }

  const valid = validateEnv(data);
  if (!valid) {
    Logger.error(`配置数据验证失败,请检查是否符合Schema要求: ${schema}`);
    return;
  }

  config = merge({}, process.env, data);
  isInit = true;
}

// 获取环境变量
export function getEnvConfig<Key extends keyof EnvironmentVariables>(
  key: Key,
  defaultValue?: EnvironmentVariables[Key],
): EnvironmentVariables[Key];
// 获取环境变量
export function getEnvConfig(): EnvironmentVariables;
// 获取环境变量
export function getEnvConfig<Key extends keyof EnvironmentVariables>(
  key?: Key,
  defaultValue?: EnvironmentVariables[Key],
): EnvironmentVariables | EnvironmentVariables[Key] {
  if (!isInit) {
    initEnvConfig();
  }
  // @ts-ignore
  return key ? get(config, key, defaultValue) : cloneDeep(config);
}
