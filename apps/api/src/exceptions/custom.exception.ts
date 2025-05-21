import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    public readonly code: number,
    message: string,
    status: number = 200,
  ) {
    super({ code, message }, status);
  }
}
