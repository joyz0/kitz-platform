import { prisma } from '@repo/prisma';
import { stripUndefined } from '@repo/utils/shared';

export interface UserRepository {
  findById(id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  deleteById(id: string): Promise<any>;
  create(param: Record<string, any>): Promise<any>;
  update(param: Record<string, any>): Promise<any>;
  findMany(param: Record<string, any>): Promise<any>;
  findAll(): Promise<any>;
  count(param: Record<string, any>): Promise<any>;
  signUp({
    email,
    password,
    inviteCode,
  }: {
    email: string;
    password: string;
    inviteCode: string;
  }): Promise<any>;
}

export const userRepo: UserRepository = {
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
    }),
  deleteById: (id) =>
    prisma.user.delete({
      where: { id },
    }),
  create: (param) => prisma.user.create(param),
  update: (param) => prisma.user.update(param),
  findMany: (param) => prisma.user.findMany(param),
  findAll: () => prisma.user.findMany(),
  count: (param) => prisma.user.count(param),
  signUp: ({ email, password, inviteCode }) =>
    prisma.$transaction(async (tx: any) => {
      const u = await tx.user.create(stripUndefined({ email, password }));
      const c = await tx.inviteCode.update({
        where: { code: inviteCode },
        ...stripUndefined({
          userId: u.id,
          usedAt: new Date(),
        }),
      });

      return [u, c];
    }),
};
