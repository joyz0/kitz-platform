import { z } from 'zod';
import { InviteCodeSchema } from './invite-code.schema';

// 更新邀请码 DTO（通常用于标记使用）
export const InviteCodeUpdateSchema = InviteCodeSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InviteCodeUpdateDto = z.infer<typeof InviteCodeUpdateSchema>;