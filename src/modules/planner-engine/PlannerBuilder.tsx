import { useState, useRef } from 'react';
import {
  ArrowLeft, Save, Eye, Plus, Trash2, GripVertical,
  ChevronUp, ChevronDown, ChevronRight, MoreVertical,
  X, Check, Search, FileText, StickyNote, Image, Minus,
  CheckSquare, Target, Flag, GitBranch, TrendingUp, Calendar,
  File, Settings, Palette, Upload,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { FormFieldsBlockEditor, type FormFieldsConfig } from './FormFieldsBlockEditor';
import {
  type PlannerConfig, type PlannerBlock, type BlockType,
  BLOCK_TYPE_INFO, THEME_COLORS, PLANNER_CATEGORIES,
  defaultBlock, newId,
} from './types';
import { cn } from '../../lib/utils';

// ─── Types ───────────────────────────────────────────────────────
type Tab = 'builder' | 'preview' | 'fill';
type BlockCategory = 'all' | 'content' | 'planning' | 'resources' | 'media';

interface PlannerSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  blocks: PlannerBlock[];
  collapsed: boolean;
}

// ─── Block category map ──────────────────────────────────────────
const BLOCK_CATEGORIES: Record<BlockType, BlockCategory> = {
  text: 'content',
  notes: 'content',
  image: 'media',
  divider: 'content',
  checklist: 'planning',
  goals: 'planning',
  milestones: 'planning',
  timeline: 'planning',
  progress: 'planning',
  calendar: 'planning',
  resources: 'resources',
  worksheet: 'content',
  form_fields: 'content',
};

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
  text: <FileText className="h-4 w-4" />,
  notes: <StickyNote className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
  divider: <Minus className="h-4 w-4" />,
  checklist: <CheckSquare className="h-4 w-4" />,
  goals: <Target className="h-4 w-4" />,
  milestones: <Flag className="h-4 w-4" />,
  timeline: <GitBranch className="h-4 w-4" />,
  progress: <TrendingUp className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  resources: <File className="h-4 w-4" />,
  worksheet: <FileText className="h-4 w-4" />,
  form_fields: <FileText className="h-4 w-4" />,
};

const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  text: 'Add titles, paragraphs and rich content',
  notes: 'Add notes with formatting options',
  image: 'Add images with captions',
  divider: 'Add a divider line between sections',
  checklist: 'Add a checklist with tasks',
  goals: 'Define and track goals',
  milestones: 'Add milestone items',
  timeline: 'Visual timeline of events',
  progress: 'Track progress and completion',
  calendar: 'Add calendar view',
  resources: 'Add files and documents',
  worksheet: 'Add questions for users to answer',
  form_fields: 'Mixed field types (text, select, etc.)',
};

// ─── Add Block Modal ─────────────────────────────────────────────
function AddBlockModal({
  onAdd,
  onClose,
}: {
  onAdd: (type: BlockType) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BlockCategory>('all');

  const categories: { key: BlockCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'content', label: 'Content' },
    { key: 'planning', label: 'Planning' },
    { key: 'resources', label: 'Resources' },
    { key: 'media', label: 'Media' },
  ];

  const filtered = (Object.entries(BLOCK_TYPE_INFO) as [BlockType, (typeof BLOCK_TYPE_INFO)[BlockType]][]).filter(
    ([type, info]) => {
      const matchesCategory = category === 'all' || BLOCK_CATEGORIES[type] === category;
      const matchesSearch = !search || info.label.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h3 className="text-base font-bold text-navy-800">Add Block</h3>
          <button type="button" onClick={onClose} className="text-navy-400 hover:text-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search blocks..."
              className="w-full rounded-xl border border-navy-100 py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-5 pt-3">
          {categories.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                category === c.key
                  ? 'bg-brand text-white'
                  : 'text-navy-500 hover:bg-navy-50'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Block grid */}
        <div className="max-h-72 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(([type, info]) => (
              <button
                key={type}
                type="button"
                onClick={() => { onAdd(type); onClose(); }}
                className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-3 text-left hover:border-brand hover:bg-brand-50 transition-colors"
              >
                <span className="mt-0.5 text-brand">{BLOCK_ICONS[type]}</span>
                <div>
                  <p className="text-sm font-semibold text-navy-800">{info.label}</p>
                  <p className="text-[11px] text-navy-400 leading-tight mt-0.5">{BLOCK_DESCRIPTIONS[type]}</p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-navy-400">No blocks found</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Block Row (inside section) ──────────────────────────────────
function BlockRow({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: PlannerBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all cursor-pointer',
        isDragging && 'opacity-50 shadow-lg',
        isSelected
          ? 'border-brand bg-brand-50'
          : 'border-navy-100 bg-white hover:border-brand/40 hover:bg-navy-50',
        !block.enabled && 'opacity-50'
      )}
      onClick={onSelect}
    >
      <button
        type="button"
        className="cursor-grab text-navy-300 active:cursor-grabbing shrink-0"
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      <span className="text-base shrink-0">{block.icon}</span>
      <span className="flex-1 text-sm font-medium text-navy-800 truncate">{block.title}</span>

      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ background: block.color }}
      >
        {BLOCK_TYPE_INFO[block.config.type]?.label ?? block.config.type}
      </span>

      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="shrink-0 text-navy-300 hover:text-red-500 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────
function SectionCard({
  section,
  sectionIndex,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onAddBlock,
  onUpdateSection,
  onDeleteSection,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onReorderBlocks,
}: {
  section: PlannerSection;
  sectionIndex: number;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (sectionId: string) => void;
  onUpdateSection: (partial: Partial<PlannerSection>) => void;
  onDeleteSection: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  onReorderBlocks: (from: number, to: number) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = section.blocks.findIndex(b => b.id === active.id);
    const to = section.blocks.findIndex(b => b.id === over.id);
    onReorderBlocks(from, to);
  };

  return (
    <div className="rounded-2xl border border-navy-100 bg-white shadow-card overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-navy-100 px-4 py-3">
        <div className="flex flex-col shrink-0">
          <button type="button" disabled={isFirst} onClick={onMoveUp} className="text-navy-300 hover:text-navy-600 disabled:opacity-20">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" disabled={isLast} onClick={onMoveDown} className="text-navy-300 hover:text-navy-600 disabled:opacity-20">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-base">
          {section.icon}
        </span>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={section.title}
            onChange={e => onUpdateSection({ title: e.target.value })}
            placeholder="Section title"
            className="w-full text-sm font-bold text-navy-800 bg-transparent focus:outline-none placeholder-navy-300"
          />
          <p className="text-[11px] text-navy-400">{section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onUpdateSection({ collapsed: !section.collapsed })}
            className="rounded-lg p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
          >
            <ChevronRight className={cn('h-4 w-4 transition-transform', !section.collapsed && 'rotate-90')} />
          </button>
          <button
            type="button"
            onClick={onDeleteSection}
            className="rounded-lg p-1 text-navy-300 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Blocks */}
      {!section.collapsed && (
        <div className="p-3">
          {section.blocks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-1.5 mb-3">
                  {section.blocks.map(block => (
                    <BlockRow
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => onSelectBlock(block.id)}
                      onDelete={() => onDeleteBlock(block.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="mb-3 py-4 text-center text-xs text-navy-300">No blocks yet</p>
          )}

          {/* Add block button */}
          <button
            type="button"
            onClick={() => onAddBlock(section.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-200 py-2 text-xs font-semibold text-navy-500 hover:border-brand hover:bg-brand-50 hover:text-brand transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Block Here
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Block Editor Panel ───────────────────────────────────────────
function BlockEditorPanel({
  block,
  onUpdate,
  onClose,
}: {
  block: PlannerBlock;
  onUpdate: (partial: Partial<PlannerBlock>) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{block.icon}</span>
          <p className="text-sm font-bold text-navy-800">Edit Block</p>
        </div>
        <button type="button" onClick={onClose} className="text-navy-400 hover:text-navy-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Title</label>
            <Input value={block.title} onChange={e => onUpdate({ title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Description</label>
            <Input value={block.description} onChange={e => onUpdate({ description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Icon</label>
            <Input value={block.icon} maxLength={4} onChange={e => onUpdate({ icon: e.target.value })} />
          </div>

          {/* Checklist items */}
          {block.config.type === 'checklist' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Items</label>
              {(block.config as any).items.map((item: any, idx: number) => (
                <div key={item.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={item.label} onChange={e => {
                    const items = [...(block.config as any).items];
                    items[idx] = { ...item, label: e.target.value };
                    onUpdate({ config: { ...block.config, items } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const items = (block.config as any).items.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, items } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const items = [...(block.config as any).items, { id: newId(), label: 'New item', required: false }];
                onUpdate({ config: { ...block.config, items } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add item</button>
            </div>
          )}

          {/* Goals */}
          {block.config.type === 'goals' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Goals</label>
              {(block.config as any).goals.map((goal: any, idx: number) => (
                <div key={goal.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={goal.label} onChange={e => {
                    const goals = [...(block.config as any).goals];
                    goals[idx] = { ...goal, label: e.target.value };
                    onUpdate({ config: { ...block.config, goals } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const goals = (block.config as any).goals.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, goals } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const goals = [...(block.config as any).goals, { id: newId(), label: 'New Goal', placeholder: '' }];
                onUpdate({ config: { ...block.config, goals } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add goal</button>
            </div>
          )}

          {/* Notes */}
          {block.config.type === 'notes' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Placeholder</label>
              <Input value={(block.config as any).placeholder}
                onChange={e => onUpdate({ config: { ...block.config, placeholder: e.target.value } as any })} />
            </div>
          )}

          {/* Progress */}
          {block.config.type === 'progress' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Habits</label>
              {(block.config as any).habits.map((habit: any, idx: number) => (
                <div key={habit.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={habit.label} onChange={e => {
                    const habits = [...(block.config as any).habits];
                    habits[idx] = { ...habit, label: e.target.value };
                    onUpdate({ config: { ...block.config, habits } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const habits = (block.config as any).habits.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, habits } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const habits = [...(block.config as any).habits, { id: newId(), label: 'New Habit', color: '#1061EC' }];
                onUpdate({ config: { ...block.config, habits } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add habit</button>
            </div>
          )}

          {/* Resources */}
          {block.config.type === 'resources' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Resources</label>
              {(block.config as any).resources.map((res: any, idx: number) => (
                <div key={res.id} className="mb-2 rounded-lg border border-navy-100 bg-navy-50 p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Input value={res.label} placeholder="Label" onChange={e => {
                      const resources = [...(block.config as any).resources];
                      resources[idx] = { ...res, label: e.target.value };
                      onUpdate({ config: { ...block.config, resources } as any });
                    }} />
                    <button type="button" onClick={() => {
                      const resources = (block.config as any).resources.filter((_: any, i: number) => i !== idx);
                      onUpdate({ config: { ...block.config, resources } as any });
                    }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <Input value={res.url ?? ''} placeholder="https://..." onChange={e => {
                    const resources = [...(block.config as any).resources];
                    resources[idx] = { ...res, url: e.target.value };
                    onUpdate({ config: { ...block.config, resources } as any });
                  }} />
                </div>
              ))}
              <button type="button" onClick={() => {
                const resources = [...(block.config as any).resources, { id: newId(), label: 'New Resource', url: '' }];
                onUpdate({ config: { ...block.config, resources } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add resource</button>
            </div>
          )}

          {/* Milestones */}
          {block.config.type === 'milestones' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Milestones</label>
              {(block.config as any).milestones.map((m: any, idx: number) => (
                <div key={m.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={m.label} onChange={e => {
                    const milestones = [...(block.config as any).milestones];
                    milestones[idx] = { ...m, label: e.target.value };
                    onUpdate({ config: { ...block.config, milestones } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const milestones = (block.config as any).milestones.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, milestones } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const milestones = [...(block.config as any).milestones, { id: newId(), label: 'New Milestone', placeholder: '' }];
                onUpdate({ config: { ...block.config, milestones } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add milestone</button>
            </div>
          )}

          {/* Timeline */}
          {block.config.type === 'timeline' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Events</label>
              {(block.config as any).events.map((ev: any, idx: number) => (
                <div key={ev.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={ev.label} onChange={e => {
                    const events = [...(block.config as any).events];
                    events[idx] = { ...ev, label: e.target.value };
                    onUpdate({ config: { ...block.config, events } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const events = (block.config as any).events.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, events } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const events = [...(block.config as any).events, { id: newId(), label: 'New Event', placeholder: '' }];
                onUpdate({ config: { ...block.config, events } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add event</button>
            </div>
          )}

          {/* Worksheet */}
          {block.config.type === 'worksheet' && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Questions</label>
              {(block.config as any).questions.map((q: any, idx: number) => (
                <div key={q.id} className="flex items-center gap-1.5 mb-1.5">
                  <Input value={q.question} onChange={e => {
                    const questions = [...(block.config as any).questions];
                    questions[idx] = { ...q, question: e.target.value };
                    onUpdate({ config: { ...block.config, questions } as any });
                  }} />
                  <button type="button" onClick={() => {
                    const questions = (block.config as any).questions.filter((_: any, i: number) => i !== idx);
                    onUpdate({ config: { ...block.config, questions } as any });
                  }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const questions = [...(block.config as any).questions, { id: newId(), question: 'New Question', type: 'textarea', placeholder: '' }];
                onUpdate({ config: { ...block.config, questions } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add question</button>
            </div>
          )}

         {/* Image */}
          {block.config.type === 'image' && (
            <div className="flex flex-col gap-2">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Image</label>
              {(block.config as any).imageData ? (
                <div className="relative">
                  <img src={(block.config as any).imageData} alt="block" className="h-32 w-full rounded-lg object-cover border border-navy-100" />
                  <button type="button" onClick={() => onUpdate({ config: { ...block.config, imageData: null } as any })}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs shadow">✕</button>
                </div>
              ) : (
                <div>
                  <input type="file" accept="image/*" className="hidden" id={`img-${block.id}`}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => onUpdate({ config: { ...block.config, imageData: reader.result } as any });
                      reader.readAsDataURL(file);
                    }} />
                  <label htmlFor={`img-${block.id}`}
                    className="flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100 text-xs text-navy-400 gap-1.5">
                    📷 Upload image
                  </label>
                  <Input className="mt-2" value={(block.config as any).imageUrl ?? ''} placeholder="Or paste image URL..."
                    onChange={e => onUpdate({ config: { ...block.config, imageUrl: e.target.value } as any })} />
                </div>
              )}
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Caption</label>
              <Input value={(block.config as any).preCaption ?? ''} placeholder="Image caption..."
                onChange={e => onUpdate({ config: { ...block.config, preCaption: e.target.value } as any })} />
            </div>
          )}

          {/* File */}
          {block.config.type === 'resources' && (
            <div className="flex flex-col gap-2">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Upload File</label>
              <input type="file" className="hidden" id={`file-${block.id}`}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const resources = [...((block.config as any).resources ?? []), {
                      id: newId(), label: file.name, url: reader.result as string, fileData: true
                    }];
                    onUpdate({ config: { ...block.config, resources } as any });
                  };
                  reader.readAsDataURL(file);
                }} />
              <label htmlFor={`file-${block.id}`}
                className="flex h-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100 text-xs text-navy-400 gap-1.5">
                📎 Upload file
              </label>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Resources</label>
              {(block.config as any).resources.map((res: any, idx: number) => (
                <div key={res.id} className="mb-2 rounded-lg border border-navy-100 bg-navy-50 p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Input value={res.label} placeholder="Label" onChange={e => {
                      const resources = [...(block.config as any).resources];
                      resources[idx] = { ...res, label: e.target.value };
                      onUpdate({ config: { ...block.config, resources } as any });
                    }} />
                    <button type="button" onClick={() => {
                      const resources = (block.config as any).resources.filter((_: any, i: number) => i !== idx);
                      onUpdate({ config: { ...block.config, resources } as any });
                    }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  {!res.fileData && (
                    <Input value={res.url ?? ''} placeholder="https://..." onChange={e => {
                      const resources = [...(block.config as any).resources];
                      resources[idx] = { ...res, url: e.target.value };
                      onUpdate({ config: { ...block.config, resources } as any });
                    }} />
                  )}
                  {res.fileData && <p className="text-[10px] text-navy-400">📎 Uploaded file</p>}
                </div>
              ))}
              <button type="button" onClick={() => {
                const resources = [...(block.config as any).resources, { id: newId(), label: 'New Resource', url: '' }];
                onUpdate({ config: { ...block.config, resources } as any });
              }} className="text-[11px] font-semibold text-brand hover:underline">+ Add link</button>
            </div>
          )}
          {/* Form Fields */}
          {block.config.type === 'form_fields' && (
            <FormFieldsBlockEditor
              config={block.config as unknown as FormFieldsConfig}
              onChange={cfg => onUpdate({ config: cfg as any })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────
function SettingsPanel({
  settings,
  onUpdate,
  fileRef,
  onCoverUpload,
}: {
  settings: PlannerConfig['settings'];
  onUpdate: (partial: Partial<PlannerConfig['settings']>) => void;
  fileRef: React.RefObject<HTMLInputElement>;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [openSections, setOpenSections] = useState({ basic: true, branding: false, advanced: false, export: false });
  const toggle = (key: keyof typeof openSections) => setOpenSections(s => ({ ...s, [key]: !s[key] }));

  return (
    <div className="flex flex-col gap-0">
      {/* Basic Information */}
      <div className="border-b border-navy-100">
        <button type="button" onClick={() => toggle('basic')}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-navy-500 hover:bg-navy-50">
          Basic Information
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', openSections.basic && 'rotate-90')} />
        </button>
        {openSections.basic && (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Planner Name</label>
              <Input value={settings.name} placeholder="My Planner" onChange={e => onUpdate({ name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Description</label>
              <Textarea rows={2} value={settings.description} placeholder="What will users achieve?" onChange={e => onUpdate({ description: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Category</label>
              <Select value={settings.category} onChange={e => onUpdate({ category: e.target.value as any })}>
                {PLANNER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-navy-500">Difficulty</label>
                <Select value={settings.difficulty} onChange={e => onUpdate({ difficulty: e.target.value as any })}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-navy-500">Language</label>
                <Select value={settings.language} onChange={e => onUpdate({ language: e.target.value as any })}>
                  {['English', 'Portuguese', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Estimated Time</label>
              <Input value={settings.estimatedDuration} placeholder="30 minutes/day" onChange={e => onUpdate({ estimatedDuration: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* Branding */}
      <div className="border-b border-navy-100">
        <button type="button" onClick={() => toggle('branding')}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-navy-500 hover:bg-navy-50">
          Branding
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', openSections.branding && 'rotate-90')} />
        </button>
        {openSections.branding && (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Icon (emoji)</label>
              <Input value={settings.icon} maxLength={4} onChange={e => onUpdate({ icon: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold text-navy-500">Theme Color</label>
              <div className="flex flex-wrap gap-1.5">
                {THEME_COLORS.map(color => (
                  <button key={color} type="button" onClick={() => onUpdate({ primaryColor: color })}
                    className={cn('h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                      settings.primaryColor === color ? 'border-navy-800 scale-110' : 'border-white shadow')}
                    style={{ background: color }} />
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-navy-500">Cover Image</label>
              {settings.coverImage ? (
                <div className="relative">
                  <img src={settings.coverImage} alt="Cover" className="h-24 w-full rounded-lg object-cover" />
                  <button type="button" onClick={() => onUpdate({ coverImage: null })}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()}
                  className="flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100">
                  <p className="flex items-center gap-1.5 text-xs text-navy-400"><Upload className="h-3.5 w-3.5" /> Upload cover</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onCoverUpload} />
            </div>
          </div>
        )}
      </div>

      {/* Export & Share */}
      <div className="border-b border-navy-100">
        <button type="button" onClick={() => toggle('export')}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-navy-500 hover:bg-navy-50">
          Export & Share
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', openSections.export && 'rotate-90')} />
        </button>
        {openSections.export && (
          <div className="flex flex-col gap-2 px-4 pb-4">
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-navy-400">Page Size</label>
                <Select value={settings.pageSize} onChange={e => onUpdate({ pageSize: e.target.value as any })}>
                  {['A4', 'Letter', 'A5'].map(s => <option key={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-navy-400">Orientation</label>
                <Select value={settings.pageOrientation} onChange={e => onUpdate({ pageOrientation: e.target.value as any })}>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </Select>
              </div>
            </div>
            {[
              { key: 'exportPdf' as const, label: 'PDF Export' },
              { key: 'exportPrint' as const, label: 'Print' },
              { key: 'allowShare' as const, label: 'Share Link' },
            ].map(opt => (
              <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-xs text-navy-700">
                <input type="checkbox" checked={settings[opt.key] as boolean}
                  onChange={e => onUpdate({ [opt.key]: e.target.checked })}
                  className="h-3.5 w-3.5 rounded accent-brand" />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cover Preview ────────────────────────────────────────────────
function CoverPreview({ settings, totalBlocks, totalSections }: {
  settings: PlannerConfig['settings'];
  totalBlocks: number;
  totalSections: number;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-navy-100 shadow-card mb-4">
      <div
        className="relative flex min-h-[140px] items-end p-5"
        style={{ background: `linear-gradient(135deg, ${settings.primaryColor}dd, ${settings.primaryColor}88)` }}
      >
        {settings.coverImage && (
          <img src={settings.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative z-10">
          <span className="text-3xl">{settings.icon}</span>
          <h2 className="mt-1 text-xl font-extrabold text-white leading-tight">
            {settings.name || 'Your Planner Name'}
          </h2>
          {settings.description && (
            <p className="mt-1 text-sm text-white/80 line-clamp-2">{settings.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">{settings.category}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">Difficulty: {settings.difficulty}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">⏱ {settings.estimatedDuration}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 divide-x divide-navy-100 border-t border-navy-100 bg-white">
        {[
          { label: 'Sections', value: totalSections },
          { label: 'Blocks', value: totalBlocks },
          { label: 'Est. Time', value: settings.estimatedDuration.split('/')[0] },
          { label: 'Language', value: settings.language.slice(0, 3) },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center py-3">
            <p className="text-base font-extrabold text-brand">{s.value}</p>
            <p className="text-[10px] text-navy-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────
interface PlannerBuilderProps {
  planner: PlannerConfig;
  onSave: (planner: PlannerConfig) => void;
  onBack: () => void;
  onPreview: () => void;
}

function newSection(): PlannerSection {
  return {
    id: newId(),
    title: 'New Section',
    description: '',
    icon: '📋',
    blocks: [],
    collapsed: false,
  };
}

// Convert flat blocks to sections (for migration from old format)
function migrateToSections(planner: PlannerConfig): PlannerSection[] {
  // If already has sections (new format), return as-is
  if ((planner as any).sections?.length > 0) return (planner as any).sections;
  // Migrate old flat blocks into a single default section
  if (planner.blocks?.length > 0) {
    return [{
      id: newId(),
      title: 'Main Content',
      description: '',
      icon: '📋',
      blocks: planner.blocks,
      collapsed: false,
    }];
  }
  return [];
}

export function PlannerBuilder({ planner, onSave, onBack, onPreview }: PlannerBuilderProps) {
  const [draft, setDraft] = useState<PlannerConfig>({ ...planner, settings: { ...planner.settings } });
  const [sections, setSections] = useState<PlannerSection[]>(() => migrateToSections(planner));
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockSectionId, setSelectedBlockSectionId] = useState<string | null>(null);
  const [addBlockSectionId, setAddBlockSectionId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('builder');
  const fileRef = useRef<HTMLInputElement>(null);

  const updateSettings = (partial: Partial<typeof draft.settings>) => {
    setDraft(d => ({ ...d, settings: { ...d.settings, ...partial }, updatedAt: new Date().toISOString() }));
  };

  const addSection = () => {
    setSections(s => [...s, newSection()]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(s => s.filter(sec => sec.id !== sectionId));
  };

  const updateSection = (sectionId: string, partial: Partial<PlannerSection>) => {
    setSections(s => s.map(sec => sec.id === sectionId ? { ...sec, ...partial } : sec));
  };

  const moveSectionUp = (idx: number) => {
    if (idx === 0) return;
    setSections(s => {
      const arr = [...s];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveSectionDown = (idx: number) => {
    setSections(s => {
      if (idx >= s.length - 1) return s;
      const arr = [...s];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  const addBlock = (sectionId: string, type: BlockType) => {
    const block = defaultBlock(type);
    setSections(s => s.map(sec =>
      sec.id === sectionId ? { ...sec, blocks: [...sec.blocks, block] } : sec
    ));
    setSelectedBlockId(block.id);
    setSelectedBlockSectionId(sectionId);
    setAddBlockSectionId(null);
  };

  const deleteBlock = (sectionId: string, blockId: string) => {
    setSections(s => s.map(sec =>
      sec.id === sectionId ? { ...sec, blocks: sec.blocks.filter(b => b.id !== blockId) } : sec
    ));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setSelectedBlockSectionId(null);
    }
  };

  const updateBlock = (sectionId: string, blockId: string, partial: Partial<PlannerBlock>) => {
    setSections(s => s.map(sec =>
      sec.id === sectionId
        ? { ...sec, blocks: sec.blocks.map(b => b.id === blockId ? { ...b, ...partial } : b) }
        : sec
    ));
  };

  const reorderBlocks = (sectionId: string, from: number, to: number) => {
    setSections(s => s.map(sec =>
      sec.id === sectionId ? { ...sec, blocks: arrayMove(sec.blocks, from, to) } : sec
    ));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 800;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(url);
      updateSettings({ coverImage: compressed });
    };
    img.src = url;
  };

  const handleSave = (publishStatus: 'draft' | 'published') => {
    const allBlocks = sections.flatMap(s => s.blocks);
    onSave({ ...draft, blocks: allBlocks, publishStatus, ...(({ sections }) => ({ sections }))(({ sections })) } as any);
  };

  const totalBlocks = sections.reduce((sum, s) => sum + s.blocks.length, 0);

  const selectedBlock = selectedBlockSectionId && selectedBlockId
    ? sections.find(s => s.id === selectedBlockSectionId)?.blocks.find(b => b.id === selectedBlockId) ?? null
    : null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f4f6fb]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white px-4 py-2.5 z-10">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">My Planners</span>
          </button>
          <span className="text-navy-200">/</span>
          <span className="text-sm font-semibold text-navy-800 truncate max-w-[200px]">
            {draft.settings.name || 'New Planner'}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-navy-100 bg-navy-50 p-1">
          {([
            { key: 'builder' as Tab, label: 'Builder' },
            { key: 'preview' as Tab, label: 'Preview' },
            { key: 'fill' as Tab, label: 'Fill Preview' },
          ]).map(({ key, label }) => (
            <button key={key} type="button" onClick={() => { setTab(key); if (key === 'fill') onPreview(); }}
              className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                tab === key ? 'bg-white shadow-sm text-brand' : 'text-navy-500 hover:text-navy-700')}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSave('draft')}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button type="button" onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
            🚀 <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </div>

      {/* 3-column workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Col 1 — Settings (240px) */}
        <div className="w-[240px] shrink-0 overflow-y-auto border-r border-navy-100 bg-white">
          <div className="flex items-center gap-2 border-b border-navy-100 px-4 py-3">
            <Settings className="h-4 w-4 text-navy-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Planner Settings</p>
          </div>
          <SettingsPanel
            settings={draft.settings}
            onUpdate={updateSettings}
            fileRef={fileRef}
            onCoverUpload={handleCoverUpload}
          />
        </div>

        {/* Col 2 — Structure (flex-1) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Planner Structure</p>
            <button type="button" onClick={addSection}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-500 hover:border-brand hover:bg-brand-50 hover:text-brand transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add Section
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Cover preview */}
            <CoverPreview
              settings={draft.settings}
              totalBlocks={totalBlocks}
              totalSections={sections.length}
            />

            {/* Sections */}
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 py-16 text-center">
                <p className="text-sm font-semibold text-navy-500">No sections yet</p>
                <p className="mt-1 text-xs text-navy-400">Click "Add Section" to get started</p>
                <button type="button" onClick={addSection}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                  <Plus className="h-4 w-4" /> Add Section
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sections.map((section, idx) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    sectionIndex={idx}
                    selectedBlockId={selectedBlockSectionId === section.id ? selectedBlockId : null}
                    onSelectBlock={(blockId) => {
                      setSelectedBlockId(blockId);
                      setSelectedBlockSectionId(section.id);
                    }}
                    onDeleteBlock={(blockId) => deleteBlock(section.id, blockId)}
                    onAddBlock={(sectionId) => setAddBlockSectionId(sectionId)}
                    onUpdateSection={(partial) => updateSection(section.id, partial)}
                    onDeleteSection={() => deleteSection(section.id)}
                    onMoveUp={() => moveSectionUp(idx)}
                    onMoveDown={() => moveSectionDown(idx)}
                    isFirst={idx === 0}
                    isLast={idx === sections.length - 1}
                    onReorderBlocks={(from, to) => reorderBlocks(section.id, from, to)}
                  />
                ))}

                <button type="button" onClick={addSection}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 py-4 text-sm font-semibold text-navy-400 hover:border-brand hover:bg-brand-50 hover:text-brand transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Col 3 — Block editor OR empty state (280px) */}
        <div className="w-[280px] shrink-0 overflow-y-auto border-l border-navy-100 bg-white">
          {selectedBlock && selectedBlockSectionId ? (
            <BlockEditorPanel
              block={selectedBlock}
              onUpdate={(partial) => updateBlock(selectedBlockSectionId, selectedBlock.id, partial)}
              onClose={() => { setSelectedBlockId(null); setSelectedBlockSectionId(null); }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-300 mb-3">
                <Eye className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-navy-500">Select a block to edit</p>
              <p className="mt-1 text-xs text-navy-400 leading-relaxed">
                Click any block in a section to configure its content and settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Block Modal */}
      {addBlockSectionId && (
        <AddBlockModal
          onAdd={(type) => addBlock(addBlockSectionId, type)}
          onClose={() => setAddBlockSectionId(null)}
        />
      )}
    </div>
  );
}
