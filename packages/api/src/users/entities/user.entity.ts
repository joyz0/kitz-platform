export class User {
  id: string;
  name?: string;
  password?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role?:string;
  createdAt?:Date;
  updatedAt?:Date;
}