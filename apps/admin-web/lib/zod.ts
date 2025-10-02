import z from 'zod';

// Web 应用特定的表单 schema

export const inviteCodeFormSchema = z.object({
  type: z.string({
    required_error: '请选择邀请码类型',
  }),
  expiresAt: z.date({
    required_error: '请选择过期时间',
  }),
});
export type InviteCodeFormSchema = z.infer<typeof inviteCodeFormSchema>;

export type UserFormSchema = Partial<{
  id: string;
  name: string;
  role: string;
  email: string;
  emailVerified: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}>;
