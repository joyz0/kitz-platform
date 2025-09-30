'use client';

import { RoutePath } from '@/lib/constants';
import { UnifiedErrorHandler } from '../error-mapping';
import { StatusCode, StatusCodeMap } from '@repo/types/enums/status-code';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 客户端错误处理器 - 只能在 Client 组件中使用
 */
export class ClientErrorHandler {
  /**
   * 客户端重定向到错误页面
   * 只能在 Client 组件中使用
   */
  static redirectToError(
    router: AppRouterInstance,
    statusCode: StatusCode | string,
  ) {
    const url = `${RoutePath.ERROR_URL}?error=${statusCode}`;
    router.push(url);
  }

  /**
   * 处理请求错误 - 根据状态码决定是否重定向
   */
  static handleRequestError(
    router: AppRouterInstance,
    statusCode: number,
    message: string,
  ) {
    if (UnifiedErrorHandler.isAuthError(statusCode)) {
      // 认证错误直接重定向到错误页面
      this.redirectToError(router, StatusCodeMap.UNAUTHORIZED.toString());
      return;
    }

    // 其他错误通过事件总线发送，由UI组件显示
    this.emitErrorEvent(message);
  }

  /**
   * 发送错误事件 - 用于UI提示
   */
  static emitErrorEvent(message: string) {
    // 动态导入避免在服务端执行
    if (typeof window !== 'undefined') {
      import('@/lib/event').then(({ CustomEventBus }) => {
        import('@/lib/constants').then(({ EventType }) => {
          CustomEventBus.emit(EventType.REQUEST_ERROR, message);
        });
      });
    }
  }

  /**
   * 处理未捕获的 Promise rejection
   */
  static handleUnhandledRejection(router: AppRouterInstance, reason: any) {
    console.error('Unhandled promise rejection:', reason);

    let errorMessage = '';
    if (reason instanceof Error) {
      errorMessage = reason.message.toLowerCase();
    } else if (typeof reason === 'string') {
      errorMessage = reason.toLowerCase();
    }

    // 检查是否包含认证相关错误信息
    if (
      UnifiedErrorHandler.isAuthError(parseInt(errorMessage)) ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('token')
    ) {
      this.redirectToError(router, StatusCodeMap.UNAUTHORIZED.toString());
      return;
    }

    // 其他未处理的错误仅在开发环境输出详情
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled rejection details:', reason);
    }
  }
}
