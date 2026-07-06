import { useState, useRef } from 'react';
import {
  ArrowLeft, Save, Eye, Plus, Trash2, GripVertical,
  Check, X, Monitor, Tablet, Smartphone
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

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

// -----------------------------------------------------------------------
// Sortable Block Row
// -----------------------------------------------------------------------
function SortableBlockRow({ block, isSelected, onSelect, onDelete, onToggle }: {
  block: PlannerBlock; isSelected: boolean;
  onSelect: () => void; onDelete: () => void; onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('flex items-center gap-2 rounded-lg border p-2 transition-all cursor-pointer text-xs',
        isDragging && 'opacity-50 shadow-lg',
        isSelected ? 'border-brand bg-brand-50' : 'border-navy-100 bg-white hover:border-brand-200',
        !block.enabled && 'opacity-50')}
      onClick={onSelect}>
      <button type="button" className="cursor-grab text-navy-300 active:cursor-grabbing"
        {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="text-base">{block.icon}</span>
      <span className="flex-1 font-medium text-navy-800 truncate">{block.title}</span>
      <button type="button" onClick={e => { e.stopPropagation(); onToggle(); }}
        className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
          block.enabled ? 'bg-emerald-500 text-white' : 'border border-navy-200')}>
        {block.enabled && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
      </button>
      <button type="button" onClick={e => { e.stopPropagation(); onDelete(); }}
        className="text-navy-300 hover:text-red-500">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------
// Live Preview
// -----------------------------------------------------------------------
function PlannerPreview({ planner, previewMode }: { planner: PlannerConfig; previewMode: PreviewMode }) {
  const enabledBlocks = planner.blocks.filter(b => b.enabled);
  return (
    <div className={cn('mx-auto overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-cardHover transition-all',
      previewMode === 'desktop' && 'w-full',
      previewMode === 'tablet' && 'max-w-[500px]',
      previewMode === 'mobile' && 'max-w-[280px]')}>
      {/* Cover */}
      <div className="relative flex min-h-[100px] items-end p-4"
        style={{ background: `linear-gradient(135deg, ${planner.settings.primaryColor}, ${planner.settings.accentColor})` }}>
        {planner.settings.coverImage && (
          <img src={planner.settings.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="relative z-10">
          <span className="text-2xl">{planner.settings.icon}</span>
          <h2 className="mt-1 text-base font-extrabold text-white leading-tight">
            {planner.settings.name || 'Your Planner Name'}
          </h2>
          {planner.settings.description && (
            <p className="mt-0.5 text-[10px] text-white/70 line-clamp-2">{planner.settings.description}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] text-white">{planner.settings.category}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] text-white">{planner.settings.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Blocks list */}
      <div className="p-3">
        {enabledBlocks.length === 0 ? (
          <p className="py-4 text-center text-xs text-navy-300">Add blocks to see your planner</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {enabledBlocks.slice(0, 8).map((block, i) => (
              <div key={block.id} className="flex items-center gap-2 rounded-lg border border-navy-50 px-2.5 py-2">
                <span className="text-sm">{block.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-navy-800 truncate">{block.title}</p>
                  <p className="text-[9px] text-navy-400 truncate">{block.description}</p>
                </div>
                <span className="text-[9px] font-bold rounded-full px-1.5 py-0.5 text-white"
                  style={{ background: block.color }}>{BLOCK_TYPE_INFO[block.config.type].label.slice(0, 4)}</span>
              </div>
            ))}
            {enabledBlocks.length > 8 && (
              <p className="text-center text-[10px] text-navy-400">+{enabledBlocks.length - 8} more blocks</p>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="border-t border-navy-50 px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-navy-400">{enabledBlocks.length} blocks</span>
        <span className="text-[10px] text-navy-400">{planner.settings.estimatedDuration}</span>
        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
          style={{ background: planner.settings.primaryColor }}>Open Planner</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Main Builder — 3 columns
// -----------------------------------------------------------------------
interface PlannerBuilderProps {
  planner: PlannerConfig;
  onSave: (planner: PlannerConfig) => void;
  onBack: () => void;
  onPreview: () => void;
}

export function PlannerBuilder({ planner, onSave, onBack, onPreview }: PlannerBuilderProps) {
  const [draft, setDraft] = useState<PlannerConfig>({ ...planner, settings: { ...planner.settings } });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const fileRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const updateSettings = (partial: Partial<typeof draft.settings>) => {
    setDraft(d => ({ ...d, settings: { ...d.settings, ...partial }, updatedAt: new Date().toISOString() }));
  };

  const updateBlock = (id: string, partial: Partial<PlannerBlock>) => {
    setDraft(d => ({ ...d, blocks: d.blocks.map(b => b.id === id ? { ...b, ...partial } : b) }));
  };

  const addBlock = (type: BlockType) => {
    const block = defaultBlock(type);
    setDraft(d => ({ ...d, blocks: [...d.blocks, block] }));
    setSelectedBlockId(block.id);
    setShowAddBlock(false);
  };

  const deleteBlock = (id: string) => {
    setDraft(d => ({ ...d, blocks: d.blocks.filter(b => b.id !== id) }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = draft.blocks.findIndex(b => b.id === active.id);
    const to = draft.blocks.findIndex(b => b.id === over.id);
    setDraft(d => ({ ...d, blocks: arrayMove(d.blocks, from, to) }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Compress image before saving to avoid localStorage size limits
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

  const selectedBlock = draft.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800">
            <ArrowLeft className="h-4 w-4" /> My Planners
          </button>
          <span className="text-navy-200">/</span>
          <span className="text-sm font-semibold text-navy-800">{draft.settings.name || 'New Planner'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPreview}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50">
            <Eye className="h-4 w-4" /> Fill Preview
          </button>
          <button type="button" onClick={() => onSave({ ...draft, publishStatus: 'draft' })}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50">
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button type="button" onClick={() => onSave({ ...draft, publishStatus: 'published' })}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
            🚀 Publish
          </button>
        </div>
      </div>

      {/* 3-column workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Col 1 — Settings (250px) */}
        <div className="w-[250px] shrink-0 overflow-y-auto border-r border-navy-100 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">Settings</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Name *</label>
              <Input value={draft.settings.name} placeholder="My Planner" onChange={e => updateSettings({ name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Description</label>
              <Textarea rows={2} value={draft.settings.description} placeholder="What will users achieve?" onChange={e => updateSettings({ description: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Category</label>
              <Select value={draft.settings.category} onChange={e => updateSettings({ category: e.target.value as any })}>
                {PLANNER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-600">Difficulty</label>
                <Select value={draft.settings.difficulty} onChange={e => updateSettings({ difficulty: e.target.value as any })}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-600">Language</label>
                <Select value={draft.settings.language} onChange={e => updateSettings({ language: e.target.value as any })}>
                  {['English', 'Portuguese', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Duration</label>
              <Input value={draft.settings.estimatedDuration} placeholder="30 minutes/day" onChange={e => updateSettings({ estimatedDuration: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Author</label>
              <Input value={draft.settings.author} placeholder="Your name" onChange={e => updateSettings({ author: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Tags</label>
              <Input value={draft.settings.tags.join(', ')} placeholder="business, goals" onChange={e => updateSettings({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Icon (emoji)</label>
              <Input value={draft.settings.icon} maxLength={4} onChange={e => updateSettings({ icon: e.target.value })} />
            </div>

            {/* Theme color */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy-600">Theme Color</label>
              <div className="flex flex-wrap gap-1.5">
                {THEME_COLORS.map(color => (
                  <button key={color} type="button" onClick={() => updateSettings({ primaryColor: color })}
                    className={cn('h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                      draft.settings.primaryColor === color ? 'border-navy-800 scale-110' : 'border-white shadow')}
                    style={{ background: color }} />
                ))}
              </div>
            </div>

            {/* Cover image */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy-600">Cover Image</label>
              {draft.settings.coverImage ? (
                <div className="relative">
                  <img src={draft.settings.coverImage} alt="Cover" className="h-24 w-full rounded-lg object-cover" />
                  <button type="button" onClick={() => updateSettings({ coverImage: null })}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()}
                  className="flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100">
                  <p className="text-xs text-navy-400">📷 Upload cover</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </div>

            {/* Export settings */}
            <div className="rounded-lg border border-navy-100 bg-navy-50 p-3">
              <p className="mb-2 text-xs font-semibold text-navy-600">Export</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="mb-0.5 block text-[10px] text-navy-500">Page Size</label>
                  <Select value={draft.settings.pageSize} onChange={e => updateSettings({ pageSize: e.target.value as any })}>
                    {['A4', 'Letter', 'A5'].map(s => <option key={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="mb-0.5 block text-[10px] text-navy-500">Orientation</label>
                  <Select value={draft.settings.pageOrientation} onChange={e => updateSettings({ pageOrientation: e.target.value as any })}>
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
                <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-xs text-navy-700 mb-1">
                  <input type="checkbox" checked={draft.settings[opt.key] as boolean}
                    onChange={e => updateSettings({ [opt.key]: e.target.checked })}
                    className="h-3.5 w-3.5 rounded accent-brand" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 — Preview (flex-1, larger) */}
        <div className="flex flex-1 flex-col overflow-hidden border-r border-navy-100 bg-[#f4f6fb]">
          {/* Preview toolbar */}
          <div className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white px-4 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Planner Preview</p>
            <div className="flex items-center gap-1 rounded-lg border border-navy-100 bg-navy-50 p-0.5">
              {([
                { mode: 'desktop' as PreviewMode, Icon: Monitor },
                { mode: 'tablet' as PreviewMode, Icon: Tablet },
                { mode: 'mobile' as PreviewMode, Icon: Smartphone },
              ]).map(({ mode, Icon }) => (
                <button key={mode} type="button" onClick={() => setPreviewMode(mode)}
                  className={cn('flex h-6 w-6 items-center justify-center rounded transition-colors',
                    previewMode === mode ? 'bg-white shadow-sm text-brand' : 'text-navy-400 hover:text-navy-600')}>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-y-auto p-6">
            <PlannerPreview planner={draft} previewMode={previewMode} />

            {/* Tips */}
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-[11px] font-semibold text-amber-700">💡 Tips</p>
              <p className="mt-1 text-[10px] text-amber-600">Add blocks from the right panel. Use the Settings on the left to configure the planner details. Click "Fill Preview" to see how users will experience it.</p>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: 'Blocks', value: draft.blocks.filter(b => b.enabled).length },
                { label: 'Total Blocks', value: draft.blocks.length },
                { label: 'Est. Time', value: draft.settings.estimatedDuration.split('/')[0] },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border border-navy-100 bg-white p-3 text-center shadow-card">
                  <p className="text-lg font-extrabold text-brand">{stat.value}</p>
                  <p className="text-[10px] text-navy-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3 — Blocks (280px) */}
        <div className="w-[280px] shrink-0 overflow-y-auto bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Blocks ({draft.blocks.length})</p>
            <button type="button" onClick={() => setShowAddBlock(v => !v)}
              className="flex items-center gap-1 rounded-lg bg-brand px-2 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          {/* Add block picker */}
          {showAddBlock && (
            <div className="mb-3 rounded-xl border border-navy-100 bg-navy-50 p-2.5">
              <p className="mb-2 text-[10px] font-semibold text-navy-500">Choose type:</p>
              <div className="grid grid-cols-2 gap-1">
                {(Object.entries(BLOCK_TYPE_INFO) as [BlockType, typeof BLOCK_TYPE_INFO[BlockType]][]).map(([type, info]) => (
                  <button key={type} type="button" onClick={() => addBlock(type)}
                    className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-left text-[11px] font-medium text-navy-700 hover:border-brand hover:bg-brand-50">
                    <span>{info.icon}</span> {info.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Block list */}
          {draft.blocks.length === 0 ? (
            <p className="py-6 text-center text-xs text-navy-400">No blocks yet. Click "Add" to start.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext items={draft.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-1.5 mb-4">
                  {draft.blocks.map(block => (
                    <SortableBlockRow key={block.id} block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onDelete={() => deleteBlock(block.id)}
                      onToggle={() => updateBlock(block.id, { enabled: !block.enabled })}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Block editor */}
          {selectedBlock && (
            <div className="border-t border-navy-100 pt-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">Edit Block</p>
              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-navy-600">Title</label>
                  <Input value={selectedBlock.title} onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-navy-600">Description</label>
                  <Input value={selectedBlock.description} onChange={e => updateBlock(selectedBlock.id, { description: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-navy-600">Icon</label>
                  <Input value={selectedBlock.icon} maxLength={4} onChange={e => updateBlock(selectedBlock.id, { icon: e.target.value })} />
                </div>

                {/* Checklist items */}
                {selectedBlock.config.type === 'checklist' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Items</label>
                    {(selectedBlock.config as any).items.map((item: any, idx: number) => (
                      <div key={item.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={item.label} onChange={e => {
                          const items = [...(selectedBlock.config as any).items];
                          items[idx] = { ...item, label: e.target.value };
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                        }} />
                        <button type="button" onClick={() => {
                          const items = (selectedBlock.config as any).items.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const items = [...(selectedBlock.config as any).items, { id: newId(), label: 'New item', required: false }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add item</button>
                  </div>
                )}

                {/* Goals */}
                {selectedBlock.config.type === 'goals' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Goals</label>
                    {(selectedBlock.config as any).goals.map((goal: any, idx: number) => (
                      <div key={goal.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={goal.label} onChange={e => {
                          const goals = [...(selectedBlock.config as any).goals];
                          goals[idx] = { ...goal, label: e.target.value };
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                        }} />
                        <button type="button" onClick={() => {
                          const goals = (selectedBlock.config as any).goals.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const goals = [...(selectedBlock.config as any).goals, { id: newId(), label: 'New Goal', placeholder: '' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add goal</button>
                  </div>
                )}

                {/* Notes */}
                {selectedBlock.config.type === 'notes' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Placeholder</label>
                    <Input value={(selectedBlock.config as any).placeholder}
                      onChange={e => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, placeholder: e.target.value } as any })} />
                  </div>
                )}

                {/* Progress habits */}
                {selectedBlock.config.type === 'progress' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Habits</label>
                    {(selectedBlock.config as any).habits.map((habit: any, idx: number) => (
                      <div key={habit.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={habit.label} onChange={e => {
                          const habits = [...(selectedBlock.config as any).habits];
                          habits[idx] = { ...habit, label: e.target.value };
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, habits } as any });
                        }} />
                        <button type="button" onClick={() => {
                          const habits = (selectedBlock.config as any).habits.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, habits } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const habits = [...(selectedBlock.config as any).habits, { id: newId(), label: 'New Habit', color: '#1061EC' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, habits } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add habit</button>
                  </div>
                )}

                {/* Resources */}
                {selectedBlock.config.type === 'resources' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Pre-configured Resources</label>
                    {(selectedBlock.config as any).resources.map((res: any, idx: number) => (
                      <div key={res.id} className="mb-2 rounded-lg border border-navy-100 bg-navy-50 p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Input value={res.label} placeholder="Label"
                            onChange={e => {
                              const resources = [...(selectedBlock.config as any).resources];
                              resources[idx] = { ...res, label: e.target.value };
                              updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, resources } as any });
                            }} />
                          <button type="button" onClick={() => {
                            const resources = (selectedBlock.config as any).resources.filter((_: any, i: number) => i !== idx);
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, resources } as any });
                          }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                        </div>
                        <Input value={res.url ?? ''} placeholder="https://..."
                          onChange={e => {
                            const resources = [...(selectedBlock.config as any).resources];
                            resources[idx] = { ...res, url: e.target.value };
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, resources } as any });
                          }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const resources = [...(selectedBlock.config as any).resources, { id: newId(), label: 'New Resource', url: '' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, resources } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add resource</button>
                  </div>
                )}

                {/* Worksheet questions */}
                {selectedBlock.config.type === 'worksheet' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Questions</label>
                    {(selectedBlock.config as any).questions.map((q: any, idx: number) => (
                      <div key={q.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={q.question} placeholder="Question..."
                          onChange={e => {
                            const questions = [...(selectedBlock.config as any).questions];
                            questions[idx] = { ...q, question: e.target.value };
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, questions } as any });
                          }} />
                        <button type="button" onClick={() => {
                          const questions = (selectedBlock.config as any).questions.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, questions } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const questions = [...(selectedBlock.config as any).questions, { id: newId(), question: 'New Question', type: 'textarea', placeholder: '' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, questions } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add question</button>
                  </div>
                )}

                {/* Milestones */}
                {selectedBlock.config.type === 'milestones' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Milestones</label>
                    {(selectedBlock.config as any).milestones.map((m: any, idx: number) => (
                      <div key={m.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={m.label} placeholder="Milestone..."
                          onChange={e => {
                            const milestones = [...(selectedBlock.config as any).milestones];
                            milestones[idx] = { ...m, label: e.target.value };
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, milestones } as any });
                          }} />
                        <button type="button" onClick={() => {
                          const milestones = (selectedBlock.config as any).milestones.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, milestones } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const milestones = [...(selectedBlock.config as any).milestones, { id: newId(), label: 'New Milestone', placeholder: '' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, milestones } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add milestone</button>
                  </div>
                )}

                {/* Timeline */}
                {selectedBlock.config.type === 'timeline' && (
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-navy-600">Events</label>
                    {(selectedBlock.config as any).events.map((ev: any, idx: number) => (
                      <div key={ev.id} className="flex items-center gap-1.5 mb-1">
                        <Input value={ev.label} placeholder="Event..."
                          onChange={e => {
                            const events = [...(selectedBlock.config as any).events];
                            events[idx] = { ...ev, label: e.target.value };
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, events } as any });
                          }} />
                        <button type="button" onClick={() => {
                          const events = (selectedBlock.config as any).events.filter((_: any, i: number) => i !== idx);
                          updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, events } as any });
                        }} className="text-navy-300 hover:text-red-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const events = [...(selectedBlock.config as any).events, { id: newId(), label: 'New Event', placeholder: '' }];
                      updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, events } as any });
                    }} className="text-[11px] font-medium text-brand-600 hover:underline">+ Add event</button>
                  </div>
                )}

                {/* Image pre-config */}
                {selectedBlock.config.type === 'image' && (
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold text-navy-600">Pre-configured Image</label>
                      {(selectedBlock.config as any).preImage ? (
                        <div className="relative">
                          <img src={(selectedBlock.config as any).preImage} alt="" className="w-full h-24 object-cover rounded-lg" />
                          <button type="button" onClick={() => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, preImage: null } as any })}
                            className="absolute right-1 top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">✕</button>
                        </div>
                      ) : (
                        <label className="flex h-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100">
                          <span className="text-xs text-navy-400">📷 Upload image</span>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = ev => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, preImage: ev.target?.result } as any });
                              reader.readAsDataURL(file);
                            }} />
                        </label>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold text-navy-600">Pre-configured Caption</label>
                      <Input value={(selectedBlock.config as any).preCaption ?? ''} placeholder="Image caption..."
                        onChange={e => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, preCaption: e.target.value } as any })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold text-navy-600">Upload Prompt for User</label>
                      <Input value={(selectedBlock.config as any).prompt ?? ''} placeholder="Upload your inspiration..."
                        onChange={e => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, prompt: e.target.value } as any })} />
                    </div>
                  </div>
                )}

                {/* Form Fields — full editor */}
                {selectedBlock.config.type === 'form_fields' && (
                  <FormFieldsBlockEditor
                    config={selectedBlock.config as unknown as FormFieldsConfig}
                    onChange={cfg => updateBlock(selectedBlock.id, { config: cfg as any })}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
