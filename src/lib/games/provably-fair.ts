import { createHash, createHmac, randomBytes } from 'crypto';
import { createLogger } from '@/lib/logger';

const log = createLogger('PROVABLY_FAIR');

export function generateServerSeed(): string {
  log.info('Generating new server seed');
  const seed = randomBytes(32).toString('hex');
  log.debug('Server seed generated', { seedPrefix: seed.substring(0, 8) + '...' });
  return seed;
}

export function hashServerSeed(serverSeed: string): string {
  const hash = createHash('sha256').update(serverSeed).digest('hex');
  log.debug('Server seed hashed', { hashPrefix: hash.substring(0, 16) + '...' });
  return hash;
}

export function generateOutcome(serverSeed: string, clientSeed: string, nonce: number): number {
  log.debug('generateOutcome called', { clientSeed, nonce });
  const hmac = createHmac('sha256', serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hex = hmac.digest('hex');
  // Use first 8 chars (32 bits) for a number between 0 and 1
  const int = parseInt(hex.substring(0, 8), 16);
  const outcome = int / 0x100000000; // Returns 0-1 float
  log.debug('generateOutcome result', { nonce, outcome });
  return outcome;
}

export function generateOutcomeInRange(serverSeed: string, clientSeed: string, nonce: number, min: number, max: number): number {
  log.debug('generateOutcomeInRange called', { nonce, min, max });
  const outcome = generateOutcome(serverSeed, clientSeed, nonce);
  const result = Math.floor(outcome * (max - min + 1)) + min;
  log.debug('generateOutcomeInRange result', { nonce, min, max, result });
  return result;
}

export function verifyOutcome(serverSeed: string, clientSeed: string, nonce: number, expectedOutcome: number): boolean {
  log.info('verifyOutcome called', { clientSeed, nonce });
  const outcome = generateOutcome(serverSeed, clientSeed, nonce);
  const isValid = Math.abs(outcome - expectedOutcome) < Number.EPSILON;
  log.info('verifyOutcome result', { nonce, isValid });
  return isValid;
}

// For slot machines: generate multiple reel outcomes
export function generateSlotOutcome(serverSeed: string, clientSeed: string, nonce: number, reelCount: number, symbolCount: number): number[] {
  log.info('generateSlotOutcome called', { nonce, reelCount, symbolCount });
  const results: number[] = [];
  for (let i = 0; i < reelCount; i++) {
    results.push(generateOutcomeInRange(serverSeed, clientSeed, nonce + i, 0, symbolCount - 1));
  }
  log.info('generateSlotOutcome results', { nonce, reelCount, results });
  return results;
}

// For roulette: generate wheel outcome (0-36)
export function generateRouletteOutcome(serverSeed: string, clientSeed: string, nonce: number): number {
  log.info('generateRouletteOutcome called', { nonce });
  const result = generateOutcomeInRange(serverSeed, clientSeed, nonce, 0, 36);
  log.info('generateRouletteOutcome result', { nonce, result });
  return result;
}
