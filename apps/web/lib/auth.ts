import NextAuth from "next-auth";
import type { Session, NextAuthResult } from "next-auth";
import type { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./zod";
import { PrismaAdapter } from "./prisma-adapter";
import { RoutePath } from "./constants";  
import { prisma } from '@repo/pgdb';
import bcrypt from "bcryptjs";
import { headers, cookies } from "next/headers";
import { getToken, decode } from "next-auth/jwt";

export type NextAuthUser = Session["user"];

const whitelist = [RoutePath.SIGNIN_URL, RoutePath.SIGNUP_URL];

export const adapter = PrismaAdapter(prisma);

const providers: Provider[] = [
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: { label: "邮箱", type: "email", value: "" },
      password: { label: "密码", type: "password", value: "" },
    },
    authorize: async (credentials) => {
      try {
        let user: any = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        // logic to verify if the user exists
        user = await adapter.getUserByEmail!(email);

        if (user) {
          const isMatch = bcrypt.compareSync(password, user.password);
          if (!isMatch) {
            throw new Error("密码不正确");
          }
        } else {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("用户不存在");
        }

        // return user object with their profile data
        return user;
      } catch (error) {
        return null;
      }
    },
  }),
  GitHub,
];

export const { handlers, signIn, signOut, auth }: any = NextAuth({
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  providers,
  adapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
        redirectUrl.searchParams.append("callbackUrl", href);
        return Response.redirect(redirectUrl);
      }
      console.log("authorized");
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    async signIn({ account, user, credentials }) {
      // if (account?.provider === 'credentials') {
      //   return (credentials!.email! as string).endsWith('@admin.com');
      // }
      return true;
    },
    async jwt(data) {
      // user是authjs从database user表查询的
      const { token, user, account } = data;
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      console.log("jwt token", token);
      console.log("jwt user", user);
      console.log("jwt account", account);
      return token;
    },
    async session(data) {
      const { session, token } = data;
      console.log("session session", session);
      console.log("session token", token);
      if (session && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const getAuthJwt = async () => {
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((c) => [c.name, c.value])
    ),
  };

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    raw: true,
  });

  return token;
};
