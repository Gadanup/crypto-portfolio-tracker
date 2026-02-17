import { TimeRange } from '@/helpers/constants/enums';
import { TEXT_CONTENT } from '@/helpers/constants';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const OPTIONS: { range: TimeRange; label: string }[] = [
  { range: TimeRange.DAY, label: TEXT_CONTENT.COIN_DETAIL.TIME_RANGES.DAY },
  { range: TimeRange.WEEK, label: TEXT_CONTENT.COIN_DETAIL.TIME_RANGES.WEEK },
  {
    range: TimeRange.MONTH,
    label: TEXT_CONTENT.COIN_DETAIL.TIME_RANGES.MONTH,
  },
  {
    range: TimeRange.THREE_MONTHS,
    label: TEXT_CONTENT.COIN_DETAIL.TIME_RANGES.THREE_MONTHS,
  },
  { range: TimeRange.YEAR, label: TEXT_CONTENT.COIN_DETAIL.TIME_RANGES.YEAR },
];

const TimeRangeSelector = ({
  value,
  onChange,
}: TimeRangeSelectorProps): React.JSX.Element => {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((option) => (
        <button
          key={option.range}
          onClick={() => onChange(option.range)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === option.range
              ? 'bg-accent text-background'
              : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
