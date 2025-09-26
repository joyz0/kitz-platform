import { z } from 'zod';
import { userSchema } from './user.schema';

// 用户查询 Schema，基于基础 Schema 扩展
export const userQuerySchema = userSchema
  .pick({
    name: true,
    email: true,
    role: true,
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

export type UserQueryDto = z.infer<typeof userQuerySchema>;
