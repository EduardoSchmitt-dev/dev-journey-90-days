import { Module,RequestMethod, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { randomUUID } from 'crypto';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './infrastructure/prisma/prisma.module';


@Module({
  imports: [ 
    PrismaModule,
    LoggerModule.forRoot({
      pinoHttp: {
       level: 'info',
       
       genReqId: (req) =>
        req.headers['x-request-id'] || randomUUID(),

       transport: 
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true},
              }
             : undefined,
            },
       }), 
    ],
    controllers: [HealthController],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware)
    .forRoutes({ path: '(.*)', method: RequestMethod.ALL });
  }
}
        
