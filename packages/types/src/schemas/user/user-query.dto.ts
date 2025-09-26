import { z } from 'zod';
import { UserSchema } from './user.schema';
import { createPaginatedQuerySchema } from '../../common/pagination.schema';

// ???? DTO?????????
export const UserQuerySchema = createPaginatedQuerySchema(
  UserSchema.pick({
    name: true,
    email: true,
    role: true,
  }).partial()
);

export type UserQueryDto = z.infer<typeof UserQuerySchema>;