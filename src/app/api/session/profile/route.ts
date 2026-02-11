import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { gameSessions, transactions } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:SessionProfile');

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user from DB for accurate data
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Aggregate game stats
    const gameStats = await db
      .select({
        gameType: gameSessions.gameType,
        gamesPlayed: sql<number>`count(*)`.as('games_played'),
        totalWagered: sql<number>`coalesce(sum(${gameSessions.betAmount}), 0)`.as('total_wagered'),
        totalWon: sql<number>`coalesce(sum(${gameSessions.payout}), 0)`.as('total_won'),
        biggestWin: sql<number>`coalesce(max(${gameSessions.payout}), 0)`.as('biggest_win'),
      })
      .from(gameSessions)
      .where(and(
        eq(gameSessions.playerId, userId),
        eq(gameSessions.status, 'completed')
      ))
      .groupBy(gameSessions.gameType);

    // Totals across all games
    const totals = gameStats.reduce(
      (acc, g) => ({
        gamesPlayed: acc.gamesPlayed + g.gamesPlayed,
        totalWagered: acc.totalWagered + g.totalWagered,
        totalWon: acc.totalWon + g.totalWon,
        biggestWin: Math.max(acc.biggestWin, g.biggestWin),
      }),
      { gamesPlayed: 0, totalWagered: 0, totalWon: 0, biggestWin: 0 }
    );

    // Per-game breakdowns
    const perGame: Record<string, { gamesPlayed: number; totalWon: number }> = {};
    for (const g of gameStats) {
      perGame[g.gameType] = { gamesPlayed: g.gamesPlayed, totalWon: g.totalWon };
    }

    log.info('Profile fetched', { userId, gamesPlayed: totals.gamesPlayed });
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          crustyCoins: user.crustyCoins,
          createdAt: user.createdAt,
        },
        stats: {
          ...totals,
          perGame,
        },
      },
    });
  } catch (error) {
    log.error('Session profile error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
