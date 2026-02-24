import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityModule } from './common/security/security.module';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { LoggerCoreModule } from './common/logger/logger-core.module';

@Module({
  imports: [
    RateLimitModule,
    AuthModule,
    UsersModule,
    FeaturesModule,
    SecurityModule,
    LoggerCoreModule,

    // ✅ ThrottlerModule TEM que ficar aqui (imports)
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20,
      },
    ]),

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
  ],
  controllers: [],
  providers: [
    // ✅ Filter global do throttler
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
    provide: APP_FILTER,
    useClass: ThrottlerExceptionFilter,
  },
  ],
})
export class AppModule {}