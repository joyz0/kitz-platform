jest.mock('@repo/database', () => ({
  userRepo: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { userRepo } from '@repo/database';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const mockUser = {
        id: '1',
        ...createDto,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepo.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(createDto);

      expect(userRepo.create).toHaveBeenCalledWith({
        data: { ...createDto, role: 'USER' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query = { pageNo: 1, pageSize: 10, sortBy: 'createdAt', sortOrder: 'descend' as const };
      const mockUsers = [
        {
          id: '1',
          email: 'test1@example.com',
          name: 'User 1',
          password: 'hash',
          role: 'USER',
        },
      ];

      (userRepo.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (userRepo.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(userRepo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      (userRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      (userRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      const updatedUser = { ...mockUser, ...updateDto };

      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);
      (userRepo.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update('1', updateDto);

      expect(userRepo.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);
      (userRepo.deleteById as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(userRepo.deleteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('checkEmailExists', () => {
    it('should return true if email exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
      };

      (userRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.checkEmailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.checkEmailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });
});
