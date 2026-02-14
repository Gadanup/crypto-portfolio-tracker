/**
 * Maps a CMC slug to a CoinCap asset ID.
 *
 * In most cases CMC slugs and CoinCap asset IDs are identical
 * (e.g. "bitcoin", "ethereum", "solana"). This helper exists
 * as a single place to handle any known exceptions and to
 * provide a consistent cross-API lookup.
 */

const SLUG_OVERRIDES: Record<string, string> = {
  // Add known mismatches here as they're discovered.
  // Example: 'cmc-slug': 'coincap-id',
};

export const getCoinCapId = (cmcSlug: string): string =>
  SLUG_OVERRIDES[cmcSlug] ?? cmcSlug;

export const buildCoinCapHistoryParams = (
  interval: string,
  days: number,
): { interval: string; start: number; end: number } => {
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;

  return { interval, start, end: now };
};
