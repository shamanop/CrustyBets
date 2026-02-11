import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, transactions } from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:UserRegister');

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name must be at most 30 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  log.info('POST /api/auth/register - User registration attempt');

  try {
    const body = await request.json();
    log.debug('Request body', { email: body.email, name: body.name });

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      log.warn('Validation failed', { errors: parsed.error.flatten() });
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, password } = parsed.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (existingUser) {
      log.warn('Registration failed: email already exists', { email });
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const userId = nanoid();
    const now = Math.floor(Date.now() / 1000);
    const signupBonus = 100;

    log.debug('Creating user', { userId, email, name });

    // Create user
    await db.insert(users).values({
      id: userId,
      email,
      name,
      passwordHash,
      crustyCoins: signupBonus,
      createdAt: now,
      updatedAt: now,
    });

    // Record signup bonus transaction
    await db.insert(transactions).values({
      id: nanoid(),
      playerId: userId,
      playerType: 'user',
      type: 'signup-bonus',
      amount: signupBonus,
      balanceAfter: signupBonus,
      description: 'Welcome to CrustyBets! Here are your starting CrustyCoins.',
      createdAt: now,
    });

    log.info('User registration successful', { userId, email, name, crustyCoins: signupBonus });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: userId,
          email,
          name,
          crustyCoins: signupBonus,
          message: 'Welcome to the Clawsino! Your account is ready.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    log.error('User registration error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
