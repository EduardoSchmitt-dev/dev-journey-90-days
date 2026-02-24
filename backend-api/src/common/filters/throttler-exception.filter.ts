import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ProgressiveLockService } from '../security/progressive-lock.service';
import { AppLogger } from '../logger/app-logger.service';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {

  constructor(
    private readonly progressiveLock: ProgressiveLockService,
    private readonly logger: AppLogger,
  ) {}

  async catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const ip =
      request.headers['x-forwarded-for'] ||
      request.ip ||
      request.socket?.remoteAddress;

    this.logger.warn(
  'Rate limit abuse detected',
  'ThrottlerExceptionFilter',
  {
    ip,
    path: request.url,
    method: request.method,
  },
);
    const key = ip;
   
    await this.progressiveLock.registerFailure(key);
    this.logger.warn(
      '🚨 Progressive lock applied', 
      '🚨 ThrottlerExceptionFilter',
    { ip },
);
    
    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: 429,
      message: 'Too many requests. Please slow down.',
    });
  }
}