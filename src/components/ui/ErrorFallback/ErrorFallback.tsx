import { AlertTriangle } from 'lucide-react';

import { TEXT_CONTENT } from '@/helpers/constants';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorFallback = ({
  message = TEXT_CONTENT.MESSAGES.ERROR,
  onRetry,
}: ErrorFallbackProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-loss-bg">
        <AlertTriangle size={24} className="text-loss" />
      </div>
      <p className="text-sm text-text-secondary">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          {TEXT_CONTENT.BUTTONS.RETRY}
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
