import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@repo/prisma';
import { StatusCodeMap } from '@repo/types/enums/status-code';
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  /**
   * 统一的错误处理方法
   * @param error 错误对象
   * @param context 上下文信息
   */
  protected handleError(error: unknown, context?: string): never {
    // 处理 Prisma 已知请求错误
    if (error instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(error, context);
    }

    // Handle Prisma validation errors (basic check)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2012') {
      this.logError('[Prisma Validation Error]', context, error);
      throw new CustomException(
        StatusCodeMap.BAD_REQUEST,
        'Invalid data provided',
      );
    }

    // 处理标准 Error
    if (error instanceof Error) {
      this.logError(error.name, context, error);
      throw error; // 保留原始堆栈
    }

    // 处理非 Error 类型的抛出 (如 throw 'string')
    this.logError('Unexpected error type', context, error);
    throw new InternalServerErrorException(context || 'Internal server error');
  }

  /**
   * 处理 Prisma 已知错误
   */
  private handlePrismaKnownError(error: PrismaClientKnownRequestError, context?: string): never {
    this.logError(`[Prisma Error ${error.code}]`, context, error);

    // 根据错误码映射不同的业务错误
    const errorMap: Record<string, { code: number; message: string }> = {
      'P2002': {
        code: StatusCodeMap.DB_UNIQUE_CONSTRAINT_FAILED,
        message: `Unique constraint failed: ${Array.isArray(error.meta?.target) ? (error.meta?.target as string[]).join(', ') : error.meta?.target || 'unknown field'}`,
      },
      'P2025': {
        code: StatusCodeMap.DB_RECORD_NOT_FOUND,
        message: 'Record not found',
      },
      'P2003': {
        code: StatusCodeMap.BAD_REQUEST,
        message: 'Foreign key constraint failed',
      },
      'P2016': {
        code: StatusCodeMap.DB_RECORD_NOT_FOUND,
        message: 'Query interpretation error: record not found',
      },
    };

    const mappedError = errorMap[error.code];
    if (mappedError) {
      throw new CustomException(mappedError.code, mappedError.message);
    }

    // 未知的 Prisma 错误
    throw new CustomException(
      StatusCodeMap.DB_ERROR,
      `Database error: ${error.message}`,
    );
  }

  /**
   * 安全的数据验证
   */
  protected validateRequired<T>(value: T | null | undefined, fieldName: string): T {
    if (value === null || value === undefined) {
      throw new CustomException(
        StatusCodeMap.BAD_REQUEST,
        `Required field missing: ${fieldName}`,
      );
    }
    return value;
  }

  /**
   * 记录成功操作
   */
  protected logSuccess(operation: string, details?: Record<string, any>): void {
    const message = details ? `${operation}: ${JSON.stringify(details)}` : operation;
    this.logger.log(`✅ ${message}`);
  }

  /**
   * 记录信息日志
   */
  protected logInfo(message: string, details?: Record<string, any>): void {
    const fullMessage = details ? `${message}: ${JSON.stringify(details)}` : message;
    this.logger.log(fullMessage);
  }

  /**
   * 记录警告信息
   */
  protected logWarning(message: string, context?: string): void {
    const fullMessage = context ? `[${context}] ${message}` : message;
    this.logger.warn(`⚠️ ${fullMessage}`);
  }

  /**
   * 私有错误日志记录方法
   */
  private logError(title: string, context: string | undefined, error: any): void {
    const errorContext = context ? `[${context}] ` : '';
    const errorDetails = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    };
    this.logger.error(`❌ ${errorContext}${title}`, errorDetails);
  }
}
