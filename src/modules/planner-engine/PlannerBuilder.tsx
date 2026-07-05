import { useState, useRef } from 'react';
import {
  ArrowLeft, Save, Eye, Plus, Trash2, GripVertical,
  Settings, Layers, ChevronDown, ChevronUp, Check, X
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
import {
  type PlannerConfig, type PlannerBlock, type BlockType,
  BLOCK_TYPE_INFO, THEME_COLORS, PLANNER_CATEGORIES,
  defaultBlock, newId, defaultSettings,
} from './types';
import { cn } from '../../lib/utils';

type BuilderTab = 'settings' | 'blocks';

// -----------------------------------------------------------------------
// Sortable Block Row
// -----------------------------------------------------------------------
function SortableBlockRow({
  block, isSelected, onSelect, onDelete, onToggle,
}: {
  block: PlannerBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer',
        isDragging && 'opacity-50 shadow-lg',
        isSelected ? 'border-brand bg-brand-50' : 'border-navy-100 bg-white hover:border-brand-200',
        !block.enabled && 'opacity-60'
      )}
      onClick={onSelect}
    >
      <button type="button" className="cursor-grab text-navy-300 hover:text-navy-500 active:cursor-grabbing"
        {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-xl">{block.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-800 truncate">{block.title}</p>
        <p className="text-xs text-navy-400 truncate">{block.description}</p>
      </div>
      <button type="button" onClick={e => { e.stopPropagation(); onToggle(); }}
        className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors',
          block.enabled ? 'bg-emerald-500 text-white' : 'border border-navy-200 text-navy-300')}>
        {block.enabled && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
      <button type="button" onClick={e => { e.stopPropagation(); onDelete(); }}
        className="shrink-0 text-navy-300 hover:text-red-500">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------
// Main Builder
// -----------------------------------------------------------------------
interface PlannerBuilderProps {
  planner: PlannerConfig;
  onSave: (planner: PlannerConfig) => void;
  onBack: () => void;
  onPreview: () => void;
}

export function PlannerBuilder({ planner, onSave, onBack, onPreview }: PlannerBuilderProps) {
  const [draft, setDraft] = useState<PlannerConfig>({ ...planner, settings: { ...planner.settings } });
  const [tab, setTab] = useState<BuilderTab>('settings');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
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
    const reader = new FileReader();
    reader.onload = ev => updateSettings({ coverImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const selectedBlock = draft.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button type="button" onClick={() => onSave({ ...draft, publishStatus: 'published' })}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600">
            <Save className="h-4 w-4" /> Save & Publish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-navy-100 bg-white px-4">
        {([
          { id: 'settings' as BuilderTab, label: 'Settings', icon: <Settings className="h-4 w-4" /> },
          { id: 'blocks' as BuilderTab, label: 'Blocks', icon: <Layers className="h-4 w-4" /> },
        ]).map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              tab === t.id ? 'border-brand text-brand-700' : 'border-transparent text-navy-400 hover:text-navy-700')}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="flex-1 overflow-y-auto bg-[#f4f6fb] p-6">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h2 className="mb-6 text-lg font-bold text-navy-900">Planner Settings</h2>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {/* Left — main fields */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-700">Planner Name <span className="text-red-500">*</span></label>
                      <Input value={draft.settings.name} placeholder="Business Startup Planner" onChange={e => updateSettings({ name: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-700">Description</label>
                      <Textarea rows={3} value={draft.settings.description} placeholder="Describe what this planner helps users achieve..." onChange={e => updateSettings({ description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Category</label>
                        <Select value={draft.settings.category} onChange={e => updateSettings({ category: e.target.value as any })}>
                          {PLANNER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Difficulty</label>
                        <Select value={draft.settings.difficulty} onChange={e => updateSettings({ difficulty: e.target.value as any })}>
                          {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Language</label>
                        <Select value={draft.settings.language} onChange={e => updateSettings({ language: e.target.value as any })}>
                          {['English', 'Portuguese', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Estimated Duration</label>
                        <Input value={draft.settings.estimatedDuration} placeholder="30 minutes/day" onChange={e => updateSettings({ estimatedDuration: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-700">Author</label>
                      <Input value={draft.settings.author} placeholder="Your name or company" onChange={e => updateSettings({ author: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-700">Tags</label>
                      <Input value={draft.settings.tags.join(', ')} placeholder="business, goals, productivity" onChange={e => updateSettings({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
                    </div>

                    {/* Theme Color */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy-700">Theme Color</label>
                      <div className="flex flex-wrap gap-2">
                        {THEME_COLORS.map(color => (
                          <button key={color} type="button" onClick={() => updateSettings({ primaryColor: color })}
                            className={cn('h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                              draft.settings.primaryColor === color ? 'border-navy-800 scale-110' : 'border-white shadow')}
                            style={{ background: color }} />
                        ))}
                        <input type="color" value={draft.settings.primaryColor}
                          onChange={e => updateSettings({ primaryColor: e.target.value })}
                          className="h-7 w-7 cursor-pointer rounded-full border border-navy-200" />
                      </div>
                    </div>

                    {/* Icon */}
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-700">Icon (emoji)</label>
                      <Input value={draft.settings.icon} placeholder="📋" maxLength={4} onChange={e => updateSettings({ icon: e.target.value })} />
                    </div>

                    {/* Export Settings */}
                    <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-navy-700">Export Settings</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-navy-600">Page Size</label>
                          <Select value={draft.settings.pageSize} onChange={e => updateSettings({ pageSize: e.target.value as any })}>
                            {['A4', 'Letter', 'A5'].map(s => <option key={s}>{s}</option>)}
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-navy-600">Orientation</label>
                          <Select value={draft.settings.pageOrientation} onChange={e => updateSettings({ pageOrientation: e.target.value as any })}>
                            {['portrait', 'landscape'].map(o => <option key={o}>{o}</option>)}
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        {[
                          { key: 'exportPdf' as const, label: 'Allow PDF Export' },
                          { key: 'exportPrint' as const, label: 'Allow Print' },
                          { key: 'allowShare' as const, label: 'Allow Share' },
                        ].map(opt => (
                          <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-sm text-navy-700">
                            <input type="checkbox" checked={draft.settings[opt.key] as boolean}
                              onChange={e => updateSettings({ [opt.key]: e.target.checked })}
                              className="h-4 w-4 rounded accent-brand" />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — cover image + preview */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy-700">Cover Image</label>
                      {draft.settings.coverImage ? (
                        <div className="relative">
                          <img src={draft.settings.coverImage} alt="Cover" className="h-48 w-full rounded-xl object-cover shadow-card" />
                          <button type="button" onClick={() => updateSettings({ coverImage: null })}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div onClick={() => fileRef.current?.click()}
                          className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100">
                          <span className="text-3xl">📷</span>
                          <p className="text-xs text-navy-400">Click to upload cover</p>
                        </div>
                      )}
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="mt-2 w-full rounded-lg border border-navy-200 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50">
                        {draft.settings.coverImage ? 'Change Image' : 'Upload Image'}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    </div>

                    {/* Mini preview */}
                    <div className="rounded-xl border border-navy-100 bg-white p-3 shadow-card">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">Preview</p>
                      <div className="rounded-lg p-3 text-white" style={{ background: `linear-gradient(135deg, ${draft.settings.primaryColor}, ${draft.settings.accentColor})` }}>
                        <span className="text-2xl">{draft.settings.icon}</span>
                        <p className="mt-1 text-sm font-extrabold">{draft.settings.name || 'Your Planner'}</p>
                        <p className="mt-0.5 text-[10px] opacity-70">{draft.settings.category} · {draft.settings.difficulty}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {draft.settings.tags.map(t => (
                          <span key={t} className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] text-navy-600">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blocks Tab */}
        {tab === 'blocks' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Block list */}
            <div className="w-80 shrink-0 overflow-y-auto border-r border-navy-100 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-navy-800">Blocks ({draft.blocks.length})</p>
                <button type="button" onClick={() => setShowAddBlock(v => !v)}
                  className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                  <Plus className="h-3.5 w-3.5" /> Add Block
                </button>
              </div>

              {/* Add block picker */}
              {showAddBlock && (
                <div className="mb-3 rounded-xl border border-navy-100 bg-navy-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-navy-500">Choose block type:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.entries(BLOCK_TYPE_INFO) as [BlockType, typeof BLOCK_TYPE_INFO[BlockType]][]).map(([type, info]) => (
                      <button key={type} type="button" onClick={() => addBlock(type)}
                        className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-left text-xs font-medium text-navy-700 hover:border-brand hover:bg-brand-50">
                        <span>{info.icon}</span> {info.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {draft.blocks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <p className="text-xs text-navy-400">No blocks yet. Click "Add Block" to start.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                  <SortableContext items={draft.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {draft.blocks.map(block => (
                        <SortableBlockRow
                          key={block.id}
                          block={block}
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
            </div>

            {/* Block editor */}
            <div className="flex-1 overflow-y-auto bg-[#f4f6fb] p-6">
              {selectedBlock ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-2xl">{selectedBlock.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-navy-800">{selectedBlock.title}</p>
                      <p className="text-xs text-navy-400">{BLOCK_TYPE_INFO[selectedBlock.config.type].label}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-navy-600">Block Title</label>
                      <Input value={selectedBlock.title} onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-navy-600">Description</label>
                      <Input value={selectedBlock.description} onChange={e => updateBlock(selectedBlock.id, { description: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-navy-600">Icon (emoji)</label>
                      <Input value={selectedBlock.icon} maxLength={4} onChange={e => updateBlock(selectedBlock.id, { icon: e.target.value })} />
                    </div>

                    {/* Block-specific config */}
                    {selectedBlock.config.type === 'checklist' && (
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-navy-600">Checklist Items</label>
                        <div className="flex flex-col gap-1.5">
                          {selectedBlock.config.items.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <Input value={item.label} onChange={e => {
                                const items = [...selectedBlock.config.items as any[]];
                                items[idx] = { ...item, label: e.target.value };
                                updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                              }} />
                              <button type="button" onClick={() => {
                                const items = (selectedBlock.config as any).items.filter((_: any, i: number) => i !== idx);
                                updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                              }} className="text-navy-300 hover:text-red-500">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const items = [...(selectedBlock.config as any).items, { id: newId(), label: 'New item', required: false }];
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, items } as any });
                          }} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                            <Plus className="h-3.5 w-3.5" /> Add item
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedBlock.config.type === 'goals' && (
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-navy-600">Goals</label>
                        <div className="flex flex-col gap-1.5">
                          {selectedBlock.config.goals.map((goal, idx) => (
                            <div key={goal.id} className="flex items-center gap-2">
                              <Input value={goal.label} onChange={e => {
                                const goals = [...(selectedBlock.config as any).goals];
                                goals[idx] = { ...goal, label: e.target.value };
                                updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                              }} />
                              <button type="button" onClick={() => {
                                const goals = (selectedBlock.config as any).goals.filter((_: any, i: number) => i !== idx);
                                updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                              }} className="text-navy-300 hover:text-red-500">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const goals = [...(selectedBlock.config as any).goals, { id: newId(), label: 'New Goal', placeholder: '' }];
                            updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, goals } as any });
                          }} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                            <Plus className="h-3.5 w-3.5" /> Add goal
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedBlock.config.type === 'notes' && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-navy-600">Placeholder text</label>
                        <Input value={selectedBlock.config.placeholder} onChange={e => updateBlock(selectedBlock.id, { config: { ...selectedBlock.config, placeholder: e.target.value } as any })} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="text-4xl">👈</span>
                  <p className="text-sm text-navy-400">Select a block to edit its settings</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
