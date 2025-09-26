import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
  UsePipes
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserCreateDto,
  UserUpdateDto,
  UserCreateSchema,
  UserUpdateSchema
} from '@repo/types';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller({
  path:'users',
  version:'1'
})
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(UserCreateSchema))
  create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UserUpdateSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
