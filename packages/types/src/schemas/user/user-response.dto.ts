import { z } from 'zod';
import { UserSchema } from './user.schema';
import { createPaginatedDataSchema } from '../../common/pagination.schema';

// 用户响应 DTO（排除敏感字段）
export const UserResponseSchema = UserSchema.omit({
  password: true, // 不返回密码
});

export type UserResponseDto = z.infer<typeof UserResponseSchema>;

// 用户列表响应 DTO（带分页）
export const UserListResponseSchema = createPaginatedDataSchema(UserResponseSchema);

export type UserListResponseDto = z.infer<typeof UserListResponseSchema>;