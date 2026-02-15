type SkeletonVariant = 'text' | 'circle' | 'rectangle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const VARIANT_DEFAULTS: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  circle: 'h-10 w-10 rounded-full',
  rectangle: 'h-24 w-full rounded-lg',
};

const Skeleton = ({
  variant = 'text',
  className = '',
}: SkeletonProps): React.JSX.Element => {
  return (
    <div
      className={`animate-pulse bg-elevated ${VARIANT_DEFAULTS[variant]} ${className}`}
    />
  );
};

export default Skeleton;
