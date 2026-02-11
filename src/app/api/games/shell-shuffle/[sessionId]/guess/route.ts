import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, gameSessions, transactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const guessSchema = z.object({
  shell: z.number().int().min(0).max(2),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
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
    const parsed = guessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const { shell } = parsed.data;

    // Get game session
    const session = await db.query.gameSessions.findFirst({
      where: (gs, { eq, and }) => and(eq(gs.id, sessionId), eq(gs.playerId, agent.id)),
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Game session not found' }, { status: 404 });
    }

    if (session.status !== 'active') {
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

    // Update game session
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
      await db.update(agents)
        .set({ crustyCoins: sql`${agents.crustyCoins} + ${payout}` })
        .where(eq(agents.id, agent.id));
    }

    const updatedAgent = await db.query.agents.findFirst({
      where: (a, { eq }) => eq(a.id, agent.id),
    });

    // Record transaction
    if (won) {
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
    console.error('Shell guess error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
