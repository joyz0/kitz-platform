import { prisma } from '@repo/prisma';

export interface InviteCodeRepository {
  findByCode(code: string): Promise<any>;
  deleteByCode(code: string): Promise<any>;
  create(param: Record<string, any>): Promise<any>;
  update(param: Record<string, any>): Promise<any>;
  findMany(param: Record<string, any>): Promise<any>;
  findAll(): Promise<any>;
  count(param: Record<string, any>): Promise<any>;
}

export const inviteCodeRepo: InviteCodeRepository = {
  findByCode: (code) =>
    prisma.inviteCode.findUnique({
      where: { code },
    }),
  deleteByCode: (code) =>
    prisma.inviteCode.delete({
      where: { code },
    }),
  create: (param) => prisma.inviteCode.create(param),
  update: (param) => prisma.inviteCode.update(param),
  findMany: (param) => prisma.inviteCode.findMany(param),
  findAll: () => prisma.inviteCode.findMany(),
  count: (param) => prisma.inviteCode.count(param),
};
