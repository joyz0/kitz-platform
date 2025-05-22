import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN_HOURS || '1') * 60 * 60;
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: expiresIn,
  },
} satisfies NextAuthConfig;
