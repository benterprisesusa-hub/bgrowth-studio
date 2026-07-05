import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Download, Printer, Save, CheckSquare, Square } from 'lucide-react';
import { type PlannerConfig, type PlannerFillData, type BlockType } from './types';
import { Toast } from '../../components/Toast';
import { cn } from '../../lib/utils';

// -----------------------------------------------------------------------
// Individual Block Renderers
// -----------------------------------------------------------------------
function CalendarBlock({ config, data, onChange }: any) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  const notes = data?.notes ?? {};

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-navy-50">←</button>
        <p className="text-sm font-bold text-navy-800">{monthName}</p>
        <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-navy-50">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-navy-400 py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = `${currentYear}-${currentMonth}-${day}`;
          const note = notes[key] ?? '';
          return (
            <div key={day} className="min-h-[52px] rounded-lg border border-navy-100 p-1 hover:border-brand">
              <p className={cn('text-[10px] font-bold mb-0.5', day === today.getDate() && currentMonth === today.getMonth() ? 'text-brand' : 'text-navy-500')}>{day}</p>
              <textarea rows={2} value={note} placeholder="..."
                onChange={e => onChange({ notes: { ...notes, [key]: e.target.value } })}
                className="w-full resize-none bg-transparent text-[9px] text-navy-600 outline-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChecklistBlockFill({ config, data, onChange }: any) {
  const checked: Record<string, boolean> = data?.checked ?? {};
  const extraItems: string[] = data?.extraItems ?? [];

  return (
    <div className="flex flex-col gap-2">
      {config.items.map((item: any) => (
        <label key={item.id} className="flex cursor-pointer items-center gap-2.5">
          <button type="button" onClick={() => onChange({ ...data, checked: { ...checked, [item.id]: !checked[item.id] } })}
            className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
              checked[item.id] ? 'border-brand bg-brand text-white' : 'border-navy-300')}>
            {checked[item.id] && <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </button>
          <span className={cn('text-sm', checked[item.id] ? 'text-navy-400 line-through' : 'text-navy-800')}>{item.label}</span>
          {item.required && <span className="text-xs text-red-400">*</span>}
        </label>
      ))}
      {config.allowAddItems && (
        <div className="mt-2">
          {extraItems.map((item, idx) => (
            <label key={idx} className="flex cursor-pointer items-center gap-2.5 mb-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-navy-300" />
              <span className="text-sm text-navy-800">{item}</span>
            </label>
          ))}
          <input placeholder="+ Add item" className="w-full text-sm text-brand-600 outline-none placeholder:text-brand-400"
            onKeyDown={e => { if (e.key === 'Enter') { onChange({ ...data, extraItems: [...extraItems, (e.target as HTMLInputElement).value] }); (e.target as HTMLInputElement).value = ''; } }} />
        </div>
      )}
    </div>
  );
}

function NotesBlockFill({ config, data, onChange }: any) {
  return (
    <textarea rows={8} value={data?.text ?? ''} placeholder={config.placeholder}
      maxLength={config.maxLength}
      onChange={e => onChange({ text: e.target.value })}
      className={cn('w-full resize-none rounded-lg border border-navy-100 p-3 text-sm text-navy-800 focus:border-brand focus:outline-none',
        config.lineRuled && 'leading-8')}
      style={config.lineRuled ? { backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)', lineHeight: '2rem' } : {}}
    />
  );
}

function GoalsBlockFill({ config, data, onChange }: any) {
  return (
    <div className="flex flex-col gap-4">
      {config.goals.map((goal: any) => (
        <div key={goal.id} className="rounded-xl border border-navy-100 bg-navy-50 p-4">
          <p className="mb-2 text-sm font-semibold text-navy-800">{goal.label}</p>
          <textarea rows={2} value={data?.[goal.id]?.text ?? ''} placeholder={goal.placeholder}
            onChange={e => onChange({ ...data, [goal.id]: { ...data?.[goal.id], text: e.target.value } })}
            className="w-full resize-none rounded-lg border border-navy-100 bg-white p-2.5 text-sm text-navy-700 focus:border-brand focus:outline-none" />
          {config.showProgress && (
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs text-navy-500">
                <span>Progress</span>
                <span>{data?.[goal.id]?.progress ?? 0}%</span>
              </div>
              <input type="range" min={0} max={100} value={data?.[goal.id]?.progress ?? 0}
                onChange={e => onChange({ ...data, [goal.id]: { ...data?.[goal.id], progress: Number(e.target.value) } })}
                className="w-full accent-brand" />
            </div>
          )}
          {config.showDeadline && (
            <div className="mt-2">
              <label className="text-xs text-navy-500">Target Date</label>
              <input type="date" value={data?.[goal.id]?.deadline ?? ''}
                onChange={e => onChange({ ...data, [goal.id]: { ...data?.[goal.id], deadline: e.target.value } })}
                className="mt-1 w-full rounded border border-navy-100 px-2 py-1 text-xs text-navy-700 focus:outline-none" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProgressBlockFill({ config, data, onChange }: any) {
  const days = Array.from({ length: Math.min(config.days, 31) }, (_, i) => i + 1);
  const checked: Record<string, boolean> = data?.checked ?? {};

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              <th className="py-1 pr-3 text-left text-navy-500 font-medium min-w-[120px]">Habit</th>
              {days.map(d => (
                <th key={d} className="px-1 py-1 text-center text-navy-400 font-medium min-w-[28px]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {config.habits.map((habit: any) => (
              <tr key={habit.id} className="border-t border-navy-50">
                <td className="py-1.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: habit.color }} />
                    <span className="text-navy-700 font-medium">{habit.label}</span>
                  </div>
                </td>
                {days.map(d => {
                  const key = `${habit.id}-${d}`;
                  return (
                    <td key={d} className="px-1 py-1 text-center">
                      <button type="button" onClick={() => onChange({ ...data, checked: { ...checked, [key]: !checked[key] } })}
                        className={cn('h-5 w-5 rounded transition-colors mx-auto block',
                          checked[key] ? 'opacity-100' : 'bg-navy-100 hover:bg-navy-200')}
                        style={checked[key] ? { background: habit.color } : {}}>
                        {checked[key] && <svg className="h-3 w-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorksheetBlockFill({ config, data, onChange }: any) {
  return (
    <div className="flex flex-col gap-4">
      {config.questions.map((q: any) => (
        <div key={q.id}>
          <label className="mb-1.5 block text-sm font-semibold text-navy-700">{q.question}</label>
          {q.type === 'textarea' ? (
            <textarea rows={3} value={data?.[q.id] ?? ''} placeholder={q.placeholder}
              onChange={e => onChange({ ...data, [q.id]: e.target.value })}
              className="w-full resize-none rounded-lg border border-navy-100 p-2.5 text-sm text-navy-700 focus:border-brand focus:outline-none" />
          ) : (
            <input type={q.type} value={data?.[q.id] ?? ''} placeholder={q.placeholder}
              onChange={e => onChange({ ...data, [q.id]: e.target.value })}
              className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-700 focus:border-brand focus:outline-none" />
          )}
        </div>
      ))}
    </div>
  );
}

function MilestonesBlockFill({ config, data, onChange }: any) {
  return (
    <div className="flex flex-col gap-3">
      {config.milestones.map((m: any, idx: number) => (
        <div key={m.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold',
              data?.[m.id]?.status === 'done' ? 'bg-emerald-500' : 'bg-brand')}>
              {idx + 1}
            </div>
            {idx < config.milestones.length - 1 && <div className="w-0.5 flex-1 bg-navy-200 my-1 min-h-[20px]" />}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-semibold text-navy-800 mb-1">{m.label}</p>
            <textarea rows={2} value={data?.[m.id]?.text ?? ''} placeholder={m.placeholder}
              onChange={e => onChange({ ...data, [m.id]: { ...data?.[m.id], text: e.target.value } })}
              className="w-full resize-none rounded-lg border border-navy-100 p-2.5 text-sm text-navy-700 focus:border-brand focus:outline-none" />
            <div className="mt-2 flex items-center gap-3">
              {config.showDate && (
                <input type="date" value={data?.[m.id]?.date ?? ''}
                  onChange={e => onChange({ ...data, [m.id]: { ...data?.[m.id], date: e.target.value } })}
                  className="rounded border border-navy-100 px-2 py-1 text-xs text-navy-700 focus:outline-none" />
              )}
              {config.showStatus && (
                <select value={data?.[m.id]?.status ?? 'pending'}
                  onChange={e => onChange({ ...data, [m.id]: { ...data?.[m.id], status: e.target.value } })}
                  className="rounded border border-navy-100 px-2 py-1 text-xs text-navy-700 focus:outline-none">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done ✓</option>
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineBlockFill({ config, data, onChange }: any) {
  return (
    <div className="flex flex-col gap-4">
      {config.events.map((event: any, idx: number) => (
        <div key={event.id} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xs font-bold">{idx + 1}</div>
            {idx < config.events.length - 1 && <div className="w-0.5 bg-navy-200 flex-1 min-h-[30px] mt-1" />}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-semibold text-navy-800 mb-1">{event.label}</p>
            <textarea rows={2} value={data?.[event.id]?.text ?? ''} placeholder={event.placeholder}
              onChange={e => onChange({ ...data, [event.id]: { ...data?.[event.id], text: e.target.value } })}
              className="w-full resize-none rounded-lg border border-navy-100 p-2.5 text-sm text-navy-700 focus:border-brand focus:outline-none" />
            <input type="date" value={data?.[event.id]?.date ?? ''}
              onChange={e => onChange({ ...data, [event.id]: { ...data?.[event.id], date: e.target.value } })}
              className="mt-1 rounded border border-navy-100 px-2 py-1 text-xs text-navy-700 focus:outline-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageBlockFill({ config, data, onChange }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      {data?.image ? (
        <div className="relative">
          <img src={data.image} alt="Vision" className="w-full rounded-xl object-cover max-h-64" />
          <button type="button" onClick={() => onChange({ ...data, image: null })}
            className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">Remove</button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()}
          className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100">
          <span className="text-3xl">📷</span>
          <p className="text-sm text-navy-400">{config.prompt}</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => onChange({ ...data, image: ev.target?.result });
          reader.readAsDataURL(file);
        }} />
      {data?.image && (
        <input value={data?.caption ?? ''} placeholder="Add a caption..."
          onChange={e => onChange({ ...data, caption: e.target.value })}
          className="mt-2 w-full rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-700 focus:border-brand focus:outline-none" />
      )}
    </div>
  );
}

function ResourcesBlockFill({ config, data, onChange }: any) {
  const extraResources: { label: string; url: string }[] = data?.extra ?? [];
  return (
    <div className="flex flex-col gap-2">
      {config.resources.map((r: any) => (
        <div key={r.id} className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-2">
          <span className="text-base">📎</span>
          <span className="flex-1 text-sm font-medium text-navy-700">{r.label}</span>
          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">Open →</a>}
        </div>
      ))}
      {extraResources.map((r, idx) => (
        <div key={idx} className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-2">
          <span className="text-base">📎</span>
          <span className="flex-1 text-sm text-navy-700">{r.label}</span>
          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">Open →</a>}
        </div>
      ))}
      {config.allowAddItems && (
        <div className="rounded-lg border border-dashed border-navy-200 p-3">
          <p className="mb-2 text-xs font-medium text-navy-500">Add Resource</p>
          <div className="flex gap-2">
            <input id="res-label" placeholder="Label" className="flex-1 rounded border border-navy-100 px-2 py-1 text-xs focus:outline-none" />
            <input id="res-url" placeholder="URL" className="flex-1 rounded border border-navy-100 px-2 py-1 text-xs focus:outline-none" />
            <button type="button" onClick={() => {
              const label = (document.getElementById('res-label') as HTMLInputElement).value;
              const url = (document.getElementById('res-url') as HTMLInputElement).value;
              if (label) { onChange({ ...data, extra: [...extraResources, { label, url }] }); }
            }} className="rounded bg-brand px-2 py-1 text-xs font-semibold text-white">Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Block renderer router
function BlockRenderer({ block, data, onChange }: { block: any; data: any; onChange: (d: any) => void }) {
  const props = { config: block.config, data, onChange };
  switch (block.config.type as BlockType) {
    case 'calendar': return <CalendarBlock {...props} />;
    case 'checklist': return <ChecklistBlockFill {...props} />;
    case 'notes': return <NotesBlockFill {...props} />;
    case 'goals': return <GoalsBlockFill {...props} />;
    case 'progress': return <ProgressBlockFill {...props} />;
    case 'worksheet': return <WorksheetBlockFill {...props} />;
    case 'milestones': return <MilestonesBlockFill {...props} />;
    case 'timeline': return <TimelineBlockFill {...props} />;
    case 'image': return <ImageBlockFill {...props} />;
    case 'resources': return <ResourcesBlockFill {...props} />;
    default: return <p className="text-sm text-navy-400">Block type not supported</p>;
  }
}

// -----------------------------------------------------------------------
// Main PlannerFill component
// -----------------------------------------------------------------------
interface PlannerFillProps {
  planner: PlannerConfig;
  onBack: () => void;
}

export function PlannerFill({ planner, onBack }: PlannerFillProps) {
  const STORAGE_KEY = `bgrowth.planner.fill.${planner.id}`;
  const [fillData, setFillData] = useState<PlannerFillData>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
  });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(
    planner.blocks.find(b => b.enabled)?.id ?? null
  );
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  };

  const handleBlockChange = useCallback((blockId: string, data: any) => {
    setFillData(prev => {
      const updated = { ...prev, [blockId]: data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [STORAGE_KEY]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fillData));
    showToast('Progress saved ✓');
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf()
        .set({
          margin: 10,
          filename: `${planner.settings.name.replace(/\s+/g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: planner.settings.pageSize.toLowerCase(), orientation: planner.settings.pageOrientation },
        })
        .from(printRef.current)
        .save()
        .then(() => { setIsGeneratingPdf(false); showToast('PDF downloaded ✓'); });
    } catch {
      setIsGeneratingPdf(false);
      window.print();
    }
  };

  const enabledBlocks = planner.blocks.filter(b => b.enabled);
  const activeBlock = enabledBlocks.find(b => b.id === activeBlockId);

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white px-4 py-2.5 no-print">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          <span className="text-navy-200">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{planner.settings.icon}</span>
            <span className="text-sm font-bold text-navy-800">{planner.settings.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-xs font-medium text-navy-600 hover:bg-navy-50">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button type="button" onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-xs font-medium text-navy-600 hover:bg-navy-50">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          {planner.settings.exportPdf && (
            <button type="button" onClick={handleDownloadPdf} disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
              <Download className="h-3.5 w-3.5" /> {isGeneratingPdf ? 'Generating...' : 'PDF'}
            </button>
          )}
        </div>
      </div>

      {/* Cover */}
      <div className="shrink-0 px-6 py-4 no-print" style={{ background: `linear-gradient(135deg, ${planner.settings.primaryColor}, ${planner.settings.accentColor})` }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">BGrowth Studio</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white">{planner.settings.name}</h1>
        {planner.settings.description && <p className="mt-0.5 text-sm text-white/70">{planner.settings.description}</p>}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — block navigation */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-navy-100 bg-white p-3 no-print">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-navy-400">Sections</p>
          {enabledBlocks.map(block => (
            <button key={block.id} type="button" onClick={() => setActiveBlockId(block.id)}
              className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors mb-1',
                activeBlockId === block.id ? 'bg-brand-50 text-brand-700' : 'text-navy-600 hover:bg-navy-50')}>
              <span className="text-base">{block.icon}</span>
              <span className="text-xs font-medium truncate">{block.title}</span>
            </button>
          ))}
        </aside>

        {/* Main content — active block */}
        <div className="flex-1 overflow-y-auto bg-[#f4f6fb] p-6">
          {activeBlock ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{activeBlock.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-navy-900">{activeBlock.title}</h2>
                  {activeBlock.description && <p className="text-sm text-navy-400">{activeBlock.description}</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <BlockRenderer
                  block={activeBlock}
                  data={fillData[activeBlock.id]}
                  onChange={(data) => handleBlockChange(activeBlock.id, data)}
                />
              </div>

              {/* Navigation */}
              <div className="mt-4 flex items-center justify-between">
                {enabledBlocks.indexOf(activeBlock) > 0 ? (
                  <button type="button" onClick={() => setActiveBlockId(enabledBlocks[enabledBlocks.indexOf(activeBlock) - 1].id)}
                    className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50">
                    ← Previous
                  </button>
                ) : <div />}
                {enabledBlocks.indexOf(activeBlock) < enabledBlocks.length - 1 ? (
                  <button type="button" onClick={() => setActiveBlockId(enabledBlocks[enabledBlocks.indexOf(activeBlock) + 1].id)}
                    className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                    Next →
                  </button>
                ) : (
                  <button type="button" onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                    <CheckSquare className="h-4 w-4" /> Complete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-navy-400">Select a section to start filling your planner.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden printable content */}
      <div ref={printRef} className="printable-summary" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <div style={{ borderBottom: `3px solid ${planner.settings.primaryColor}`, paddingBottom: '12px', marginBottom: '20px' }}>
          <h1 style={{ color: planner.settings.primaryColor, fontSize: '24px', margin: 0 }}>{planner.settings.icon} {planner.settings.name}</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>{planner.settings.description}</p>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0' }}>Generated: {new Date().toLocaleDateString()}</p>
        </div>
        {enabledBlocks.map(block => (
          <div key={block.id} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 12px' }}>
              {block.icon} {block.title}
            </h2>
            <pre style={{ fontSize: '12px', color: '#475569', whiteSpace: 'pre-wrap', margin: 0 }}>
              {JSON.stringify(fillData[block.id] ?? {}, null, 2)}
            </pre>
          </div>
        ))}
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '24px' }}>
          Generated by BGrowth Studio™
        </p>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
