import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { BusinessStatus, HttpResponse } from '@app/common/utils';

export const VALIDATION_OPTION: ValidationPipeOptions = {
  transform: true, // 转换数据
  whitelist: true, // 剥离装饰器不验证的项目
  stopAtFirstError: true, // 遇见第一个错误时就停止验证
  // skipMissingProperties: true, // 跳过未定义或定义null的验证
  // disableErrorMessages: true, // 禁用详细错误信息
  validateCustomDecorators: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    return new HttpResponse({
      statusCode: BusinessStatus.EXPECTATION_FAILED,
      data: errors,
      message: '请求参数不符合期望值',
    });
  },
};

// 标识接口无需进行鉴权
export const IS_PUBLIC_KEY = 'public';

export const AUTH_KEY = 'AUTH';

export enum PERMISSIONS {
  /** 权限相关 */
  PERMISSION_CREATE = 'permissions_create',
  PERMISSION_DELETE = 'permissions_delete',
  PERMISSION_UPDATE = 'permissions_update',
  PERMISSION_QUERY = 'permissions_query',
  /** 角色相关 */
  ROLE_CREATE = 'roles_create',
  ROLE_DELETE = 'roles_delete',
  ROLE_UPDATE = 'roles_update',
  ROLE_QUERY = 'roles_query',
  /** 用户相关 */
  USER_CREATE = 'users_create',
  USER_DELETE = 'users_delete',
  USER_UPDATE = 'users_update',
  USER_QUERY = 'users_query',
  DEBUG = 'debug',
}
