import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { getIcon } from '../../engine/icons';
import { Lightbulb, FileText, Zap, Clock, Layers } from 'lucide-react';
import type { PlannerConfig } from './types';
import { cn } from '../../lib/utils';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface PlannerPreviewProps {
  config: PlannerConfig;
}

export function PlannerPreview({ config }: PlannerPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const enabledSections = config.sections.filter((s) => s.enabled);
  const totalPages = enabledSections.reduce((sum, s) => sum + s.estimatedPages, 0);
  const interactiveElements = enabledSections.filter((s) =>
    ['checklist', 'habit-tracker', 'goals', 'budget', 'worksheet'].includes(s.type)
  ).length * 5;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Planner Preview</p>
        <div className="flex items-center gap-1 rounded-lg border border-navy-100 bg-navy-50 p-0.5">
          {([
            { mode: 'desktop', Icon: Monitor },
            { mode: 'tablet', Icon: Tablet },
            { mode: 'mobile', Icon: Smartphone },
          ] as { mode: ViewMode; Icon: typeof Monitor }[]).map(({ mode, Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded transition-colors',
                viewMode === mode ? 'bg-white shadow-sm text-brand' : 'text-navy-400 hover:text-navy-600'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto bg-navy-50 p-3">
        <div
          className={cn(
            'mx-auto overflow-hidden rounded-xl bg-white shadow-cardHover transition-all',
            viewMode === 'desktop' && 'w-full',
            viewMode === 'tablet' && 'max-w-[480px]',
            viewMode === 'mobile' && 'max-w-[280px]'
          )}
        >
          {/* Cover */}
          <div
            className="relative flex min-h-[120px] items-end p-4"
            style={{ background: `linear-gradient(135deg, ${config.theme.primaryColor}, ${config.theme.accentColor})` }}
          >
            {config.coverImage && (
              <img
                src={config.coverImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            )}
            <div className="relative z-10">
              <p className="text-[8px] font-semibold uppercase tracking-widest text-white/70">BGrowth Studio</p>
              <h2 className="mt-0.5 text-base font-extrabold leading-tight text-white">
                {config.name || 'Your Planner Name'}
              </h2>
              {config.description && (
                <p className="mt-0.5 text-[9px] text-white/80 line-clamp-2">{config.description}</p>
              )}
              <div
                className="mt-2 inline-block rounded px-2 py-0.5 text-[8px] font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                YOUR ROADMAP TO SUCCESS
              </div>
            </div>
          </div>

          {/* Sections list */}
          <div className="p-3">
            {enabledSections.length === 0 ? (
              <p className="py-4 text-center text-xs text-navy-300">Add sections to see your planner take shape</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {enabledSections.slice(0, 8).map((section, i) => {
                  const Icon = getIcon(section.icon);
                  return (
                    <div
                      key={section._key}
                      className="flex items-center gap-2 rounded-lg border border-navy-50 px-2 py-1.5"
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white"
                        style={{ background: config.theme.primaryColor }}
                      >
                        <Icon className="h-2.5 w-2.5" />
                      </span>
                      <span className="flex-1 text-[10px] font-medium text-navy-700 truncate">{section.title}</span>
                      <span className="text-[9px] text-navy-300">~{section.estimatedPages}p</span>
                    </div>
                  );
                })}
                {enabledSections.length > 8 && (
                  <p className="text-center text-[9px] text-navy-400">+{enabledSections.length - 8} more sections</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats below preview */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { icon: <Layers className="h-3 w-3" />, label: 'Total Sections', value: enabledSections.length },
            { icon: <FileText className="h-3 w-3" />, label: 'Total Pages (Est.)', value: totalPages },
            { icon: <Zap className="h-3 w-3" />, label: 'Interactive Elements', value: interactiveElements },
            { icon: <Clock className="h-3 w-3" />, label: 'Est. Completion Time', value: config.estimatedDuration || '4-6 hours' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 rounded-xl border border-navy-100 bg-white p-2">
              <span className="text-brand">{stat.icon}</span>
              <div>
                <p className="text-[9px] text-navy-400">{stat.label}</p>
                <p className="text-[11px] font-bold text-navy-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
            <Lightbulb className="h-3 w-3" /> Planner Tips
          </p>
          <p className="text-[10px] leading-relaxed text-amber-600">
            A well-structured planner increases completion rate by 80%. Keep it simple, focused and actionable.
          </p>
        </div>
      </div>
    </div>
  );
}
