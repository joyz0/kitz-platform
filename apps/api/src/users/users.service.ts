import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/pgdb';
import { UserEntity } from '@repo/api/users/entities/user.entity';
import { BaseService } from '../common/base.service';
import { CreateUserDto } from '@repo/api/users/dto/create-user.dto';
import { UpdateUserDto } from '@repo/api/users/dto/update-user.dto';
import { UserRoleEnum } from '@repo/api/enums/user-role';

@Injectable()
export class UsersService extends BaseService {
  constructor() {
    super(UsersService.name);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await prisma.user.create({
        data: {
          ...createUserDto,
          // 如果需要默认值
          role: createUserDto.role || UserRoleEnum.USER,
        },
      });
      this.logger.log(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.handleError(error, 'Error creating user');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await prisma.user.findMany();
      this.logger.log(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.handleError(error, 'Error fetching users');
    }
  }

  async findOne(id: string): Promise<UserEntity | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`);
        return null;
      }
      return user;
    } catch (error) {
      this.handleError(error, `Error finding user with ID: ${id}`);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        this.logger.warn(`User not found with Email: ${email}`);
        return null;
      }
      return user;
    } catch (error) {
      this.handleError(error, `Error finding user with Email: ${email}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      this.logger.log(`User updated with ID: ${id}`);
      return user;
    } catch (error) {
      this.handleError(error, `Error updating user with ID: ${id}`);
    }
  }

  async remove(id: string): Promise<UserEntity> {
    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      this.logger.log(`User deleted with ID: ${id}`);
      return user;
    } catch (error) {
      this.handleError(error, `Error deleting user with ID: ${id}`);
    }
  }
}
