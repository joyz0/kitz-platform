import { type User } from '@repo/prisma';
import { UserRoleEnum } from '../../enums/user-role';

export class UserEntity implements User {
  id: string;
  name: string;
  password: string;
  email: string;
  emailVerified: Date;
  image: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
