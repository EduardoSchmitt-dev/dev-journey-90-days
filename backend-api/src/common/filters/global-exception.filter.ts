import { ExceptionFilter,  Catch,  ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { timestamp } from 'rxjs';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    
    // Tratamento do Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return response.status(409).json({
          statusCode: 409,
          error: 'Conflict',
          message: 'Resource already exists',
          path: request.url,
          timestamp: new Date().toISOString(),
        });
      }
    

    if (exception.code === 'P2025') {
      return response.status(404).json({
        statusCode:404,
        error: 'Not Found',
        message: 'Resource not found',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exceptionResponse,
    });
  }
}
