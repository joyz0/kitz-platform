import { z } from 'zod';
import { UserSchema } from './user.schema';

// 用户创建 DTO schema
export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6), // 密码最少 6 位
});

export type UserCreateDto = z.infer<typeof UserCreateSchema>;