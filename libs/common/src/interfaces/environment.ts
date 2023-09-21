// .env 可用环境变量
export interface EnvironmentVariablesDto {
  /**
   * 环境变量
   * @default process.env.NODE_ENV | 'production'
   */
  NODE_ENV?: 'development' | 'production';
  /**
   * API节流间隔 毫秒单位
   * @default 60000
   */
  APP_THROTTLE_TTL?: number;
  /**
   * 节流间隔内的限制次数
   * @default 60
   */
  APP_THROTTLE_LIMIT?: number;
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
  /** 邮件服务类目 (不提供则不启用邮件模块,影响相关功能) */
  EMAIL_SERVICE?: string;
  /** 邮件授权用户 (不提供则不启用邮件模块,影响相关功能) */
  EMAIL_AUTH_USER?: string;
  /** 邮件授权用户密码 (不提供则不启用邮件模块,影响相关功能) */
  EMAIL_AUTH_PASS?: string;
  /** Redis连接地址 (不提供则不启用Redis模块,影响相关功能) */
  REDIS_CONNECTION_URL?: string;
}

// 与默认值合并后的环境变量声明
export type EnvironmentVariables = EnvironmentVariablesDto &
  Required<
    Pick<
      EnvironmentVariablesDto,
      | 'NODE_ENV'
      | 'APP_THROTTLE_TTL'
      | 'APP_THROTTLE_LIMIT'
      | 'MYSQL_CONNECTION_LIMIT'
      | 'MYSQL_DEBUG'
      | 'APP_HMAC_SECRET'
      | 'APP_JWT_SECRET'
    >
  >;
