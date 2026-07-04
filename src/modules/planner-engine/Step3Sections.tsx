import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Check, X } from 'lucide-react';
import { getIcon } from '../../engine/icons';
import { cn } from '../../lib/utils';
import type { PlannerConfig, PlannerSectionConfig, PlannerSectionType } from './types';
import { PLANNER_SECTION_DEFAULTS } from './types';

const SECTION_TYPE_OPTIONS: { type: PlannerSectionType; label: string; icon: string }[] = [
  { type: 'text', label: 'Text Page', icon: 'file-text' },
  { type: 'rich-text', label: 'Rich Text', icon: 'notebook-pen' },
  { type: 'checklist', label: 'Checklist', icon: 'clipboard-list' },
  { type: 'worksheet', label: 'Worksheet', icon: 'file-check-2' },
  { type: 'goals', label: 'Goals', icon: 'file-text' },
  { type: 'milestones', label: 'Milestones', icon: 'file-text' },
  { type: 'habit-tracker', label: 'Habit Tracker', icon: 'calendar-days' },
  { type: 'calendar', label: 'Calendar', icon: 'calendar-days' },
  { type: 'budget', label: 'Budget', icon: 'dollar-sign' },
  { type: 'notes', label: 'Notes', icon: 'notebook-pen' },
  { type: 'reflection', label: 'Reflection', icon: 'book-open' },
  { type: 'custom', label: 'Custom Section', icon: 'file-text' },
];

function newKey() { return `k-${Math.random().toString(36).slice(2, 9)}`; }

function SortableSection({
  section,
  onChange,
  onRemove,
}: {
  section: PlannerSectionConfig;
  onChange: (updated: PlannerSectionConfig) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._key });
  const Icon = getIcon(section.icon);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-3 py-2.5 transition-shadow',
        isDragging && 'opacity-50 shadow-cardHover',
        !section.enabled && 'opacity-60'
      )}
    >
      <button type="button" className="cursor-grab text-navy-300 hover:text-navy-500 active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <input
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className="w-full bg-transparent text-sm font-semibold text-navy-800 outline-none placeholder:text-navy-300 focus:border-b focus:border-brand"
          placeholder="Section title"
        />
        <input
          value={section.description}
          onChange={(e) => onChange({ ...section, description: e.target.value })}
          className="w-full bg-transparent text-xs text-navy-400 outline-none placeholder:text-navy-300 focus:border-b focus:border-brand"
          placeholder="Short description..."
        />
      </div>

      {/* Enable/disable toggle */}
      <button
        type="button"
        onClick={() => onChange({ ...section, enabled: !section.enabled })}
        title={section.enabled ? 'Disable section' : 'Enable section'}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full transition-colors',
          section.enabled ? 'bg-emerald-500 text-white' : 'border border-navy-200 text-navy-300'
        )}
      >
        {section.enabled ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="text-navy-300 hover:text-red-500"
        title="Remove section"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface Step3SectionsProps {
  config: PlannerConfig;
  onChange: (updated: Partial<PlannerConfig>) => void;
}

export function Step3Sections({ config, onChange }: Step3SectionsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const updateSection = (index: number, updated: PlannerSectionConfig) => {
    const sections = [...config.sections];
    sections[index] = updated;
    onChange({ sections });
  };

  const removeSection = (index: number) => {
    onChange({ sections: config.sections.filter((_, i) => i !== index) });
  };

  const addSection = (type: PlannerSectionType, label: string) => {
    const defaults = PLANNER_SECTION_DEFAULTS[type];
    const newSection: PlannerSectionConfig = {
      id: newKey(),
      _key: newKey(),
      type,
      title: label,
      description: '',
      icon: defaults.icon,
      enabled: true,
      estimatedPages: defaults.estimatedPages,
    };
    onChange({ sections: [...config.sections, newSection] });
    setShowAdd(false);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = config.sections.findIndex((s) => s._key === active.id);
    const to = config.sections.findIndex((s) => s._key === over.id);
    onChange({ sections: arrayMove(config.sections, from, to) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">3. ADD SECTIONS</p>
          <p className="mt-0.5 text-sm text-navy-500">Select and organize sections for your planner.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Custom Section
        </button>
      </div>

      {/* Add section type picker */}
      {showAdd && (
        <div className="rounded-xl border border-navy-100 bg-white p-3 shadow-card">
          <p className="mb-2.5 text-xs font-semibold text-navy-500">Choose section type:</p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {SECTION_TYPE_OPTIONS.map((opt) => {
              const Icon = getIcon(opt.icon);
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => addSection(opt.type, opt.label)}
                  className="flex items-center gap-2 rounded-lg border border-navy-100 px-2.5 py-2 text-left text-xs font-medium text-navy-700 hover:border-brand hover:bg-brand-50 hover:text-brand"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sortable sections list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={config.sections.map((s) => s._key)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {config.sections.map((section, idx) => (
              <SortableSection
                key={section._key}
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
                onRemove={() => removeSection(idx)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {config.sections.length === 0 && (
        <div className="rounded-xl border border-dashed border-navy-200 py-8 text-center">
          <p className="text-sm text-navy-400">No sections yet. Click "Add Custom Section" to start.</p>
        </div>
      )}

      <p className="text-center text-xs text-navy-400">+ Drag to reorder sections</p>
    </div>
  );
}
