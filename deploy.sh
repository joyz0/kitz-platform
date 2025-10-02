#!/bin/bash

set -e

echo "🚀 Kitz Platform Setup Script"
echo "=============================="
echo ""

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Error: $1 is not installed"
        echo "Please install $1 first: $2"
        exit 1
    fi
}

check_version() {
    local current_version=$1
    local required_version=$2
    local tool_name=$3

    if [ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" != "$required_version" ]; then
        echo "❌ Error: $tool_name version $current_version is too old"
        echo "Required version: >= $required_version"
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
echo ""

check_command "node" "https://nodejs.org/"
check_command "pnpm" "npm install -g pnpm@9.1.0"

NODE_VERSION=$(node -v | sed 's/v//')
PNPM_VERSION=$(pnpm -v)

echo "✅ Node.js version: $NODE_VERSION"
check_version "$NODE_VERSION" "18.0.0" "Node.js"

echo "✅ pnpm version: $PNPM_VERSION"
check_version "$PNPM_VERSION" "9.1.0" "pnpm"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🏗️  Building packages..."

echo "Building @repo/utils..."
pnpm --filter=@repo/utils run build

echo "Building @repo/types..."
pnpm --filter=@repo/types run build

echo "Building @repo/env..."
pnpm --filter=@repo/env run build

echo "🔧 Generating Prisma Client..."
pnpm --filter=@repo/prisma run prisma-generate

echo "Building @repo/prisma..."
pnpm --filter=@repo/prisma run build

echo "Building @repo/database..."
pnpm --filter=@repo/database run build

echo "Building @repo/ui..."
pnpm --filter=@repo/ui run build

# echo "Building @repo/chat-ui..."
# pnpm --filter=@repo/chat-ui run build

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "⚠️  Next steps:"
echo "1. Configure your environment variables (.env files)"
echo "   - Check apps/api-server/.env"
echo "   - Check apps/admin-web/.env"
echo "   - Set up your PostgreSQL database connection"
echo "   - Set up your Redis connection (if using)"
echo ""
echo "2. Run database migrations:"
echo "   pnpm --filter=@repo/prisma" run prisma-migrate
echo ""
echo "3. Start the development servers:"
echo "   pnpm dev"
echo ""
echo "   Or start individual services:"
echo "   - API: pnpm --filter=api-server run dev"
echo "   - Web: pnpm --filter=admin-web run dev"
echo ""
echo "📚 For more information, check CLAUDE.md"
