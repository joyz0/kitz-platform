import React from 'react';
import { StatusCode, StatusCodeMap, StatusCodeLabels } from '@repo/types/enums/status-code';
import { RoutePath } from '@/lib/constants';

export interface ErrorConfig {
  title: string;
  redirect: string;
  content: React.ReactNode;
}

// 创建错误内容的辅助函数
const createErrorContent = (message: string, statusCode: string) => (
  <p>
    {message} 错误码{' '}
    <code className="rounded-sm bg-slate-100 p-1 text-xs">{statusCode}</code>
  </p>
);

export const StatusCodeErrorMap: Record<StatusCode, ErrorConfig> = {
  // HTTP 状态码
  '200': {
    title: '成功',
    redirect: RoutePath.INDEX,
    content: createErrorContent('操作成功', '200'),
  },
  '400': {
    title: '请求错误',
    redirect: RoutePath.INDEX,
    content: createErrorContent('请求参数错误', '400'),
  },
  '401': {
    title: '访问受限',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('登录已过期，请重新登录', '401'),
  },
  '403': {
    title: '权限不足',
    redirect: RoutePath.DASHBOARD,
    content: createErrorContent('您没有访问该页面的权限', '403'),
  },
  '404': {
    title: '页面不存在',
    redirect: RoutePath.INDEX,
    content: createErrorContent('请求的资源不存在', '404'),
  },
  '500': {
    title: '服务器异常',
    redirect: RoutePath.INDEX,
    content: createErrorContent('服务器内部错误', '500'),
  },

  // 数据库错误
  '101001': {
    title: '数据库错误',
    redirect: RoutePath.INDEX,
    content: createErrorContent('数据库操作异常', '101001'),
  },
  '101002': {
    title: '数据冲突',
    redirect: RoutePath.INDEX,
    content: createErrorContent('数据已存在，请检查输入信息', '101002'),
  },
  '101003': {
    title: '数据不存在',
    redirect: RoutePath.INDEX,
    content: createErrorContent('请求的数据不存在', '101003'),
  },

  // 用户错误
  '200001': {
    title: '用户不存在',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('用户账户不存在，请检查登录信息', '200001'),
  },

  // 订单错误
  '300001': {
    title: '订单已过期',
    redirect: RoutePath.DASHBOARD,
    content: createErrorContent('订单已过期，请重新下单', '300001'),
  },

  // 认证错误
  '400001': {
    title: '登录已过期',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('登录状态已过期，请重新登录', '400001'),
  },
  '400002': {
    title: '登录失效',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('登录信息无效，请重新登录', '400002'),
  },
  '400003': {
    title: '登录已过期',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('刷新令牌已过期，请重新登录', '400003'),
  },
  '400004': {
    title: '登录失效',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('刷新令牌无效，请重新登录', '400004'),
  },
  '400005': {
    title: '未登录',
    redirect: RoutePath.SIGNIN_URL,
    content: createErrorContent('请先登录后再访问', '400005'),
  },
};

export const DefaultErrorConfig: ErrorConfig = {
  title: '未知错误',
  redirect: RoutePath.INDEX,
  content: createErrorContent('未知错误，请联系系统管理员', 'UNKNOWN'),
};

/**
 * 统一错误处理工具类
 */
export class UnifiedErrorHandler {
  /**
   * 根据状态码获取错误配置
   */
  static getErrorConfig(statusCode: StatusCode | string): ErrorConfig {
    return StatusCodeErrorMap[statusCode as StatusCode] || DefaultErrorConfig;
  }

  /**
   * 判断是否为认证相关错误
   */
  static isAuthError(statusCode: StatusCode | string | number): boolean {
    const authErrorCodes = [
      StatusCodeMap.TOKEN_EXPIRED.toString(),
      StatusCodeMap.TOKEN_INVALID.toString(),
      StatusCodeMap.REFRESH_TOKEN_EXPIRED.toString(),
      StatusCodeMap.REFRESH_TOKEN_INVALID.toString(),
      StatusCodeMap.TOKEN_MISSING.toString(),
      StatusCodeMap.UNAUTHORIZED.toString(),
    ];
    return authErrorCodes.includes(statusCode.toString());
  }

  /**
   * 创建错误页面URL
   */
  static createErrorUrl(statusCode: StatusCode | string, origin?: string): string {
    const base =
      origin ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : process.env.BASE_URL);
    const url = new URL(RoutePath.ERROR_URL, base);
    url.searchParams.append('error', statusCode.toString());
    return url.href;
  }

  /**
   * 获取错误标签
   */
  static getErrorLabel(statusCode: StatusCode | string): string {
    return StatusCodeLabels[statusCode.toString()] || '未知错误';
  }
}