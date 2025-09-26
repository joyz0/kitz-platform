import { z } from 'zod';

export const registerDto = z.object({
  email: z
    .string({ required_error: '请输入邮箱' })
    .min(1, '请输入邮箱')
    .email('请输入正确的邮箱'),
  password: z
    .string({ required_error: '请输入密码' })
    .min(1, '请输入密码')
    .min(8, '密码必须大于8位')
    .max(32, '密码必须小于32位'),
  inviteCode: z
    .string({ required_error: '请输入邀请码' })
    .min(1, '请输入邀请码'),
});

export type RegisterDto = z.infer<typeof registerDto>;