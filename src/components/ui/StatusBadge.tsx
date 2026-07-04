import { cn } from '../../lib/utils';

export type StatusKind = 'completed' | 'optional' | 'progress' | 'pending';

interface StatusBadgeProps {
  kind: StatusKind;
  label: string;
  className?: string;
}

const kindClasses: Record<StatusKind, string> = {
  completed: 'bg-success-bg text-success-DEFAULT',
  optional: 'bg-brand-50 text-brand-600',
  progress: 'bg-transparent text-brand-600',
  pending: 'bg-transparent text-navy-400',
};

export function StatusBadge({ kind, label, className }: StatusBadgeProps) {
  const isPill = kind === 'completed' || kind === 'optional';
  return (
    <span
      className={cn(
        'text-xs font-semibold whitespace-nowrap',
        isPill && 'rounded-full px-3 py-1',
        kindClasses[kind],
        className
      )}
    >
      {label}
    </span>
  );
}
