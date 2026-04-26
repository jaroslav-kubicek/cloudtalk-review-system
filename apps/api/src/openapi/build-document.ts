import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Reviews API')
    .setDescription('Customer reviews and admin moderation for the product catalog.')
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'customer')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'admin')
    .build();
  return SwaggerModule.createDocument(app, config);
}
