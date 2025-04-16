import { Injectable } from '@nestjs/common';
import prisma from '@repo/pgdb';

@Injectable()
export class UserService {
  async findUser(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }
}