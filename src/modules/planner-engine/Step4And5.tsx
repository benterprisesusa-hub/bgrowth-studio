import { Clock, FileText, Zap, Layers } from 'lucide-react';
import type { PlannerConfig } from './types';
import { THEME_COLOR_PRESETS } from './types';
import { cn } from '../../lib/utils';

// -----------------------------------------------------------------------
// Step 4 — Customization
// -----------------------------------------------------------------------
interface Step4CustomizeProps {
  config: PlannerConfig;
  onChange: (updated: Partial<PlannerConfig>) => void;
}

export function Step4Customize({ config, onChange }: Step4CustomizeProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">4. CUSTOMIZE</p>

      {/* Colors */}
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-navy-700">Planner Colors</p>
        <div className="flex flex-wrap gap-2 mb-3">
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
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-navy-500 mb-1">Primary</p>
            <div className="flex items-center gap-2">
              <input type="color" value={config.theme.primaryColor} onChange={(e) => onChange({ theme: { ...config.theme, primaryColor: e.target.value } })} className="h-8 w-8 rounded cursor-pointer border border-navy-100" />
              <span className="text-xs font-mono text-navy-500">{config.theme.primaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-navy-500 mb-1">Accent</p>
            <div className="flex items-center gap-2">
              <input type="color" value={config.theme.accentColor} onChange={(e) => onChange({ theme: { ...config.theme, accentColor: e.target.value } })} className="h-8 w-8 rounded cursor-pointer border border-navy-100" />
              <span className="text-xs font-mono text-navy-500">{config.theme.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-navy-700">Typography</p>
        <div className="grid grid-cols-3 gap-2">
          {(['poppins', 'inter', 'playfair'] as const).map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => onChange({ theme: { ...config.theme, fontFamily: font } })}
              className={cn(
                'rounded-lg border p-3 text-center transition-colors',
                config.theme.fontFamily === font
                  ? 'border-brand bg-brand-50 text-brand-700'
                  : 'border-navy-100 text-navy-600 hover:border-brand-200'
              )}
            >
              <p className="text-sm font-semibold capitalize">{font}</p>
              <p className="text-xs text-navy-400">Aa Bb Cc</p>
            </button>
          ))}
        </div>
      </div>

      {/* PDF Options */}
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-navy-700">PDF Options</p>
        <div className="flex flex-col gap-2">
          {['Include cover page', 'Add page numbers', 'Include table of contents', 'Add watermark (BGrowth Club)'].map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-navy-700">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-brand" />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Step 5 — Review & Publish
// -----------------------------------------------------------------------
interface Step5ReviewProps {
  config: PlannerConfig;
  onPublish: () => void;
  onSaveDraft: () => void;
  isPublishing: boolean;
}

export function Step5Review({ config, onPublish, onSaveDraft, isPublishing }: Step5ReviewProps) {
  const enabledSections = config.sections.filter((s) => s.enabled);
  const totalPages = enabledSections.reduce((sum, s) => sum + s.estimatedPages, 0);
  const interactiveElements = enabledSections.filter((s) =>
    ['checklist', 'habit-tracker', 'goals', 'budget', 'worksheet'].includes(s.type)
  ).length * 5;

  const stats = [
    { icon: <Layers className="h-4 w-4" />, label: 'Total Sections', value: enabledSections.length },
    { icon: <FileText className="h-4 w-4" />, label: 'Total Pages (Est.)', value: totalPages },
    { icon: <Zap className="h-4 w-4" />, label: 'Interactive Elements', value: interactiveElements },
    { icon: <Clock className="h-4 w-4" />, label: 'Est. Completion Time', value: config.estimatedDuration || '4-6 hours' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">5. REVIEW & PUBLISH</p>

      {/* Summary card */}
      <div className="rounded-xl border border-navy-100 bg-white p-5">
        <div className="flex items-start gap-4">
          {config.coverImage ? (
            <img src={config.coverImage} alt="Cover" className="h-20 w-28 rounded-xl object-cover shadow-card" />
          ) : (
            <div
              className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: config.theme.primaryColor }}
            >
              <span className="text-center text-[10px] font-bold leading-tight px-2">
                {config.name || 'Untitled'}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-navy-900">{config.name || 'Untitled Planner'}</h3>
            <p className="text-sm text-navy-500">{config.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{config.category}</span>
              <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-600">{config.audience}</span>
              <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-600">{config.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3">
            <span className="text-brand">{stat.icon}</span>
            <div>
              <p className="text-[11px] text-navy-400">{stat.label}</p>
              <p className="text-sm font-bold text-navy-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections list */}
      <div className="rounded-xl border border-navy-100 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-navy-700">Sections ({enabledSections.length})</p>
        <div className="flex flex-col gap-1.5">
          {enabledSections.map((s, i) => (
            <div key={s._key} className="flex items-center gap-2 text-sm text-navy-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand">{i + 1}</span>
              {s.title}
              <span className="ml-auto text-xs text-navy-400">~{s.estimatedPages}p</span>
            </div>
          ))}
        </div>
      </div>

      {/* Publish actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 rounded-xl border border-navy-200 bg-white py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing || !config.name}
          className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {isPublishing ? 'Publishing…' : '🚀 Publish Planner'}
        </button>
      </div>

      {!config.name && (
        <p className="text-center text-xs text-red-500">Add a planner name before publishing.</p>
      )}
    </div>
  );
}
