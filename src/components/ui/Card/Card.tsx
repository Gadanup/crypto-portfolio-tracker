interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card = ({
  title,
  children,
  className = '',
  noPadding = false,
}: CardProps): React.JSX.Element => {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${noPadding ? '' : 'p-4 md:p-5'} ${className}`}
    >
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
