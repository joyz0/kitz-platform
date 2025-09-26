import { z } from 'zod';
import { InviteCodeSchema } from './invite-code.schema';
import { createPaginatedQuerySchema } from '../../common/pagination.schema';

// 查询邀请码 DTO（支持分页和过滤）
export const InviteCodeQuerySchema = createPaginatedQuerySchema(
  InviteCodeSchema.pick({
    code: true,
    type: true,
    userId: true,
  }).partial()
);

export type InviteCodeQueryDto = z.infer<typeof InviteCodeQuerySchema>;