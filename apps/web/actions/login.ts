'use server';

import { signIn, signOut } from '@/lib/auth';
import { RoutePath } from '@/lib/constants';
import {
  loginDto,
  registerDto,
  ApiResponse,
  ResponseBuilder,
  RegisterDto,
} from '@repo/types';
import { userRepo, inviteCodeRepo } from '@repo/database';
import { saltAndHashPassword } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

export async function logout() {
  await signOut({
    redirectTo: RoutePath.SIGNIN_URL,
  });
}

export async function login(prevState: ApiResponse, req: FormData) {
  const json = Object.fromEntries(req.entries());
  delete json.redirectTo;
  const query = loginDto.safeParse(json);

  if (!query.success) {
    return ResponseBuilder.error('参数类型不正确', 400);
  }
  try {
    await signIn('credentials', req);
  } catch (error) {
    if (error instanceof AuthError) {
      return ResponseBuilder.error('登录失败', 401);
    }
    // Otherwise if a redirects happens Next.js can handle it
    // so you can just re-thrown the error and let Next.js handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
  return ResponseBuilder.success(true, '登录成功');
}

export async function loginByProvider(prevState: ApiResponse, req: FormData) {
  const json = Object.fromEntries(req.entries());
  req.delete('provider');
  try {
    await signIn(json.provider as string, req);
  } catch (error) {
    if (error instanceof AuthError) {
      return ResponseBuilder.error('登录失败', 401);
    }
    throw error;
  }
  return ResponseBuilder.success(true, '登录成功');
}

export async function signUp(prevState: ApiResponse, req: FormData) {
  const query = registerDto.safeParse(Object.fromEntries(req.entries()));

  if (!query.success) {
    return ResponseBuilder.error('参数类型不正确', 400);
  }

  const { email, password, inviteCode } = query.data as RegisterDto;

  try {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return ResponseBuilder.error('该邮箱已被使用', 409);
    }
    const existingInviteCode = await inviteCodeRepo.findByCode(inviteCode);
    if (!existingInviteCode) {
      return ResponseBuilder.error('无效的邀请码', 400);
    }
    if (existingInviteCode.usedAt) {
      return ResponseBuilder.error('邀请码已被使用', 400);
    }
    if (new Date() > existingInviteCode.expiresAt) {
      return ResponseBuilder.error('邀请码已失效', 400);
    }
    const [user, code] = await userRepo.signUp({
      email,
      password: saltAndHashPassword(password),
      inviteCode,
    });
  } catch (error) {
    return ResponseBuilder.error('用户创建失败', 500);
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
  return ResponseBuilder.success(query.data, '注册成功');
}
