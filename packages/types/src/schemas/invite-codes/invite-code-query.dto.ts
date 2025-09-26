import { z } from 'zod';
import { inviteCodeSchema } from './invite-code.schema';

// 查询邀请码 Schema，基于基础Schema扩展
export const inviteCodeQuerySchema = inviteCodeSchema
  .pick({
    code: true,
    type: true,
    userId: true,
  })
  .partial()
  .extend({
    // 时间范围查询
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),

    // 分页参数
    pageNo: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),

    // 排序参数，对应ProTable格式
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['ascend', 'descend']).default('descend'),
  });

export type InviteCodeQueryDto = z.infer<typeof inviteCodeQuerySchema>;
