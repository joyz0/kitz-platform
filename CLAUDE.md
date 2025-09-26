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