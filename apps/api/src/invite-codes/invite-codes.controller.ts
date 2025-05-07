import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { InviteCodesService } from './invite-codes.service';
import { CreateInviteCodeDto } from '@repo/api/invite-codes/dto/create-invite-code.dto';
import { UpdateInviteCodeDto } from '@repo/api/invite-codes/dto/update-invite-code.dto';
import { PaginateInviteCodeDto } from '@repo/api/invite-codes/dto/paginate-invite-code.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  path:'inviteCodes',
  version:'1'
})
@UseGuards(AuthGuard('jwt'))
export class InviteCodesController {
  constructor(private readonly inviteCodesService: InviteCodesService) {}

  @Post()
  create(@Body() createInviteCodeDto: CreateInviteCodeDto) {
    return this.inviteCodesService.create(createInviteCodeDto);
  }

  @Get('paginate')
  paginate(@Query() query: PaginateInviteCodeDto) {
    return this.inviteCodesService.paginate(query, query.where);
  }

  @Get()
  findAll() {
    return this.inviteCodesService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.inviteCodesService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateInviteCodeDto: UpdateInviteCodeDto) {
    return this.inviteCodesService.update(code, updateInviteCodeDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.inviteCodesService.remove(code);
  }
}
