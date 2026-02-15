import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated">
        {icon ?? <Inbox size={24} className="text-text-secondary" />}
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
