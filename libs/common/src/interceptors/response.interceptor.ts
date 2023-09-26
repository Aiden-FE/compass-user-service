import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { BusinessStatus, HttpResponse } from '@app/common';

@Injectable()
export default class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((result) => {
        let data: HttpResponse;
        if (result instanceof HttpResponse) {
          data = result;
        } else {
          data = new HttpResponse({
            data: result,
          });
        }

        return data.getMicroServiceResponse();
      }),
      catchError((err: unknown) => {
        let resp: HttpResponse;
        if (err instanceof HttpResponse) {
          resp = err;
        } else {
          resp = new HttpResponse({
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            statusCode: BusinessStatus.INTERNAL_SERVER_ERROR,
            message: 'Server internal error',
          });
          Logger.warn(err);
        }
        return of(resp.getMicroServiceResponse());
      }),
    );
  }
}
