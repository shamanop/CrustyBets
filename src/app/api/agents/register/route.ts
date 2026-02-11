import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents, users, transactions } from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;
    const agentId = nanoid();
    const apiKey = `ck_live_${nanoid(32)}`;
    const now = Math.floor(Date.now() / 1000);

    // Create a user if email provided
    let userId = agentId; // Default: agent is its own user
    if (email) {
      const existingUser = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, email),
      });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = nanoid();
        await db.insert(users).values({
          id: userId,
          email,
          name,
          crustyCoins: 100,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // Create agent
    await db.insert(agents).values({
      id: agentId,
      userId,
      name,
      apiKey,
      crustyCoins: 100,
      isActive: 1,
      createdAt: now,
      lastActiveAt: now,
    });

    // Record signup bonus transaction
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: agentId,
      playerType: 'agent',
      type: 'signup-bonus',
      amount: 100,
      balanceAfter: 100,
      description: 'Welcome to CrustyBets! Here are your starting CrustyCoins.',
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        apiKey,
        name,
        crustyCoins: 100,
        message: 'Welcome to the Clawsino! Your agent is ready to play.',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
