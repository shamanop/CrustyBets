import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  image: text('image'),
  crustyCoins: integer('crusty_coins').notNull().default(100),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
  transactions: many(transactions),
  inventory: many(playerInventory),
}));

// ─── Agents ──────────────────────────────────────────────────────────────────

export const agents = sqliteTable(
  'agents',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    apiKey: text('api_key').unique().notNull(),
    crustyCoins: integer('crusty_coins').notNull().default(100),
    isActive: integer('is_active').notNull().default(1),
    createdAt: integer('created_at').notNull(),
    lastActiveAt: integer('last_active_at').notNull(),
  },
  (table) => ({
    apiKeyIdx: uniqueIndex('agents_api_key_idx').on(table.apiKey),
  })
);

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  inventory: many(playerInventory),
}));

// ─── Game Sessions ───────────────────────────────────────────────────────────

export const gameSessions = sqliteTable('game_sessions', {
  id: text('id').primaryKey(),
  gameType: text('game_type').notNull(),
  playerId: text('player_id').notNull(),
  playerType: text('player_type').notNull(),
  status: text('status').notNull().default('pending'),
  betAmount: integer('bet_amount').notNull(),
  payout: integer('payout').notNull().default(0),
  gameState: text('game_state').notNull(),
  result: text('result'),
  serverSeed: text('server_seed').notNull(),
  clientSeed: text('client_seed'),
  nonce: integer('nonce').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  completedAt: integer('completed_at'),
});

export const gameSessionsRelations = relations(gameSessions, ({ many }) => ({
  transactions: many(transactions),
  inventory: many(playerInventory),
}));

// ─── Transactions ────────────────────────────────────────────────────────────

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  playerId: text('player_id').notNull(),
  playerType: text('player_type').notNull(),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  gameSessionId: text('game_session_id').references(() => gameSessions.id),
  description: text('description'),
  createdAt: integer('created_at').notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  gameSession: one(gameSessions, {
    fields: [transactions.gameSessionId],
    references: [gameSessions.id],
  }),
}));

// ─── Prizes ──────────────────────────────────────────────────────────────────

export const prizes = sqliteTable('prizes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  rarity: text('rarity').notNull(),
  spriteKey: text('sprite_key').notNull(),
  value: integer('value').notNull(),
  weight: integer('weight').notNull(),
});

export const prizesRelations = relations(prizes, ({ many }) => ({
  inventory: many(playerInventory),
}));

// ─── Player Inventory ────────────────────────────────────────────────────────

export const playerInventory = sqliteTable('player_inventory', {
  id: text('id').primaryKey(),
  playerId: text('player_id').notNull(),
  playerType: text('player_type').notNull(),
  prizeId: text('prize_id').notNull().references(() => prizes.id),
  gameSessionId: text('game_session_id').notNull().references(() => gameSessions.id),
  wonAt: integer('won_at').notNull(),
});

export const playerInventoryRelations = relations(playerInventory, ({ one }) => ({
  prize: one(prizes, {
    fields: [playerInventory.prizeId],
    references: [prizes.id],
  }),
  gameSession: one(gameSessions, {
    fields: [playerInventory.gameSessionId],
    references: [gameSessions.id],
  }),
}));

// ─── Debug Logs ──────────────────────────────────────────────────────────────

export const debugLogs = sqliteTable('debug_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  level: text('level').notNull(), // 'info' | 'warn' | 'error' | 'debug'
  module: text('module').notNull(),
  message: text('message').notNull(),
  data: text('data'), // JSON stringified extra data
  timestamp: integer('timestamp').notNull(),
});

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const leaderboard = sqliteTable('leaderboard', {
  id: text('id').primaryKey(),
  playerId: text('player_id').notNull(),
  playerType: text('player_type').notNull(),
  playerName: text('player_name').notNull(),
  gameType: text('game_type'),
  totalWagered: integer('total_wagered').notNull().default(0),
  totalWon: integer('total_won').notNull().default(0),
  gamesPlayed: integer('games_played').notNull().default(0),
  biggestWin: integer('biggest_win').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});
