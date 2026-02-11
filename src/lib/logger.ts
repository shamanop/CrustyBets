import { createClient } from '@libsql/client';

// Separate DB client for logging to avoid circular dependency with db/index.ts
let logClient: ReturnType<typeof createClient> | null = null;

function getLogClient() {
  if (!logClient) {
    try {
      logClient = createClient({
        url: process.env.DATABASE_URL || 'file:./local.db',
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });
    } catch {
      // Silently fail - console logging still works
    }
  }
  return logClient;
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

async function persistLog(level: LogLevel, module: string, message: string, data?: unknown) {
  try {
    const client = getLogClient();
    if (!client) return;

    const dataStr = data !== undefined ? JSON.stringify(data, null, 0) : null;
    await client.execute({
      sql: 'INSERT INTO debug_logs (level, module, message, data, timestamp) VALUES (?, ?, ?, ?, ?)',
      args: [level, module, message?.substring(0, 2000) || '', dataStr?.substring(0, 5000) || null, Date.now()],
    });
  } catch {
    // Never let logging break the app
  }
}

function formatArgs(args: unknown[]): { message: string; data: unknown | undefined } {
  const parts: string[] = [];
  let extraData: unknown | undefined;

  for (const arg of args) {
    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
      parts.push(String(arg));
    } else if (arg instanceof Error) {
      parts.push(`${arg.message}\n${arg.stack}`);
    } else {
      extraData = arg;
      parts.push(JSON.stringify(arg));
    }
  }

  return { message: parts.join(' '), data: extraData };
}

export function createLogger(module: string) {
  const prefix = `[${module}]`;

  const log = (level: LogLevel, ...args: unknown[]) => {
    const ts = new Date().toISOString();
    const { message, data } = formatArgs(args);

    // Always console log
    const consoleFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleFn(`${prefix} ${ts}`, ...args);

    // Persist to DB (fire-and-forget)
    persistLog(level, module, message, data);
  };

  return {
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
    debug: (...args: unknown[]) => log('debug', ...args),
  };
}
