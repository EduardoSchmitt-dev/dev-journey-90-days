import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { RequestLoggingInterceptor } from './common/intercptors/request-logging.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());
  
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) =>
          Object.values(err.constraints || {}),
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Error',
          messages: formattedErrors.flat(),
        });
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(app.get(ThrottlerExceptionFilter));
  app.useGlobalInterceptors(app.get(RequestLoggingInterceptor));

  const config = new DocumentBuilder()
    .setTitle('Saas Feature Control API')
    .setDescription(
      'Multi-tenant SaaS API with plan-based feature limits (Free: 3 features, Pro: unlimited).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
