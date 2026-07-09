import { Calculator, LayoutTemplate, BookOpen, Variable, Cpu, HelpCircle, Settings, Plus, MoreVertical, TrendingUp, Search, Bell, ChevronRight } from 'lucide-react';
import type { CalculatorDraft } from './builderTypes';
import { cn } from '../../../lib/utils';

interface CalcDashboardProps {
  drafts: CalculatorDraft[];
  onNew: (mode: 'blank' | 'template' | 'import' | 'ai') => void;
  onOpen: (draft: CalculatorDraft) => void;
  onDelete: (id: string) => void;
  activeSidebarItem: string;
  onSidebarNav: (item: string) => void;
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutTemplate className="h-4 w-4" /> },
  { id: 'my-calculators', label: 'My Calculators', icon: <Calculator className="h-4 w-4" /> },
  { id: 'templates', label: 'Templates', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'formula-library', label: 'Formula Library', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'variable-library', label: 'Variable Library', icon: <Variable className="h-4 w-4" /> },
  { id: 'ai-connector', label: 'AI Connector', icon: <Cpu className="h-4 w-4" /> },
];

const RESOURCES = [
  { id: 'guides', label: 'Guides', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'help', label: 'Help Center', icon: <HelpCircle className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

const TEMPLATES_PREVIEW = [
  { name: 'Cleaning Quote Calculator', color: '#1061EC', category: 'Pricing' },
  { name: 'ROI Calculator', color: '#7C3AED', category: 'Business' },
  { name: 'Startup Cost Calculator', color: '#059669', category: 'Cost' },
  { name: 'Personal Budget Calculator', color: '#D97706', category: 'Budget' },
];

export function CalcDashboard({ drafts, onNew, onOpen, onDelete, activeSidebarItem, onSidebarNav }: CalcDashboardProps) {
  const published = drafts.filter(d => d.publishSettings.status === 'public').length;
  const inProgress = drafts.filter(d => d.publishSettings.status === 'draft').length;

  const stats = [
    { label: 'Calculators', value: published, sub: 'Published', color: 'text-brand' },
    { label: 'Drafts', value: inProgress, sub: 'In Progress', color: 'text-amber-500' },
    { label: 'Templates', value: 24, sub: 'Ready to Use', color: 'text-violet-500' },
    { label: 'Total Uses', value: drafts.reduce((s, d) => s + d.uses, 0), sub: 'All Time', color: 'text-emerald-500' },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col bg-navy-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-navy-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold leading-tight">BGrowth</p>
            <p className="text-[10px] text-navy-400 leading-tight">Calculator Engine™</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3">
          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-500">Dashboard</p>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSidebarNav(item.id)}
              className={cn(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors',
                activeSidebarItem === item.id
                  ? 'bg-brand text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              )}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <p className="mt-4 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-500">Resources</p>
          {RESOURCES.map((item) => (
            <button key={item.id} type="button" onClick={() => onSidebarNav(item.id)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white">
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* User */}
        <div className="border-t border-navy-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold">B</div>
            <p className="text-xs text-navy-300 truncate">benterprisesusa</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f4f6fb]">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-navy-100 bg-navy-50 px-3">
              <Search className="h-4 w-4 text-navy-400" />
              <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-navy-400" placeholder="Search calculators..." />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-400 hover:bg-navy-50">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">B</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">Dashboard</h1>
              <p className="text-sm text-navy-400">Create powerful calculators in minutes.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-sm font-semibold text-navy-800 mt-0.5">{s.label}</p>
                <p className="text-xs text-navy-400">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recently Edited */}
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-navy-800">Recently Edited</p>
                <button className="text-xs text-brand-600 hover:underline">View all</button>
              </div>
              {drafts.length === 0 ? (
                <p className="text-sm text-navy-400 py-4 text-center">No calculators yet. Create your first one!</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {drafts.slice(0, 4).map((draft) => (
                    <div key={draft.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-navy-50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs"
                        style={{ background: draft.themeColor }}>
                        <Calculator className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-800 truncate">{draft.name || 'Untitled'}</p>
                        <p className="text-xs text-navy-400">
                          Edited {new Date(draft.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onOpen(draft)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50">
                          Edit
                        </button>
                        <button onClick={() => onDelete(draft.id)}
                          className="rounded-lg p-1 text-navy-300 hover:text-red-500">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create New */}
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <p className="font-bold text-navy-800 mb-4">Create New Calculator</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { mode: 'blank' as const, label: 'Blank Calculator', desc: 'Start from scratch', color: '#1061EC', icon: <Plus className="h-5 w-5" /> },
                  { mode: 'template' as const, label: 'Start from Template', desc: 'Use a professional template', color: '#7C3AED', icon: <LayoutTemplate className="h-5 w-5" /> },
                  { mode: 'import' as const, label: 'Import from Excel', desc: 'Import your existing calculator', color: '#059669', icon: <BookOpen className="h-5 w-5" /> },
                ].map((item) => (
                  <button key={item.mode} type="button" onClick={() => onNew(item.mode)}
                    className="flex items-center gap-3 rounded-xl border border-navy-100 p-3 text-left hover:border-brand-200 hover:bg-brand-50/30 transition-colors">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ background: item.color }}>
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy-800">{item.label}</p>
                      <p className="text-xs text-navy-400">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-navy-300 ml-auto" />
                  </button>
                ))}

                {/* AI — locked */}
                <div className="flex items-center gap-3 rounded-xl border border-navy-100 p-3 opacity-60">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100">
                    <Cpu className="h-5 w-5 text-navy-400" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy-800">AI Calculator Generator</p>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">PRO</span>
                    </div>
                    <p className="text-xs text-navy-400">Generate with AI (Optional)</p>
                  </div>
                  <span className="text-navy-300">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
