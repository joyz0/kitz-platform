import { z } from 'zod';

export const StatusCodeEnum = z.enum([
  '200', '400', '401', '403', '404', '500', // HTTP 状态码
  '101001', '101002', '101003', // 数据库错误
  '200001', // 用户错误
  '300001'  // 订单错误
]);

export type StatusCode = z.infer<typeof StatusCodeEnum>;

// 状态码映射
export const StatusCodeMap = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,

  // 扩展业务状态码（6位数字，前3位代表模块）
  DB_ERROR: 101001,
  DB_UNIQUE_CONSTRAINT_FAILED: 101002,
  DB_RECORD_NOT_FOUND: 101003,
  USER_NOT_EXIST: 200001,
  ORDER_EXPIRED: 300001,
} as const;

// 状态码标签映射
export const StatusCodeLabels: Record<string, string> = {
  '200': '成功',
  '400': '请求错误',
  '401': '未授权',
  '403': '禁止访问',
  '404': '资源不存在',
  '500': '服务器错误',
  '101001': '数据库错误',
  '101002': '唯一约束失败',
  '101003': '记录不存在',
  '200001': '用户不存在',
  '300001': '订单已过期',
};