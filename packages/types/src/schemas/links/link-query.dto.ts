import { z } from 'zod';
import { linkSchema } from './link.schema';

// 链接查询 Schema，基于基础 Schema 扩展
export const linkQuerySchema = linkSchema
  .pick({
    title: true,
    url: true,
    description: true,
  })
  .partial()
  .extend({
    // 时间范围查询
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),

    // 分页参数
    pageNo: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),

    // 排序参数
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['ascend', 'descend']).default('descend'),
  });

export type LinkQueryDto = z.infer<typeof linkQuerySchema>;
