import { type User, UserRole } from '@repo/pgdb';

export class UserEntity implements User {
  id: string;
  name: string;
  password: string;
  email: string;
  emailVerified: Date;
  image: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}