import { z } from 'zod';
import { InviteCodeTypeEnum } from '../../enums/invite-code-type';

// 完整的邀请码 schema
export const inviteCodeSchema = z.object({
  id: z.string().cuid(),
  code: z.string(),
  type: InviteCodeTypeEnum,
  expiresAt: z.coerce.date().nullable(),
  usedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().nullable(), // 使用者ID
});

export type InviteCode = z.infer<typeof inviteCodeSchema>;
