import { StatusCodeMap, StatusCode } from '@repo/types/enums/status-code';
import { UnifiedErrorHandler } from './error-mapping';

/**
 * 服务端错误处理器 - 只能在 Server 组件中使用
 */
export class ServerErrorHandler {
  /**
   * 服务端重定向到错误页面
   * 只能在 Server 组件、Server Actions 中使用
   */
  static redirectToError(statusCode: StatusCode | string, baseUrl?: string): void {
    const { redirect } = require('next/navigation');
    const url = UnifiedErrorHandler.createErrorUrl(statusCode, baseUrl);
    redirect(url);
  }

  /**
   * 权限检查 - 用于 Server 组件
   */
  static checkAccess(
    userRole?: string,
    requiredRoles: string[] = [],
    baseUrl?: string,
  ) {
    if (!userRole || !requiredRoles.some((role) => role === userRole)) {
      this.redirectToError(StatusCodeMap.FORBIDDEN.toString(), baseUrl);
    }
  }

  /**
   * Session 检查 - 用于受保护的页面布局
   */
  static validateSession(session: any) {
    if (!session) {
      this.redirectToError(StatusCodeMap.UNAUTHORIZED.toString());
    } else if (session.error) {
      // 如果 session 中的 error 是 StatusCode，直接使用，否则映射为 401
      const statusCode = Object.values(StatusCodeMap).map(String).includes(String(session.error))
        ? String(session.error)
        : StatusCodeMap.UNAUTHORIZED.toString();
      this.redirectToError(statusCode as StatusCode);
    }
  }
}
