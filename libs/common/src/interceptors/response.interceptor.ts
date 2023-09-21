import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpResponse } from '@app/common';

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
      catchError((err: any) => {
        if (err instanceof HttpResponse) {
          return of(err.getMicroServiceResponse());
        }
        return throwError(() => err);
      }),
    );
  }
}
