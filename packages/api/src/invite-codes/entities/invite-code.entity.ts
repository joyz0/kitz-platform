import { type InviteCode, InviteCodeType } from '@repo/pgdb';

export class InviteCodeEntity implements Partial<InviteCode> {
  code: string;
  type?: InviteCodeType;
  expiresAt?: Date;
  usedAt?: Date;
  createdAt?: Date;
  userId?: string;
}