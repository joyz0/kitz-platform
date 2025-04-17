import z from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ required_error: '请输入邮箱' })
    .min(1, '请输入邮箱')
    .email('请输入正确的邮箱'),
  password: z
    .string({ required_error: '请输入密码' })
    .min(1, '请输入密码')
    .min(8, '密码必须大于8位')
    .max(32, '密码必须小于32位'),
});

export const signUpSchema = z.object({
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

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const querySchema = z.object({
  pagination: z.object({
    pageIndex: z.number().min(0).default(0),
    pageSize: z.number().min(0).max(100).default(10),
  }),
  sorting: z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    })
  ),
  columnFilters: z.array(
    z.object({
      id: z.string(),
      value: z.any(),
    })
  ),
});
export type QuerySchema = z.infer<typeof querySchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  role: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});
export type UserSchema = z.infer<typeof userSchema>;

export type UserFormSchema = Partial<{
  [P in keyof UserSchema]: Exclude<UserSchema[P], null>;
}>;

export const inviteCodeSchema = z.object({
  code: z.string().optional(),
  type: z.string().optional(),
  expiresAt: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  usedAt: z.string().optional().nullable(),
  user: z
    .object({
      name: z.string().nullable(),
      email: z.string().nullable(),
    })
    .optional()
    .nullable(),
});
export type InviteCodeSchema = z.infer<typeof inviteCodeSchema>;

export const inviteCodeFormSchema = z.object({
  type: z.string({
    required_error: '请选择邀请码类型',
  }),
  expiresAt: z.date({
    required_error: '请选择过期时间',
  }),
});
export type InviteCodeFormSchema = z.infer<typeof inviteCodeFormSchema>;
