/**
 * 环境感知的错误处理器
 *
 * 使用指南：
 * - ServerErrorHandler: 仅在 Server 组件、Server Actions 中使用
 * - ClientErrorHandler: 仅在 Client 组件中使用
 * - ErrorUtils: 通用工具类，可在任何环境使用
 */

// 服务端错误处理器
export { ServerErrorHandler } from './server';

// 客户端错误处理器（运行时导入避免服务端执行）
export type { ClientErrorHandler } from './client';

export { UnifiedErrorHandler } from '../error-mapping';

/**
 * 动态导入客户端错误处理器
 * 避免在服务端环境执行客户端代码
 */
export const getClientErrorHandler = async () => {
  if (typeof window !== 'undefined') {
    const { ClientErrorHandler } = await import('./client');
    return ClientErrorHandler;
  }
  throw new Error('ClientErrorHandler can only be used in client environment');
};
