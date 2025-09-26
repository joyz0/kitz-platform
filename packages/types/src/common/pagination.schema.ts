import { z } from 'zod';

// 分页参数 schema
export const PaginationSchema = z.object({
  pageNo: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// 分页响应 schema
export const PaginatedResponseSchema = z.object({
  pageNo: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;

// 通用分页查询 schema 工厂函数
export const createPaginatedQuerySchema = <T extends z.ZodObject<any>>(schema: T) => {
  return schema.merge(PaginationSchema.partial());
};

// 通用分页响应 schema 工厂函数
export const createPaginatedDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: z.array(dataSchema),
    pagination: PaginatedResponseSchema,
  });
};