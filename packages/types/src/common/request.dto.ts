import { z } from 'zod';

// 请求查询参数（扩展分页）
export const RequestQuerySchema = z.object({
  pageNo: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type RequestQuery = z.infer<typeof RequestQuerySchema>;

// 通用请求查询 schema 工厂函数
export const createRequestQuerySchema = <T extends z.ZodTypeAny>(whereSchema: T) => {
  return RequestQuerySchema.extend({
    where: whereSchema.optional(),
  });
};