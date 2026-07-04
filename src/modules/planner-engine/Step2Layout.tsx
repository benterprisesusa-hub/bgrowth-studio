import { Check } from 'lucide-react';
import type { PlannerConfig, PlannerLayout } from './types';
import { PLANNER_LAYOUT_OPTIONS } from './types';
import { cn } from '../../lib/utils';

// SVG mini previews for each layout
const LAYOUT_PREVIEWS: Record<PlannerLayout, React.ReactNode> = {
  classic: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="8" rx="2" fill="#1061EC" opacity="0.8"/>
      <rect x="4" y="16" width="50" height="4" rx="1" fill="#CBD5E1"/>
      <rect x="4" y="22" width="40" height="4" rx="1" fill="#CBD5E1"/>
      <rect x="4" y="30" width="72" height="6" rx="1" fill="#EFF6FF"/>
      <rect x="4" y="38" width="72" height="6" rx="1" fill="#EFF6FF"/>
      <rect x="4" y="46" width="72" height="6" rx="1" fill="#EFF6FF"/>
    </svg>
  ),
  weekly: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="6" rx="1" fill="#1061EC" opacity="0.8"/>
      {[0,1,2,3,4,5,6].map((i) => (
        <g key={i}>
          <rect x={4 + i * 11} y="14" width="9" height="5" rx="1" fill="#BFDBFE"/>
          <rect x={4 + i * 11} y="21" width="9" height="30" rx="1" fill="#EFF6FF"/>
        </g>
      ))}
    </svg>
  ),
  monthly: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="6" rx="1" fill="#1061EC" opacity="0.8"/>
      {Array.from({length: 35}).map((_, i) => (
        <rect key={i} x={4 + (i % 7) * 11} y={14 + Math.floor(i / 7) * 9} width="9" height="7" rx="1"
          fill={i === 15 ? '#BFDBFE' : '#F1F5F9'}/>
      ))}
    </svg>
  ),
  goals: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <circle cx="40" cy="22" r="14" fill="none" stroke="#1061EC" strokeWidth="3" opacity="0.3"/>
      <circle cx="40" cy="22" r="9" fill="none" stroke="#1061EC" strokeWidth="3" opacity="0.5"/>
      <circle cx="40" cy="22" r="4" fill="#1061EC"/>
      <rect x="4" y="40" width="72" height="4" rx="1" fill="#EFF6FF"/>
      <rect x="4" y="47" width="50" height="4" rx="1" fill="#EFF6FF"/>
    </svg>
  ),
  project: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="5" rx="1" fill="#1061EC" opacity="0.8"/>
      {[72, 55, 72, 40, 65, 30].map((w, i) => (
        <g key={i}>
          <rect x="4" y={13 + i * 7} width={w * 0.97} height="5" rx="1"
            fill={i === 0 ? '#BFDBFE' : i === 2 ? '#BBF7D0' : '#F1F5F9'}/>
        </g>
      ))}
    </svg>
  ),
  business: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="6" rx="1" fill="#1061EC" opacity="0.8"/>
      <rect x="4" y="14" width="34" height="18" rx="2" fill="#EFF6FF"/>
      <rect x="42" y="14" width="34" height="18" rx="2" fill="#EFF6FF"/>
      <rect x="4" y="36" width="34" height="16" rx="2" fill="#EFF6FF"/>
      <rect x="42" y="36" width="34" height="16" rx="2" fill="#BFDBFE"/>
    </svg>
  ),
  blank: (
    <svg viewBox="0 0 80 56" className="h-full w-full">
      <rect x="4" y="4" width="72" height="48" rx="2" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 2"/>
      <text x="40" y="30" textAnchor="middle" fontSize="10" fill="#94A3B8">+ Custom</text>
    </svg>
  ),
};

interface Step2LayoutProps {
  config: PlannerConfig;
  onChange: (updated: Partial<PlannerConfig>) => void;
}

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
              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy-100 bg-white p-1">
                {LAYOUT_PREVIEWS[layout.id as PlannerLayout]}
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
