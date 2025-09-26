import { z } from 'zod';

export const envValidationSchema = z.object({
  // 数据库配置 (Postgres/Neon)
  POSTGRES_URL_PRISMA_ACCELERATE: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().optional(),
  POSTGRES_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  POSTGRES_URL_NO_SSL: z.string().optional(),
  PGDATABASE: z.string().optional(),
  PGHOST: z.string().optional(),
  PGHOST_UNPOOLED: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  PGUSER: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_USER: z.string().optional(),

  // Redis配置
  REDIS_HOST: z.string().optional(),

  // 认证配置
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),

  // 令牌配置
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  TOKEN_EXPIRES_IN_HOURS: z.coerce.number().int().positive().default(1),

  // Dify API配置
  DIFY_API_KEY: z.string().optional(),

  // 环信配置
  EASEMOB_APPKEY: z.string().optional(),
  EASEMOB_ACCESS_TOKEN: z.string().optional(),
  EASEMOB_USERNAME: z.string().optional(),
  EASEMOB_SOCKET_URL: z.string().optional(),
  EASEMOB_REST_URL: z.string().optional(),

  // 百炼API配置
  BAILIAN_API_KEY: z.string().optional(),

  // Next.js公共环境变量
  NEXT_PUBLIC_DIFY_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // 应用配置
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'local'])
    .default('local'),
});

export type EnvConfig = z.infer<typeof envValidationSchema>;

export function validateEnv(rawEnv: Record<string, unknown>): EnvConfig {
  const parsed = envValidationSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const errors = parsed.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join('; ');
    throw new Error(`Environment validation error: ${errors}`);
  }

  return parsed.data;
}
