import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { handlers } from './handler';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(PinoLogger) private readonly logger: PinoLogger) {}
  catch(exception: unknown, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    for (const [klass, handler] of handlers.entries()) {
      if (exception instanceof klass) {
        const handleResponse = handler(exception);
        return response.status(handleResponse.statusCode).json(handleResponse);
      }
    }
    this.logger.error('Internal Server Error: ', exception);
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: exception instanceof Error ? (exception as HttpException).message : 'Unknown error',
    });
  }
}
