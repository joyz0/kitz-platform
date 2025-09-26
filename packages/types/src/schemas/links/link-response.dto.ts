import { z } from 'zod';
import { linkSchema } from './link.schema';
import { createPaginatedResponseSchema } from '../../common/response.dto';

// 链接响应 Schema
export const linkResponseSchema = linkSchema;

export type LinkResponseDto = z.infer<typeof linkResponseSchema>;

// 链接列表响应 Schema（带分页）
export const linkListResponseSchema =
  createPaginatedResponseSchema(linkResponseSchema);

export type LinkListResponseDto = z.infer<typeof linkListResponseSchema>;
