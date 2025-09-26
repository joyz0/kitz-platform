import z from 'zod';

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(), // 🔒 后端专用
  role: z.enum(['admin', 'user']),
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>; // 后端实体
