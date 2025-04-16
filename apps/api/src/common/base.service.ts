import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@repo/pgdb';

@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  protected handleError(error: unknown, context?: string): never {
    // 处理 Prisma 已知错误
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.logError(`[Prisma Error ${error.code}]`, context, error);
      
      // 特殊处理常见错误码
      switch (error.code) {
        case 'P2002':
          throw new Error(`Unique constraint failed: ${error.meta?.target}`);
        case 'P2025':
          throw new Error('Record not found');
        default:
          throw new Error(`Database error: ${error.message}`);
      }
    }

    // 处理标准 Error
    if (error instanceof Error) {
      this.logError(error.name, context, error);
      throw error; // 保留原始堆栈
    }

    // 处理非 Error 类型的抛出 (如 throw 'string')
    this.logError('Unexpected error type', context, error);
    throw new Error(context || 'Internal server error');
  }

  private logError(title: string, context: string | undefined, error: any) {
    const errorContext = context ? `[${context}] ` : '';
    this.logger.error(`${errorContext}${title}`, error.stack || error);
  }
}