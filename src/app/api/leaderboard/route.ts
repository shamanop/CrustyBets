import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leaderboard } from '@/lib/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:Leaderboard');

export async function GET(request: Request) {
  log.info('GET /api/leaderboard - Leaderboard query received');
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('game');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    log.debug('Query params', { gameType: gameType || 'global', limit });

    let query;
    if (gameType) {
      log.debug('Querying leaderboard filtered by game type', { gameType });
      query = await db.select()
        .from(leaderboard)
        .where(eq(leaderboard.gameType, gameType))
        .orderBy(desc(leaderboard.totalWon))
        .limit(limit);
    } else {
      log.debug('Querying global leaderboard');
      query = await db.select()
        .from(leaderboard)
        .where(isNull(leaderboard.gameType))
        .orderBy(desc(leaderboard.totalWon))
        .limit(limit);
    }

    log.info('Leaderboard query successful', { gameType: gameType || 'global', resultCount: query.length, limit, status: 200 });
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
    log.error('Leaderboard error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
