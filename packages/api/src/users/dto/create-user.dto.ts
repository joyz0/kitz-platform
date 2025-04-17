import { type User, UserRole } from '@repo/pgdb';

export class CreateUserDto implements Partial<User>  {
  name?: string;
  password?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role?: UserRole;
}
