import { Check } from 'lucide-react';
import type { PlannerConfig, PlannerLayout } from './types';
import { PLANNER_LAYOUT_OPTIONS } from './types';
import { cn } from '../../lib/utils';

interface Step2LayoutProps {
  config: PlannerConfig;
  onChange: (updated: Partial<PlannerConfig>) => void;
}

const LAYOUT_PREVIEWS: Record<PlannerLayout, React.ReactNode> = {
  classic: (
    <div className="flex flex-col gap-1">
      {[80, 60, 70, 50].map((w, i) => (
        <div key={i} className="h-1.5 rounded bg-navy-200" style={{ width: `${w}%` }} />
      ))}
    </div>
  ),
  weekly: (
    <div className="grid grid-cols-7 gap-0.5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="h-1 rounded bg-brand-300" />
          <div className="h-4 rounded bg-navy-100" />
        </div>
      ))}
    </div>
  ),
  monthly: (
    <div className="grid grid-cols-7 gap-0.5">
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="h-1.5 rounded bg-navy-200" />
      ))}
    </div>
  ),
  goals: (
    <div className="flex flex-col gap-1">
      <div className="h-2 w-3/4 rounded bg-brand-300" />
      {[60, 80, 40].map((w, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-navy-300" />
          <div className="h-1.5 rounded bg-navy-200" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  ),
  project: (
    <div className="flex flex-col gap-1">
      {[100, 75, 50, 90, 30].map((w, i) => (
        <div key={i} className="h-1.5 rounded" style={{ width: `${w}%`, background: i === 0 ? '#1061EC' : '#E3E7EF' }} />
      ))}
    </div>
  ),
  business: (
    <div className="grid grid-cols-2 gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-3 rounded bg-navy-100" />
      ))}
    </div>
  ),
  blank: (
    <div className="flex h-10 items-center justify-center">
      <span className="text-[10px] text-navy-300">+ Custom</span>
    </div>
  ),
};

export function Step2Layout({ config, onChange }: Step2LayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-navy-400">2. CHOOSE LAYOUT</p>
        <p className="mt-1 text-sm text-navy-500">Select the best layout structure for your planner.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {PLANNER_LAYOUT_OPTIONS.map((layout) => {
          const isSelected = config.layout === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onChange({ layout: layout.id })}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                isSelected
                  ? 'border-brand bg-brand-50 shadow-sm'
                  : 'border-navy-100 bg-white hover:border-brand-200 hover:bg-brand-50/30'
              )}
            >
              {/* Mini preview */}
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-navy-100 bg-white p-2">
                {LAYOUT_PREVIEWS[layout.id]}
              </div>

              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-semibold', isSelected ? 'text-brand-700' : 'text-navy-800')}>
                  {layout.name}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy-400">{layout.description}</p>
              </div>

              {isSelected && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
        <p className="text-xs text-navy-500">
          💡 You can customize layouts and sections in the next steps.
        </p>
      </div>
    </div>
  );
}
