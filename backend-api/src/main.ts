import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  }); 
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
 
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não permitidos
      forbidNonWhitelisted: true, // erro se enviar campo extra
      transform: true, //  tranforma query params em número automaticamente
    }),
  );

  await app.listen(3000); 
}
  
bootstrap();
