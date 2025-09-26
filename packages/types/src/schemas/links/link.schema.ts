import { z } from 'zod';

// 完整的链接 schema
export const LinkSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  title: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Link = z.infer<typeof LinkSchema>;