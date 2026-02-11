import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { createLogger } from '@/lib/logger';

const log = createLogger('DB');

const dbUrl = process.env.DATABASE_URL || 'file:./local.db';
const maskedUrl = dbUrl.startsWith('file:') ? dbUrl : dbUrl.replace(/\/\/.*@/, '//***:***@');

log.info('Creating database client', { url: maskedUrl, hasAuthToken: !!process.env.DATABASE_AUTH_TOKEN });

let client: ReturnType<typeof createClient>;
try {
  client = createClient({
    url: dbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  log.info('Database client created successfully');
} catch (err) {
  log.error('Failed to create database client', err);
  throw err;
}

export const db = drizzle(client, { schema });
log.info('Drizzle ORM initialized with schema');
export type Database = typeof db;
