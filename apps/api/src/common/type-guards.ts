/**
 * 通用类型守卫函数
 * 用于处理 try-catch 中的 unknown error 类型
 */

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function hasProperty<T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj;
}

export function hasStringProperty<T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, string> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    prop in obj &&
    typeof (obj as any)[prop] === 'string'
  );
}

// JWT 错误类型守卫
export function isJWTError(error: unknown): error is Error & { name: string } {
  return (
    isError(error) &&
    (error.name === 'TokenExpiredError' ||
     error.name === 'JsonWebTokenError' ||
     error.name === 'NotBeforeError')
  );
}

// Prisma 错误类型守卫
export function isPrismaError(error: unknown): error is { code: string; meta?: any } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string'
  );
}