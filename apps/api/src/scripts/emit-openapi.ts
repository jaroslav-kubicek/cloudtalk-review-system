import 'reflect-metadata';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../app.module';
import { buildOpenApiDocument } from '../openapi/build-document';

process.env.JWT_SECRET ||= 'dev-emit-secret';

async function emit(): Promise<void> {
  const log = new Logger('emit-openapi');
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: ['error', 'warn'],
  });
  await app.init();

  const document = buildOpenApiDocument(app);
  const outPath = resolve(__dirname, '../../../../packages/api-client/openapi.json');
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
  log.log(`Wrote ${outPath}`);

  await app.close();
}

emit().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
