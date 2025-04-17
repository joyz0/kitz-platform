import { PartialType } from '@nestjs/mapped-types';
import { type User } from '@repo/pgdb';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) implements Partial<User> {
    id: string;
}
