import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:ShellShuffleGuess');

const guessSchema = z.object({
  shell: z.number().int().min(0).max(2),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  log.info('POST /api/games/shell-shuffle/[sessionId]/guess - Guess attempt received');
  try {
    const { sessionId } = await params;
    log.debug('Session ID from params', { sessionId });
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      log.warn('Guess rejected - no API key provided', { sessionId });
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    log.debug('Querying agent by API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      log.warn('Guess rejected - invalid API key', { sessionId });
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    log.debug('Agent authenticated', { agentId: agent.id, sessionId });

    const body = await request.json();
    log.debug('Guess params', { shell: body.shell, sessionId });
    const parsed = guessSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Guess validation failed', { agentId: agent.id, sessionId });
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const { shell } = parsed.data;

    // Get game session
    log.debug('Querying game session', { sessionId, agentId: agent.id });
    const session = await db.query.gameSessions.findFirst({
      where: (gs, { eq, and }) => and(eq(gs.id, sessionId), eq(gs.playerId, agent.id)),
    });

    if (!session) {
      log.warn('Guess rejected - session not found', { sessionId, agentId: agent.id });
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

    // Credit winnings
    if (won) {
      log.debug('Crediting winnings', { agentId: agent.id, payout });
      await db.update(agents)
        .set({ crustyCoins: sql`${agents.crustyCoins} + ${payout}` })
        .where(eq(agents.id, agent.id));
    }

    const updatedAgent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, agent.id),
    });

    // Record transaction
    if (won) {
      log.debug('Recording win transaction', { sessionId, payout, balanceAfter: updatedAgent!.crustyCoins });
      await db.insert(transactions).values({
        id: nanoid(),
        playerId: agent.id,
        playerType: 'agent',
        type: 'win',
        amount: payout,
        balanceAfter: updatedAgent!.crustyCoins,
        gameSessionId: sessionId,
        description: `Shell Shuffle win! Found the pearl!`,
        createdAt: now,
      });
    }

    log.info('Guess completed', { agentId: agent.id, sessionId, won, payout, newBalance: updatedAgent!.crustyCoins, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        won,
        guess: shell,
        pearlPosition: currentPearlPos,
        payout,
        balance: updatedAgent!.crustyCoins,
        serverSeed: session.serverSeed, // Reveal for verification
        message: won ? 'You found the pearl! 🐚' : 'Not this time... The pearl was elsewhere.',
      },
    });
  } catch (error) {
    log.error('Shell guess error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
