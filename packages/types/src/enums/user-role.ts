import { z } from 'zod';

export const UserRoleEnum = z.enum(['ADMIN', 'USER', 'GUEST']);

export type UserRole = z.infer<typeof UserRoleEnum>;

// 用于前端显示的标签映射
export const UserRoleLabels: Record<UserRole, string> = {
  ADMIN: '管理员',
  USER: '普通用户',
  GUEST: '游客'
};

// 获取选项列表的辅助函数
export const getUserRoleOptions = () => {
  return UserRoleEnum.options.map(value => ({
    value,
    label: UserRoleLabels[value]
  }));
};