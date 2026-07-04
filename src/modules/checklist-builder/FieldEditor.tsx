import { Trash2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SortableRow } from './SortableRow';
import { IconPicker } from './IconPicker';
import { FIELD_TYPE_LABELS } from './builderTypes';
import type { DraftField } from './builderTypes';
import type { FieldType } from '../../engine/types';

interface FieldEditorProps {
  field: DraftField;
  onChange: (updated: DraftField) => void;
  onDelete: () => void;
}

const FIELD_TYPES = Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][];

export function FieldEditor({ field, onChange, onDelete }: FieldEditorProps) {
  const set = <K extends keyof DraftField>(key: K, val: DraftField[K]) =>
    onChange({ ...field, [key]: val });

  return (
    <SortableRow id={field._key} className="p-0">
      <div className="flex flex-col gap-3">
        {/* Row 1: label + type + required toggle */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
              Field Label
            </label>
            <Input
              value={field.label}
              placeholder="e.g. Client Name"
              onChange={(e) => set('label', e.target.value)}
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
              Type
            </label>
            <Select
              value={field.type}
              onChange={(e) => set('type', e.target.value as FieldType)}
            >
              {FIELD_TYPES.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-600">
              <input
                type="checkbox"
                checked={!!field.required}
                onChange={(e) => set('required', e.target.checked)}
                className="h-4 w-4 rounded accent-brand"
              />
              Required
            </label>
            <button
              type="button"
              onClick={onDelete}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500"
              aria-label="Delete field"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Row 2: placeholder */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
            Placeholder (optional)
          </label>
          <Input
            value={field.placeholder ?? ''}
            placeholder="e.g. John Smith"
            onChange={(e) => set('placeholder', e.target.value)}
          />
        </div>

        {/* Row 3: dropdown options (only for select type) */}
        {field.type === 'select' && (
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
              Options (one per line)
            </label>
            <textarea
              rows={3}
              className="w-full resize-y rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-800 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder={"Option A\nOption B\nOption C"}
              value={(field.options ?? []).join('\n')}
              onChange={(e) =>
                set('options', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
              }
            />
          </div>
        )}

        {/* Row 4: icon picker */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">
            Field Icon
          </label>
          <IconPicker value={field.icon} onChange={(v) => set('icon', v)} />
        </div>
      </div>
    </SortableRow>
  );
}
