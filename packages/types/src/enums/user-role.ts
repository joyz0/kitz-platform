import { z } from 'zod';

export const UserRoleEnum = z.enum(['ADMIN', 'USER', 'GUEST']);

export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserRole = {
  ADMIN: 'ADMIN' as const,
  USER: 'USER' as const,
  GUEST: 'GUEST' as const,
} as const;

export const UserRoleLabels: Record<UserRole, string> = {
  ADMIN: '管理员',
  USER: '普通用户',
  GUEST: '游客'
};

export const getUserRoleOptions = () => {
  return UserRoleEnum.options.map(value => ({
    value,
    label: UserRoleLabels[value]
  }));
};