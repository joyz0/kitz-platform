import { Injectable, NotFoundException } from '@nestjs/common';
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
      this.validateRequired(createUserDto.email, 'email');
      this.validateRequired(createUserDto.password, 'password');

      const user = await userRepo.create({
        data: {
          ...createUserDto,
          role: createUserDto.role || ('USER' as UserRole),
        },
      });

      this.logSuccess('User created', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      this.handleError(error, 'create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await userRepo.findAll();
      this.logSuccess('Retrieved users', { count: users.length });
      return users;
    } catch (error) {
      this.handleError(error, 'fetch all users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      this.validateRequired(id, 'id');

      const user = await userRepo.findById(id);
      if (!user) {
        this.logWarning('User not found', `ID: ${id}`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.handleError(error, `find user by ID: ${id}`);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      this.validateRequired(email, 'email');

      const user = await userRepo.findByEmail(email);
      if (!user) {
        this.logWarning('User not found', `Email: ${email}`);
        return null;
      }

      return user;
    } catch (error) {
      this.handleError(error, `find user by email: ${email}`);
    }
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<User> {
    try {
      this.validateRequired(id, 'id');

      // 确保用户存在
      await this.findOne(id);

      const user = await userRepo.update({
        where: { id },
        data: updateUserDto,
      });

      this.logSuccess('User updated', { id: user.id, updatedFields: Object.keys(updateUserDto) });
      return user;
    } catch (error) {
      this.handleError(error, `update user with ID: ${id}`);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      this.validateRequired(id, 'id');

      // 确保用户存在
      await this.findOne(id);

      const user = await userRepo.deleteById(id);
      this.logSuccess('User deleted', { id: user.id });
      return user;
    } catch (error) {
      this.handleError(error, `delete user with ID: ${id}`);
    }
  }

  /**
   * 检查邮箱是否已存在
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.findOneByEmail(email);
      return user !== null;
    } catch (error) {
      this.handleError(error, `check email exists: ${email}`);
    }
  }
}
