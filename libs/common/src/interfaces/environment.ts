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
   * mysql 要连接的数据库的主机名
   * @default 本地主机
   */
  MYSQL_HOST?: string | undefined;
  /**
   * 连接用户 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_USER?: string | undefined;
  /**
   * 连接密码 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_PASSWORD?: string | undefined;
  /**
   * 用于此连接的数据库名称 (不存在则不启用mysql模块,影响相关功能)
   */
  MYSQL_DATABASE?: string | undefined;
  /**
   * 创建的最大连接数
   * @default 10
   */
  MYSQL_CONNECTION_LIMIT?: number;
}

export type EnvironmentVariables = Required<EnvironmentVariablesDto>;
