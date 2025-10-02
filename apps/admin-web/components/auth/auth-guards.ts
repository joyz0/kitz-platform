import { auth } from '@/lib/auth';
import { UserRole } from '@repo/types';
import { redirect } from 'next/navigation';
import { RoutePath } from '../../lib/constants';
import { StatusCodeMap } from '@repo/types/enums/status-code';

/**
 * 服务器端角色检查工具
 * 用于在 Server 组件和服务器操作中检查用户权限
 */
export class AuthGuards {
  /**
   * 检查用户是否有指定角色
   */
  static async requireRole(requiredRole: UserRole): Promise<void> {
    const session = await auth();

    if (!session?.user) {
      redirect(
        `${RoutePath.SIGNIN_URL}?callbackUrl=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}`,
      );
    }

    const userRole = session.user.role as UserRole;

    if (!this.hasRole(userRole, requiredRole)) {
      redirect(`${RoutePath.ERROR_URL}?error=${StatusCodeMap.FORBIDDEN}`);
    }
  }

  /**
   * 检查用户是否为管理员
   */
  static async requireAdmin(): Promise<void> {
    await this.requireRole(UserRole.ADMIN);
  }

  /**
   * 检查用户是否有管理员或普通用户权限
   */
  static async requireUser(): Promise<void> {
    const session = await auth();

    if (!session?.user) {
      redirect(
        `${RoutePath.SIGNIN_URL}?callbackUrl=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}`,
      );
    }

    const userRole = session.user.role as UserRole;

    if (!this.hasRole(userRole, 'USER')) {
      redirect(`${RoutePath.ERROR_URL}?error=${StatusCodeMap.FORBIDDEN}`);
    }
  }

  /**
   * 获取当前用户信息（含角色检查）
   */
  static async getCurrentUser() {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRole,
      image: session.user.image,
    };
  }

  /**
   * 检查用户是否有足够的权限
   * 权限等级：ADMIN > USER > GUEST
   */
  static hasRole(
    userRole: UserRole | undefined | null,
    requiredRole: UserRole,
  ): boolean {
    if (!userRole) return false;

    const roleHierarchy: Record<UserRole, number> = {
      GUEST: 1,
      USER: 2,
      ADMIN: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * 条件性角色检查，返回布尔值而不是重定向
   */
  static async checkRole(requiredRole: UserRole): Promise<boolean> {
    const session = await auth();

    if (!session?.user) return false;

    const userRole = session.user.role as UserRole;
    return this.hasRole(userRole, requiredRole);
  }

  /**
   * 检查是否为管理员（不重定向）
   */
  static async isAdmin(): Promise<boolean> {
    return this.checkRole('ADMIN');
  }
}
