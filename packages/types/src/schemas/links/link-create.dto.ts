import { z } from 'zod';
import { linkSchema } from './link.schema';

// 创建链接 DTO
export const linkCreateSchema = linkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LinkCreateDto = z.infer<typeof linkCreateSchema>;
