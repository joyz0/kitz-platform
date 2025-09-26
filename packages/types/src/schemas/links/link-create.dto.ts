import { z } from 'zod';
import { LinkSchema } from './link.schema';

// 创建链接 DTO
export const LinkCreateSchema = LinkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LinkCreateDto = z.infer<typeof LinkCreateSchema>;