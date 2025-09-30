'use client';

import { ComponentType } from 'react';
import { UserRole } from '@repo/types';
import { useRequireRole, useCheckRole } from '@/components/auth/use-auth-guard';

interface WithRoleGuardOptions {
  fallback?: ComponentType;
  loadingComponent?: ComponentType;
  redirectOnFail?: boolean;
}

/**
 * 高阶组件：为页面组件添加角色权限保护
 */
export function withRoleGuard<T extends object>(
  WrappedComponent: ComponentType<T>,
  requiredRole: UserRole,
  options: WithRoleGuardOptions = {},
) {
  const {
    fallback: FallbackComponent,
    loadingComponent: LoadingComponent,
    redirectOnFail = true,
  } = options;

  const RoleGuardedComponent = (props: T) => {
    if (redirectOnFail) {
      const { isLoading, hasPermission } = useRequireRole(requiredRole);

      if (isLoading) {
        return LoadingComponent ? <LoadingComponent /> : <div>加载中...</div>;
      }

      if (!hasPermission) {
        return null;
      }

      return <WrappedComponent {...props} />;
    } else {
      const { isLoading, hasPermission } = useCheckRole(requiredRole);

      if (isLoading) {
        return LoadingComponent ? <LoadingComponent /> : <div>加载中...</div>;
      }

      if (!hasPermission) {
        return FallbackComponent ? <FallbackComponent /> : <div>权限不足</div>;
      }

      return <WrappedComponent {...props} />;
    }
  };

  RoleGuardedComponent.displayName = `withRoleGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return RoleGuardedComponent;
}

/**
 * 要求管理员权限的高阶组件
 */
export function withAdminGuard<T extends object>(
  WrappedComponent: ComponentType<T>,
  options?: WithRoleGuardOptions,
) {
  return withRoleGuard(WrappedComponent, 'ADMIN', options);
}

/**
 * 要求用户权限的高阶组件
 */
export function withUserGuard<T extends object>(
  WrappedComponent: ComponentType<T>,
  options?: WithRoleGuardOptions,
) {
  return withRoleGuard(WrappedComponent, 'USER', options);
}

/**
 * 角色权限保护组件
 */
interface RoleGuardProps {
  role: UserRole;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  children: React.ReactNode;
  redirect?: boolean;
}

export function RoleGuard({
  role,
  fallback = <div>权限不足</div>,
  loading = <div>加载中...</div>,
  children,
  redirect = true,
}: RoleGuardProps) {
  if (redirect) {
    const { isLoading, hasPermission } = useRequireRole(role);

    if (isLoading) return <>{loading}</>;
    if (!hasPermission) return null;

    return <>{children}</>;
  } else {
    const { isLoading, hasPermission } = useCheckRole(role);

    if (isLoading) return <>{loading}</>;
    if (!hasPermission) return <>{fallback}</>;

    return <>{children}</>;
  }
}

/**
 * 管理员权限保护组件
 */
export function AdminGuard({
  fallback,
  loading,
  children,
  redirect = true,
}: Omit<RoleGuardProps, 'role'>) {
  return (
    <RoleGuard
      role="ADMIN"
      fallback={fallback}
      loading={loading}
      redirect={redirect}
    >
      {children}
    </RoleGuard>
  );
}

/**
 * 用户权限保护组件
 */
export function UserGuard({
  fallback,
  loading,
  children,
  redirect = true,
}: Omit<RoleGuardProps, 'role'>) {
  return (
    <RoleGuard
      role="USER"
      fallback={fallback}
      loading={loading}
      redirect={redirect}
    >
      {children}
    </RoleGuard>
  );
}
