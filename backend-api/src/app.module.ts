import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FeaturesModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',

        genReqId: (req) => req.headers['x-request-id'] || randomUUID(),

        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true },
              }
            : undefined,
      },
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
