import { resolve } from 'path';
import { EnvLoader } from '@repo/env';

const envPackagePath = resolve(__dirname, '../../../packages/env');
EnvLoader.load({
  path: envPackagePath,
  env: process.env.NODE_ENV || 'test',
  required: [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_BASE_URL',
    'NEXT_PUBLIC_DIFY_BASE_URL',
    'TOKEN_EXPIRES_IN_HOURS',
    'REFRESH_TOKEN_EXPIRES_IN_DAYS',
    'AUTH_SECRET',
    'AUTH_GITHUB_ID',
    'AUTH_GITHUB_SECRET',
  ],
});
