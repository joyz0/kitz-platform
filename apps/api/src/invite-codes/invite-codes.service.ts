import { Injectable } from '@nestjs/common';
import { inviteCodeRepo } from '@repo/database';
import {
  InviteCode,
  InviteCodeCreateDto,
  InviteCodeUpdateDto,
  InviteCodeQueryDto,
  InviteCodeType,
  createPaginateResponse,
  ApiResponse
} from '@repo/types';
import { BaseService } from '../common/base.service';
import crypto from 'crypto';

@Injectable()
export class InviteCodesService extends BaseService {
  constructor() {
    super(InviteCodesService.name);
  }

  async create(
    createInviteCodeDto: InviteCodeCreateDto,
  ): Promise<InviteCode> {
    try {
      const inviteCode = await inviteCodeRepo.create({
        data: {
          ...createInviteCodeDto,
          code: createInviteCodeDto.code || crypto.randomBytes(16).toString('hex').toUpperCase(),
          type: createInviteCodeDto.type || 'REGISTER' as InviteCodeType,
        }
      })
      this.logger.log(`InviteCode created with CODE: ${inviteCode.code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, 'Error creating inviteCode');
    }
  }

  async paginate(
    query: InviteCodeQueryDto,
  ): Promise<ApiResponse<any>> {
    const orderBy = {
      [query.sortBy || 'createdAt']: (query.sortOrder || 'DESC').toLowerCase(),
    };

    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 10;

    const [data, total] = await Promise.all([
      inviteCodeRepo.findMany({
        where: query.where || {},
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
        orderBy,
      }),
      inviteCodeRepo.count({ where: query.where || {} }),
    ]);

    return createPaginateResponse(data, total, pageNo, pageSize);
  }

  async findAll(): Promise<InviteCode[]> {
    try {
      const inviteCodes = await inviteCodeRepo.findAll();
      this.logger.log(`Retrieved ${inviteCodes.length} inviteCodes`);
      return inviteCodes;
    } catch (error) {
      this.handleError(error, 'Error fetching inviteCodes');
    }
  }

  async findOne(code: string): Promise<InviteCode | null> {
    try {
      const inviteCode = await inviteCodeRepo.findByCode(code);
      if (!inviteCode) {
        this.logger.warn(`InviteCode not found with CODE: ${code}`);
        return null;
      }
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error finding inviteCode with CODE: ${code}`);
    }
  }

  async update(
    code: string,
    updateInviteCodeDto: InviteCodeUpdateDto,
  ): Promise<InviteCode> {
    try {
      const inviteCode = await inviteCodeRepo.update({
        where: { code },
        data: updateInviteCodeDto,
      });
      this.logger.log(`InviteCode updated with CODE: ${code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error updating inviteCode with CODE: ${code}`);
    }
  }

  async remove(code: string): Promise<InviteCode> {
    try {
      const inviteCode = await inviteCodeRepo.deleteByCode(code);
      this.logger.log(`InviteCode deleted with CODE: ${code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error deleting inviteCode with CODE: ${code}`);
    }
  }
}
