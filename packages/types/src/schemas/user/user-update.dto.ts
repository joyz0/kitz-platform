import { z } from 'zod';
import { UserSchema } from './user.schema';

// 更新链接 DTO
export const UserUpdateSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type UserUpdateDto = z.infer<typeof UserUpdateSchema>;
