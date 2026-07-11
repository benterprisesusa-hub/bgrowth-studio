import { Trash2, Copy } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { SortableRow } from './SortableRow';
import type { DraftItem } from './builderTypes';

interface ChecklistItemEditorProps {
  item: DraftItem;
  onChange: (updated: DraftItem) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export function ChecklistItemEditor({ item, onChange, onDelete, onDuplicate }: ChecklistItemEditorProps) {
  return (
    <SortableRow id={item._key}>
      <div className="flex items-center gap-2">
        <Input
          value={item.label}
          placeholder="e.g. Confirm appointment with the signer"
          onChange={(e) => onChange({ ...item, label: e.target.value })}
          className="flex-1"
        />
        {onDuplicate && (
          <button
            type="button"
            onClick={onDuplicate}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-navy-300 hover:bg-brand-50 hover:text-brand"
            aria-label="Duplicate item"
            title="Duplicate item"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500"
          aria-label="Delete item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </SortableRow>
  );
}
