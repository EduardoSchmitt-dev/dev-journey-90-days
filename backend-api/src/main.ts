import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    console.log('🔥 INICIANDO APP...');

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    console.log('✅ APP CRIADO');

    const config = new DocumentBuilder()
      .setTitle('Dev Journey API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3333, '0.0.0.0');

    console.log('🚀 SERVER RUNNING ON 3333');
  } catch (err) {
    console.error('💥 ERRO AO SUBIR APP:', err);
  }
}

bootstrap();
