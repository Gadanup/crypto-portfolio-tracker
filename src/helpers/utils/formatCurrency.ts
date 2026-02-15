const COMPACT_THRESHOLDS = [
  { value: 1e12, suffix: 'T' },
  { value: 1e9, suffix: 'B' },
  { value: 1e6, suffix: 'M' },
  { value: 1e3, suffix: 'K' },
] as const;

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  BTC: '₿',
};

export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  compact: boolean = false,
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '$';

  if (compact) {
    const absValue = Math.abs(value);

    for (const threshold of COMPACT_THRESHOLDS) {
      if (absValue >= threshold.value) {
        const scaled = value / threshold.value;
        return `${symbol}${scaled.toFixed(2)}${threshold.suffix}`;
      }
    }
  }

  if (currency === 'BTC') {
    return `${symbol}${value.toFixed(8)}`;
  }

  const absValue = Math.abs(value);
  const fractionDigits = absValue < 1 ? 6 : absValue < 100 ? 4 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  })
    .format(value)
    .replace(/^(-?)/, `$1${symbol}`);
};
