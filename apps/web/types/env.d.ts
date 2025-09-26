// 扩展 Next.js Web 应用环境变量类型定义

declare namespace NodeJS {
  interface ProcessEnv {
    // Web 应用特定的公共环境变量 (NEXT_PUBLIC_ 前缀)
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_DIFY_BASE_URL: string;

    // Web 应用特定的认证配置
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;

    // Node.js 环境
    NODE_ENV: 'development' | 'production' | 'test';
  }
}