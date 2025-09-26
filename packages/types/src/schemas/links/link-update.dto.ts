import { z } from 'zod';
import { LinkSchema } from './link.schema';

// 更新链接 DTO
export const LinkUpdateSchema = LinkSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LinkUpdateDto = z.infer<typeof LinkUpdateSchema>;