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
  UserRole,
} from '@repo/types';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller({
  path: 'inviteCodes',
  version: '1',
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InviteCodesController {
  constructor(private readonly inviteCodesService: InviteCodesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(inviteCodeCreateSchema))
  create(@Body() createInviteCodeDto: InviteCodeCreateDto) {
    return this.inviteCodesService.create(createInviteCodeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(
    @Query(new ZodValidationPipe(inviteCodeQuerySchema))
    query: InviteCodeQueryDto,
  ) {
    return this.inviteCodesService.findAll(query);
  }

  @Get(':code')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('code') code: string) {
    return this.inviteCodesService.findOne(code);
  }

  @Patch(':code')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(inviteCodeUpdateSchema))
  update(
    @Param('code') code: string,
    @Body() updateInviteCodeDto: InviteCodeUpdateDto,
  ) {
    return this.inviteCodesService.update(code, updateInviteCodeDto);
  }

  @Delete(':code')
  @Roles(UserRole.ADMIN)
  remove(@Param('code') code: string) {
    return this.inviteCodesService.remove(code);
  }
}
