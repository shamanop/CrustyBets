// ─── Core Enums / Literal Types ──────────────────────────────────────────────

export type GameType = 'claw-machine' | 'shell-shuffle' | 'lobster-slots' | 'crab-roulette';

export type PlayerType = 'user' | 'agent';

export type SessionStatus = 'pending' | 'active' | 'completed';

export type TransactionType = 'bet' | 'win' | 'daily-claim' | 'signup-bonus' | 'refund';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface CrustyCoinBalance {
  playerId: string;
  playerType: PlayerType;
  balance: number;
}

export interface GameSession {
  id: string;
  gameType: GameType;
  playerId: string;
  playerType: PlayerType;
  status: SessionStatus;
  betAmount: number;
  payout: number;
  gameState: string; // JSON blob
  result: string | null; // JSON blob
  serverSeed: string;
  clientSeed: string | null;
  nonce: number;
  createdAt: Date;
  completedAt: Date | null;
}

// ─── Claw Machine ────────────────────────────────────────────────────────────

export interface ClawMachinePrize {
  id: string;
  name: string;
  rarity: Rarity;
  spriteKey: string;
  value: number;
  x: number;
  y: number;
}

export interface ClawMachineState {
  clawX: number;
  clawY: number;
  clawOpen: boolean;
  isDropping: boolean;
  timeRemaining: number;
  prizes: ClawMachinePrize[];
}

export interface ClawMachineMove {
  action: 'move' | 'drop' | 'grab';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export interface ClawMachineResult {
  won: boolean;
  prize: ClawMachinePrize | null;
  payout: number;
}

// ─── Shell Shuffle ───────────────────────────────────────────────────────────

export interface ShellShuffleState {
  shells: number[];
  /** Only available server-side; stripped before sending to client */
  pearlPosition: number;
  shuffleSequence: [number, number][];
  phase: 'watching' | 'guessing' | 'revealed';
  difficulty: number;
}

export interface ShellShuffleMove {
  action: 'guess';
  shellIndex: number;
}

export interface ShellShuffleResult {
  won: boolean;
  pearlPosition: number;
  chosenShell: number;
  payout: number;
}

// ─── Lobster Slots ───────────────────────────────────────────────────────────

export interface SlotSymbol {
  id: number;
  name: string;
  multipliers: {
    three: number;
    four: number;
    five: number;
  };
}

export interface LobsterSlotsState {
  reels: number[][];
  betPerLine: number;
  activeLines: number;
  spinning: boolean;
}

export interface LobsterSlotsMove {
  action: 'spin';
  betPerLine?: number;
  activeLines?: number;
}

export interface LobsterSlotsResult {
  reels: number[][];
  winLines: { line: number; symbols: number[]; payout: number }[];
  totalPayout: number;
}

// ─── Crab Roulette ───────────────────────────────────────────────────────────

export type RouletteBetType = 'straight' | 'color' | 'parity' | 'half' | 'dozen' | 'column';

export interface RouletteBet {
  type: RouletteBetType;
  value: string | number;
  amount: number;
}

export interface CrabRouletteState {
  bets: Map<string, RouletteBet[]>;
  phase: 'betting' | 'spinning' | 'result';
  timeRemaining: number;
  result: number | null;
  players: string[];
}

export interface CrabRouletteMove {
  action: 'place-bet' | 'clear-bets';
  bet?: RouletteBet;
}

export interface CrabRouletteResult {
  winningNumber: number;
  winningColor: 'red' | 'black' | 'green';
  payouts: { playerId: string; amount: number; bets: RouletteBet[] }[];
}

// ─── Socket Events ───────────────────────────────────────────────────────────

export interface ClientToServerEvents {
  'game:join': (data: { gameType: GameType; sessionId?: string }) => void;
  'game:move': (data: { sessionId: string; move: ClawMachineMove | ShellShuffleMove | LobsterSlotsMove | CrabRouletteMove }) => void;
  'game:leave': (data: { sessionId: string }) => void;
  'roulette:bet': (data: { sessionId: string; bet: RouletteBet }) => void;
  'chat:message': (data: { message: string; room?: string }) => void;
}

export interface ServerToClientEvents {
  'game:state': (data: { sessionId: string; state: ClawMachineState | ShellShuffleState | LobsterSlotsState | CrabRouletteState }) => void;
  'game:result': (data: { sessionId: string; result: ClawMachineResult | ShellShuffleResult | LobsterSlotsResult | CrabRouletteResult }) => void;
  'game:error': (data: { sessionId: string; error: string }) => void;
  'balance:update': (data: CrustyCoinBalance) => void;
  'roulette:countdown': (data: { sessionId: string; timeRemaining: number }) => void;
  'roulette:spin': (data: { sessionId: string }) => void;
  'chat:message': (data: { playerId: string; playerName: string; message: string; timestamp: number }) => void;
  'leaderboard:update': (data: LeaderboardEntry[]) => void;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  id: string;
  playerId: string;
  playerType: PlayerType;
  playerName: string;
  gameType: GameType | null; // null for global
  totalWagered: number;
  totalWon: number;
  gamesPlayed: number;
  biggestWin: number;
  updatedAt: Date;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
