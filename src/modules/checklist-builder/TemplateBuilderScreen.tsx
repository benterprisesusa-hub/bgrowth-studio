import { useState, useCallback } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, Save, Eye, EyeOff, Palette } from 'lucide-react';
import { ModuleHeader } from './ModuleHeader';
import { SectionEditor } from './SectionEditor';
import { LivePreview } from './LivePreview';
import { Input } from '../../components/ui/Input';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';
import { Toast } from '../../components/Toast';
import { api_saveTemplate } from './api';
import { draftToConfig, draftToConfigJson } from './draftToConfig';
import type { BuilderDraft, DraftSection } from './builderTypes';
import { BRAND_COLOR_PRESETS } from './builderTypes';
import type { SectionType } from '../../engine/types';
import { cn } from '../../lib/utils';

function newKey() {
  return `k-${Math.random().toString(36).slice(2, 9)}`;
}

function newSection(type: SectionType, index: number): DraftSection {
  const base: DraftSection = {
    _key: newKey(),
    id: newKey(),
    type,
    number: index + 1,
    title: '',
    description: '',
    icon: 'file-text',
  };
  if (type === 'form') base.fields = [];
  if (type === 'checklist' || type === 'outcome') base.items = [];
  return base;
}

interface TemplateBuilderScreenProps {
  ownerEmail: string;
  onBack: () => void;
  initialDraft?: BuilderDraft;
}

export function TemplateBuilderScreen({ ownerEmail, onBack, initialDraft }: TemplateBuilderScreenProps) {
  const [draft, setDraft] = useState<BuilderDraft>(
    initialDraft ?? {
      name: '',
      primaryColor: '#1061EC',
      sections: [],
    }
  );
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    window.setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  }, []);

  const updateSection = (index: number, updated: DraftSection) => {
    const sections = [...draft.sections];
    sections[index] = updated;
    setDraft((d) => ({ ...d, sections }));
  };

  const deleteSection = (index: number) => {
    setDraft((d) => ({ ...d, sections: d.sections.filter((_, i) => i !== index) }));
  };

  const addSection = (type: SectionType) => {
    setDraft((d) => ({ ...d, sections: [...d.sections, newSection(type, d.sections.length)] }));
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = draft.sections.findIndex((s) => s._key === active.id);
    const to = draft.sections.findIndex((s) => s._key === over.id);
    setDraft((d) => ({ ...d, sections: arrayMove(d.sections, from, to) }));
  };

  const handleSave = async () => {
    if (!draft.name.trim()) { showToast('Add a template name before saving'); return; }
    if (draft.sections.length === 0) { showToast('Add at least one section before saving'); return; }
    setIsSaving(true);
    try {
      const saved = await api_saveTemplate({
        templateId: draft.templateId,
        ownerEmail,
        name: draft.name,
        configJson: draftToConfigJson(draft),
      });
      setDraft((d) => ({ ...d, templateId: saved.templateId }));
      showToast(draft.templateId ? 'Template updated ✓' : 'Template saved ✓');
    } catch (e) {
      showToast('Save failed — ' + (e instanceof Error ? e.message : 'unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const liveConfig = draftToConfig(draft);
  const sectionCount = draft.sections.length;

  return (
    <div className="flex h-full flex-col">
      <ModuleHeader
        title={draft.templateId ? 'Edit Template' : 'New Template'}
        subtitle={sectionCount > 0 ? `${sectionCount} section${sectionCount !== 1 ? 's' : ''}` : 'No sections yet'}
        onBack={onBack}
        backLabel="Templates"
        actions={
          <div className="flex items-center gap-2">
            <SecondaryButton size="sm" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden sm:inline">{showPreview ? 'Hide preview' : 'Preview'}</span>
            </SecondaryButton>
            <PrimaryButton size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving…' : 'Save Template'}
            </PrimaryButton>
          </div>
        }
      />

      {/* Split layout: editor left, preview right */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Editor panel */}
        <div className={cn(
          'flex flex-col overflow-y-auto border-r border-navy-100 bg-[#f4f6fb]',
          showPreview ? 'w-full lg:w-[520px] lg:shrink-0' : 'flex-1'
        )}>
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            {/* Template name + brand color */}
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-navy-400">Template Settings</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Template Name *</label>
                  <Input
                    value={draft.name}
                    placeholder="e.g. Client Onboarding Checklist"
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-navy-400">Brand Color</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker((v) => !v)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-navy-100 shadow-sm"
                      style={{ background: draft.primaryColor }}
                      title="Pick brand color"
                    >
                      <Palette className="h-4 w-4 text-white drop-shadow" />
                    </button>
                    <Input
                      value={draft.primaryColor}
                      placeholder="#1061EC"
                      className="w-28 font-mono text-sm"
                      onChange={(e) => setDraft((d) => ({ ...d, primaryColor: e.target.value }))}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {BRAND_COLOR_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          title={p.label}
                          onClick={() => { setDraft((d) => ({ ...d, primaryColor: p.value })); setShowColorPicker(false); }}
                          className={cn(
                            'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                            draft.primaryColor === p.value ? 'border-navy-800 scale-110' : 'border-white'
                          )}
                          style={{ background: p.value }}
                        />
                      ))}
                    </div>
                  </div>
                  {showColorPicker && (
                    <div className="mt-2">
                      <input
                        type="color"
                        value={draft.primaryColor}
                        onChange={(e) => setDraft((d) => ({ ...d, primaryColor: e.target.value }))}
                        className="h-9 w-full cursor-pointer rounded-lg border border-navy-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-navy-400">
                  Sections ({sectionCount})
                </p>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={draft.sections.map((s) => s._key)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3">
                    {draft.sections.map((section, idx) => (
                      <SectionEditor
                        key={section._key}
                        section={section}
                        index={idx}
                        onChange={(updated) => updateSection(idx, updated)}
                        onDelete={() => deleteSection(idx)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {sectionCount === 0 && (
                <div className="rounded-2xl border border-dashed border-navy-200 py-10 text-center">
                  <p className="text-sm font-medium text-navy-500">No sections yet</p>
                  <p className="mt-1 text-xs text-navy-400">Choose a section type below to add the first one.</p>
                </div>
              )}
            </div>

            {/* Add section buttons */}
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-navy-400">Add Section</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(['form', 'checklist', 'notes', 'outcome'] as SectionType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addSection(type)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-navy-100 bg-white p-3 text-center text-xs font-semibold text-navy-600 transition-colors hover:border-brand hover:bg-brand-50 hover:text-brand"
                  >
                    <Plus className="h-4 w-4" />
                    {type === 'form' ? 'Form Fields' : type === 'checklist' ? 'Checklist' : type === 'notes' ? 'Notes' : 'Outcome'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Live Preview (desktop only unless toggled) */}
        {showPreview && (
          <div className="hidden flex-1 lg:flex lg:flex-col">
            <LivePreview config={liveConfig} />
          </div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
