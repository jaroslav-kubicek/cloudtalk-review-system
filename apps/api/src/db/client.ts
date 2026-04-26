import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDbClient(connectionString: string) {
  const queryClient = postgres(connectionString);
  return drizzle(queryClient);
}

export type DrizzleDb = ReturnType<typeof createDbClient>;
export type DrizzleTx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0];
