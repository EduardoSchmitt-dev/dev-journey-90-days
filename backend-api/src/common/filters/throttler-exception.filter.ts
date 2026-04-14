import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { RequestWithUser } from '../types/request-with-user';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();

    const forwardedFor = request.headers['x-forwarded-for'];

    const ip =
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : (request.socket?.remoteAddress ?? request.ip ?? 'unknown');

    response.status(429).json({
      success: false,
      error: 'Too many requests',
      statusCode: 429,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ip,
    });
  }
}
