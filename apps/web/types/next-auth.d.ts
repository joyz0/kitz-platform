import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user: {
      id: string;
      /** The user's role. */
      role?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role?: string | null;
  }
  interface SessionProps {
    session: Session;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's role */
    id: string;
    role?: string | null;
  }
}

declare module "next-auth/adapters" {
  interface VerificationToken {
    identifier: string;
    expires: Date;
    token: string;
    createdAt: Date;
  }
}
