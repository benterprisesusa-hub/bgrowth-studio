import { ClipboardList, BookOpen, FileText, Receipt, ArrowRight } from 'lucide-react';
import type { StudioTool } from './types';

const TOOLS: StudioTool[] = [
  {
    id: 'checklist',
    name: 'Checklist Builder',
    description: 'Create guided workflow checklists for any process — notary, cleaning, onboarding, and more.',
    icon: 'checklist',
    color: '#1061EC',
    status: 'live',
  },
  {
    id: 'planner',
    name: 'Planner Engine',
    description: 'Design premium interactive planners for any industry — business, fitness, goals, and more.',
    icon: 'planner',
    color: '#7C3AED',
    status: 'live',
  },
  {
    id: 'form',
    name: 'Form Builder',
    description: 'Build smart forms and surveys with conditional logic and response tracking.',
    icon: 'form',
    color: '#0EA5A0',
    status: 'coming',
  },
  {
    id: 'invoice',
    name: 'Invoice Builder',
    description: 'Generate professional invoices and manage billing for your services.',
    icon: 'invoice',
    color: '#D97706',
    status: 'coming',
  },
];

const ICONS: Record<string, React.ReactNode> = {
  checklist: <ClipboardList className="h-7 w-7" />,
  planner: <BookOpen className="h-7 w-7" />,
  form: <FileText className="h-7 w-7" />,
  invoice: <Receipt className="h-7 w-7" />,
};

interface StudioHomeProps {
  ownerEmail: string;
  onSelect: (tool: string) => void;
}

export function StudioHome({ ownerEmail, onSelect }: StudioHomeProps) {
  return (
    <div className="flex min-h-full flex-col">
      {/* Hero */}
      <div className="border-b border-navy-100 bg-white px-6 py-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">BGrowth Studio</p>
        <h1 className="mt-2 text-3xl font-extrabold text-navy-900">
          What would you like to build?
        </h1>
        <p className="mt-2 text-sm text-navy-400">
          Choose a tool to get started. More tools coming soon.
        </p>
      </div>

      {/* Tools grid */}
      <div className="flex-1 p-6 sm:p-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              disabled={tool.status === 'coming'}
              onClick={() => tool.status === 'live' && onSelect(tool.id)}
              className="group relative flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 text-left shadow-card transition-all hover:shadow-cardHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tool.status === 'coming' && (
                <span className="absolute right-4 top-4 rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-semibold text-navy-500">
                  Coming Soon
                </span>
              )}

              <span
                className="flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: tool.color }}
              >
                {ICONS[tool.icon]}
              </span>

              <div className="flex-1">
                <h2 className="text-[17px] font-bold text-navy-900">{tool.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-navy-400">{tool.description}</p>
              </div>

              {tool.status === 'live' && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                  Open {tool.name} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-navy-100 bg-white px-6 py-4 text-center">
        <p className="text-xs text-navy-400">
          BGrowth Studio™ · Logged in as <span className="font-medium text-navy-600">{ownerEmail}</span>
        </p>
      </div>
    </div>
  );
}
