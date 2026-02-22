import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const requestId = randomUUID();

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    request.requestId = requestId;
    response.setHeader('x-request-id', requestId);

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        this.logger.log(
          'Request completed',
          'RequestLoggingInterceptor',
          {
            requestId,
            method: request.method,
            url: request.url,
            statusCode: response.statusCode,
            responseTimeMs: responseTime,
          },
        );
      }),
    );
  }
}