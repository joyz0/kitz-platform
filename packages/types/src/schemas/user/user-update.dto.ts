import { z } from 'zod';
import { userSchema } from './user.schema';

// 更新用户 Schema - 排除系统管理字段，其余字段都可选
export const userUpdateSchema = userSchema
  .omit({
    id: true, // 主键不能修改
    createdAt: true, // 创建时间不能修改
    updatedAt: true, // 更新时间由系统自动管理
  })
  .partial(); // 所有业务字段都可选，支持部分更新

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
