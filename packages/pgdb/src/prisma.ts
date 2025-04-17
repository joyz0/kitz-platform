import { PrismaClient, UserRole, InviteCodeType } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { withAccelerate } from '@prisma/extension-accelerate';

// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma, PrismaClient, PrismaClientKnownRequestError, UserRole };
export type { User, Account, Session, VerificationToken, Authenticator, InviteCode, InviteCodeType } from '@prisma/client';

if (process.env.NODE_ENV === 'development') globalThis.prismaGlobal = prisma;
