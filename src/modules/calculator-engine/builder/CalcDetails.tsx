import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { INDUSTRIES, CATEGORIES, THEME_COLORS, FIELD_TYPE_LABELS } from './builderTypes';
import type { CalculatorDraft } from './builderTypes';
import { cn } from '../../../lib/utils';

interface CalcDetailsProps {
  draft: CalculatorDraft;
  onChange: (partial: Partial<CalculatorDraft>) => void;
}

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;
const TIMES = ['1-2 minutes', '2-3 minutes', '3-5 minutes', '5-10 minutes'];
const ICONS = ['calculator', 'dollar-sign', 'home', 'building-2', 'trending-up', 'percent', 'file-text', 'users'];

export function CalcDetails({ draft, onChange }: CalcDetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = [draft.tags.join(', '), (v: string) => onChange({ tags: v.split(',').map(t => t.trim()).filter(Boolean) })];

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ coverImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-navy-900">Calculator Details</h2>
        <p className="text-sm text-navy-400">Basic information about your calculator.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — main fields */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">
              Calculator Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={draft.name}
              placeholder="Cleaning Quote Calculator"
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">Subtitle</label>
            <Input
              value={draft.subtitle}
              placeholder="Estimate your cleaning service price in minutes"
              onChange={(e) => onChange({ subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">Short Description</label>
            <Textarea
              rows={3}
              value={draft.shortDescription}
              placeholder="Provide an instant quote based on property details, services and preferences."
              onChange={(e) => onChange({ shortDescription: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Industry <span className="text-red-500">*</span></label>
              <Select value={draft.industry} onChange={(e) => onChange({ industry: e.target.value })}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Category <span className="text-red-500">*</span></label>
              <Select value={draft.category} onChange={(e) => onChange({ category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-navy-700">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange({ themeColor: color })}
                  className={cn(
                    'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                    draft.themeColor === color ? 'border-navy-800 scale-110' : 'border-white shadow'
                  )}
                  style={{ background: color }}
                />
              ))}
              <input
                type="color"
                value={draft.themeColor}
                onChange={(e) => onChange({ themeColor: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded-full border border-navy-200"
                title="Custom color"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Difficulty</label>
              <Select value={draft.difficulty} onChange={(e) => onChange({ difficulty: e.target.value as typeof draft.difficulty })}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Estimated Time</label>
              <Select value={draft.estimatedTime} onChange={(e) => onChange({ estimatedTime: e.target.value })}>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Icon</label>
              <Select value={draft.icon} onChange={(e) => onChange({ icon: e.target.value })}>
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">Tags</label>
            <Input
              value={draft.tags.join(', ')}
              placeholder="cleaning, quote, pricing, estimate"
              onChange={(e) => onChange({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            />
            <p className="mt-1 text-xs text-navy-400">Separate with commas</p>
            {draft.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {draft.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    {tag}
                    <button type="button" onClick={() => onChange({ tags: draft.tags.filter(t => t !== tag) })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — cover image */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-navy-700">Cover Image</label>
            {draft.coverImage ? (
              <div className="relative">
                <img src={draft.coverImage} alt="Cover" className="h-48 w-full rounded-xl object-cover shadow-card" />
                <button
                  type="button"
                  onClick={() => onChange({ coverImage: null })}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-navy-300" />
                <p className="text-sm text-navy-400">Click to upload image</p>
                <p className="text-xs text-navy-300">PNG, JPG up to 5MB</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 w-full rounded-lg border border-navy-200 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
            >
              {draft.coverImage ? 'Change Image' : 'Upload Image'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>

          {/* Preview card */}
          <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">Preview</p>
            <div className="rounded-lg p-3 text-white" style={{ background: draft.themeColor }}>
              <p className="text-xs font-bold opacity-70">BGROWTH STUDIO</p>
              <p className="mt-1 text-base font-extrabold">{draft.name || 'Calculator Name'}</p>
              {draft.subtitle && <p className="mt-0.5 text-xs opacity-80">{draft.subtitle}</p>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {draft.tags.map(t => (
                <span key={t} className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] text-navy-600">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
