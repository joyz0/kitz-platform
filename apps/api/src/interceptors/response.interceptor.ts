import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@repo/types/common/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const handler = context.getHandler();
    const response = http.getResponse();
    const shouldBypass = Reflect.getMetadata('RESPONSE_SKIP', handler);

    if (shouldBypass) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 如果已经是 ApiResponse 实例则直接返回
        if (data && typeof data === 'object' && 'ok' in data && 'code' in data) {
          response.status(data.code);
          return data;
        }

        // 创建成功响应
        const successResponse: ApiResponse<T> = {
          ok: true,
          code: 200,
          message: 'Success',
          data,
          timestamp: Date.now(),
        };

        response.status(200);
        return successResponse;
      }),
    );
  }
}
