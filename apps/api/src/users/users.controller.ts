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
  Version,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  type UserCreateDto,
  type UserUpdateDto,
  type UserQueryDto,
  userCreateSchema,
  userUpdateSchema,
  userQuerySchema,
  UserRole,
} from '@repo/types';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(userCreateSchema))
  create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(
    @Query(new ZodValidationPipe(userQuerySchema))
    query: UserQueryDto,
  ) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(userUpdateSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
