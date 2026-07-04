import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ id, label, checked, onToggle }: ChecklistItemProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-150',
        checked ? 'border-brand-100 bg-brand-50' : 'border-navy-100 bg-white hover:bg-navy-50'
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150',
          checked ? 'border-brand bg-brand' : 'border-navy-200 bg-white'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className={cn('text-sm font-medium', checked ? 'text-navy-800' : 'text-navy-600')}>{label}</span>
    </label>
  );
}
