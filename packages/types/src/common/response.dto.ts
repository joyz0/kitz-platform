import { z } from 'zod';
import { PaginatedResponseSchema } from './pagination.schema';

// 分页结果 meta 信息 (重用 pagination.schema 中的定义)
export type PaginateMeta = z.infer<typeof PaginatedResponseSchema>;

// 分页结果 schema 工厂函数
export const createPaginateResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    items: z.array(itemSchema),
    meta: PaginatedResponseSchema,
  });
};

// 通用 API 响应
export const ApiResponseSchema = z.object({
  ok: z.boolean(),
  code: z.number(),
  message: z.string().optional(),
  data: z.any().optional(),
  timestamp: z.number().optional(),
});

export type ApiResponse<T = any> = {
  ok: boolean;
  code: number;
  message?: string;
  data?: T;
  timestamp?: number;
};

// API 响应工厂函数
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    ok: z.boolean(),
    code: z.number(),
    message: z.string().optional(),
    data: dataSchema.optional(),
    timestamp: z.number().optional(),
  });
};

// 成功响应辅助函数
export const createSuccessResponse = <T>(data?: T): ApiResponse<T> => ({
  ok: true,
  code: 200,
  message: 'Success',
  data,
  timestamp: Date.now(),
});

// 错误响应辅助函数
export const createErrorResponse = (message: string, code: number = 500): ApiResponse<never> => ({
  ok: false,
  code,
  message,
  timestamp: Date.now(),
});

// 分页响应辅助函数
export const createPaginateResponse = <T>(
  items: T[],
  total: number,
  pageNo: number,
  pageSize: number,
): ApiResponse<{ items: T[]; meta: PaginateMeta }> => ({
  ok: true,
  code: 200,
  message: 'Success',
  data: {
    items,
    meta: {
      total,
      pageNo,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  },
  timestamp: Date.now(),
});