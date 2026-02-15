export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
