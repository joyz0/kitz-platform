export class CreateUserDto {
  name?: string;
  password?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role?: string;
}
