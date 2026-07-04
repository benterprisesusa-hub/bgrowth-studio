import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SortableRowProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SortableRow({ id, children, className }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-start gap-2 rounded-xl border border-navy-100 bg-white',
        isDragging && 'opacity-50 shadow-cardHover',
        className
      )}
    >
      <button
        type="button"
        className="mt-3 flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded text-navy-300 hover:text-navy-500 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 py-3 pr-3">{children}</div>
    </div>
  );
}
