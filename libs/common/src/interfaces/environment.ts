// .env 可用环境变量
export interface EnvironmentVariablesDto {
  /** 邮件服务类目 */
  EMAIL_SERVICE: string;
  /** 邮件授权用户 */
  EMAIL_AUTH_USER: string;
  /** 邮件授权用户密码 */
  EMAIL_AUTH_PASS: string;
  /**
   * 环境变量
   * @default process.env.NODE_ENV | 'production'
   */
  NODE_ENV?: 'development' | 'production';
  /**
   * HMAC 密钥串,内部不可逆加密隐私数据时使用.
   * 生产环境强烈建议设置一个随机字符串,不要使用默认值,
   * @default example
   */
  APP_HMAC_SECRET?: string;
  /**
   * JWT 授权密钥
   * 生产环境强烈建议设置一个随机字符串,不要使用默认值
   * @default example
   */
  APP_JWT_SECRET?: string;
  /**
   * 谷歌人机校验密钥, 不设置相关校验接口会异常
   * @default example
   */
  APP_GOOGLE_RECAPTCHA_SECRET?: string;
  /**
   * mysql 要连接的数据库的主机名
   * @default 本地主机
   */
  MYSQL_HOST?: string;
  /**
   * 连接用户 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_USER?: string;
  /**
   * 连接密码 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_PASSWORD?: string;
  /**
   * 用于此连接的数据库名称 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_DATABASE?: string;
  /**
   * 创建的最大连接数
   * @default 10
   */
  MYSQL_CONNECTION_LIMIT?: number;
  /**
   * sql 调试模式
   * @default false
   */
  MYSQL_DEBUG?: boolean;
  /**
   * redis主机地址
   * @default 本地主机
   */
  REDIS_HOST?: string;
  /**
   * redis端口
   * @default 6379
   */
  REDIS_PORT?: number;
  /** redis密码 */
  REDIS_PASSWORD?: string;
}

// 与默认值合并后的环境变量声明
export type EnvironmentVariables = EnvironmentVariablesDto &
  Required<
    Pick<
      EnvironmentVariablesDto,
      | 'NODE_ENV'
      | 'MYSQL_CONNECTION_LIMIT'
      | 'MYSQL_DEBUG'
      | 'APP_HMAC_SECRET'
      | 'APP_JWT_SECRET'
      | 'APP_GOOGLE_RECAPTCHA_SECRET'
    >
  >;
