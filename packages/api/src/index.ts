import { LinkEntity } from 'links/entities/link.entity';
import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { UserEntity } from 'users/entities/user.entity';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { UpdateUserDto } from 'users/dto/update-user.dto';
import { InviteCodeEntity } from 'invite-codes/entities/invite-code.entity';
import { CreateInviteCodeDto } from 'invite-codes/dto/create-invite-code.dto';
import { UpdateInviteCodeDto } from 'invite-codes/dto/update-invite-code.dto';
import { UserRoleEnum } from 'enums/user-role';
import { InviteCodeTypeEnum } from 'enums/invite-code-type';

export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto
  },
  entities: {
    LinkEntity
  },
};

export const users = {
  dto: {
    CreateUserDto,
    UpdateUserDto
  },
  entities: {
    UserEntity
  },
};

export const inviteCodes = {
  dto: {
    CreateInviteCodeDto,
    UpdateInviteCodeDto
  },
  entities: {
    InviteCodeEntity
  },
};

export const enums = {
  UserRoleEnum,
  InviteCodeTypeEnum
}
