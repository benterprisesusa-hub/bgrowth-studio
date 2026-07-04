import { getIcon } from '../../engine/icons';
import { ICON_OPTIONS } from './builderTypes';
import { cn } from '../../lib/utils';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
      {ICON_OPTIONS.map((opt) => {
        const Icon = getIcon(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
              value === opt.value
                ? 'border-brand bg-brand text-white'
                : 'border-navy-100 bg-white text-navy-500 hover:border-brand hover:text-brand'
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
