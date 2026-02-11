import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, transactions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

const DAILY_AMOUNT = 50;
const COOLDOWN = 24 * 60 * 60; // 24 hours in seconds

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Check last daily claim
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

      return NextResponse.json({
        success: false,
        error: `Daily reward already claimed. Next claim in ${hours}h ${minutes}m.`,
        data: { nextClaimAt, remainingSeconds },
      }, { status: 429 });
    }

    // Credit the daily reward
    await db.update(agents)
      .set({ crustyCoins: sql`${agents.crustyCoins} + ${DAILY_AMOUNT}` })
      .where(eq(agents.id, agent.id));

    const updatedAgent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, agent.id),
    });

    // Record transaction
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

    return NextResponse.json({
      success: true,
      data: {
        amount: DAILY_AMOUNT,
        balance: updatedAgent!.crustyCoins,
        message: `Claimed ${DAILY_AMOUNT} CrustyCoins! 🦞`,
      },
    });
  } catch (error) {
    console.error('Daily claim error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
