import { useState } from 'react';
import { Plus, Trash2, Edit2, GripVertical, ChevronDown, ChevronRight, Toggle } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { getIcon } from '../.././../engine/icons';
import {
  CATEGORY_COLORS, CATEGORY_ICONS, FIELD_TYPE_LABELS,
  newId, newVariableName,
  type CalculatorDraft, type BuilderCategory, type BuilderField, type FieldType,
} from './builderTypes';
import { cn } from '../../../lib/utils';

function newField(): BuilderField {
  return {
    id: newId(),
    label: 'New Field',
    type: 'number',
    variableName: 'newField',
    required: true,
    defaultValue: 0,
    placeholder: '',
  };
}

function newCategory(): BuilderCategory {
  return {
    id: newId(),
    label: 'New Category',
    icon: 'file-text',
    color: CATEGORY_COLORS[0],
    fields: [],
  };
}

interface FieldEditorPanelProps {
  field: BuilderField;
  onChange: (updated: BuilderField) => void;
  onClose: () => void;
}

function FieldEditorPanel({ field, onChange, onClose }: FieldEditorPanelProps) {
  const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as FieldType[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Edit Field</p>
        <button type="button" onClick={onClose} className="text-xs text-navy-400 hover:text-navy-700">✕</button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Label</label>
        <Input
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value, variableName: newVariableName(e.target.value) })}
          placeholder="Field label"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Field Type</label>
        <Select value={field.type} onChange={(e) => onChange({ ...field, type: e.target.value as FieldType })}>
          {FIELD_TYPES.map(t => <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>)}
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Variable Name</label>
        <Input
          value={field.variableName}
          onChange={(e) => onChange({ ...field, variableName: e.target.value.replace(/\s+/g, '') })}
          placeholder="variableName"
          className="font-mono text-xs"
        />
        <p className="mt-0.5 text-[10px] text-navy-400">Used in formulas: {`{${field.variableName}}`}</p>
      </div>

      {field.type === 'dropdown' || field.type === 'radio' ? (
        <div>
          <label className="mb-1 block text-xs font-semibold text-navy-600">Options (one per line)</label>
          <textarea
            rows={4}
            className="w-full resize-none rounded-lg border border-navy-100 p-2.5 text-xs text-navy-700 focus:border-brand focus:outline-none"
            placeholder="Apartment&#10;House&#10;Condo&#10;Townhouse"
            value={(field.options ?? []).map(o => o.label).join('\n')}
            onChange={(e) => onChange({
              ...field,
              options: e.target.value.split('\n').filter(Boolean).map(l => ({ label: l, value: l.toLowerCase().replace(/\s+/g, '_') }))
            })}
          />
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Default Value</label>
        <Input
          value={String(field.defaultValue ?? '')}
          onChange={(e) => onChange({ ...field, defaultValue: e.target.value })}
          placeholder="0"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Placeholder</label>
        <Input
          value={field.placeholder ?? ''}
          onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
          placeholder="e.g. Enter value..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-navy-600">Tooltip (optional)</label>
        <Input
          value={field.tooltip ?? ''}
          onChange={(e) => onChange({ ...field, tooltip: e.target.value })}
          placeholder="Helpful description..."
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-navy-100 px-3 py-2.5">
        <span className="text-xs font-semibold text-navy-700">Required</span>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ ...field, required: e.target.checked })}
          className="h-4 w-4 rounded accent-brand"
        />
      </label>
    </div>
  );
}

interface CalcInputBuilderProps {
  draft: CalculatorDraft;
  onChange: (partial: Partial<CalculatorDraft>) => void;
}

export function CalcInputBuilder({ draft, onChange }: CalcInputBuilderProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(draft.categories[0]?.id ?? '');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const categories = draft.categories;
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const updateCategories = (cats: BuilderCategory[]) => onChange({ categories: cats });

  const addCategory = () => {
    const cat = newCategory();
    const updated = [...categories, cat];
    updateCategories(updated);
    setSelectedCategoryId(cat.id);
  };

  const updateCategory = (id: string, partial: Partial<BuilderCategory>) => {
    updateCategories(categories.map(c => c.id === id ? { ...c, ...partial } : c));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    updateCategories(updated);
    if (selectedCategoryId === id) setSelectedCategoryId(updated[0]?.id ?? '');
  };

  const addField = () => {
    if (!selectedCategory) return;
    const field = newField();
    updateCategory(selectedCategoryId, { fields: [...selectedCategory.fields, field] });
    setEditingFieldId(field.id);
  };

  const updateField = (fieldId: string, updated: BuilderField) => {
    if (!selectedCategory) return;
    updateCategory(selectedCategoryId, {
      fields: selectedCategory.fields.map(f => f.id === fieldId ? updated : f)
    });
  };

  const deleteField = (fieldId: string) => {
    if (!selectedCategory) return;
    updateCategory(selectedCategoryId, {
      fields: selectedCategory.fields.filter(f => f.id !== fieldId)
    });
    if (editingFieldId === fieldId) setEditingFieldId(null);
  };

  const editingField = selectedCategory?.fields.find(f => f.id === editingFieldId);
  const totalFields = categories.reduce((s, c) => s + c.fields.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Input Categories</h2>
          <p className="text-sm text-navy-400">Organize your inputs into logical groups.</p>
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-200 py-16 text-center">
          <p className="text-sm font-semibold text-navy-800">No categories yet</p>
          <p className="text-xs text-navy-400">Click "Add Category" to create your first input group.</p>
          <button type="button" onClick={addCategory}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4" style={{ minHeight: '480px' }}>
          {/* Col 1: Category list */}
          <div className="col-span-3 flex flex-col gap-2">
            {categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategoryId(cat.id); setEditingFieldId(null); }}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all',
                    selectedCategoryId === cat.id
                      ? 'border-brand bg-brand-50'
                      : 'border-navy-100 bg-white hover:border-brand-200'
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white text-xs"
                    style={{ background: cat.color }}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-xs font-semibold truncate', selectedCategoryId === cat.id ? 'text-brand-700' : 'text-navy-800')}>
                      {cat.label}
                    </p>
                    <p className="text-[10px] text-navy-400">{cat.fields.length} fields</p>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                    className="shrink-0 text-navy-300 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              );
            })}
          </div>

          {/* Col 2: Fields list */}
          <div className="col-span-5 rounded-2xl border border-navy-100 bg-white p-4">
            {selectedCategory ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <Input
                      value={selectedCategory.label}
                      onChange={(e) => updateCategory(selectedCategoryId, { label: e.target.value })}
                      className="border-0 p-0 text-sm font-bold text-navy-800 focus:ring-0 h-auto"
                    />
                    <p className="text-xs text-navy-400">{selectedCategory.fields.length} Fields</p>
                  </div>
                  <button type="button" onClick={addField}
                    className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                    <Plus className="h-3.5 w-3.5" /> Add Field
                  </button>
                </div>

                {selectedCategory.fields.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <p className="text-xs text-navy-400">No fields yet. Click "Add Field" to start.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wide text-navy-400">
                      <div className="col-span-4">Label</div>
                      <div className="col-span-3">Type</div>
                      <div className="col-span-3">Variable</div>
                      <div className="col-span-2 text-center">Req.</div>
                    </div>
                    {selectedCategory.fields.map((field) => (
                      <div
                        key={field.id}
                        className={cn(
                          'grid grid-cols-12 gap-2 items-center rounded-lg px-2 py-2 cursor-pointer transition-colors',
                          editingFieldId === field.id ? 'bg-brand-50 border border-brand-200' : 'hover:bg-navy-50 border border-transparent'
                        )}
                        onClick={() => setEditingFieldId(field.id === editingFieldId ? null : field.id)}
                      >
                        <div className="col-span-4 text-xs font-medium text-navy-800 truncate">{field.label}</div>
                        <div className="col-span-3 text-xs text-navy-500 capitalize">{field.type}</div>
                        <div className="col-span-3 text-[10px] font-mono text-navy-400 truncate">{field.variableName}</div>
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <span className={cn('h-2 w-2 rounded-full', field.required ? 'bg-brand' : 'bg-navy-200')} />
                          <button type="button" onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                            className="text-navy-300 hover:text-red-500">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-navy-400">Select a category to manage its fields</p>
              </div>
            )}
          </div>

          {/* Col 3: Field editor */}
          <div className="col-span-4 rounded-2xl border border-navy-100 bg-white p-4 overflow-y-auto">
            {editingField ? (
              <FieldEditorPanel
                field={editingField}
                onChange={(updated) => updateField(editingField.id, updated)}
                onClose={() => setEditingFieldId(null)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <Edit2 className="h-8 w-8 text-navy-200" />
                <p className="text-sm text-navy-400">Click a field to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3">
        <p className="text-sm text-navy-600">
          <span className="font-bold text-navy-900">{totalFields}</span> total fields across {categories.length} categories
        </p>
      </div>
    </div>
  );
}
