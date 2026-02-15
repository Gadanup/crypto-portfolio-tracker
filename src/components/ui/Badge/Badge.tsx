import { TrendingUp, TrendingDown } from 'lucide-react';

interface BadgeProps {
  value: number;
  showIcon?: boolean;
  className?: string;
}

const Badge = ({
  value,
  showIcon = true,
  className = '',
}: BadgeProps): React.JSX.Element => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
        isPositive ? 'bg-profit-bg text-profit' : 'bg-loss-bg text-loss'
      } ${className}`}
    >
      {showIcon && <Icon size={12} />}
      {isPositive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  );
};

export default Badge;
