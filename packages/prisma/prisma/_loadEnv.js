const { EnvLoader } = require('@repo/env');
const { resolve } = require('path');

EnvLoader.load({
  path: resolve(__dirname, '../../../packages/env'),
  env: process.env.NODE_ENV || 'development',
  required: ['POSTGRES_URL_PRISMA_ACCELERATE', 'POSTGRES_URL_NON_POOLING'],
});
