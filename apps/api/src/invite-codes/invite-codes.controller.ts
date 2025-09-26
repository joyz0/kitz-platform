import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { InviteCodesService } from './invite-codes.service';
import {
  type InviteCodeCreateDto,
  type InviteCodeUpdateDto,
  type InviteCodeQueryDto,
  inviteCodeCreateSchema,
  inviteCodeUpdateSchema,
  inviteCodeQuerySchema,
} from '@repo/types';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller({
  path: 'inviteCodes',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class InviteCodesController {
  constructor(private readonly inviteCodesService: InviteCodesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(inviteCodeCreateSchema))
  create(@Body() createInviteCodeDto: InviteCodeCreateDto) {
    return this.inviteCodesService.create(createInviteCodeDto);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(inviteCodeQuerySchema))
    query: InviteCodeQueryDto,
  ) {
    return this.inviteCodesService.findAll(query);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.inviteCodesService.findOne(code);
  }

  @Patch(':code')
  @UsePipes(new ZodValidationPipe(inviteCodeUpdateSchema))
  update(
    @Param('code') code: string,
    @Body() updateInviteCodeDto: InviteCodeUpdateDto,
  ) {
    return this.inviteCodesService.update(code, updateInviteCodeDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.inviteCodesService.remove(code);
  }
}
