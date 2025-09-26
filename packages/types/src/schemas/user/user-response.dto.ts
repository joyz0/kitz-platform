import { z } from 'zod';
import { userSchema } from './user.schema';
import { createPaginatedResponseSchema } from '../../common/response.dto';

// 用户响应 Schema（排除敏感字段）
export const userResponseSchema = userSchema.omit({
  password: true, // 不返回密码
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

// 用户列表响应 Schema（带分页）
export const userListResponseSchema =
  createPaginatedResponseSchema(userResponseSchema);

export type UserListResponseDto = z.infer<typeof userListResponseSchema>;
