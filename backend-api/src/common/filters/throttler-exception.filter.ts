import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ProgressiveLockService } from '../security/progressive-lock.service';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {

  constructor(
    private readonly progressiveLock: ProgressiveLockService,
  ) {}

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const ip =
      request.headers['x-forwarded-for'] ||
      request.ip ||
      request.socket?.remoteAddress;

    console.warn('🚨 RATE LIMIT ABUSE:', {
      ip,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    const key = ip;
    const duration = this.progressiveLock.registerFailure(key);

    console.warn('🚨 Progressive Lock:', {
      ip,
      lockedFor: duration / 1000 + ' seconds',
    });

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: 429,
      message: 'Too many requests. Please slow down.',
    });
  }
}