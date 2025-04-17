import { Module } from '@nestjs/common';
import { InviteCodesService } from './invite-codes.service';
import { InviteCodesController } from './invite-codes.controller';

@Module({
  controllers: [InviteCodesController],
  providers: [InviteCodesService],
})
export class InviteCodesModule {}
