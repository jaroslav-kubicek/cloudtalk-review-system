import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDbClient, type DrizzleDb } from './client';

export const DRIZZLE = 'DRIZZLE';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): DrizzleDb => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) throw new Error('DATABASE_URL is required');
        return createDbClient(url);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
