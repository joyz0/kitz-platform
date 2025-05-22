export const encryptFrontPassword = async (password: string, raw = false) => {
  if (typeof crypto === undefined || raw) {
    return password;
  }
  // 生成随机盐值（16字节）
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // 将密码和盐值转换为 ArrayBuffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // 合并密码和盐值
  const combined = new Uint8Array([...passwordBuffer, ...salt]);

  // 使用 SHA-256 进行哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);

  // 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // 将盐值转换为 Base64
  const saltBase64 = btoa(String.fromCharCode(...salt));

  return `${saltBase64}:${hashHex}`;
};
