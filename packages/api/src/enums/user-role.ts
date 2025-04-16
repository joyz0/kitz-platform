import { type EnumClass, createEnum } from './enum-factory';

// 创建枚举
export const UserRoleEnum = createEnum({
  values: ['ADMIN', 'USER', 'GUEST'] as const,
  labels: {
    ADMIN: '管理员',
    USER: '普通用户',
    GUEST: '游客'
  }
});

// 生成类型（可选，增强类型提示）
export type UserRoleEnum = typeof UserRoleEnum extends EnumClass<infer T> ? T : never;
