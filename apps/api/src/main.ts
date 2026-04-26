import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildOpenApiDocument } from './openapi/build-document';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({ origin: 'http://localhost:5173' });
  SwaggerModule.setup('docs', app, () => buildOpenApiDocument(app), {
    jsonDocumentUrl: 'openapi.json',
  });
  const config = app.get(ConfigService);
  const port = Number(config.get('PORT')) || 3000;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
