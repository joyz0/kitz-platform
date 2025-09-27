/**
 * JWT 工具函数
 * 提供 JWT token 的解码和处理功能
 */

export interface JWTPayload {
  sub?: string;        // Subject (用户ID)
  email?: string;      // 邮箱
  iat?: number;        // Issued At (签发时间)
  exp?: number;        // Expiration Time (过期时间)
  [key: string]: any;  // 其他自定义字段
}

/**
 * 解码 JWT token 的 payload 部分
 * 注意：这只解码 payload，不验证签名
 *
 * @param token - JWT token 字符串
 * @returns 解码后的 payload 对象，失败时返回 null
 */
export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    // JWT 格式验证
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format: token must have 3 parts');
    }

    // 获取 payload 部分 (第二部分)
    const base64Url = parts[1];
    if (!base64Url) {
      throw new Error('Invalid JWT: missing payload');
    }

    // Base64URL 转 Base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Base64 解码为字符串
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    // 解析 JSON
    const decoded = JSON.parse(jsonPayload) as JWTPayload;
    return decoded;
  } catch (error) {
    console.warn('Failed to decode JWT payload:', error);
    return null;
  }
}

/**
 * 获取 JWT token 的过期时间
 *
 * @param token - JWT token 字符串
 * @returns 过期时间戳 (秒)，失败时返回 null
 */
export function getJWTExpiration(token: string): number | null {
  const payload = decodeJWTPayload(token);
  return payload?.exp || null;
}

/**
 * 检查 JWT token 是否即将过期
 *
 * @param token - JWT token 字符串
 * @param bufferSeconds - 提前多少秒判定为即将过期，默认 30 秒
 * @returns true 表示即将过期或已过期
 */
export function isJWTExpiringSoon(token: string, bufferSeconds: number = 30): boolean {
  const exp = getJWTExpiration(token);
  if (!exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > exp - bufferSeconds;
}

/**
 * 检查 JWT token 是否已过期
 *
 * @param token - JWT token 字符串
 * @returns true 表示已过期
 */
export function isJWTExpired(token: string): boolean {
  const exp = getJWTExpiration(token);
  if (!exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > exp;
}

/**
 * 获取 JWT token 的剩余有效时间
 *
 * @param token - JWT token 字符串
 * @returns 剩余秒数，已过期返回 0，解析失败返回 null
 */
export function getJWTRemainingTime(token: string): number | null {
  const exp = getJWTExpiration(token);
  if (!exp) return null;

  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = exp - currentTime;
  return Math.max(0, remaining);
}

/**
 * 格式化显示 JWT 信息（用于调试）
 *
 * @param token - JWT token 字符串
 * @returns 格式化的信息字符串
 */
export function formatJWTInfo(token: string): string {
  const payload = decodeJWTPayload(token);
  if (!payload) return 'Invalid JWT token';

  const exp = payload.exp;
  const iat = payload.iat;
  const currentTime = Math.floor(Date.now() / 1000);

  let info = `JWT Info:\n`;
  info += `  Subject: ${payload.sub || 'N/A'}\n`;
  info += `  Email: ${payload.email || 'N/A'}\n`;

  if (iat) {
    info += `  Issued: ${new Date(iat * 1000).toISOString()}\n`;
  }

  if (exp) {
    info += `  Expires: ${new Date(exp * 1000).toISOString()}\n`;
    info += `  Current: ${new Date(currentTime * 1000).toISOString()}\n`;
    info += `  Status: ${exp > currentTime ? 'Valid' : 'Expired'}\n`;

    if (exp > currentTime) {
      const remaining = exp - currentTime;
      info += `  Remaining: ${Math.floor(remaining / 60)}m ${remaining % 60}s\n`;
    }
  }

  return info;
}