# JWT 鉴权架构优化记录

## 优化日期
2024-09-27

## 优化目标
完全依赖 NextAuth 管理 token，消除数据存储和获取路径的不一致性问题。

## 优化前的问题

### 1. Token 三重存储
- NextAuth Cookie (加密)
- Request.token (内存静态属性)
- localStorage (明文)

### 2. 获取路径不一致
- 业务逻辑：`await auth()` → NextAuth Cookie
- API 请求：`Request.token` → 内存静态属性

### 3. token.exp 混乱
- NextAuth 的 session 管理与后端 JWT 过期时间不同步
- 每次页面刷新 token.exp 可能被重新计算

### 4. 登出清理不完整
- NextAuth 只清理 Cookie 和数据库
- 需要手动清理 Request.token 和 localStorage

## 优化实施

### 1. 修改 Request 类 ✅

**文件**: `apps/web/lib/request.ts`

**变更**:
```typescript
// 移除静态 token 属性
- static token?: string | null;

// 添加私有方法从 NextAuth 获取 token
+ private static async getAccessToken(): Promise<string | null> {
+   try {
+     const session = await auth();
+     return session?.accessToken || null;
+   } catch (error) {
+     return null;
+   }
+ }

// 在 get 和 post 方法中使用
if (!isPublic) {
  const accessToken = await Request.getAccessToken();
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }
}
```

### 2. 移除手动 Token 同步 ✅

**文件**: `apps/web/app/dashboard/components/client-layout-wrapper.tsx`

**变更**:
```typescript
// 移除这些代码
- if (session?.accessToken) {
-   Request.token = session.accessToken;
-   storage.set(TOKEN_STORAGE_KEY, session.accessToken);
- }

// 只保留错误处理监听
useLayoutEffect(() => {
  CustomEventBus.on<string>(EventType.REQUEST_ERROR, (error) => {
    message.error(error);
  });
  return () => {
    CustomEventBus.off(EventType.REQUEST_ERROR);
  };
}, [message]);
```

### 3. 简化登出逻辑 ✅

**文件**: `apps/web/app/dashboard/components/client-layout.tsx`

**变更**:
```typescript
// 移除手动清理
const handleUserMenuClick: MenuProps['onClick'] = (e) => {
  if (e.key === '1') {
    startTransition(async () => {
-     storage.remove(TOKEN_STORAGE_KEY);
      await logout();  // NextAuth 会自动清理所有数据
    });
  }
};
```

### 4. 优化 NextAuth 配置 ✅

**文件**: `apps/web/lib/auth.ts`

**变更**:

#### a) 移除 session 配置
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
- session: {
-   strategy: 'jwt',
-   maxAge: expiresIn,
-   updateAge: expiresIn * 0.9,
- },
+ // 使用 NextAuth 默认值 (30天过期, 1天更新)
+ // 让后端 JWT 完全控制过期逻辑
```

#### b) 优化 JWT Callback - 使用后端 JWT 真实过期时间
```typescript
async jwt(data) {
  const { token, user, account } = data;

  // 首次登录时解码后端 JWT 获取真实过期时间
  if (user) {
    token.id = user.id;
    token.accessToken = user.accessToken;
    token.refreshToken = user.refreshToken;

    // 解码 JWT 获取 exp
    try {
      const base64Url = user.accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      token.exp = decoded.exp; // 使用后端 JWT 的真实过期时间
    } catch (error) {
      token.exp = Math.floor(Date.now() / 1000) + expiresIn;
    }
  }

  // 基于真实过期时间判断是否需要刷新
  if (Math.floor(Date.now() / 1000) > token.exp - 30 && token.refreshToken) {
    // 刷新逻辑...
  }

  return token;
}
```

## 优化后的架构

### 数据流向

```
用户登录
  ↓
后端生成 JWT (accessToken + refreshToken)
  ↓
NextAuth JWT Callback
  ↓ 解码 JWT 获取真实过期时间
  ↓ 加密存储到 Cookie
  ↓
每次 API 请求
  ↓
Request.getAccessToken()
  ↓
await auth() → 从 Cookie 解密
  ↓
添加到 Authorization 头
  ↓
发送请求到后端
```

### Token 存储

**唯一数据源**: NextAuth 加密的 Cookie
- 存储位置: `next-auth.session-token` Cookie
- 加密方式: JWE (使用 AUTH_SECRET)
- 自动管理: 登出时自动清理

### Token 获取

**统一获取方式**: `await auth()`
- 业务逻辑: `const session = await auth()`
- API 请求: `Request.getAccessToken()` 内部调用 `await auth()`

### Token 刷新

**基于后端 JWT 真实过期时间**:
- 解码后端 JWT 获取 `exp` 字段
- 提前 30 秒自动刷新
- 刷新后更新 Cookie 中的 token

## 优化效果

### ✅ 解决的问题

1. **消除数据冗余**: 只有一个数据源 (NextAuth Cookie)
2. **统一获取路径**: 所有地方都通过 `await auth()` 获取
3. **修复 token.exp 混乱**: 使用后端 JWT 的真实过期时间
4. **简化登出清理**: NextAuth 自动清理所有数据
5. **提高安全性**: Token 加密存储，不暴露在 localStorage

### ✅ 架构优势

- **单一职责**: Request 类只负责发送请求，不管理 token
- **自动同步**: Token 刷新后自动更新到 Cookie，无需手动同步
- **易于维护**: 代码更简洁，逻辑更清晰
- **安全可靠**: 依赖成熟的 NextAuth 框架

## 测试要点

1. **登录流程**
   - [ ] 账号密码登录成功
   - [ ] Token 正确存储到 Cookie
   - [ ] 可以正常访问受保护的页面

2. **API 请求**
   - [ ] 请求自动携带 Authorization 头
   - [ ] 后端正确验证 token
   - [ ] 白名单接口不携带 token

3. **Token 刷新**
   - [ ] 距离过期 30 秒时自动刷新
   - [ ] 刷新后获取新的 token
   - [ ] token.exp 正确更新

4. **登出流程**
   - [ ] Cookie 被正确清理
   - [ ] 无法访问受保护的页面
   - [ ] 重定向到登录页面

5. **页面刷新**
   - [ ] Session 数据保持不变
   - [ ] token.exp 不会变化（除非真的刷新了）
   - [ ] 可以继续正常使用

## 后续建议

1. **生产环境测试**: 在生产环境充分测试各种场景
2. **性能监控**: 监控 `await auth()` 的性能影响
3. **错误处理**: 完善 token 刷新失败的错误处理
4. **日志优化**: 生产环境移除 console.log

## 相关文档

- [JWT 鉴权架构文档](./AUTHENTICATION.md)
- [NextAuth 官方文档](https://next-auth.js.org/)

---

*优化完成时间: 2024-09-27*
*优化实施人员: Claude Code*