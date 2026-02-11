import { createHash, createHmac, randomBytes } from 'crypto';

export function generateServerSeed(): string {
  return randomBytes(32).toString('hex');
}

export function hashServerSeed(serverSeed: string): string {
  return createHash('sha256').update(serverSeed).digest('hex');
}

export function generateOutcome(serverSeed: string, clientSeed: string, nonce: number): number {
  const hmac = createHmac('sha256', serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hex = hmac.digest('hex');
  // Use first 8 chars (32 bits) for a number between 0 and 1
  const int = parseInt(hex.substring(0, 8), 16);
  return int / 0x100000000; // Returns 0-1 float
}

export function generateOutcomeInRange(serverSeed: string, clientSeed: string, nonce: number, min: number, max: number): number {
  const outcome = generateOutcome(serverSeed, clientSeed, nonce);
  return Math.floor(outcome * (max - min + 1)) + min;
}

export function verifyOutcome(serverSeed: string, clientSeed: string, nonce: number, expectedOutcome: number): boolean {
  const outcome = generateOutcome(serverSeed, clientSeed, nonce);
  return Math.abs(outcome - expectedOutcome) < Number.EPSILON;
}

// For slot machines: generate multiple reel outcomes
export function generateSlotOutcome(serverSeed: string, clientSeed: string, nonce: number, reelCount: number, symbolCount: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < reelCount; i++) {
    results.push(generateOutcomeInRange(serverSeed, clientSeed, nonce + i, 0, symbolCount - 1));
  }
  return results;
}

// For roulette: generate wheel outcome (0-36)
export function generateRouletteOutcome(serverSeed: string, clientSeed: string, nonce: number): number {
  return generateOutcomeInRange(serverSeed, clientSeed, nonce, 0, 36);
}
