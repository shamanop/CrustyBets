import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:Balance');

export async function GET(request: Request) {
  log.info('GET /api/economy/balance - Balance check request');
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
    log.debug('Auth header present', { hasApiKey: !!apiKey, authMethod: request.headers.has('x-api-key') ? 'x-api-key' : request.headers.has('authorization') ? 'bearer' : 'none' });

    if (!apiKey) {
      log.warn('Balance check rejected - no API key provided');
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    log.debug('Querying agent by API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      log.warn('Balance check rejected - invalid API key');
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    log.info('Balance check successful', { agentId: agent.id, name: agent.name, balance: agent.crustyCoins, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        agentId: agent.id,
        name: agent.name,
        balance: agent.crustyCoins,
      },
    });
  } catch (error) {
    log.error('Balance check error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
