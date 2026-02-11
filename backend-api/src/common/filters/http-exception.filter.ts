import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { request, Response } from 'express';
import { timestamp } from 'rxjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();  
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
     ) {      
       message = (exceptionResponse as any).message;
       }
      }
   response.status(status).json({
     sucess: false,
     error: message,
     statusCode: status,
     timestamp: new Date().toISOString(),
     path: request.url, 
   });
  } 
}