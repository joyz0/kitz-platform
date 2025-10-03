import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@repo/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Partial<User> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
