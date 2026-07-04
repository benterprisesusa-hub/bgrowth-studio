import type { ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatusBadge, type StatusKind } from './ui/StatusBadge';

interface SectionSummaryRowProps {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
  statusLabel: string;
  statusKind: StatusKind;
  isCompleted: boolean;
  onClick: () => void;
}

export function SectionSummaryRow({
  number,
  icon,
  title,
  description,
  statusLabel,
  statusKind,
  isCompleted,
  onClick,
}: SectionSummaryRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="print-section flex w-full items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-card transition-shadow duration-150 hover:shadow-cardHover sm:p-5"
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          isCompleted ? 'bg-success-DEFAULT text-white' : 'bg-navy-100 text-navy-500'
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : number}
      </span>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-navy-800">
          {number}. {title}
        </span>
        <span className="block truncate text-[13px] text-navy-400">{description}</span>
      </span>

      <span className="hidden shrink-0 sm:block">
        <StatusBadge kind={statusKind} label={statusLabel} />
      </span>

      <ChevronDown className="h-[18px] w-[18px] shrink-0 text-navy-300" />
    </button>
  );
}
