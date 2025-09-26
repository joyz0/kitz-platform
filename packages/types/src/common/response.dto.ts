import { z } from 'zod';

// 分页元信息
export const PaginationMetaSchema = z.object({
  pageNo: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// API 响应基础结构
export const ApiResponseSchema = z.object({
  ok: z.boolean(),
  code: z.number(),
  message: z.string().optional(),
  timestamp: z.number().optional(),
});

// 数据响应类型定义
export type ApiResponse<T = unknown> = {
  ok: boolean;
  code: number;
  message?: string;
  data?: T;
  timestamp?: number;
};

// 分页数据响应类型
export type PaginatedApiResponse<T = unknown> = ApiResponse<{
  items: T[];
  meta: PaginationMeta;
}>;

// 响应构建器
export class ResponseBuilder {
  // 成功响应
  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return {
      ok: true,
      code: 200,
      message: message || 'Success',
      data,
      timestamp: Date.now(),
    };
  }

  // 错误响应
  static error(message: string, code: number = 500): ApiResponse<never> {
    return {
      ok: false,
      code,
      message,
      timestamp: Date.now(),
    };
  }

  // 分页响应
  static paginated<T>(
    items: T[],
    total: number,
    pageNo: number,
    pageSize: number,
    message?: string
  ): PaginatedApiResponse<T> {
    return {
      ok: true,
      code: 200,
      message: message || 'Success',
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
    };
  }
}

// Schema 工厂函数
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return ApiResponseSchema.extend({
    data: dataSchema.optional(),
  });
};

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return ApiResponseSchema.extend({
    data: z.object({
      items: z.array(itemSchema),
      meta: PaginationMetaSchema,
    }).optional(),
  });
};

// 向后兼容的工厂函数和类型别名
export const createPaginateResultSchema = createPaginatedResponseSchema;
export type PaginateMeta = PaginationMeta;

// 辅助函数（向后兼容）
export const createSuccessResponse = ResponseBuilder.success;
export const createErrorResponse = ResponseBuilder.error;
export const createPaginateResponse = ResponseBuilder.paginated;