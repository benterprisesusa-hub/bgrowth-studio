import { Info } from 'lucide-react';
import type { CalculatorField } from './types';
import { cn } from '../../lib/utils';

interface FieldInputProps {
  field: CalculatorField;
  value: string | number;
  onChange: (id: string, value: string | number) => void;
}

const inputBase = 'h-10 w-full rounded-lg border border-navy-100 bg-white px-3 text-sm text-navy-800 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export function FieldInput({ field, value, onChange }: FieldInputProps) {
  const handleChange = (val: string | number) => onChange(field.id, val);

  if (field.type === 'select') {
    return (
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(inputBase, 'appearance-none pr-8 cursor-pointer')}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400">▾</span>
      </div>
    );
  }

  if (field.type === 'slider') {
    return (
      <div>
        <input
          type="range"
          min={field.min ?? 0}
          max={field.max ?? 100}
          step={field.step ?? 1}
          value={Number(value)}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="mt-1 flex justify-between text-xs text-navy-400">
          <span>{field.prefix}{field.min ?? 0}{field.suffix}</span>
          <span className="font-semibold text-brand">{field.prefix}{value}{field.suffix}</span>
          <span>{field.prefix}{field.max ?? 100}{field.suffix}</span>
        </div>
      </div>
    );
  }

  if (field.type === 'toggle' || field.type === 'checkbox') {
    return (
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => handleChange(e.target.checked ? 1 : 0)}
          className="h-4 w-4 rounded accent-brand"
        />
        <span className="text-sm text-navy-700">{field.label}</span>
      </label>
    );
  }

  // number, currency, percentage, text
  const inputType = field.type === 'text' ? 'text' : 'number';
  return (
    <div className="relative">
      {field.prefix && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-navy-400">
          {field.prefix}
        </span>
      )}
      <input
        type={inputType}
        value={value}
        step={field.step ?? (field.type === 'currency' ? '0.01' : '1')}
        min={field.min}
        max={field.max}
        placeholder={field.placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          handleChange(inputType === 'number' ? (parseFloat(raw) || 0) : raw);
        }}
        className={cn(inputBase, field.prefix && 'pl-7', field.suffix && 'pr-10')}
      />
      {field.suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy-400">
          {field.suffix}
        </span>
      )}
    </div>
  );
}

interface CalcFieldProps {
  field: CalculatorField;
  value: string | number;
  onChange: (id: string, value: string | number) => void;
}

export function CalcField({ field, value, onChange }: CalcFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-navy-700">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
        {field.tooltip && (
          <span title={field.tooltip} className="cursor-help text-navy-300 hover:text-navy-500">
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </label>
      <FieldInput field={field} value={value} onChange={onChange} />
    </div>
  );
}
