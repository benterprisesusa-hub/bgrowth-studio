import type { ReactNode } from 'react';
import { PrimaryButton } from '../../components/ui/Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand [&>svg]:h-8 [&>svg]:w-8">
        {icon}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-navy-800">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-navy-400">{description}</p>
      </div>
      {actionLabel && onAction && (
        <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>
      )}
    </div>
  );
}
