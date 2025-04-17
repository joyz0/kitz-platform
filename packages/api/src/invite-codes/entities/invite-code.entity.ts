import { type InviteCode, InviteCodeType } from '@repo/pgdb';

export class InviteCodeEntity implements InviteCode {
  code: string;
  type: InviteCodeType;
  expiresAt: Date;
  usedAt: Date;
  createdAt: Date;
  userId: string;
}