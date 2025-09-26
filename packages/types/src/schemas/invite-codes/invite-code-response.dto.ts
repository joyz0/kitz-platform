import { z } from 'zod';
import { InviteCodeSchema } from './invite-code.schema';
import { createPaginatedDataSchema } from '../../common/pagination.schema';

// 邀请码响应 DTO
export const InviteCodeResponseSchema = InviteCodeSchema;

export type InviteCodeResponseDto = z.infer<typeof InviteCodeResponseSchema>;

// 邀请码列表响应 DTO（带分页）
export const InviteCodeListResponseSchema = createPaginatedDataSchema(InviteCodeResponseSchema);

export type InviteCodeListResponseDto = z.infer<typeof InviteCodeListResponseSchema>;