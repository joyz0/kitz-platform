'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@repo/types';
import { RoutePath } from '@/lib/constants';
import { StatusCodeMap } from '@repo/types/enums/status-code';

/**
 * 客户端权限检查 Hook
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!session?.user?.role) return false;

    const roleHierarchy: Record<UserRole, number> = {
      GUEST: 1,
      USER: 2,
      ADMIN: 3,
    };

    const userRole = session.user.role as UserRole;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isUser = (): boolean => hasRole('USER');

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    userRole: session?.user?.role as UserRole,
    hasRole,
    isAdmin,
    isUser,
  };
}

/**
 * 要求特定角色权限的 Hook
 */
export function useRequireRole(requiredRole: UserRole) {
  const { session, isLoading, hasRole } = useAuthGuard();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!session?.user) {
      router.push(
        `${RoutePath.SIGNIN_URL}?callbackUrl=${encodeURIComponent(window.location.href)}`,
      );
      return;
    }

    if (!hasRole(requiredRole)) {
      router.push(
        `${RoutePath.ERROR_URL}?error=${StatusCodeMap.FORBIDDEN}`,
      );
      return;
    }

    setHasPermission(true);
  }, [session, isLoading, hasRole, requiredRole, router]);

  return {
    isLoading,
    hasPermission,
    userRole: session?.user?.role as UserRole,
  };
}

/**
 * 要求管理员权限的 Hook
 */
export function useRequireAdmin() {
  return useRequireRole('ADMIN');
}

/**
 * 要求用户权限的 Hook（ADMIN 或 USER）
 */
export function useRequireUser() {
  return useRequireRole('USER');
}

/**
 * 条件性权限检查 Hook（不自动重定向）
 */
export function useCheckRole(requiredRole: UserRole) {
  const { session, isLoading, hasRole } = useAuthGuard();

  return {
    isLoading,
    hasPermission: hasRole(requiredRole),
    isAuthenticated: !!session?.user,
    userRole: session?.user?.role as UserRole,
  };
}

/**
 * 检查是否为管理员（不自动重定向）
 */
export function useCheckAdmin() {
  return useCheckRole('ADMIN');
}
