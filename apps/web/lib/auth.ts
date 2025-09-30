import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { loginDto } from '@repo/types';
import { getJWTExpiration } from '@repo/utils/shared';
import { PrismaAdapter } from './prisma-adapter';
import { RoutePath } from './constants';
import { prisma } from '@repo/prisma';
import { headers, cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { Request } from '@/lib/request';
import { UnifiedErrorHandler } from '../components/error/error-mapping';
import { StatusCodeMap } from '@repo/types/enums/status-code';

export type NextAuthUser = Session['user'];

const whitelist = [RoutePath.SIGNIN_URL, RoutePath.SIGNUP_URL];

export const adapter = PrismaAdapter(prisma);

const providers: Provider[] = [
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: { label: '邮箱', type: 'email', value: '' },
      password: { label: '密码', type: 'password', value: '' },
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await loginDto.parseAsync(credentials);

        const res = await Request.post<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            email,
            password,
          },
        );
        if (res.ok) {
          return res.data;
        }
      } catch (error) {
        return null;
      }
    },
  }),
  GitHub,
];

// 1小时
const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN_HOURS || '1') * 60 * 60;

export const { handlers, signIn, signOut, auth }: any = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  providers,
  secret: process.env.AUTH_SECRET,
  // 移除 session 配置，使用 NextAuth 默认值 (30天过期, 1天更新)
  // 这样可以让后端 JWT 完全控制过期逻辑
  pages: {
    signIn: RoutePath.SIGNIN_URL,
    error: RoutePath.ERROR_URL,
  },
  // https://authjs.dev/reference/nextjs#callbacks
  callbacks: {
    async authorized({ request, auth }) {
      const { origin, pathname, href } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isProtected = !whitelist.some((path) => pathname.startsWith(path));

      // 检查是否有错误状态需要重定向到错误页面
      if (auth?.error) {
        const errorUrl = UnifiedErrorHandler.createErrorUrl(
          auth.error as string,
          origin,
        );
        return Response.redirect(errorUrl);
      }

      if (!isLoggedIn && isProtected) {
        const redirectUrl = new URL(RoutePath.SIGNIN_URL, origin);
        redirectUrl.searchParams.append('callbackUrl', href);
        return Response.redirect(redirectUrl);
      }
      console.log('authorized');
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    async signIn({ account, user, credentials, profile }) {
      // if (account?.provider === 'credentials') {
      //   return (credentials!.email! as string).endsWith('@admin.com');
      // }
      // const res = await request.post<any>(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
      //   {
      //     githubId: profile!.id,
      //     email: profile!.email,
      //     username: profile!.login,
      //     avatar: user.image,
      //   },
      // );
      // if (!res.ok) {
      //   throw new Error('认证失败');
      // }
      // user.accessToken = res.data.accessToken;
      return true;
    },
    async jwt(data) {
      const { token, user, account } = data;

      // 首次登录时设置 token 信息
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        // 使用工具函数解码后端 JWT 获取真实的过期时间
        const exp = getJWTExpiration(user.accessToken!);
        if (exp) {
          token.exp = exp;
          console.log(
            'JWT decoded exp:',
            exp,
            'Current time:',
            Math.floor(Date.now() / 1000),
          );
        } else {
          console.warn('Failed to decode JWT, using default expiration');
          token.exp = Math.floor(Date.now() / 1000) + expiresIn;
        }

        // 重置刷新相关状态
        token.lastRefreshAttempt = 0;
      } else if (account) {
        token.accessToken = account.access_token;
        if (!token.exp) {
          token.exp = Math.floor(Date.now() / 1000) + expiresIn;
        }
      }

      const currentTime = Math.floor(Date.now() / 1000);
      console.log('token.exp', token.exp, 'Current time:', currentTime);

      // 刷新冷却机制：避免频繁刷新
      const lastRefreshAttempt = (token.lastRefreshAttempt as number) || 0;
      const timeSinceLastRefresh = currentTime - lastRefreshAttempt;
      const refreshCooldown = 60; // 60秒冷却期

      // 检查是否需要刷新 token
      const shouldRefresh =
        token.exp &&
        token.exp > 0 &&
        token.accessToken &&
        token.refreshToken &&
        typeof token.accessToken === 'string' &&
        currentTime > token.exp - 30 && // 提前30秒刷新
        timeSinceLastRefresh > refreshCooldown; // 冷却期检查

      if (shouldRefresh) {
        console.log('Token expiring soon, refreshing...');

        token.lastRefreshAttempt = currentTime;

        try {
          const res = await Request.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              refreshToken: token.refreshToken,
            },
          );

          const newExp = getJWTExpiration(res.data.accessToken);
          const finalExp = newExp || Math.floor(Date.now() / 1000) + expiresIn;

          console.log('Token refreshed successfully, new exp:', finalExp);

          return {
            ...token,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            exp: finalExp,
            lastRefreshAttempt: currentTime,
          };
        } catch (error) {
          console.warn('Token refresh failed, redirecting to login:', error);
          return {
            ...token,
            error: StatusCodeMap.UNAUTHORIZED.toString(),
          };
        }
      }

      // 如果 token 已经过期，标记为需要重新登录
      if (token.exp && currentTime > token.exp) {
        console.warn('Token expired, redirecting to login');
        return { ...token, error: StatusCodeMap.TOKEN_EXPIRED.toString() };
      }

      return token;
    },
    // 该方法返回的键值对会被存到cookies中
    async session(data) {
      const { session, token } = data;
      if (session && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }
      return session;
    },
  },
});

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const getAuthJwt = async () => {
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value]),
    ),
  };

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    raw: true,
  });

  return token;
};
