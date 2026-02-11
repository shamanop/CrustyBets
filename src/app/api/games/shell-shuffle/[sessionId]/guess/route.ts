import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { agents, users, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:ShellShuffleGuess');

const guessSchema = z.object({
  shell: z.number().int().min(0).max(2),
});

// Helper: resolve player from either API key (agent) or cookie (user)
async function resolvePlayer(request: Request): Promise<{
  playerId: string;
  playerType: 'agent' | 'user';
} | null> {
  // 1. Try API key auth (agents)
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  if (apiKey) {
    log.debug('Attempting agent auth via API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });
    if (agent) {
      log.debug('Agent authenticated', { agentId: agent.id });
      return { playerId: agent.id, playerType: 'agent' };
    }
    log.warn('Invalid API key provided');
  }

  // 2. Try cookie-based auth (human users)
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('crusty-user-id');
    if (userIdCookie?.value) {
      log.debug('Attempting user auth via cookie', { userId: userIdCookie.value });
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userIdCookie.value),
      });
      if (user) {
        log.debug('User authenticated via cookie', { userId: user.id });
        return { playerId: user.id, playerType: 'user' };
      }
      log.warn('Cookie user ID not found in database', { userId: userIdCookie.value });
    }
  } catch (err) {
    log.debug('Cookie auth check failed', { error: err instanceof Error ? err.message : err });
  }

  return null;
}

// Helper: get current balance for a player
async function getPlayerBalance(playerId: string, playerType: 'agent' | 'user'): Promise<number> {
  if (playerType === 'agent') {
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, playerId),
    });
    return agent?.crustyCoins ?? 0;
  } else {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, playerId),
    });
    return user?.crustyCoins ?? 0;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  log.info('POST /api/games/shell-shuffle/[sessionId]/guess - Guess attempt received');
  try {
    const { sessionId } = await params;
    log.debug('Session ID from params', { sessionId });

    const player = await resolvePlayer(request);

    if (!player) {
      log.warn('Guess rejected - no valid auth', { sessionId });
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    log.debug('Guess params', { shell: body.shell, sessionId });
    const parsed = guessSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Guess validation failed', { playerId: player.playerId, sessionId });
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const { shell } = parsed.data;

    // Get game session - must belong to this player
    log.debug('Querying game session', { sessionId, playerId: player.playerId });
    const session = await db.query.gameSessions.findFirst({
      where: (gs, { eq, and }) => and(eq(gs.id, sessionId), eq(gs.playerId, player.playerId)),
    });

    if (!session) {
      log.warn('Guess rejected - session not found', { sessionId, playerId: player.playerId });
      return NextResponse.json({ success: false, error: 'Game session not found' }, { status: 404 });
    }

    if (session.status !== 'active') {
      log.warn('Guess rejected - game already completed', { sessionId, status: session.status });
      return NextResponse.json({ success: false, error: 'Game already completed' }, { status: 400 });
    }

    const gameState = JSON.parse(session.gameState || '{}');
    const pearlPosition = gameState.pearlPosition;

    // Track pearl through shuffles
    let currentPearlPos = pearlPosition;
    for (const [a, b] of gameState.shuffleSequence) {
      if (currentPearlPos === a) currentPearlPos = b;
      else if (currentPearlPos === b) currentPearlPos = a;
    }

    const won = shell === currentPearlPos;
    const now = Math.floor(Date.now() / 1000);
    const payout = won ? session.betAmount * 2 : 0; // 2x payout on win
    log.debug('Guess evaluated', { sessionId, guessedShell: shell, actualPearlPos: currentPearlPos, won, payout });

    // Update game session
    log.debug('Updating game session to completed', { sessionId });
    await db.update(gameSessions)
      .set({
        status: 'completed',
        payout,
        result: JSON.stringify({ guess: shell, pearlPosition: currentPearlPos, won, payout }),
        completedAt: now,
      })
      .where(eq(gameSessions.id, sessionId));

    // Credit winnings to the appropriate table
    if (won) {
      if (player.playerType === 'agent') {
        log.debug('Crediting winnings to agent', { playerId: player.playerId, payout });
        await db.update(agents)
          .set({ crustyCoins: sql`${agents.crustyCoins} + ${payout}` })
          .where(eq(agents.id, player.playerId));
      } else {
        log.debug('Crediting winnings to user', { playerId: player.playerId, payout });
        await db.update(users)
          .set({ crustyCoins: sql`${users.crustyCoins} + ${payout}` })
          .where(eq(users.id, player.playerId));
      }
    }

    const currentBalance = await getPlayerBalance(player.playerId, player.playerType);

    // Record transaction
    if (won) {
      log.debug('Recording win transaction', { sessionId, payout, balanceAfter: currentBalance });
      await db.insert(transactions).values({
        id: nanoid(),
        playerId: player.playerId,
        playerType: player.playerType,
        type: 'win',
        amount: payout,
        balanceAfter: currentBalance,
        gameSessionId: sessionId,
        description: `Shell Shuffle win! Found the pearl!`,
        createdAt: now,
      });
    }

    log.info('Guess completed', { playerId: player.playerId, playerType: player.playerType, sessionId, won, payout, newBalance: currentBalance, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        won,
        guess: shell,
        pearlPosition: currentPearlPos,
        payout,
        balance: currentBalance,
        serverSeed: session.serverSeed, // Reveal for verification
        message: won ? 'You found the pearl!' : 'Not this time... The pearl was elsewhere.',
      },
    });
  } catch (error) {
    log.error('Shell guess error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
