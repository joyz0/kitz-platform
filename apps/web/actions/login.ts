'use server';

import { signIn, signOut } from '@/lib/auth';
import { RoutePath } from '@/lib/constants';
import { signInSchema, signUpSchema } from '@/lib/zod';
import { userRepo, inviteCodeRepo } from '@repo/database';
import { saltAndHashPassword } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

export async function logout() {
  await signOut({
    redirectTo: RoutePath.SIGNIN_URL,
  });
}

export async function login(prevState: KitResponse, req: FormData) {
  const json = Object.fromEntries(req.entries());
  delete json.redirectTo;
  const query = signInSchema.safeParse(json);

  if (!query.success) {
    return {
      success: false,
      data: false,
      message: '参数类型不正确',
    };
  }
  try {
    await signIn('credentials', req);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        data: false,
        message: '登录失败',
      };
    }
    // Otherwise if a redirects happens Next.js can handle it
    // so you can just re-thrown the error and let Next.js handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
  return {
    success: true,
    data: true,
    message: '登录成功',
  };
}

export async function loginByProvider(prevState: KitResponse, req: FormData) {
  const json = Object.fromEntries(req.entries());
  req.delete('provider');
  try {
    await signIn(json.provider as string, req);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        data: false,
        message: '登录失败',
      };
    }
    throw error;
  }
  return {
    success: true,
    data: true,
    message: '登录成功',
  };
}

export async function signUp(prevState: KitResponse, req: FormData) {
  const query = signUpSchema.safeParse(Object.fromEntries(req.entries()));

  if (!query.success) {
    return {
      success: false,
      data: query,
      message: '参数类型不正确',
    };
  }

  const { email, password, inviteCode } = query.data;

  try {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        data: query,
        message: '该邮箱已被使用',
      };
    }
    const existingInviteCode = await inviteCodeRepo.findByCode(inviteCode);
    if (!existingInviteCode) {
      return {
        success: false,
        data: query,
        message: '无效的邀请码',
      };
    }
    if (existingInviteCode.usedAt) {
      return {
        success: false,
        data: query,
        message: '邀请码已被使用',
      };
    }
    if (new Date() > existingInviteCode.expiresAt) {
      return {
        success: false,
        data: query,
        message: '邀请码已失效',
      };
    }
    const [user, code] = await userRepo.signUp({
      email,
      password: saltAndHashPassword(password),
      inviteCode,
    });
  } catch (error) {
    return {
      success: false,
      data: query,
      message: '用户创建失败',
    };
  }
  try {
    req.append('redirectTo', RoutePath.DASHBOARD);
    await signIn('credentials', req);
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(RoutePath.SIGNIN_URL);
    }
    throw error;
  }
  return {
    success: true,
    data: query,
    message: '注册成功',
  };
}
