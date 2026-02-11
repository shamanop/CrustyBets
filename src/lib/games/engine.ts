import type { GameSession, PlayerType } from '@/types';
import { createLogger } from '@/lib/logger';

/**
 * Logger instance for game engine implementations.
 * Import and use in concrete engine classes:
 *   `const log = engineLogger;`
 *
 * Log key lifecycle events:
 * - Session creation (playerId, betAmount)
 * - State transitions (sessionId, old status -> new status)
 * - Move processing (sessionId, move type)
 * - Game results (sessionId, outcome, payout)
 * - Session end / timeout (sessionId, reason)
 */
export const engineLogger = createLogger('GAME_ENGINE');

/**
 * Abstract game engine interface.
 *
 * Each casino game (Claw Machine, Shell Shuffle, Lobster Slots, Crab Roulette)
 * implements this interface with its own state, move, and result types.
 *
 * Implementations SHOULD use {@link engineLogger} to log:
 * - `createSession`: log playerId, betAmount, generated sessionId
 * - `getState`: log sessionId, whether view is player-filtered
 * - `processMove`: log sessionId, move details, resulting state/result
 * - `endSession`: log sessionId, reason, final result
 *
 * @typeParam TState  - The game-specific state shape sent to clients.
 * @typeParam TMove   - The shape of a player action / move.
 * @typeParam TResult - The shape of the final game result.
 */
export interface GameEngine<TState, TMove, TResult> {
  /**
   * Create a new game session, deduct the bet, and return the persisted session.
   * Log: playerId, playerType, betAmount, resulting sessionId.
   */
  createSession(
    playerId: string,
    playerType: PlayerType,
    betAmount: number,
  ): Promise<GameSession>;

  /**
   * Return the current game state for a session.
   * If `forPlayer` is provided, sensitive fields (e.g. server seed, pearl
   * position) are stripped before returning.
   * Log: sessionId, forPlayer presence.
   */
  getState(sessionId: string, forPlayer?: string): Promise<TState>;

  /**
   * Process a player's move and return the updated state.
   * If the move concludes the game, `result` will be populated.
   * Log: sessionId, move, whether result was produced.
   */
  processMove(
    sessionId: string,
    move: TMove,
  ): Promise<{ state: TState; result?: TResult }>;

  /**
   * Force-end a session (e.g. on timeout or disconnect) and return the result.
   * Log: sessionId, reason for ending, final result.
   */
  endSession(sessionId: string): Promise<TResult>;
}

/**
 * Provably-fair cryptographic helpers.
 *
 * Every game outcome is derived from a server seed (committed before the game),
 * a client seed (optionally provided by the player), and a nonce. After the
 * game completes, the server seed is revealed so the player can independently
 * verify the outcome.
 */
export interface ProvablyFair {
  /**
   * Generate a cryptographically secure random server seed.
   */
  generateServerSeed(): string;

  /**
   * Derive a deterministic numeric outcome from the seed pair + nonce.
   * The returned number is typically normalised to [0, 1) or [0, N).
   */
  generateOutcome(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
  ): number;

  /**
   * Verify that a given outcome matches the seed pair + nonce.
   * Returns true if the outcome is valid.
   */
  verifyOutcome(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    outcome: number,
  ): boolean;
}
