import { PartialType } from '@nestjs/mapped-types';
import { type InviteCode } from '@repo/pgdb';
import { CreateInviteCodeDto } from './create-invite-code.dto';

export class UpdateInviteCodeDto extends PartialType(CreateInviteCodeDto) implements Partial<InviteCode> {
}
