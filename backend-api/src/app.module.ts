import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
