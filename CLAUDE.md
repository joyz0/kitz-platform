# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- **Development**: `pnpm dev` - Starts all apps in development mode
- **Build**: `pnpm build` - Builds all apps and packages (packages must be built before apps)
- **Test**: `pnpm test` - Runs tests across all packages
- **E2E Tests**: `pnpm test:e2e` - Runs end-to-end tests
- **Lint**: `pnpm lint` - Lints all packages and apps
- **Format**: `pnpm format` - Formats all TypeScript, JavaScript, and Markdown files

### Package-Specific Commands
- **API Development**: `cd apps/api && pnpm dev` - Starts NestJS API on port 8080
- **Web Development**: `cd apps/web && pnpm dev` - Starts Next.js web app on port 8081 with Turbopack
- **Database Operations**:
  - `cd packages/prisma && pnpm prisma-migrate` - Run Prisma migrations
  - `cd packages/prisma && pnpm prisma-seed` - Seed the database
  - `cd packages/prisma && pnpm prisma-generate` - Generate Prisma client

### Testing Individual Components
- **Single API test**: `cd apps/api && pnpm test -- [test-name]`
- **Single web test**: `cd apps/web && pnpm test -- [test-name]`
- **Watch mode**: Add `--watch` to any test command

## Project Architecture

This is a **Kitz Platform** - a full-stack TypeScript application built with Turborepo monorepo architecture.

### Core Applications
- **`apps/api`** - NestJS backend API server (port 8080)
  - JWT authentication with refresh token support
  - Global guards, interceptors, and exception filters
  - Modular structure: Auth, Users, InviteCode, Links modules
  - Custom base services with logging and error handling
  - Redis integration for caching/sessions
  - CORS configured for localhost:8081

- **`apps/web`** - Next.js 15 frontend application (port 8081)
  - App Router with TypeScript
  - NextAuth v5 beta with dual authentication: GitHub OAuth + Credentials
  - Ant Design Pro Components for dashboard UI
  - Tailwind CSS with custom styling
  - Chat functionality with IndexedDB storage
  - Custom environment loading and validation

### Key Features
- **Authentication System**:
  - NextAuth with GitHub OAuth and email/password credentials
  - JWT token management with automatic refresh
  - Custom Prisma adapter for database sessions
  - Protected routes with authorization middleware

- **Chat System**:
  - Real-time chat bot component with floating interface
  - IndexedDB for persistent message history
  - Pagination for message loading (10+ messages)
  - API integration with `/api/chat` endpoint
  - Smooth animations and loading states

- **Dashboard Interface**:
  - User management system with role-based access
  - Invite code system for user registration
  - GSAP animation examples (flip, scroll-trigger, canvas, parallax)
  - System administration panels

### Shared Packages
- **`@repo/prisma`** - Database layer with PostgreSQL + Prisma
  - Models: User, Account, Session, InviteCode, Authenticator
  - Custom client generation to `generated/client`
  - Support for Prisma Accelerate connection pooling

- **`@repo/api`** - Shared NestJS resources (DTOs, entities, enums)
- **`@repo/database`** - Database repositories and utilities
- **`@repo/env`** - Environment management with Zod validation
- **`@repo/config`** - Shared configurations (ESLint, Prettier, TypeScript)
- **`@repo/ui`** - Reusable React components
- **`@repo/chat-ui`** - Chat interface components
- **`@repo/types`** - Shared TypeScript definitions
- **`@repo/utils`** - Common utility functions

### Environment Configuration
Required environment variables:
- **API**: `AUTH_SECRET`, `REFRESH_TOKEN_EXPIRES_IN_DAYS`, `TOKEN_EXPIRES_IN_HOURS`, `REDIS_HOST`
- **Web**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_DIFY_BASE_URL`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

### Development Notes
1. **Package Manager**: Always use `pnpm` for dependency management
2. **Build Order**: Packages must be built before applications
3. **Database**: PostgreSQL with connection pooling via Prisma Accelerate
4. **Authentication**: Custom token refresh logic with 1-hour expiration
5. **Chat Integration**: Uses Dify API for chat bot responses
6. **File Protection**: Environment files are protected via `.claudeignore`

### Known Project TODOs
- Supabase integration consideration
- Refine framework evaluation
- Session token behavior optimization (current: 30-day refresh cycle)
- API authentication token synchronization improvements
- 永远使用pnpm运行命令和管理依赖
- 生成代码时不要注解了

## 常见错误与教训

### 1. 环境兼容性错误

**错误场景**：在 `request.ts` 中直接导入 `auth.ts`，导致 client 环境报错
```typescript
// ❌ 错误：client 环境会在模块导入时报错
import { auth } from './auth';
```

**根本原因**：
- 忽视了 `auth.ts` 使用 `next/headers` 等 server-only API
- 混淆了模块导入时机和函数执行时机
- `typeof window === 'undefined'` 运行时判断无法解决导入阶段的问题

**正确方案**：
```typescript
// ✅ 正确：使用动态导入或设计架构分离
if (typeof window === 'undefined') {
  const { auth } = await import('./auth'); // 动态导入
}
// 或者更好的方案：让 request.ts 不依赖 server-only 模块
```

**教训**：
- 跨环境模块必须从导入阶段就考虑兼容性
- 理解 JavaScript 模块加载机制，区分导入时和执行时
- Server-only 模块应保持纯净，不要强行适配 client 环境

### 2. 架构设计错误

**错误场景**：试图修改 `auth.ts` 来适配 client 环境
```typescript
// ❌ 错误思路：让 server-only 的 auth.ts 适配 client
export const getAuthJwt = async () => {
  // 分离 server-only 功能...
}
```

**根本原因**：
- 本末倒置，没有理解模块职责边界
- `auth.ts` 本就是 server-only，应该保持原样
- `request.ts` 作为通用工具，不应依赖特定环境模块

**正确方案**：
```typescript
// ✅ 正确：让 request.ts 回归纯工具角色
export class Request {
  static token: string | null = null; // 简单的静态 token 管理
}
```

**教训**：
- 明确各模块的职责边界和运行环境
- 通用工具模块应该保持环境无关性
- 不要为了兼容性而破坏原有架构的合理性

### 3. Header 处理逻辑错误

**错误场景**：Header 优先级和合并逻辑错误
```typescript
// ❌ 错误：先设置默认值，后检查冲突
const defaultHeaders = { Authorization: 'Bearer token' };
const headers = new Headers(defaultHeaders);
// 后续检查 options.headers 中是否有 Authorization
```

**根本原因**：
- 没有正确理解优先级关系：手动传入 > 自动添加
- 先设置后检查的逻辑导致冲突和覆盖问题

**正确方案**：
```typescript
// ✅ 正确：先检查手动传入，再决定是否添加
let hasAuthHeader = false;
if (options?.headers) {
  hasAuthHeader = new Headers(options.headers).has('Authorization');
}
if (!hasAuthHeader && Request.token) {
  headers.set('Authorization', `Bearer ${Request.token}`);
}
```

**教训**：
- 处理可选参数覆盖时，应该先检查再设置
- 明确优先级关系，避免后续冲突
- 逻辑设计要考虑各种边界情况

### 4. 代码质量问题

**错误场景**：GET 和 POST 方法存在大量重复代码
```typescript
// ❌ 错误：重复的 header 处理逻辑
static async get() {
  // 大段重复的 header 处理...
}
static async post() {
  // 相同的 header 处理逻辑...
}
```

**根本原因**：
- 没有及时识别和提取公共逻辑
- 忽视了代码维护性和扩展性

**正确方案**：
```typescript
// ✅ 正确：提取公共方法
private static buildHeaders(url, options, defaultHeaders) {
  // 统一的 header 处理逻辑
}
```

**教训**：
- 发现代码重复时应立即重构
- 提取公共逻辑，提高代码可维护性
- 设计时考虑复用性，避免重复实现

### 5. TypeScript 类型处理错误

**错误场景**：错误对象类型处理不当
```typescript
// ❌ 错误：直接访问 unknown 类型的 message 属性
catch (error) {
  console.log(error.message); // TypeScript 错误
}
```

**正确方案**：
```typescript
// ✅ 正确：proper 类型检查
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
}
```

**教训**：
- 始终进行适当的类型检查和类型断言
- 理解 TypeScript 的类型安全机制
- 错误处理时要考虑各种错误类型

## 最佳实践总结

### 环境兼容性
- 设计跨环境模块时，从模块导入阶段就考虑兼容性
- 使用动态导入 `await import()` 处理条件性依赖
- Server-only 模块保持纯净，不要强行适配其他环境
- 通用工具模块应保持环境无关性

### 架构设计
- 明确各模块的职责边界和运行环境
- 遵循单一职责原则，避免模块间的不当耦合
- 优先考虑架构的合理性，而非为了兼容性破坏设计
- 认证逻辑应由调用方处理，工具模块保持简洁

### 代码质量
- 及时识别和重构重复代码
- 提取公共逻辑，提高可维护性
- 设计时考虑复用性和扩展性
- 保持代码简洁，避免过度抽象

### TypeScript 实践
- 进行适当的类型检查和类型断言
- 正确处理 `unknown` 类型的错误对象
- 理解并利用 TypeScript 的类型安全特性
- 避免使用 `any`，优先使用具体类型

### 错误处理
- 实现健壮的错误处理机制
- 区分不同类型的错误并采取相应策略
- 提供有意义的错误信息和降级方案
- 避免因外部依赖失败导致核心功能不可用