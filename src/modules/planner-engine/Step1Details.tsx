import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import type { PlannerConfig } from './types';
import { PLANNER_CATEGORIES, PLANNER_AUDIENCES, THEME_COLOR_PRESETS } from './types';
import { cn } from '../../lib/utils';

interface Step1DetailsProps {
  config: PlannerConfig;
  onChange: (updated: Partial<PlannerConfig>) => void;
}

export function Step1Details({ config, onChange }: Step1DetailsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const charCount = config.goal.length;

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ coverImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-navy-400">1. PLANNER DETAILS</p>
      </div>

      {/* Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-navy-700">
          Planner Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={config.name}
          placeholder="Business Startup Planner"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Short Description</label>
        <Textarea
          rows={3}
          value={config.description}
          placeholder="A complete planner to help you launch and grow your business from idea to success."
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      {/* Category + Subcategory */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-700">Category</label>
          <Select value={config.category} onChange={(e) => onChange({ category: e.target.value })}>
            {PLANNER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-700">Subcategory</label>
          <Input
            value={config.subcategory}
            placeholder="Startup"
            onChange={(e) => onChange({ subcategory: e.target.value })}
          />
        </div>
      </div>

      {/* Audience + Difficulty */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-700">Audience</label>
          <Select value={config.audience} onChange={(e) => onChange({ audience: e.target.value })}>
            {PLANNER_AUDIENCES.map((a) => <option key={a}>{a}</option>)}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-700">Difficulty Level</label>
          <Select value={config.difficulty} onChange={(e) => onChange({ difficulty: e.target.value as PlannerConfig['difficulty'] })}>
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((d) => <option key={d}>{d}</option>)}
          </Select>
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Planner Goal</label>
        <p className="mb-1.5 text-xs text-navy-400">What will the user achieve with this planner?</p>
        <Textarea
          rows={3}
          value={config.goal}
          placeholder="Users will create a clear roadmap, set goals, track progress, and take action to launch their business successfully."
          maxLength={200}
          onChange={(e) => onChange({ goal: e.target.value })}
        />
        <p className="mt-1 text-right text-xs text-navy-400">{charCount} / 200</p>
      </div>

      {/* Cover Image */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Planner Cover Image</label>
        <div className="flex items-start gap-4">
          {config.coverImage ? (
            <img
              src={config.coverImage}
              alt="Cover"
              className="h-24 w-32 rounded-xl object-cover shadow-card"
            />
          ) : (
            <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-navy-200 bg-navy-50">
              <Upload className="h-6 w-6 text-navy-300" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              {config.coverImage ? 'Change Image' : 'Upload Image'}
            </button>
            <p className="text-xs text-navy-400">Recommended size: 1200x800px</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>
        </div>
      </div>

      {/* Theme Color */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Theme Color</label>
        <div className="flex flex-wrap gap-2">
          {THEME_COLOR_PRESETS.map((p) => (
            <button
              key={p.primary}
              type="button"
              title={p.label}
              onClick={() => onChange({ theme: { ...config.theme, primaryColor: p.primary, accentColor: p.accent } })}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                config.theme.primaryColor === p.primary ? 'border-navy-800 scale-110' : 'border-white shadow'
              )}
              style={{ background: p.primary }}
            />
          ))}
          <input
            type="color"
            value={config.theme.primaryColor}
            onChange={(e) => onChange({ theme: { ...config.theme, primaryColor: e.target.value } })}
            className="h-8 w-8 cursor-pointer rounded-full border border-navy-200"
            title="Custom color"
          />
        </div>
      </div>

      {/* Advanced Settings (collapsed) */}
      <details className="rounded-xl border border-navy-100 bg-navy-50">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy-700">
          Advanced Settings (Optional)
        </summary>
        <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Estimated Duration</label>
            <Input
              value={config.estimatedDuration}
              placeholder="4-6 hours"
              onChange={(e) => onChange({ estimatedDuration: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700">Tags (comma separated)</label>
            <Input
              value={config.tags.join(', ')}
              placeholder="business, startup, goals"
              onChange={(e) => onChange({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            />
          </div>
        </div>
      </details>
    </div>
  );
}
