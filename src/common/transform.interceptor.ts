import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  error_code: number | string;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // If the controller already wrapped it with error_code or code, leave it alone
        if (data && (data.error_code !== undefined || data.code !== undefined)) {
          return data;
        }
        return {
          error_code: 0,
          data: data,
          message: 'success',
        };
      }),
    );
  }
}
