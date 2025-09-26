import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

export interface EnvLoaderOptions {
  path?: string;
  env?: string;
  required?: string[];
}

export class EnvLoader {
  private static loaded = false;
  private static config: Record<string, string | number> = {};

  /**
   * 加载环境变量
   */
  static load<T extends Record<string, any>>(options?: EnvLoaderOptions): T {
    if (this.loaded) {
      return this.config as T;
    }

    const env = options?.env || process.env.NODE_ENV || 'development';
    const basePath = options?.path || process.cwd();

    // 定义要加载的环境文件列表
    const envFiles = [
      join(basePath, `.env.${env}.local`),
      join(basePath, `.env.${env}`),
      join(basePath, '.env.local'),
      join(basePath, '.env'),
    ];

    // 按优先级加载环境文件
    for (const envFile of envFiles) {
      if (existsSync(envFile)) {
        config({ path: envFile });
        console.log(`Loaded environment variables from ${envFile}`);
        break;
      }
    }

    // 将环境变量存入配置对象
    this.config = { ...process.env } as T;

    // 转换数字类型的值
    Object.keys(this.config).forEach((key) => {
      const value = this.config[key];
      if (value && !isNaN(Number(value))) {
        this.config[key] = Number(value);
      }
    });

    this.loaded = true;

    // 验证必需的环境变量
    if (options?.required && options.required.length > 0) {
      this.validateRequired(options.required);
    }

    return this.config as T;
  }

  /**
   * 获取环境变量值
   */
  static get(key: string, defaultValue?: any): any {
    if (!this.loaded) {
      this.load();
    }

    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  /**
   * 获取所有环境变量
   */
  static getAll(): Record<string, string | number> {
    if (!this.loaded) {
      this.load();
    }

    return { ...this.config };
  }

  /**
   * 验证必需的环境变量
   */
  private static validateRequired(required: string[]): void {
    const missing: string[] = [];

    required.forEach((key) => {
      if (this.config[key] === undefined || this.config[key] === '') {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }

  /**
   * 获取所有 NEXT_PUBLIC_ 前缀的环境变量
   * 专门用于 Next.js 客户端环境变量
   */
  static getNextConfigEnv(): Record<string, string> {
    if (!this.loaded) {
      this.load();
    }

    const clientEnvs: Record<string, string> = {};

    Object.keys(this.config).forEach((key) => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        clientEnvs[key] = String(this.config[key]);
      }
    });

    return clientEnvs;
  }

  /**
   * 获取指定前缀的环境变量
   */
  static getByPrefix(prefix: string): Record<string, string | number> {
    if (!this.loaded) {
      this.load();
    }

    const prefixedEnvs: Record<string, string | number> = {};

    Object.keys(this.config).forEach((key) => {
      if (key.startsWith(prefix) && this.config[key] !== undefined) {
        prefixedEnvs[key] = this.config[key]!;
      }
    });

    return prefixedEnvs;
  }

  /**
   * 检查当前环境
   */
  static isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  static isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  static isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
}
