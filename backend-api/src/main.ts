import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const config = new DocumentBuilder()
  .setTitle('Saas Feature Control API')
  .setDescription('Multi-tenant SaaS API with plan-based feature limits (Free: 3 features, Pro: unlimited).')
  .setVersion('1.0')
  .addBearerAuth()
  .build();


    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
