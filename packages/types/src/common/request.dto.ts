import { z } from 'zod';

// 基础排序参数
export const SortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

// 分页参数
export const PaginationSchema = z.object({
  pageNo: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// 完整的分页查询参数
export const PaginatedQuerySchema = SortSchema.merge(PaginationSchema).extend({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type Sort = z.infer<typeof SortSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type PaginatedQuery = z.infer<typeof PaginatedQuerySchema>;

// 查询构建器 - 支持条件查询
export const createQuerySchema = <T extends z.ZodTypeAny>(
  whereSchema: T,
  options: { paginated?: boolean; sortable?: boolean } = {}
) => {
  const { paginated = false, sortable = true } = options;

  let baseSchema = z.object({
    where: whereSchema.optional(),
  });

  if (sortable && paginated) {
    return baseSchema.merge(PaginatedQuerySchema);
  } else if (sortable) {
    return baseSchema.merge(SortSchema);
  } else if (paginated) {
    return baseSchema.merge(PaginationSchema);
  }

  return baseSchema;
};

// 向后兼容的工厂函数
export const createRequestQuerySchema = <T extends z.ZodTypeAny>(whereSchema: T) => {
  return createQuerySchema(whereSchema, { paginated: true, sortable: true });
};

export const createPaginatedQuerySchema = <T extends z.ZodObject<any>>(schema: T) => {
  return z.intersection(schema, PaginationSchema.partial());
};