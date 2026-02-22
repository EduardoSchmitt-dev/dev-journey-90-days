import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { ProgressiveLockService } from './common/security/progressive-lock.service';
import { AppLogger } from './common/logger/app-logger.service';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

@Module({
  imports: [
    RateLimitModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        genReqId: (req) => {
          return req.headers['x-request-id'] || require('crypto').randomUUID();
        },
        transport: { 
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
         },
        },
      }),

      ThrottlerModule.forRoot({
        throttlers: [
          { ttl: 60,
            limit: 20,
          },
        ],
      }),
    FeaturesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [ 
    AppLogger,
    ProgressiveLockService,
    ThrottlerExceptionFilter,
    RequestLoggingInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
