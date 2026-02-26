import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guards';


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

  await app.listen(3000); 
}
  
bootstrap();
