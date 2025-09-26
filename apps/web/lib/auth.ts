import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { loginDto } from '@repo/types';
import { PrismaAdapter } from './prisma-adapter';
import { ErrorType, RoutePath } from './constants';
import { prisma } from '@repo/prisma';
import { headers, cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { Request } from '@/lib/request';
import './env-init';

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
  // 移除手动 env 配置，环境变量现在通过 next.config.mjs 自动注入
  // adapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: expiresIn,
    updateAge: expiresIn * 0.9,
  },
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
      // https://jwt.io/ 解码jwt
      // user是Credentials.authorize的返回值
      const { token, user, account } = data;
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      } else if (account) {
        token.accessToken = account.access_token;
      }
      console.log('token.exp', token.exp);
      if (
        token.exp &&
        token.exp > 0 &&
        Date.now() / 1000 > token.exp - 30 &&
        token.refreshToken
      ) {
        // token续期
        try {
          const res = await Request.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              refreshToken: token.refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          );
          return {
            ...token,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            exp: Date.now() / 1000 + expiresIn,
          };
        } catch (error) {
          return { ...token, error: ErrorType.ACCESS_DENIED };
        }
      }
      console.log('jwt token', token);
      console.log('jwt user', user);
      console.log('jwt account', account);
      return token;
    },
    // 该方法返回的键值对会被存到cookies中
    async session(data) {
      const { session, token } = data;
      if (session && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string;
      }
      console.log('session session', session);
      console.log('session token', token);
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
