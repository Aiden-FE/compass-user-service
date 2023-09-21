import { CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { HttpResponse, IS_PUBLIC_KEY } from '@app/common';
import { RpcException } from '@nestjs/microservices';

export default class JWTAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 使用了 @Public() 装饰器的不做校验
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 公共接口放行
    if (isPublic) {
      return true;
    }
    const rpcCtx = context.switchToRpc();
    const { user } = rpcCtx.getData();
    if (!user) {
      throw new RpcException(
        new HttpResponse({
          httpStatus: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        }).getMicroServiceResponse(),
      );
    }
    // 当存在用户信息则检查权限是否可用
    return true;
  }
}
