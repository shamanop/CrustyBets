import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateServerSeed, generateSlotOutcome, hashServerSeed } from '@/lib/games/provably-fair';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:LobsterSlotsSpin');

const spinSchema = z.object({
  bet: z.number().int().min(1).max(100),
  lines: z.number().int().min(1).max(20).default(1),
});

// Symbol definitions with multipliers
const SYMBOLS = [
  { id: 0, name: 'Golden Lobster', multipliers: { 3: 50, 4: 200, 5: 500 } },
  { id: 1, name: 'King Crab', multipliers: { 3: 25, 4: 100, 5: 250 } },
  { id: 2, name: 'Pearl', multipliers: { 3: 10, 4: 50, 5: 100 } },
  { id: 3, name: 'Treasure Chest', multipliers: { 3: 5, 4: 25, 5: 50 } },
  { id: 4, name: 'Anchor', multipliers: { 3: 3, 4: 10, 5: 25 } },
  { id: 5, name: 'Shell', multipliers: { 3: 2, 4: 5, 5: 10 } },
  { id: 6, name: 'Seaweed', multipliers: { 3: 1, 4: 3, 5: 5 } },
  { id: 7, name: 'Barnacle', multipliers: { 3: 0.5, 4: 1, 5: 2 } },
];

// Weighted symbol distribution (lower index = rarer)
const REEL_WEIGHTS = [1, 2, 4, 6, 8, 12, 16, 20]; // Total: 69
const TOTAL_WEIGHT = REEL_WEIGHTS.reduce((a, b) => a + b, 0);

function weightedSymbol(outcome: number): number {
  let cumulative = 0;
  const scaled = outcome * TOTAL_WEIGHT;
  for (let i = 0; i < REEL_WEIGHTS.length; i++) {
    cumulative += REEL_WEIGHTS[i];
    if (scaled < cumulative) return i;
  }
  return REEL_WEIGHTS.length - 1;
}

function calculateWin(reels: number[], bet: number): { payout: number; matches: number; symbol: number | null } {
  // Simple: check for consecutive matches from left
  const first = reels[0];
  let matches = 1;
  for (let i = 1; i < reels.length; i++) {
    if (reels[i] === first) matches++;
    else break;
  }

  if (matches >= 3) {
    const symbolDef = SYMBOLS[first];
    const multiplier = symbolDef.multipliers[matches as 3 | 4 | 5] || 0;
    return { payout: Math.floor(bet * multiplier), matches, symbol: first };
  }

  return { payout: 0, matches: 0, symbol: null };
}

export async function POST(request: Request) {
  log.info('POST /api/games/lobster-slots/spin - Spin request received');
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      log.warn('Spin rejected - no API key provided');
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    log.debug('Querying agent by API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      log.warn('Spin rejected - invalid API key');
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    log.debug('Agent authenticated', { agentId: agent.id, name: agent.name, balance: agent.crustyCoins });

    const body = await request.json();
    log.debug('Spin request params', { bet: body.bet, lines: body.lines });
    const parsed = spinSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Spin validation failed', { agentId: agent.id, errors: parsed.error.flatten() });
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bet, lines } = parsed.data;
    const totalBet = bet * lines;

    if (agent.crustyCoins < totalBet) {
      log.warn('Spin rejected - insufficient balance', { agentId: agent.id, required: totalBet, available: agent.crustyCoins });
      return NextResponse.json(
        { success: false, error: `Insufficient CrustyCoins. Need ${totalBet}, have ${agent.crustyCoins}.` },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const clientSeed = nanoid(16);
    const sessionId = nanoid();

    // Generate reel outcomes
    const rawOutcomes = generateSlotOutcome(serverSeed, clientSeed, 0, 5, 1000);
    const reels = rawOutcomes.map(o => weightedSymbol(o / 1000));
    log.debug('Reel outcomes generated', { sessionId, reels, symbols: reels.map(r => SYMBOLS[r].name) });

    // Calculate winnings
    const { payout, matches, symbol } = calculateWin(reels, totalBet);
    log.debug('Win calculation complete', { sessionId, payout, matches, winningSymbol: symbol !== null ? SYMBOLS[symbol].name : null });

    // Deduct bet
    log.debug('Deducting bet', { agentId: agent.id, totalBet });
    await db.update(agents)
      .set({ crustyCoins: sql`${agents.crustyCoins} - ${totalBet}` })
      .where(eq(agents.id, agent.id));

    // Add winnings if any
    if (payout > 0) {
      log.debug('Crediting payout', { agentId: agent.id, payout });
      await db.update(agents)
        .set({ crustyCoins: sql`${agents.crustyCoins} + ${payout}` })
        .where(eq(agents.id, agent.id));
    }

    const updatedAgent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, agent.id),
    });

    // Record game session
    log.debug('Recording game session', { sessionId, gameType: 'lobster-slots' });
    await db.insert(gameSessions).values({
      id: sessionId,
      gameType: 'lobster-slots',
      playerId: agent.id,
      playerType: 'agent',
      status: 'completed',
      betAmount: totalBet,
      payout,
      gameState: JSON.stringify({ reels, symbols: reels.map(r => SYMBOLS[r].name) }),
      result: JSON.stringify({ reels, matches, symbol: symbol !== null ? SYMBOLS[symbol].name : null, payout }),
      serverSeed,
      clientSeed,
      nonce: 0,
      createdAt: now,
      completedAt: now,
    });

    // Record transactions
    log.debug('Recording bet transaction', { sessionId, amount: -totalBet });
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: agent.id,
      playerType: 'agent',
      type: 'bet',
      amount: -totalBet,
      balanceAfter: updatedAgent!.crustyCoins - (payout > 0 ? payout : 0), // approximate
      gameSessionId: sessionId,
      description: `Lobster Slots spin: ${totalBet} CC`,
      createdAt: now,
    });

    if (payout > 0) {
      log.debug('Recording win transaction', { sessionId, payout });
      await db.insert(transactions).values({
        id: nanoid(),
        playerId: agent.id,
        playerType: 'agent',
        type: 'win',
        amount: payout,
        balanceAfter: updatedAgent!.crustyCoins,
        gameSessionId: sessionId,
        description: `Lobster Slots win: ${matches}x ${symbol !== null ? SYMBOLS[symbol].name : 'match'}!`,
        createdAt: now,
      });
    }

    log.info('Spin completed', { agentId: agent.id, sessionId, bet: totalBet, payout, netResult: payout - totalBet, newBalance: updatedAgent!.crustyCoins, status: 200 });
    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        reels: reels.map(r => ({ id: r, name: SYMBOLS[r].name })),
        bet: totalBet,
        payout,
        netResult: payout - totalBet,
        matches,
        winningSymbol: symbol !== null ? SYMBOLS[symbol].name : null,
        balance: updatedAgent!.crustyCoins,
        provablyFair: {
          serverSeedHash,
          clientSeed,
          nonce: 0,
          serverSeed, // Revealed immediately for slots (single-round game)
        },
      },
    });
  } catch (error) {
    log.error('Slot spin error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
