import { db } from '@/lib/db';
import { transactions, users, agents } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

type TransactionType = 'bet' | 'win' | 'daily-claim' | 'signup-bonus' | 'refund';
type PlayerType = 'user' | 'agent';

interface TransactionInput {
  playerId: string;
  playerType: PlayerType;
  type: TransactionType;
  amount: number; // positive for credit, negative for debit
  gameSessionId?: string;
  description?: string;
}

export async function getBalance(playerId: string, playerType: PlayerType): Promise<number> {
  if (playerType === 'user') {
    const user = await db.select({ crustyCoins: users.crustyCoins }).from(users).where(eq(users.id, playerId)).get();
    return user?.crustyCoins ?? 0;
  } else {
    const agent = await db.select({ crustyCoins: agents.crustyCoins }).from(agents).where(eq(agents.id, playerId)).get();
    return agent?.crustyCoins ?? 0;
  }
}

export async function processTransaction(input: TransactionInput): Promise<{ success: boolean; balance: number; error?: string }> {
  const { playerId, playerType, type, amount, gameSessionId, description } = input;

  // For debits, check balance first
  if (amount < 0) {
    const currentBalance = await getBalance(playerId, playerType);
    if (currentBalance + amount < 0) {
      return { success: false, balance: currentBalance, error: 'Insufficient CrustyCoins' };
    }
  }

  const table = playerType === 'user' ? users : agents;
  const now = Math.floor(Date.now() / 1000);

  // Update balance
  await db.update(table)
    .set({
      crustyCoins: sql`${playerType === 'user' ? users.crustyCoins : agents.crustyCoins} + ${amount}`
    })
    .where(eq(table.id, playerId));

  // Get new balance
  const newBalance = await getBalance(playerId, playerType);

  // Record transaction
  await db.insert(transactions).values({
    id: nanoid(),
    playerId,
    playerType,
    type,
    amount,
    balanceAfter: newBalance,
    gameSessionId: gameSessionId ?? null,
    description: description ?? null,
    createdAt: now,
  });

  return { success: true, balance: newBalance };
}

export async function claimDailyReward(playerId: string, playerType: PlayerType): Promise<{ success: boolean; amount?: number; balance?: number; error?: string; nextClaimAt?: number }> {
  // Check last daily claim
  const lastClaim = await db.select()
    .from(transactions)
    .where(eq(transactions.playerId, playerId))
    .orderBy(sql`${transactions.createdAt} DESC`)
    .limit(1)
    .all();

  const lastDailyClaim = lastClaim.find(t => t.type === 'daily-claim');
  const now = Math.floor(Date.now() / 1000);
  const twentyFourHours = 24 * 60 * 60;

  if (lastDailyClaim && (now - lastDailyClaim.createdAt) < twentyFourHours) {
    const nextClaimAt = lastDailyClaim.createdAt + twentyFourHours;
    return { success: false, error: 'Daily reward already claimed', nextClaimAt };
  }

  const dailyAmount = 50;
  const result = await processTransaction({
    playerId,
    playerType,
    type: 'daily-claim',
    amount: dailyAmount,
    description: 'Daily CrustyCoin reward',
  });

  return { success: true, amount: dailyAmount, balance: result.balance };
}
