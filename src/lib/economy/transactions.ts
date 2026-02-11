import { db } from '@/lib/db';
import { transactions, users, agents } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createLogger } from '@/lib/logger';

const log = createLogger('TRANSACTIONS');

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
  log.debug('getBalance called', { playerId, playerType });
  if (playerType === 'user') {
    const user = await db.select({ crustyCoins: users.crustyCoins }).from(users).where(eq(users.id, playerId)).get();
    const balance = user?.crustyCoins ?? 0;
    log.debug('getBalance result', { playerId, playerType, balance });
    return balance;
  } else {
    const agent = await db.select({ crustyCoins: agents.crustyCoins }).from(agents).where(eq(agents.id, playerId)).get();
    const balance = agent?.crustyCoins ?? 0;
    log.debug('getBalance result', { playerId, playerType, balance });
    return balance;
  }
}

export async function processTransaction(input: TransactionInput): Promise<{ success: boolean; balance: number; error?: string }> {
  const { playerId, playerType, type, amount, gameSessionId, description } = input;

  log.info('processTransaction started', { playerId, playerType, type, amount, gameSessionId, description });

  // For debits, check balance first
  if (amount < 0) {
    const currentBalance = await getBalance(playerId, playerType);
    log.debug('Debit check', { playerId, currentBalance, debitAmount: amount, wouldRemain: currentBalance + amount });
    if (currentBalance + amount < 0) {
      log.warn('Transaction rejected: insufficient balance', { playerId, playerType, currentBalance, requestedDebit: amount });
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
  log.info('Transaction processed successfully', { playerId, playerType, type, amount, newBalance });

  // Record transaction
  const txnId = nanoid();
  await db.insert(transactions).values({
    id: txnId,
    playerId,
    playerType,
    type,
    amount,
    balanceAfter: newBalance,
    gameSessionId: gameSessionId ?? null,
    description: description ?? null,
    createdAt: now,
  });

  log.debug('Transaction record persisted', { txnId, playerId, type, amount, balanceAfter: newBalance });

  return { success: true, balance: newBalance };
}

export async function claimDailyReward(playerId: string, playerType: PlayerType): Promise<{ success: boolean; amount?: number; balance?: number; error?: string; nextClaimAt?: number }> {
  log.info('claimDailyReward called', { playerId, playerType });

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
    log.info('Daily reward rejected: already claimed', { playerId, lastClaimAt: lastDailyClaim.createdAt, nextClaimAt });
    return { success: false, error: 'Daily reward already claimed', nextClaimAt };
  }

  const dailyAmount = 50;
  log.info('Processing daily reward', { playerId, dailyAmount });
  const result = await processTransaction({
    playerId,
    playerType,
    type: 'daily-claim',
    amount: dailyAmount,
    description: 'Daily CrustyCoin reward',
  });

  log.info('Daily reward claimed successfully', { playerId, dailyAmount, newBalance: result.balance });
  return { success: true, amount: dailyAmount, balance: result.balance };
}
