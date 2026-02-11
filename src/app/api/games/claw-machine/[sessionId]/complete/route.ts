import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, users, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createLogger } from '@/lib/logger';
import { auth } from '@/lib/auth';

const log = createLogger('API:ClawMachineComplete');

const completeSchema = z.object({
  won: z.boolean(),
  prizeRarity: z.string().optional(),
  prizeValue: z.number().optional(),
  prizeName: z.string().optional(),
});

async function authenticatePlayer(request: Request): Promise<{
  playerId: string;
  playerType: 'user' | 'agent';
} | null> {
  // Try API key auth first (agent)
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

  if (apiKey) {
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (agent) {
      return { playerId: agent.id, playerType: 'agent' };
    }
  }

  // Try session auth (user)
  try {
    const session = await auth();
    if (session?.user?.id) {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, session.user.id),
      });

      if (user) {
        return { playerId: user.id, playerType: 'user' };
      }
    }
  } catch (err) {
    log.debug('Session auth failed or unavailable', { error: err instanceof Error ? err.message : err });
  }

  return null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  log.info('POST /api/games/claw-machine/[sessionId]/complete - Complete game request');
  try {
    const { sessionId } = await params;
    log.debug('Session ID from params', { sessionId });

    const player = await authenticatePlayer(request);

    if (!player) {
      log.warn('Complete rejected - no valid auth', { sessionId });
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    log.debug('Complete params', { sessionId, won: body.won, prizeRarity: body.prizeRarity, prizeValue: body.prizeValue });
    const parsed = completeSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Complete validation failed', { playerId: player.playerId, sessionId, errors: parsed.error.flatten() });
      return NextResponse.json({ success: false, error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { won, prizeRarity, prizeValue, prizeName } = parsed.data;

    // Get game session
    log.debug('Querying game session', { sessionId, playerId: player.playerId });
    const session = await db.query.gameSessions.findFirst({
      where: (gs, { eq, and }) => and(eq(gs.id, sessionId), eq(gs.playerId, player.playerId)),
    });

    if (!session) {
      log.warn('Complete rejected - session not found', { sessionId, playerId: player.playerId });
      return NextResponse.json({ success: false, error: 'Game session not found' }, { status: 404 });
    }

    if (session.status !== 'active') {
      log.warn('Complete rejected - game already completed', { sessionId, status: session.status });
      return NextResponse.json({ success: false, error: 'Game already completed' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    const gameState = JSON.parse(session.gameState || '{}');
    let payout = 0;

    if (won && prizeValue) {
      // Validate prize rarity is within the allowed tiers for this bet
      const allowedTiers = gameState.prizeTier || [];
      if (prizeRarity && allowedTiers.length > 0 && !allowedTiers.includes(prizeRarity)) {
        // Prize rarity doesn't match tier -- still allow it but cap the value
        // This is a client-side physics game, so we trust the general result
        // but apply a sanity cap based on bet amount
        log.warn('Prize rarity outside allowed tier', {
          sessionId,
          prizeRarity,
          allowedTiers,
          prizeValue,
        });
      }

      // Cap the payout to reasonable multiples of the bet
      const maxPayout = session.betAmount * 20;
      payout = Math.min(prizeValue, maxPayout);

      log.debug('Win payout calculated', {
        sessionId,
        prizeValue,
        payout,
        maxPayout,
        bet: session.betAmount,
        prizeName,
        prizeRarity,
      });
    }

    // Update game session to completed
    log.debug('Updating game session to completed', { sessionId, won, payout });
    await db.update(gameSessions)
      .set({
        status: 'completed',
        payout,
        result: JSON.stringify({
          won,
          prizeName: prizeName || null,
          prizeRarity: prizeRarity || null,
          prizeValue: prizeValue || 0,
          payout,
        }),
        completedAt: now,
      })
      .where(eq(gameSessions.id, sessionId));

    // Credit winnings if won
    const table = player.playerType === 'user' ? users : agents;
    const coinsColumn = player.playerType === 'user' ? users.crustyCoins : agents.crustyCoins;

    if (won && payout > 0) {
      log.debug('Crediting winnings', { playerId: player.playerId, payout });
      await db.update(table)
        .set({ crustyCoins: sql`${coinsColumn} + ${payout}` })
        .where(eq(table.id, player.playerId));
    }

    // Get updated balance
    let newBalance: number;
    if (player.playerType === 'user') {
      const updated = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, player.playerId) });
      newBalance = updated?.crustyCoins ?? 0;
    } else {
      const updated = await db.query.agents.findFirst({ where: (a, { eq }) => eq(a.id, player.playerId) });
      newBalance = updated?.crustyCoins ?? 0;
    }

    // Record win transaction
    if (won && payout > 0) {
      log.debug('Recording win transaction', { sessionId, payout, balanceAfter: newBalance });
      await db.insert(transactions).values({
        id: nanoid(),
        playerId: player.playerId,
        playerType: player.playerType,
        type: 'win',
        amount: payout,
        balanceAfter: newBalance,
        gameSessionId: sessionId,
        description: `Claw Machine win: ${prizeName || 'Prize'} (${prizeRarity || 'unknown'}) +${payout} CC`,
        createdAt: now,
      });
    }

    log.info('Claw machine game completed', {
      playerId: player.playerId,
      sessionId,
      won,
      payout,
      prizeName,
      prizeRarity,
      newBalance,
      status: 200,
    });

    return NextResponse.json({
      success: true,
      data: {
        won,
        payout,
        balance: newBalance,
        prize: won ? {
          name: prizeName || null,
          rarity: prizeRarity || null,
          value: prizeValue || 0,
        } : null,
        serverSeed: session.serverSeed, // Reveal for verification after game ends
      },
    });
  } catch (error) {
    log.error('Claw machine complete error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
