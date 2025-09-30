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

- **API Development**: `pnpm dev --filter=api` - Starts NestJS API on port 8080
- **Web Development**: `pnpm dev --filter=web` - Starts Next.js web app on port 8081 with Turbopack
- **Types Development**: `pnpm dev --filter=@repo/types`
- **Utils Development**: `pnpm dev --filter=@repo/utils`
- **Database Development**: `pnpm dev --filter=@repo/database`
- **Prisma Development**: `pnpm dev --filter=@repo/prisma`
- **Env Development**: `pnpm dev --filter=@repo/env`
- **UI Development**: `pnpm dev --filter=@repo/ui`
- **Database Operations**:
  - `pnpm prisma-migrate --filter=@repo/prisma` - Run Prisma migrations
  - `pnpm prisma-generate --filter=@repo/prisma` - Generate Prisma client

### Testing Individual Components

- **Single API test**: `pnpm test --filter=api`
- **Single web test**: `pnpm test --filter=web`
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

- **`@repo/database`** - Database repositories and utilities
- **`@repo/env`** - Environment management with Zod validation
- **`@repo/config`** - Shared configurations (ESLint, Prettier, TypeScript)
- **`@repo/ui`** - Reusable React components
- **`@repo/chat-ui`** - Chat interface components
- **`@repo/types`** - Shared TypeScript definitions
- **`@repo/utils`** - Common utility functions

### Development Notes

1. **Package Manager**: Always use `pnpm` for dependency management
2. **Build Order**: Packages must be built before applications
3. **Database**: PostgreSQL with connection pooling via Prisma Accelerate
4. **Authentication**: Custom token refresh logic with 1-hour expiration
5. **File Protection**: Environment files are protected via `.claudeignore`
6. to memorize 本项目需要时刻考虑代码的运行环境是在server组件还是client组件，server组件不能成为client组件的子节点
7. to memorize 所有常量都必须使用packages/types中定义的枚举值

## 最佳实践总结

### 架构设计

- to memorize 永远使用pnpm运行命令和管理依赖
- to memorize 明确各模块的职责边界和运行环境
- to memorize 遵循单一职责原则，避免模块间的不当耦合
- to memorize 优先考虑架构的合理性，而非为了兼容性破坏设计
- to memorize 逻辑设计要考虑各种边界情况

### 代码质量

- to memorize 生成代码时不需要有注解
- to memorize 条件判断时应该使用枚举值而不是常量
- to memorize 及时识别和重构重复代码
- to memorize 提取公共逻辑，提高可维护性
- to memorize 设计时考虑复用性和扩展性
- to memorize 保持代码简洁，避免过度抽象
- to memorize 明确各模块的职责边界和运行环境，通用工具模块应该保持环境无关性

### Next.js 环境区分（重要）

**🚨 Claude 必须时刻留意 Server 组件和 Client 组件的区别，避免环境混淆错误！**

#### 环境识别标识

- **Client 组件**：文件顶部有 `'use client';` 指令
- **Server 组件**：没有 `'use client'` 指令，可以使用 `async/await`

#### API 使用限制对照表

| 功能                        | Server 组件 | Client 组件 |
| --------------------------- | ----------- | ----------- |
| `useRouter()`               | ❌          | ✅          |
| `useState()`, `useEffect()` | ❌          | ✅          |
| `redirect()`                | ✅          | ❌          |
| `cookies()`, `headers()`    | ✅          | ❌          |
| DOM API, `window`           | ❌          | ✅          |
| React hooks                 | ❌          | ✅          |
| `async/await` 直接使用      | ✅          | ❌          |

#### 环境检查清单（每次编码前必查）

1. **确定当前文件环境**：检查是否有 `'use client'` 指令
2. **验证 API 可用性**：确保使用的 API 在当前环境可用
3. **检查组件嵌套规则**：Server 组件不能成为 Client 组件的子节点
4. **选择正确的错误处理方式**：
   - Server: 使用 `redirect()`
   - Client: 使用 `router.push()`

#### 常见错误示例

```typescript
// ❌ 错误：在 Server 组件中使用 Client API
export default function ServerComponent() {
  const router = useRouter(); // 错误！Server 组件不能使用 hooks
}

// ❌ 错误：在 Client 组件中使用 Server API
('use client');
export default function ClientComponent() {
  redirect('/login'); // 错误！Client 组件不能使用 redirect
}

// ✅ 正确：环境匹配的用法
// Server 组件
export default async function ServerComponent() {
  const data = await fetch('...'); // ✅ 可以直接使用 async/await
  if (someCondition) redirect('/error'); // ✅ 使用 Server API
}

// Client 组件
('use client');
export default function ClientComponent() {
  const router = useRouter(); // ✅ 可以使用 hooks
  if (someCondition) router.push('/error'); // ✅ 使用 Client API
}
```

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
