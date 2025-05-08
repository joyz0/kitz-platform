import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/pgdb';
import { InviteCodeEntity } from '@repo/api/invite-codes/entities/invite-code.entity';
import { BaseService } from '../common/base.service';
import { CreateInviteCodeDto } from '@repo/api/invite-codes/dto/create-invite-code.dto';
import { UpdateInviteCodeDto } from '@repo/api/invite-codes/dto/update-invite-code.dto';
import { InviteCodeTypeEnum } from '@repo/api/enums/invite-code-type';
import { PaginateInviteCodeDto } from '@repo/api/invite-codes/dto/paginate-invite-code.dto';
import { PaginateResultDto } from '@repo/api/common/paginate-result.dto';
import crypto from 'crypto';

@Injectable()
export class InviteCodesService extends BaseService {
  constructor() {
    super(InviteCodesService.name);
  }

  async create(createInviteCodeDto: CreateInviteCodeDto): Promise<InviteCodeEntity> {
    try {
      const inviteCode = await prisma.inviteCode.create({
        data: {
          ...createInviteCodeDto,
          code: crypto.randomBytes(16).toString('hex').toUpperCase(),
          type: createInviteCodeDto.type || InviteCodeTypeEnum.REGISTER,
        },
      });
      this.logger.log(`InviteCode created with CODE: ${inviteCode.code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, 'Error creating inviteCode');
    }
  }


  async paginate(query: PaginateInviteCodeDto): Promise<PaginateResultDto<InviteCodeEntity>> {
    const orderBy = {
      [query.sortBy]: query.sortOrder.toLowerCase(),
    };
  
    const [data, total] = await Promise.all([
      prisma.inviteCode.findMany({
        where: query.where,
        skip: (query.pageNo - 1) * query.pageSize,
        take: query.pageSize,
        orderBy,
      }),
      prisma.inviteCode.count({ where: query.where }),
    ]);

    return PaginateResultDto.from(data, total, query);
  }

  async findAll(): Promise<InviteCodeEntity[]> {
    try {
      const inviteCodes = await prisma.inviteCode.findMany();
      this.logger.log(`Retrieved ${inviteCodes.length} inviteCodes`);
      return inviteCodes;
    } catch (error) {
      this.handleError(error, 'Error fetching inviteCodes');
    }
  }

  async findOne(code: string): Promise<InviteCodeEntity | null> {
    try {
      const inviteCode = await prisma.inviteCode.findUnique({
        where: { code },
      });
      if (!inviteCode) {
        this.logger.warn(`InviteCode not found with CODE: ${code}`);
        return null;
      }
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error finding inviteCode with CODE: ${code}`);
    }
  }

  async update(code: string, updateInviteCodeDto: UpdateInviteCodeDto): Promise<InviteCodeEntity> {
    try {
      const inviteCode = await prisma.inviteCode.update({
        where: { code },
        data: updateInviteCodeDto,
      });
      this.logger.log(`InviteCode updated with CODE: ${code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error updating inviteCode with CODE: ${code}`);
    }
  }

  async remove(code: string): Promise<InviteCodeEntity> {
    try {
      const inviteCode = await prisma.inviteCode.delete({
        where: { code },
      });
      this.logger.log(`InviteCode deleted with CODE: ${code}`);
      return inviteCode;
    } catch (error) {
      this.handleError(error, `Error deleting inviteCode with CODE: ${code}`);
    }
  }
}