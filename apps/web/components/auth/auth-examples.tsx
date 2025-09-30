/**
 * 角色权限校验系统使用示例
 *
 * 这个文件展示了如何在不同的场景下使用权限校验系统
 */

import { AuthGuards } from '@/components/auth/auth-guards';
import {
  useRequireAdmin,
  useCheckAdmin,
} from '@/components/auth/use-auth-guard';
import { withAdminGuard, AdminGuard } from '@/components/auth/role-guard';

// ==================== 服务器组件示例 ====================

/**
 * 示例1: 管理员专用页面（服务器组件）
 */
export default async function AdminDashboardPage() {
  // 检查管理员权限，权限不足会自动重定向到错误页面
  await AuthGuards.requireAdmin();

  // 获取当前用户信息
  const currentUser = await AuthGuards.getCurrentUser();

  return (
    <div>
      <h1>管理员仪表板</h1>
      <p>欢迎，{currentUser?.name}（管理员）</p>
      {/* 管理员专用内容 */}
    </div>
  );
}

/**
 * 示例2: 用户页面（需要 USER 或 ADMIN 权限）
 */
export async function UserProfilePage() {
  // 检查用户权限（USER 或 ADMIN 都可以访问）
  await AuthGuards.requireUser();

  const currentUser = await AuthGuards.getCurrentUser();

  return (
    <div>
      <h1>用户资料</h1>
      <p>当前用户: {currentUser?.name}</p>
      <p>用户角色: {currentUser?.role}</p>
    </div>
  );
}

/**
 * 示例3: 条件性显示管理员功能
 */
export async function MixedContentPage() {
  const currentUser = await AuthGuards.getCurrentUser();
  const isAdmin = await AuthGuards.isAdmin();

  return (
    <div>
      <h1>混合内容页面</h1>
      <p>所有登录用户都能看到这里</p>

      {/* 只有管理员能看到的内容 */}
      {isAdmin && (
        <div className="admin-section">
          <h2>管理员专区</h2>
          <button>删除用户</button>
          <button>系统设置</button>
        </div>
      )}
    </div>
  );
}

// ==================== 客户端组件示例 ====================

/**
 * 示例4: 使用 Hook 的客户端组件
 */
('use client');
function AdminPanelComponent() {
  const { isLoading, hasPermission, userRole } = useRequireAdmin();

  // 加载中状态
  if (isLoading) {
    return <div className="loading">验证权限中...</div>;
  }

  // 权限不足会自动重定向，这里不会执行
  if (!hasPermission) {
    return null;
  }

  return (
    <div>
      <h2>管理员控制面板</h2>
      <p>当前角色: {userRole}</p>
      <button>管理用户</button>
      <button>系统配置</button>
    </div>
  );
}

/**
 * 示例5: 条件性权限检查（不自动重定向）
 */
('use client');
function ConditionalAdminComponent() {
  const { isLoading, hasPermission, isAuthenticated } = useCheckAdmin();

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  if (!hasPermission) {
    return <div>只有管理员才能看到这个功能</div>;
  }

  return (
    <div>
      <h2>管理员专用功能</h2>
      <button>危险操作</button>
    </div>
  );
}

// ==================== 高阶组件示例 ====================

/**
 * 示例6: 使用高阶组件保护整个页面
 */
function AdminSettingsPage() {
  return (
    <div>
      <h1>系统设置</h1>
      <form>
        <input placeholder="系统名称" />
        <button type="submit">保存设置</button>
      </form>
    </div>
  );
}

// 导出被保护的页面组件
export const ProtectedAdminSettings = withAdminGuard(AdminSettingsPage, {
  loadingComponent: () => <div>验证管理员权限中...</div>,
});

// ==================== 权限保护组件示例 ====================

/**
 * 示例7: 使用权限保护组件
 */
('use client');
function MixedPermissionComponent() {
  return (
    <div>
      <h1>功能页面</h1>

      {/* 所有用户都能看到的内容 */}
      <section>
        <h2>公共功能</h2>
        <p>这里是所有用户都能访问的内容</p>
      </section>

      {/* 只有管理员能看到的内容 */}
      <AdminGuard
        fallback={<p>需要管理员权限才能查看此内容</p>}
        loading={<p>验证权限中...</p>}
        redirect={false} // 不自动重定向，显示 fallback
      >
        <section className="admin-only">
          <h2>管理员专区</h2>
          <button>删除所有数据</button>
          <button>重置系统</button>
        </section>
      </AdminGuard>
    </div>
  );
}

// ==================== 路由保护示例 ====================

/**
 * 示例8: 在 layout 中添加权限保护
 */
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  // 在布局级别检查权限
  await AuthGuards.requireAdmin();

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <h1>管理员后台</h1>
        <ul>
          <li>
            <a href="/admin/users">用户管理</a>
          </li>
          <li>
            <a href="/admin/settings">系统设置</a>
          </li>
        </ul>
      </nav>
      <main className="admin-content">{children}</main>
    </div>
  );
}

// ==================== API 路由保护示例 ====================

/**
 * 示例9: API 路由权限保护
 */
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // 在 API 路由中检查权限
    await AuthGuards.requireAdmin();

    // 执行管理员操作
    // ... 删除逻辑

    return NextResponse.json({ success: true });
  } catch (error) {
    // 权限不足会抛出错误并重定向
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
