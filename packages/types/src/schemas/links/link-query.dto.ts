import { z } from 'zod';
import { LinkSchema } from './link.schema';
import { createPaginatedQuerySchema } from '../../common/pagination.schema';

// 查询链接 DTO（支持分页和过滤）
export const LinkQuerySchema = createPaginatedQuerySchema(
  LinkSchema.pick({
    title: true,
    url: true,
  }).partial()
);

export type LinkQueryDto = z.infer<typeof LinkQuerySchema>;