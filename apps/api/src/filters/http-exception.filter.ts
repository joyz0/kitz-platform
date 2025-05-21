import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from '@repo/api/common/response.dto';
import { Request, Response as ExpressResponse } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() || 500;
    const message = exception.message || 'Internal Server Error';

    const errorResponse = Response.error(message, status);

    response.status(status).json(errorResponse);
  }
}
