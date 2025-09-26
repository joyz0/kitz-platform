import { Injectable, NotFoundException } from '@nestjs/common';
import { inviteCodeRepository as inviteCodeRepo } from '@repo/database';
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

  async create(createInviteCodeDto: InviteCodeCreateDto): Promise<InviteCode> {
    try {
      const generatedCode = createInviteCodeDto.code || this.generateInviteCode();
      const inviteCode = await inviteCodeRepo.create({
        data: {
          ...createInviteCodeDto,
          code: generatedCode,
          type: createInviteCodeDto.type || ('REGISTER' as InviteCodeType),
        },
      });

      this.logSuccess('InviteCode created', { code: inviteCode.code, type: inviteCode.type });
      return inviteCode;
    } catch (error) {
      this.handleError(error, 'create invite code');
    }
  }

  async paginate(query: InviteCodeQueryDto): Promise<ApiResponse<any>> {
    try {
      const orderBy = {
        [query.sortBy || 'createdAt']: (query.sortOrder || 'DESC').toLowerCase(),
      };

      const pageNo = query.pageNo || 1;
      const pageSize = Math.min(query.pageSize || 10, 100); // 限制最大页面大小

      const [data, total] = await Promise.all([
        inviteCodeRepo.findMany({
          where: query.where || {},
          skip: (pageNo - 1) * pageSize,
          take: pageSize,
          orderBy,
        }),
        inviteCodeRepo.count({ where: query.where || {} }),
      ]);

      this.logSuccess('InviteCodes paginated', { total, pageNo, pageSize });
      return createPaginateResponse(data, total, pageNo, pageSize);
    } catch (error) {
      this.handleError(error, 'paginate invite codes');
    }
  }

  async findAll(): Promise<InviteCode[]> {
    try {
      const inviteCodes = await inviteCodeRepo.findAll();
      this.logSuccess('Retrieved invite codes', { count: inviteCodes.length });
      return inviteCodes;
    } catch (error) {
      this.handleError(error, 'fetch all invite codes');
    }
  }

  async findOne(code: string): Promise<InviteCode> {
    try {
      this.validateRequired(code, 'code');

      const inviteCode = await inviteCodeRepo.findByCode(code);
      if (!inviteCode) {
        this.logWarning('InviteCode not found', `CODE: ${code}`);
        throw new NotFoundException(`Invite code ${code} not found`);
      }

      return inviteCode;
    } catch (error) {
      this.handleError(error, `find invite code: ${code}`);
    }
  }

  async update(code: string, updateInviteCodeDto: InviteCodeUpdateDto): Promise<InviteCode> {
    try {
      this.validateRequired(code, 'code');

      // 确保邀请码存在
      await this.findOne(code);

      const inviteCode = await inviteCodeRepo.update({
        where: { code },
        data: updateInviteCodeDto,
      });

      this.logSuccess('InviteCode updated', { code, updatedFields: Object.keys(updateInviteCodeDto) });
      return inviteCode;
    } catch (error) {
      this.handleError(error, `update invite code: ${code}`);
    }
  }

  async remove(code: string): Promise<InviteCode> {
    try {
      this.validateRequired(code, 'code');

      // 确保邀请码存在
      await this.findOne(code);

      const inviteCode = await inviteCodeRepo.deleteByCode(code);
      this.logSuccess('InviteCode deleted', { code });
      return inviteCode;
    } catch (error) {
      this.handleError(error, `delete invite code: ${code}`);
    }
  }

  /**
   * 验证邀请码有效性
   */
  async validateInviteCode(code: string): Promise<boolean> {
    try {
      const inviteCode = await inviteCodeRepo.findByCode(code);
      if (!inviteCode) {
        return false;
      }

      // 检查是否过期
      if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
        this.logWarning('InviteCode expired', `CODE: ${code}`);
        return false;
      }

      // 检查使用次数
      if (inviteCode.maxUses && inviteCode.usedCount >= inviteCode.maxUses) {
        this.logWarning('InviteCode usage limit exceeded', `CODE: ${code}`);
        return false;
      }

      return true;
    } catch (error) {
      this.handleError(error, `validate invite code: ${code}`);
    }
  }

  /**
   * 生成邀请码
   */
  private generateInviteCode(): string {
    return crypto.randomBytes(16).toString('hex').toUpperCase();
  }
}
