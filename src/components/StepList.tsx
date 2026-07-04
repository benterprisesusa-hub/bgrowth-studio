import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export type SectionId = string;

export interface StepListItem {
  id: SectionId;
  number: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
}

interface StepListProps {
  items: StepListItem[];
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}

export function StepList({ items, activeId, onSelect }: StepListProps) {
  return (
    <nav aria-label="Workflow steps" className="rounded-2xl border border-navy-100 bg-white shadow-card">
      <ul>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex w-full items-start gap-3 border-l-[3px] px-4 py-3 text-left transition-colors duration-150',
                  isActive
                    ? 'border-l-brand bg-brand-50'
                    : 'border-l-transparent hover:bg-navy-50'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    item.status === 'completed' && 'bg-success-DEFAULT text-white',
                    item.status === 'active' && 'bg-brand text-white',
                    item.status === 'pending' && 'bg-navy-100 text-navy-500'
                  )}
                >
                  {item.status === 'completed' ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : item.number}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block truncate text-[13px] font-semibold',
                      isActive ? 'text-brand-700' : 'text-navy-800'
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="block text-xs text-navy-400">{item.subtitle}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
