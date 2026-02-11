import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, users, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateServerSeed, generateRouletteOutcome, hashServerSeed } from '@/lib/games/provably-fair';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:CrabRoulette');

// ─── Constants ──────────────────────────────────────────────────────────────

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const COLUMN_1ST = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const COLUMN_2ND = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const COLUMN_3RD = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

// ─── Validation ─────────────────────────────────────────────────────────────

const betSchema = z.object({
  type: z.enum(['straight', 'color', 'parity', 'half', 'dozen', 'column']),
  value: z.union([z.string(), z.number()]),
  amount: z.number().int().min(1),
});

const rouletteBetsSchema = z.object({
  bets: z.array(betSchema).min(1),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function getColor(n: number): 'gold' | 'red' | 'blue' {
  if (n === 0) return 'gold';
  return RED_NUMBERS.includes(n) ? 'red' : 'blue';
}

function calculateBetPayout(bet: { type: string; value: string | number; amount: number }, resultNumber: number): number {
  const color = getColor(resultNumber);

  switch (bet.type) {
    case 'straight': {
      const target = typeof bet.value === 'string' ? parseInt(bet.value, 10) : bet.value;
      if (target === resultNumber) return bet.amount * 35;
      return 0;
    }
    case 'color': {
      // 0 (gold) loses all color bets
      if (resultNumber === 0) return 0;
      if (bet.value === color) return bet.amount * 2;
      return 0;
    }
    case 'parity': {
      // 0 is neither odd nor even
      if (resultNumber === 0) return 0;
      const isOdd = resultNumber % 2 !== 0;
      if ((bet.value === 'odd' && isOdd) || (bet.value === 'even' && !isOdd)) return bet.amount * 2;
      return 0;
    }
    case 'half': {
      if (resultNumber === 0) return 0;
      if (bet.value === '1-18' && resultNumber >= 1 && resultNumber <= 18) return bet.amount * 2;
      if (bet.value === '19-36' && resultNumber >= 19 && resultNumber <= 36) return bet.amount * 2;
      return 0;
    }
    case 'dozen': {
      if (resultNumber === 0) return 0;
      if (bet.value === '1-12' && resultNumber >= 1 && resultNumber <= 12) return bet.amount * 3;
      if (bet.value === '13-24' && resultNumber >= 13 && resultNumber <= 24) return bet.amount * 3;
      if (bet.value === '25-36' && resultNumber >= 25 && resultNumber <= 36) return bet.amount * 3;
      return 0;
    }
    case 'column': {
      if (resultNumber === 0) return 0;
      if (bet.value === '1st' && COLUMN_1ST.includes(resultNumber)) return bet.amount * 3;
      if (bet.value === '2nd' && COLUMN_2ND.includes(resultNumber)) return bet.amount * 3;
      if (bet.value === '3rd' && COLUMN_3RD.includes(resultNumber)) return bet.amount * 3;
      return 0;
    }
    default:
      return 0;
  }
}

// ─── Auth helper ────────────────────────────────────────────────────────────

interface AuthResult {
  playerId: string;
  playerType: 'user' | 'agent';
  getName: () => string;
  getBalance: () => number;
  updateBalance: (delta: number) => Promise<void>;
  fetchBalance: () => Promise<number>;
}

async function authenticateRequest(request: Request): Promise<AuthResult | NextResponse> {
  // Try API key auth first (agent)
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

  if (apiKey) {
    log.debug('Attempting agent auth via API key');
    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      log.warn('Auth rejected - invalid API key');
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    log.debug('Agent authenticated', { agentId: agent.id, name: agent.name, balance: agent.crustyCoins });
    return {
      playerId: agent.id,
      playerType: 'agent',
      getName: () => agent.name,
      getBalance: () => agent.crustyCoins,
      updateBalance: async (delta: number) => {
        await db.update(agents)
          .set({ crustyCoins: sql`${agents.crustyCoins} + ${delta}` })
          .where(eq(agents.id, agent.id));
      },
      fetchBalance: async () => {
        const updated = await db.query.agents.findFirst({
          where: (a, { eq }) => eq(a.id, agent.id),
        });
        return updated?.crustyCoins ?? 0;
      },
    };
  }

  // Try session cookie auth (user) - check for next-auth session token
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionToken = extractCookieValue(cookieHeader, 'next-auth.session-token')
    || extractCookieValue(cookieHeader, '__Secure-next-auth.session-token');

  if (sessionToken) {
    log.debug('Attempting user auth via session cookie');
    // For now, look up the user associated with this session
    // next-auth stores sessions in its own way; we'll look up the user directly
    // Since next-auth isn't fully configured, we use a simple lookup
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, sessionToken),
    });

    if (user) {
      log.debug('User authenticated via session', { userId: user.id, name: user.name, balance: user.crustyCoins });
      return {
        playerId: user.id,
        playerType: 'user',
        getName: () => user.name,
        getBalance: () => user.crustyCoins,
        updateBalance: async (delta: number) => {
          await db.update(users)
            .set({ crustyCoins: sql`${users.crustyCoins} + ${delta}` })
            .where(eq(users.id, user.id));
        },
        fetchBalance: async () => {
          const updated = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, user.id),
          });
          return updated?.crustyCoins ?? 0;
        },
      };
    }
  }

  log.warn('Auth rejected - no valid credentials');
  return NextResponse.json({ success: false, error: 'Authentication required. Provide an API key or log in.' }, { status: 401 });
}

function extractCookieValue(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── POST handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  log.info('POST /api/games/crab-roulette - Roulette spin request received');
  try {
    // Authenticate
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) return authResult;

    const { playerId, playerType } = authResult;

    // Parse and validate body
    const body = await request.json();
    log.debug('Roulette request params', { playerId, playerType, betsCount: body.bets?.length });
    const parsed = rouletteBetsSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Roulette validation failed', { playerId, errors: parsed.error.flatten() });
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bets } = parsed.data;

    // Calculate total bet
    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    log.debug('Total bet calculated', { playerId, totalBet, betCount: bets.length });

    // Check balance
    const currentBalance = authResult.getBalance();
    if (currentBalance < totalBet) {
      log.warn('Roulette rejected - insufficient balance', { playerId, required: totalBet, available: currentBalance });
      return NextResponse.json(
        { success: false, error: `Insufficient CrustyCoins. Need ${totalBet}, have ${currentBalance}.` },
        { status: 400 }
      );
    }

    // Generate provably fair outcome
    const now = Math.floor(Date.now() / 1000);
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const clientSeed = nanoid(16);
    const sessionId = nanoid();

    const resultNumber = generateRouletteOutcome(serverSeed, clientSeed, 0);
    const resultColor = getColor(resultNumber);
    log.debug('Roulette outcome generated', { sessionId, resultNumber, resultColor });

    // Calculate payouts for each bet
    let totalPayout = 0;
    const betResults = bets.map((bet) => {
      const payout = calculateBetPayout(bet, resultNumber);
      totalPayout += payout;
      return { ...bet, payout };
    });
    log.debug('Payout calculation complete', { sessionId, totalBet, totalPayout, netResult: totalPayout - totalBet });

    // Deduct total bet
    log.debug('Deducting bet', { playerId, totalBet });
    await authResult.updateBalance(-totalBet);

    // Credit payout if any
    if (totalPayout > 0) {
      log.debug('Crediting payout', { playerId, totalPayout });
      await authResult.updateBalance(totalPayout);
    }

    // Fetch updated balance
    const newBalance = await authResult.fetchBalance();

    // Record game session
    log.debug('Recording game session', { sessionId, gameType: 'crab-roulette' });
    await db.insert(gameSessions).values({
      id: sessionId,
      gameType: 'crab-roulette',
      playerId,
      playerType,
      status: 'completed',
      betAmount: totalBet,
      payout: totalPayout,
      gameState: JSON.stringify({ bets: betResults }),
      result: JSON.stringify({ number: resultNumber, color: resultColor, betResults }),
      serverSeed,
      clientSeed,
      nonce: 0,
      createdAt: now,
      completedAt: now,
    });

    // Record bet transaction
    log.debug('Recording bet transaction', { sessionId, amount: -totalBet });
    await db.insert(transactions).values({
      id: nanoid(),
      playerId,
      playerType,
      type: 'bet',
      amount: -totalBet,
      balanceAfter: totalPayout > 0 ? newBalance - totalPayout : newBalance,
      gameSessionId: sessionId,
      description: `Crab Roulette bet: ${totalBet} CC on ${bets.length} position(s)`,
      createdAt: now,
    });

    // Record win transaction if payout > 0
    if (totalPayout > 0) {
      log.debug('Recording win transaction', { sessionId, totalPayout });
      await db.insert(transactions).values({
        id: nanoid(),
        playerId,
        playerType,
        type: 'win',
        amount: totalPayout,
        balanceAfter: newBalance,
        gameSessionId: sessionId,
        description: `Crab Roulette win: ${resultNumber} (${resultColor})! Payout ${totalPayout} CC`,
        createdAt: now,
      });
    }

    log.info('Roulette spin completed', {
      playerId,
      playerType,
      sessionId,
      totalBet,
      totalPayout,
      netResult: totalPayout - totalBet,
      resultNumber,
      resultColor,
      newBalance,
      status: 200,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        result: {
          number: resultNumber,
          color: resultColor,
        },
        bets: betResults,
        totalBet,
        totalPayout,
        balance: newBalance,
        provablyFair: {
          serverSeedHash,
          clientSeed,
          serverSeed, // Revealed immediately (single-round game)
        },
      },
    });
  } catch (error) {
    log.error('Crab roulette error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
