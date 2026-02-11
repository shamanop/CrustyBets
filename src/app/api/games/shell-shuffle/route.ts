import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { agents, users, gameSessions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateServerSeed, generateOutcomeInRange, hashServerSeed } from '@/lib/games/provably-fair';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:ShellShuffle');

const createSchema = z.object({
  bet: z.number().int().min(5).max(25),
  difficulty: z.number().int().min(1).max(5).default(1),
});

// Helper: resolve player from either API key (agent) or cookie (user)
async function resolvePlayer(request: Request): Promise<{
  playerId: string;
  playerType: 'agent' | 'user';
  balance: number;
  name: string;
} | null> {
  // 1. Try API key auth (agents)
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  if (apiKey) {
    log.debug('Attempting agent auth via API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });
    if (agent) {
      log.debug('Agent authenticated', { agentId: agent.id, name: agent.name, balance: agent.crustyCoins });
      return { playerId: agent.id, playerType: 'agent', balance: agent.crustyCoins, name: agent.name };
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
        log.debug('User authenticated via cookie', { userId: user.id, name: user.name, balance: user.crustyCoins });
        return { playerId: user.id, playerType: 'user', balance: user.crustyCoins, name: user.name };
      }
      log.warn('Cookie user ID not found in database', { userId: userIdCookie.value });
    }
  } catch (err) {
    log.debug('Cookie auth check failed', { error: err instanceof Error ? err.message : err });
  }

  return null;
}

export async function POST(request: Request) {
  log.info('POST /api/games/shell-shuffle - New game creation request');
  try {
    const player = await resolvePlayer(request);

    if (!player) {
      log.warn('Shell shuffle create rejected - no valid auth');
      return NextResponse.json({ success: false, error: 'Authentication required. Provide an API key or log in.' }, { status: 401 });
    }

    const body = await request.json();
    log.debug('Game creation params', { bet: body.bet, difficulty: body.difficulty });
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Shell shuffle validation failed', { playerId: player.playerId, errors: parsed.error.flatten() });
      return NextResponse.json({ success: false, error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { bet, difficulty } = parsed.data;

    if (player.balance < bet) {
      log.warn('Shell shuffle rejected - insufficient balance', { playerId: player.playerId, required: bet, available: player.balance });
      return NextResponse.json({ success: false, error: 'Insufficient CrustyCoins', balance: player.balance }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    const serverSeed = generateServerSeed();
    const clientSeed = nanoid(16);
    const sessionId = nanoid();

    // Pearl position (0, 1, or 2)
    const pearlPosition = generateOutcomeInRange(serverSeed, clientSeed, 0, 0, 2);
    log.debug('Pearl placement determined', { sessionId, pearlPosition });

    // Generate shuffle sequence (3 + difficulty * 2 swaps)
    const shuffleCount = 3 + difficulty * 2;
    const shuffleSequence: [number, number][] = [];
    for (let i = 0; i < shuffleCount; i++) {
      const a = generateOutcomeInRange(serverSeed, clientSeed, i + 1, 0, 2);
      let b = generateOutcomeInRange(serverSeed, clientSeed, i + 100, 0, 1);
      if (b >= a) b += 1; // Ensure a !== b
      shuffleSequence.push([a, b]);
    }
    log.debug('Shuffle sequence generated', { sessionId, difficulty, shuffleCount, shuffleSequenceLength: shuffleSequence.length });

    // Deduct bet from appropriate table
    if (player.playerType === 'agent') {
      log.debug('Deducting bet from agent', { playerId: player.playerId, bet });
      await db.update(agents)
        .set({ crustyCoins: sql`${agents.crustyCoins} - ${bet}` })
        .where(eq(agents.id, player.playerId));
    } else {
      log.debug('Deducting bet from user', { playerId: player.playerId, bet });
      await db.update(users)
        .set({ crustyCoins: sql`${users.crustyCoins} - ${bet}` })
        .where(eq(users.id, player.playerId));
    }

    // Create game session
    log.debug('Creating game session', { sessionId, gameType: 'shell-shuffle' });
    await db.insert(gameSessions).values({
      id: sessionId,
      gameType: 'shell-shuffle',
      playerId: player.playerId,
      playerType: player.playerType,
      status: 'active',
      betAmount: bet,
      payout: 0,
      gameState: JSON.stringify({ pearlPosition, shuffleSequence, difficulty, phase: 'watching' }),
      serverSeed,
      clientSeed,
      nonce: 0,
      createdAt: now,
    });

    log.info('Shell shuffle game created', { playerId: player.playerId, playerType: player.playerType, sessionId, difficulty, bet, shuffleCount, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        difficulty,
        shuffleCount,
        shuffleSequence, // Client needs this to animate
        bet,
        balance: player.balance - bet,
        provablyFair: {
          serverSeedHash: hashServerSeed(serverSeed),
          clientSeed,
        },
        message: 'Watch the shells carefully...',
      },
    });
  } catch (error) {
    log.error('Shell shuffle create error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
