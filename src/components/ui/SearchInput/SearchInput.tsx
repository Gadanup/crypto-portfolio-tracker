import { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

const SearchInput = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  placeholder = 'Search coins...',
  isLoading = false,
  autoFocus = false,
}: SearchInputProps): React.JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
        aria-label={placeholder}
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
        {isLoading && (
          <Loader2 size={14} className="animate-spin text-text-secondary" />
        )}
        {!isLoading && value && (
          <button
            onClick={() => onChange('')}
            className="flex items-center justify-center text-text-secondary hover:text-text-primary"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
