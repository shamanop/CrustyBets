import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactions, agents } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:Transactions');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const typeFilter = searchParams.get('type');

    // Try session auth first (browser users)
    const session = await auth();
    let playerId: string | null = null;

    if (session?.user?.id) {
      playerId = session.user.id;
    } else {
      // Try API key auth (agents)
      const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
      if (apiKey) {
        const agent = await db.query.agents.findFirst({
          where: (a, { eq }) => eq(a.apiKey, apiKey),
        });
        if (agent) {
          playerId = agent.id;
        }
      }
    }

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build query conditions
    const conditions = [eq(transactions.playerId, playerId)];
    if (typeFilter) {
      conditions.push(eq(transactions.type, typeFilter));
    }

    const results = await db.select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);

    log.info('Transactions fetched', { playerId, count: results.length, typeFilter });

    return NextResponse.json({
      success: true,
      data: {
        transactions: results.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          balanceAfter: t.balanceAfter,
          description: t.description,
          gameSessionId: t.gameSessionId,
          createdAt: t.createdAt,
        })),
        total: results.length,
      },
    });
  } catch (error) {
    log.error('Transactions fetch error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
