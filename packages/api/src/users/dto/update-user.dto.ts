import { PartialType } from '@nestjs/mapped-types';
import { type User } from '@repo/prisma';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) implements Partial<User> {
    id: string;
}
