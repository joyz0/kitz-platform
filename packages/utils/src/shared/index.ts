export function stripUndefined<T>(obj: T): any {
  const data = {} as T;
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key];
  return { data };
}

// 导出 JWT 工具函数
export * from './jwt';
