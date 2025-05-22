import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { InviteCodesService } from './invite-codes.service';

describe('InviteCodesService', () => {
  let service: InviteCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteCodesService],
    }).compile();

    service = module.get<InviteCodesService>(InviteCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('inviteCode create', async () => {
  //   const inviteCode = await service.create({
  //     expiresAt: new Date('2025-07-20'),
  //     type: InviteCodeTypeEnum.REGISTER
  //   })
  //   expect(inviteCode).toHaveProperty('code');
  // }, 100000);

  it('inviteCode findAll', async () => {
    const inviteCodes = await service.findAll();
    expect(inviteCodes.length).toBe(1);
  }, 100000);
});
