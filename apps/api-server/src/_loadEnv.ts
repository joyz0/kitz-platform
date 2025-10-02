import { resolve } from 'path';
import { EnvLoader } from '@repo/env';

const envPackagePath = resolve(__dirname, '../../../../packages/env');
EnvLoader.load({
  path: envPackagePath,
  env: process.env.NODE_ENV || 'development',
  required: [
    'AUTH_SECRET',
    'REFRESH_TOKEN_EXPIRES_IN_DAYS',
    'TOKEN_EXPIRES_IN_HOURS',
    'REDIS_HOST',
    'POSTGRES_URL_PRISMA_ACCELERATE',
    'POSTGRES_URL_NON_POOLING',
  ],
});
