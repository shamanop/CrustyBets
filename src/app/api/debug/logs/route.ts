import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { debugLogs } from '@/lib/db/schema';
import { desc, eq, and, gte } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // filter by level
    const module = searchParams.get('module'); // filter by module
    const since = searchParams.get('since'); // timestamp filter
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

    const conditions = [];
    if (level) conditions.push(eq(debugLogs.level, level));
    if (module) conditions.push(eq(debugLogs.module, module));
    if (since) conditions.push(gte(debugLogs.timestamp, parseInt(since)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const logs = await db.select()
      .from(debugLogs)
      .where(where)
      .orderBy(desc(debugLogs.timestamp))
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs: logs.map(l => ({
        ...l,
        data: l.data ? JSON.parse(l.data) : null,
        time: new Date(l.timestamp).toISOString(),
      })),
    });
  } catch (error) {
    console.error('[DEBUG_LOGS_API]', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch logs',
    }, { status: 500 });
  }
}

// DELETE endpoint to clear old logs
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const olderThan = searchParams.get('olderThan');
    const { lte } = await import('drizzle-orm');

    const cutoff = olderThan ? parseInt(olderThan) : Date.now() - 86400000;
    await db.delete(debugLogs).where(lte(debugLogs.timestamp, cutoff));

    return NextResponse.json({ success: true, message: `Logs older than ${new Date(cutoff).toISOString()} cleared` });
  } catch (error) {
    console.error('[DEBUG_LOGS_API]', error);
    return NextResponse.json({ success: false, error: 'Failed to clear logs' }, { status: 500 });
  }
}
