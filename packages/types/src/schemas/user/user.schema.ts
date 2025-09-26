import { z } from 'zod';
import { UserRoleEnum } from '../../enums/user-role';

// 完整的用户 schema（后端实体）
export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  password: z.string(), // 🔒 后端专用（用于验证）
  email: z.string().email(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  role: UserRoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;
