import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, transactions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:SessionClaimDaily');

const DAILY_AMOUNT = 50;
const COOLDOWN = 24 * 60 * 60; // 24 hours in seconds

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = Math.floor(Date.now() / 1000);

    // Check last daily claim
    const lastClaim = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.playerId, userId),
        eq(transactions.type, 'daily-claim')
      ))
      .orderBy(desc(transactions.createdAt))
      .limit(1);

    if (lastClaim.length > 0 && (now - lastClaim[0].createdAt) < COOLDOWN) {
      const nextClaimAt = lastClaim[0].createdAt + COOLDOWN;
      const remainingSeconds = nextClaimAt - now;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);

      log.info('Daily claim rejected - cooldown active', { userId, remainingSeconds });
      return NextResponse.json({
        success: false,
        error: `Daily reward already claimed. Next claim in ${hours}h ${minutes}m.`,
        data: { nextClaimAt, remainingSeconds },
      }, { status: 429 });
    }

    // Credit the daily reward
    await db.update(users)
      .set({ crustyCoins: sql`${users.crustyCoins} + ${DAILY_AMOUNT}` })
      .where(eq(users.id, userId));

    const updatedUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    // Record transaction
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: userId,
      playerType: 'user',
      type: 'daily-claim',
      amount: DAILY_AMOUNT,
      balanceAfter: updatedUser!.crustyCoins,
      description: 'Daily CrustyCoin reward',
      createdAt: now,
    });

    log.info('Daily claim successful', { userId, amount: DAILY_AMOUNT, newBalance: updatedUser!.crustyCoins });
    return NextResponse.json({
      success: true,
      data: {
        amount: DAILY_AMOUNT,
        balance: updatedUser!.crustyCoins,
        message: `Claimed ${DAILY_AMOUNT} CrustyCoins!`,
      },
    });
  } catch (error) {
    log.error('Session daily claim error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
