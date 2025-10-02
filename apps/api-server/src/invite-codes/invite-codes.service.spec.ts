jest.mock('@repo/database', () => ({
  inviteCodeRepo: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { InviteCodesService } from './invite-codes.service';
import { InviteCodeTypeEnum } from '@repo/types';
import { inviteCodeRepo } from '@repo/database';

describe('InviteCodesService', () => {
  let service: InviteCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteCodesService],
    }).compile();

    service = module.get<InviteCodesService>(InviteCodesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invite code', async () => {
      const createDto = {
        expiresAt: new Date('2025-12-31'),
        type: InviteCodeTypeEnum.REGISTER,
      };
      const mockInviteCode = {
        code: 'ABC123',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (inviteCodeRepo.create as jest.Mock).mockResolvedValue(mockInviteCode);

      const result = await service.create(createDto);

      expect(inviteCodeRepo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('code');
    });
  });

  describe('findAll', () => {
    it('should return all invite codes', async () => {
      const query = { pageNo: 1, pageSize: 10, sortBy: 'createdAt', sortOrder: 'descend' as const };
      const mockInviteCodes = [
        {
          code: 'ABC123',
          type: InviteCodeTypeEnum.REGISTER,
          expiresAt: new Date(),
        },
      ];

      (inviteCodeRepo.findMany as jest.Mock).mockResolvedValue(mockInviteCodes);
      (inviteCodeRepo.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.data.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an invite code by code', async () => {
      const mockInviteCode = {
        code: 'ABC123',
        type: InviteCodeTypeEnum.REGISTER,
        expiresAt: new Date(),
      };

      (inviteCodeRepo.findByCode as jest.Mock).mockResolvedValue(mockInviteCode);

      const result = await service.findOne('ABC123');

      expect(inviteCodeRepo.findByCode).toHaveBeenCalledWith('ABC123');
      expect(result).toEqual(mockInviteCode);
    });

    it('should throw NotFoundException when invite code not found', async () => {
      (inviteCodeRepo.findByCode as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an invite code', async () => {
      const updateDto = { expiresAt: new Date('2026-01-01') };
      const mockInviteCode = {
        code: 'ABC123',
        type: InviteCodeTypeEnum.REGISTER,
        expiresAt: new Date('2025-12-31'),
      };
      const updatedCode = { ...mockInviteCode, ...updateDto };

      (inviteCodeRepo.findByCode as jest.Mock).mockResolvedValue(mockInviteCode);
      (inviteCodeRepo.update as jest.Mock).mockResolvedValue(updatedCode);

      const result = await service.update('ABC123', updateDto);

      expect(inviteCodeRepo.update).toHaveBeenCalledWith({
        where: { code: 'ABC123' },
        data: updateDto,
      });
      expect(result).toEqual(updatedCode);
    });
  });

  describe('remove', () => {
    it('should delete an invite code', async () => {
      const mockInviteCode = {
        code: 'ABC123',
        type: InviteCodeTypeEnum.REGISTER,
        expiresAt: new Date(),
      };

      (inviteCodeRepo.findByCode as jest.Mock).mockResolvedValue(mockInviteCode);
      (inviteCodeRepo.delete as jest.Mock).mockResolvedValue(mockInviteCode);

      const result = await service.remove('ABC123');

      expect(inviteCodeRepo.delete).toHaveBeenCalledWith({
        where: { code: 'ABC123' },
      });
      expect(result).toEqual(mockInviteCode);
    });
  });
});
