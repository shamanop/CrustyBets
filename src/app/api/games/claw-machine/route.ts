import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, users, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateServerSeed, hashServerSeed } from '@/lib/games/provably-fair';
import { createLogger } from '@/lib/logger';
import { auth } from '@/lib/auth';

const log = createLogger('API:ClawMachine');

const VALID_BETS = [10, 25, 50] as const;

const createSchema = z.object({
  bet: z.number().int().refine((v) => VALID_BETS.includes(v as typeof VALID_BETS[number]), {
    message: 'Bet must be 10, 25, or 50',
  }),
});

// Prize tiers based on bet amount
const PRIZE_TIERS: Record<number, string[]> = {
  10: ['common', 'uncommon'],
  25: ['uncommon', 'rare'],
  50: ['rare', 'epic', 'legendary'],
};

async function authenticatePlayer(request: Request): Promise<{
  playerId: string;
  playerType: 'user' | 'agent';
  crustyCoins: number;
} | null> {
  // Try API key auth first (agent)
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

  if (apiKey) {
    log.debug('Attempting agent auth via API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (agent) {
      log.debug('Agent authenticated', { agentId: agent.id, name: agent.name, balance: agent.crustyCoins });
      return { playerId: agent.id, playerType: 'agent', crustyCoins: agent.crustyCoins };
    }
  }

  // Try session auth (user)
  try {
    const session = await auth();
    if (session?.user?.id) {
      log.debug('Attempting user session auth', { userId: session.user.id });
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, session.user.id),
      });

      if (user) {
        log.debug('User authenticated via session', { userId: user.id, name: user.name, balance: user.crustyCoins });
        return { playerId: user.id, playerType: 'user', crustyCoins: user.crustyCoins };
      }
    }
  } catch (err) {
    log.debug('Session auth failed or unavailable', { error: err instanceof Error ? err.message : err });
  }

  return null;
}

export async function POST(request: Request) {
  log.info('POST /api/games/claw-machine - New claw machine game request');
  try {
    const player = await authenticatePlayer(request);

    if (!player) {
      log.warn('Claw machine create rejected - no valid auth');
      return NextResponse.json({ success: false, error: 'Authentication required. Provide an API key or sign in.' }, { status: 401 });
    }

    const body = await request.json();
    log.debug('Game creation params', { bet: body.bet, playerId: player.playerId, playerType: player.playerType });
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Claw machine validation failed', { playerId: player.playerId, errors: parsed.error.flatten() });
      return NextResponse.json({ success: false, error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { bet } = parsed.data;

    if (player.crustyCoins < bet) {
      log.warn('Claw machine rejected - insufficient balance', {
        playerId: player.playerId,
        required: bet,
        available: player.crustyCoins,
      });
      return NextResponse.json(
        { success: false, error: `Insufficient CrustyCoins. Need ${bet}, have ${player.crustyCoins}.` },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const serverSeed = generateServerSeed();
    const clientSeed = nanoid(16);
    const sessionId = nanoid();
    const prizeTier = PRIZE_TIERS[bet];

    // Deduct bet
    const table = player.playerType === 'user' ? users : agents;
    const coinsColumn = player.playerType === 'user' ? users.crustyCoins : agents.crustyCoins;
    log.debug('Deducting bet', { playerId: player.playerId, bet });
    await db.update(table)
      .set({ crustyCoins: sql`${coinsColumn} - ${bet}` })
      .where(eq(table.id, player.playerId));

    // Get updated balance
    let newBalance: number;
    if (player.playerType === 'user') {
      const updated = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, player.playerId) });
      newBalance = updated?.crustyCoins ?? 0;
    } else {
      const updated = await db.query.agents.findFirst({ where: (a, { eq }) => eq(a.id, player.playerId) });
      newBalance = updated?.crustyCoins ?? 0;
    }

    // Record bet transaction
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: player.playerId,
      playerType: player.playerType,
      type: 'bet',
      amount: -bet,
      balanceAfter: newBalance,
      gameSessionId: sessionId,
      description: `Claw Machine bet: ${bet} CC`,
      createdAt: now,
    });

    // Create game session
    log.debug('Creating game session', { sessionId, gameType: 'claw-machine' });
    await db.insert(gameSessions).values({
      id: sessionId,
      gameType: 'claw-machine',
      playerId: player.playerId,
      playerType: player.playerType,
      status: 'active',
      betAmount: bet,
      payout: 0,
      gameState: JSON.stringify({ bet, prizeTier, timeLimit: 30 }),
      serverSeed,
      clientSeed,
      nonce: 0,
      createdAt: now,
    });

    log.info('Claw machine game created', {
      playerId: player.playerId,
      playerType: player.playerType,
      sessionId,
      bet,
      prizeTier,
      balance: newBalance,
      status: 200,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        bet,
        timeLimit: 30,
        prizeTier,
        balance: newBalance,
        provablyFair: {
          serverSeedHash: hashServerSeed(serverSeed),
          clientSeed,
        },
      },
    });
  } catch (error) {
    log.error('Claw machine create error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
