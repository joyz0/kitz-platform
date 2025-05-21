import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '@repo/api/common/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const http = context.switchToHttp();
    const handler = context.getHandler();
    const response = http.getResponse();
    const shouldBypass = Reflect.getMetadata('RESPONSE_SKIP', handler);

    if (shouldBypass) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 如果已经是 Response 实例则直接返回
        if (data instanceof Response || data.code !== undefined) {
          response.status(data.code);
          return data;
        }

        return Response.success(data);
      }),
    );
  }
}
