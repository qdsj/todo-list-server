import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        data,
        code: context.switchToHttp().getResponse().statusCode,
        message: 'success',
        timestamp: new Date().toISOString(),
        path: context.switchToHttp().getRequest().url,
      })),
      catchError((err) => {
        if (err instanceof HttpException) {
          const response = err.getResponse();
          // 如果是验证错误，保留原始错误信息结构
          const message =
            typeof response === 'object' ? response['message'] : err.message;

          return throwError(() => ({
            code: err.getStatus(),
            message,
            timestamp: new Date().toISOString(),
            path: context.switchToHttp().getRequest().url,
          }));
        }
        return throwError(() => err);
      }),
    );
  }
}
