import type { ReactNode } from 'react';
import { Star, Info } from 'lucide-react';
import { PrimaryButton } from './ui/Button';
import { ArrowRight } from 'lucide-react';

interface WorkflowSectionProps {
  number: number;
  totalSteps: number;
  icon: ReactNode;
  title: string;
  description: string;
  whyItMatters?: string;
  tip?: string;
  children: ReactNode;
  isLast: boolean;
  onContinue: () => void;
  continueLabel?: string;
}

export function WorkflowSection({
  number,
  totalSteps,
  icon,
  title,
  description,
  whyItMatters,
  tip,
  children,
  isLast,
  onContinue,
  continueLabel,
}: WorkflowSectionProps) {
  return (
    <div className="print-section rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand [&>svg]:h-6 [&>svg]:w-6">
            {icon}
          </span>
          <div>
            <span className="inline-block rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Step {number} of {totalSteps}
            </span>
            <h2 className="mt-2 text-xl font-bold text-navy-900 sm:text-[22px]">{title}</h2>
            <p className="mt-1 text-sm text-navy-400">{description}</p>
          </div>
        </div>

        {whyItMatters && (
          <div className="no-print w-full shrink-0 rounded-xl border border-brand-100 bg-brand-50 p-4 sm:w-72">
            <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-brand-700">
              <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
              Why this matters
            </p>
            <p className="text-xs leading-relaxed text-navy-500">{whyItMatters}</p>
          </div>
        )}
      </div>

      <div className="mt-6">{children}</div>

      {tip && (
        <div className="no-print mt-5 flex items-start gap-2.5 rounded-xl bg-navy-50 px-4 py-3.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-[13px] text-navy-500">
            <span className="font-semibold text-navy-700">Tip: </span>
            {tip}
          </p>
        </div>
      )}

      <div className="no-print mt-6 flex justify-end">
        <PrimaryButton onClick={onContinue}>
          {continueLabel ?? (isLast ? 'Finish Checklist' : 'Save & Continue')}
          <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  );
}
