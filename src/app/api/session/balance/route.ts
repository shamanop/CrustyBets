import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createLogger } from '@/lib/logger';

const log = createLogger('API:SessionBalance');

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, session.user.id),
    });

    if (!user) {
      log.warn('Session balance - user not found in DB', { userId: session.user.id });
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    log.info('Session balance check', { userId: user.id, balance: user.crustyCoins });
    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        name: user.name,
        balance: user.crustyCoins,
      },
    });
  } catch (error) {
    log.error('Session balance error', { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
