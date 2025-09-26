import { type User } from '@repo/prisma';
import { UserRoleEnum } from '../../enums/user-role';

export class CreateUserDto implements Partial<User> {
  name?: string;
  password?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role?: UserRoleEnum;
}
