// 扩展 Next.js 环境变量类型定义

declare namespace NodeJS {
  interface ProcessEnv {
    // 数据库相关
    POSTGRES_URL_PRISMA_ACCELERATE: string;
    POSTGRES_URL_NON_POOLING: string;
    DATABASE_URL: string;

    // 认证相关
    AUTH_SECRET: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
    TOKEN_EXPIRES_IN_HOURS: string;
    REFRESH_TOKEN_EXPIRES_IN_DAYS: string;

    // Redis 配置
    REDIS_HOST: string;

    // 公共环境变量 (NEXT_PUBLIC_ 前缀)
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_DIFY_BASE_URL: string;

    // AI 服务
    DIFY_API_KEY: string;
    BAILIAN_API_KEY: string;

    // 环信配置
    EASEMOB_APPKEY: string;
    EASEMOB_ACCESS_TOKEN: string;
    EASEMOB_USERNAME: string;
    EASEMOB_SOCKET_URL: string;
    EASEMOB_REST_URL: string;

    // Node.js 环境
    NODE_ENV: 'development' | 'production' | 'test';
  }
}