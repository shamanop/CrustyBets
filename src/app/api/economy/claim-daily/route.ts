import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, transactions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:ClaimDaily');

const DAILY_AMOUNT = 50;
const COOLDOWN = 24 * 60 * 60; // 24 hours in seconds

export async function POST(request: Request) {
  log.info('POST /api/economy/claim-daily - Daily claim attempt');
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      log.warn('Daily claim rejected - no API key provided');
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    log.debug('Querying agent by API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      log.warn('Daily claim rejected - invalid API key');
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    log.debug('Agent authenticated', { agentId: agent.id, name: agent.name });
    const now = Math.floor(Date.now() / 1000);

    // Check last daily claim
    log.debug('Checking last daily claim', { agentId: agent.id });
    const lastClaim = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.playerId, agent.id),
        eq(transactions.type, 'daily-claim')
      ))
      .orderBy(desc(transactions.createdAt))
      .limit(1);

    if (lastClaim.length > 0 && (now - lastClaim[0].createdAt) < COOLDOWN) {
      const nextClaimAt = lastClaim[0].createdAt + COOLDOWN;
      const remainingSeconds = nextClaimAt - now;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);

      log.info('Daily claim rejected - cooldown active', { agentId: agent.id, remainingSeconds, nextClaimAt, status: 429 });
      return NextResponse.json({
        success: false,
        error: `Daily reward already claimed. Next claim in ${hours}h ${minutes}m.`,
        data: { nextClaimAt, remainingSeconds },
      }, { status: 429 });
    }

    // Credit the daily reward
    log.debug('Crediting daily reward', { agentId: agent.id, amount: DAILY_AMOUNT });
    await db.update(agents)
      .set({ crustyCoins: sql`${agents.crustyCoins} + ${DAILY_AMOUNT}` })
      .where(eq(agents.id, agent.id));

    const updatedAgent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, agent.id),
    });

    // Record transaction
    log.debug('Recording daily claim transaction', { agentId: agent.id, balanceAfter: updatedAgent!.crustyCoins });
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: agent.id,
      playerType: 'agent',
      type: 'daily-claim',
      amount: DAILY_AMOUNT,
      balanceAfter: updatedAgent!.crustyCoins,
      description: 'Daily CrustyCoin reward',
      createdAt: now,
    });

    log.info('Daily claim successful', { agentId: agent.id, amount: DAILY_AMOUNT, newBalance: updatedAgent!.crustyCoins, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        amount: DAILY_AMOUNT,
        balance: updatedAgent!.crustyCoins,
        message: `Claimed ${DAILY_AMOUNT} CrustyCoins! 🦞`,
      },
    });
  } catch (error) {
    log.error('Daily claim error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
