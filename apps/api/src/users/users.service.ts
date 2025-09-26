import { Injectable } from '@nestjs/common';
import { userRepo } from '@repo/database';
import {
  User,
  UserCreateDto,
  UserUpdateDto,
  UserRole
} from '@repo/types';
import { BaseService } from '../common/base.service';

@Injectable()
export class UsersService extends BaseService {
  constructor() {
    super(UsersService.name);
  }

  async create(createUserDto: UserCreateDto): Promise<User> {
    try {
      const user = await userRepo.create({
        data: {
          ...createUserDto,
          // 如果需要默认值
          role: createUserDto.role || 'USER' as UserRole,
        },
      });
      this.logger.log(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.handleError(error, 'Error creating user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await userRepo.findAll();
      this.logger.log(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.handleError(error, 'Error fetching users');
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await userRepo.findById(id);
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`);
        return null;
      }
      return user;
    } catch (error) {
      this.handleError(error, `Error finding user with ID: ${id}`);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        this.logger.warn(`User not found with Email: ${email}`);
        return null;
      }
      return user;
    } catch (error) {
      this.handleError(error, `Error finding user with Email: ${email}`);
    }
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<User> {
    try {
      const user = await userRepo.update({
        where: { id },
        data: updateUserDto,
      });
      this.logger.log(`User updated with ID: ${id}`);
      return user;
    } catch (error) {
      this.handleError(error, `Error updating user with ID: ${id}`);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await userRepo.delete(id);
      this.logger.log(`User deleted with ID: ${id}`);
      return user;
    } catch (error) {
      this.handleError(error, `Error deleting user with ID: ${id}`);
    }
  }
}
