# Kitz Platform

A modern full-stack TypeScript platform built with Turborepo monorepo architecture, featuring authentication, user management, and AI-powered chat functionality.

## ✨ Features

- 🔐 **Multi-Provider Authentication** - GitHub OAuth + Email/Password with NextAuth v5
- 💬 **AI Chat System** - Real-time chat with persistent history using IndexedDB
- 👥 **User Management** - Role-based access control with invite code system
- 🎨 **Modern UI** - Ant Design Pro Components with Tailwind CSS
- 🚀 **High Performance** - Next.js 15 with Turbopack and optimized builds
- 🔄 **Real-time Features** - Redis integration for caching and sessions
- 📊 **Database** - PostgreSQL with Prisma ORM and connection pooling
- 🎭 **Animations** - GSAP integration with various animation examples

## 🏗️ Architecture

### Applications

- **`apps/api`** - NestJS backend API (Port 8080)
- **`apps/web`** - Next.js frontend application (Port 8081)

### Shared Packages

- **`@repo/prisma`** - Database schema and client
- **`@repo/api`** - Shared NestJS resources (DTOs, entities)
- **`@repo/database`** - Database utilities and repositories
- **`@repo/env`** - Environment management with validation
- **`@repo/config`** - Shared configurations (ESLint, Prettier, TypeScript)
- **`@repo/ui`** - Reusable React components
- **`@repo/chat-ui`** - Chat interface components
- **`@repo/types`** - Shared TypeScript definitions
- **`@repo/utils`** - Common utility functions

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (recommended package manager)
- PostgreSQL database
- Redis (for sessions and caching)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kitz-platform

# Install dependencies
pnpm install

# Set up environment variables
cp packages/env/.env.example packages/env/.env.local

# Generate Prisma client
cd packages/prisma
pnpm prisma-generate

# Run database migrations
pnpm prisma-migrate

# Seed the database (optional)
pnpm prisma-seed
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Or start individually
cd apps/api && pnpm dev    # API server on port 8080
cd apps/web && pnpm dev    # Web app on port 8081
```

## 📝 Available Scripts

### Core Commands

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm test         # Run tests across all packages
pnpm test:e2e     # Run end-to-end tests
pnpm lint         # Lint all packages and apps
pnpm format       # Format all TypeScript/JavaScript files
```

### Database Commands

```bash
cd packages/prisma
pnpm prisma-migrate    # Run database migrations
pnpm prisma-generate   # Generate Prisma client
pnpm prisma-seed       # Seed database with sample data
```

## 🔧 Environment Configuration

Create environment files in `packages/env/`:

### Required Variables

- `AUTH_SECRET` - NextAuth secret key
- `POSTGRES_URL_PRISMA_ACCELERATE` - Database connection URL
- `POSTGRES_URL_NON_POOLING` - Direct database URL
- `REDIS_HOST` - Redis server host
- `NEXT_PUBLIC_API_URL` - API base URL
- `NEXT_PUBLIC_DIFY_BASE_URL` - Dify AI service URL
- `AUTH_GITHUB_ID` - GitHub OAuth client ID
- `AUTH_GITHUB_SECRET` - GitHub OAuth client secret

## 🏃‍♂️ Running Tests

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/api && pnpm test
cd apps/web && pnpm test

# Run in watch mode
pnpm test --watch

# Run E2E tests
pnpm test:e2e
```

## 🌟 Key Features Overview

### Authentication System

- Dual authentication: GitHub OAuth and email/password credentials
- JWT token management with automatic refresh
- Protected routes with role-based access control
- Session management with Redis

### Chat System

- AI-powered chat bot with floating interface
- Persistent message history using IndexedDB
- Message pagination for performance
- Real-time typing indicators and loading states
- Integration with Dify AI platform

### Dashboard Interface

- User management with role-based permissions
- Invite code system for controlled registration
- GSAP animation examples and demos
- System administration panels

### Database Layer

- PostgreSQL with Prisma ORM
- Connection pooling with Prisma Accelerate
- Type-safe database operations
- Automated migrations and seeding

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Ant Design Pro
- **Backend**: NestJS, Node.js, TypeScript, JWT Authentication
- **Database**: PostgreSQL, Prisma ORM, Redis
- **Tools**: Turborepo, pnpm, ESLint, Prettier, Jest, Playwright
- **AI/ML**: Dify integration for chat functionality
- **Animation**: GSAP for smooth animations and transitions

## 📚 Development Notes

1. **Package Manager**: Always use `pnpm` for dependency management
2. **Build Order**: Packages must be built before applications
3. **Environment**: Environment files are managed centrally in `/packages/env`
4. **Testing**: Run `pnpm build` before testing to avoid dependency issues
5. **Database**: Use Prisma migrations for schema changes
6. **Authentication**: JWT tokens expire in 1 hour with automatic refresh

## 📋 Development TODOs

- [ ] VSCode dev container setup
- [ ] Supabase integration evaluation
- [ ] Refine framework integration
- [ ] SWR implementation for data fetching
- [ ] API response format standardization
- [ ] Session token behavior optimization
- [ ] Enhanced error handling and logging

## todo

2. 考虑是否能把.env环境变量文件提升到根项目：需要引入dotenv，可能和nextjs默认配置冲突，想想还是算了
3. 解决pnpm test报错问题：先执行build后在test就不报错了
4. 跑通api controller测试用例，支持分页查询
5. 将通用查询方法都提取到base-service和base-controller中：算了，类型定义太麻烦
6. 接入supabase和refine
7. 统一接口返回格式
8. 登录鉴权放在api好还是web好？：可能放在web更简便，api需要额外协同第三方登录的token鉴权，但放web需要解决与api的token互通和将session token转变为request header token。最终放在了api中。
9. 为什么next-auth默认会将token存储在cookie中：next-auth源码会在登录成功后将token放入cookie中
10. 我每次刷新页面输出的token.exp都会变化，且是30天后的时间戳，与我预期不符
11. 评估是否要使用https://swr.vercel.app/zh-CN/examples/ssr

## 📄 License

This project is licensed under the MIT License.
