import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
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

    return NextResponse.json({
      success: true,
      data: {
        agentId: agent.id,
        name: agent.name,
        balance: agent.crustyCoins,
      },
    });
  } catch (error) {
    console.error('Balance check error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
