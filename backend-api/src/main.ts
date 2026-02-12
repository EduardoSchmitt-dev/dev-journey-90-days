import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { error } from 'console';

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


async function bootstrap() { 
  const app = await NestFactory.create(AppModule);


  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
