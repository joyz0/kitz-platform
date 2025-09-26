import { z } from 'zod';
import { LinkSchema } from './link.schema';
import { createPaginatedDataSchema } from '../../common/pagination.schema';

// 链接响应 DTO
export const LinkResponseSchema = LinkSchema;

export type LinkResponseDto = z.infer<typeof LinkResponseSchema>;

// 链接列表响应 DTO（带分页）
export const LinkListResponseSchema = createPaginatedDataSchema(LinkResponseSchema);

export type LinkListResponseDto = z.infer<typeof LinkListResponseSchema>;