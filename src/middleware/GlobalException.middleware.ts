import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import GlobalException from 'src/exceptions/GlobalException';

// Global Exception Handler
@Catch(GlobalException)
export class GlobalExceptionHandler implements ExceptionFilter {
  catch(exception: GlobalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof GlobalException
        ? exception.getStatusCode()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof GlobalException
        ? exception.getResponse()
        : 'Internal server error';

    const data =
      exception instanceof GlobalException ? exception.getData() : null;
    response.status(statusCode).json({
      statusCode,
      error,
      data,
    });
  }
}
