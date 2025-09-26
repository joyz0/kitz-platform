import { z } from 'zod';
import { inviteCodeSchema } from './invite-code.schema';

// 创建邀请码 DTO
export const inviteCodeCreateSchema = inviteCodeSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    usedAt: true,
  })
  .extend({
    code: z.string().optional(), // code 可选，后端可自动生成
  });

export type InviteCodeCreateDto = z.infer<typeof inviteCodeCreateSchema>;
