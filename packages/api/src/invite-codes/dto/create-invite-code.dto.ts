import { type InviteCode } from '@repo/prisma';
import { InviteCodeTypeEnum } from '../../enums/invite-code-type';

export class CreateInviteCodeDto implements Partial<InviteCode> {
  code?: string;
  type: InviteCodeTypeEnum;
  expiresAt: Date;
  usedAt?: Date;
  createdAt?: Date;
  userId?: string;
}
