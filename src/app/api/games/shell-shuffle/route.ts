import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, gameSessions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateServerSeed, generateOutcomeInRange, hashServerSeed } from '@/lib/games/provably-fair';

const createSchema = z.object({
  bet: z.number().int().min(5).max(25),
  difficulty: z.number().int().min(1).max(5).default(1),
});

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 });
    }

    const agent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.apiKey, apiKey),
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { bet, difficulty } = parsed.data;

    if (agent.crustyCoins < bet) {
      return NextResponse.json({ success: false, error: 'Insufficient CrustyCoins' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    const serverSeed = generateServerSeed();
    const clientSeed = nanoid(16);
    const sessionId = nanoid();

    // Pearl position (0, 1, or 2)
    const pearlPosition = generateOutcomeInRange(serverSeed, clientSeed, 0, 0, 2);

    // Generate shuffle sequence (3 + difficulty * 2 swaps)
    const shuffleCount = 3 + difficulty * 2;
    const shuffleSequence: [number, number][] = [];
    for (let i = 0; i < shuffleCount; i++) {
      const a = generateOutcomeInRange(serverSeed, clientSeed, i + 1, 0, 2);
      let b = generateOutcomeInRange(serverSeed, clientSeed, i + 100, 0, 1);
      if (b >= a) b += 1; // Ensure a !== b
      shuffleSequence.push([a, b]);
    }

    // Deduct bet
    await db.update(agents)
      .set({ crustyCoins: sql`${agents.crustyCoins} - ${bet}` })
      .where(eq(agents.id, agent.id));

    // Create game session
    await db.insert(gameSessions).values({
      id: sessionId,
      gameType: 'shell-shuffle',
      playerId: agent.id,
      playerType: 'agent',
      status: 'active',
      betAmount: bet,
      payout: 0,
      gameState: JSON.stringify({ pearlPosition, shuffleSequence, difficulty, phase: 'watching' }),
      serverSeed,
      clientSeed,
      nonce: 0,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        difficulty,
        shuffleCount,
        shuffleSequence, // Client needs this to animate
        bet,
        provablyFair: {
          serverSeedHash: hashServerSeed(serverSeed),
          clientSeed,
        },
        message: 'Watch the shells carefully...',
      },
    });
  } catch (error) {
    console.error('Shell shuffle create error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
