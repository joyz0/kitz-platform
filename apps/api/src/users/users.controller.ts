import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@repo/api/users/dto/create-user.dto';
import { UpdateUserDto } from '@repo/api/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly linksService: UsersService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.linksService.create(CreateUserDto);
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.linksService.update(id, UpdateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
