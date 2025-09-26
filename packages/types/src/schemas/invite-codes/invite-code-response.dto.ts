import { z } from 'zod';
import { inviteCodeSchema } from './invite-code.schema';
import { createPaginatedResponseSchema } from '../../common/response.dto';

// 用户信息 Schema
const userInfoSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  })
  .nullable();

// 邀请码响应 Schema，基于基础Schema扩展用户信息
export const inviteCodeResponseSchema = inviteCodeSchema.extend({
  user: userInfoSchema,
});

export type InviteCodeResponseDto = z.infer<typeof inviteCodeResponseSchema>;

// 邀请码列表响应 Schema（带分页）
export const inviteCodeListResponseSchema = createPaginatedResponseSchema(
  inviteCodeResponseSchema,
);

export type InviteCodeListResponseDto = z.infer<
  typeof inviteCodeListResponseSchema
>;
