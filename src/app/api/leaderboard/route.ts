import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leaderboard } from '@/lib/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('game');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query;
    if (gameType) {
      query = await db.select()
        .from(leaderboard)
        .where(eq(leaderboard.gameType, gameType))
        .orderBy(desc(leaderboard.totalWon))
        .limit(limit);
    } else {
      query = await db.select()
        .from(leaderboard)
        .where(isNull(leaderboard.gameType))
        .orderBy(desc(leaderboard.totalWon))
        .limit(limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        entries: query.map((entry, rank) => ({
          rank: rank + 1,
          playerId: entry.playerId,
          playerName: entry.playerName,
          playerType: entry.playerType,
          totalWagered: entry.totalWagered,
          totalWon: entry.totalWon,
          gamesPlayed: entry.gamesPlayed,
          biggestWin: entry.biggestWin,
        })),
        gameType: gameType || 'global',
      },
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
