import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { InviteCodesController } from './invite-codes.controller';
import { InviteCodesService } from './invite-codes.service';

describe('InviteCodesController', () => {
  let controller: InviteCodesController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [InviteCodesController],
  //     providers: [InviteCodesService],
  //   }).compile();

  //   controller = module.get<InviteCodesController>(InviteCodesController);
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
