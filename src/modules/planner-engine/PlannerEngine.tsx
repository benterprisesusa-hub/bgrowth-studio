import { useState, useCallback } from 'react';
import {
  BookOpen, LayoutGrid, Layers, Star, Trash2, Plus,
  Save, Eye, Book, ChevronRight,
} from 'lucide-react';
import { Step1Details } from './Step1Details';
import { Step2Layout } from './Step2Layout';
import { Step3Sections } from './Step3Sections';
import { Step4Customize, Step5Review } from './Step4And5';
import { PlannerPreview } from './PlannerPreview';
import { Toast } from '../../components/Toast';
import { emptyPlannerConfig, LAYOUT_SECTIONS } from './types';
import type { PlannerConfig } from './types';
import { cn } from '../../lib/utils';

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Planner Details' },
  { id: 2, label: 'Choose Layout' },
  { id: 3, label: 'Add Sections' },
  { id: 4, label: 'Customize' },
  { id: 5, label: 'Review & Publish' },
];

const STORAGE_KEY = 'bgrowth.studio.planner.drafts';

function loadDrafts(): PlannerConfig[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

function saveDrafts(drafts: PlannerConfig[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)); } catch { /* ignore */ }
}

interface PlannerEngineProps {
  ownerEmail: string;
}

export function PlannerEngine({ ownerEmail }: PlannerEngineProps) {
  const [step, setStep] = useState<Step>(1);
  const [config, setConfig] = useState<PlannerConfig>(emptyPlannerConfig);
  const [drafts, setDrafts] = useState<PlannerConfig[]>(loadDrafts);
  const [activeView, setActiveView] = useState<'builder' | 'list' | 'overview' | 'templates' | 'favorites' | 'trash'>('list');
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  const updateConfig = (partial: Partial<PlannerConfig>) => {
    setConfig((c) => {
      const updated = { ...c, ...partial };
      // When layout changes, update sections to match the new layout
      if (partial.layout && partial.layout !== c.layout) {
        const newSections = LAYOUT_SECTIONS[partial.layout];
        if (newSections && newSections.length > 0) {
          updated.sections = newSections;
        }
      }
      return updated;
    });
  };

  const handleSaveDraft = () => {
    const updated = drafts.some((d) => d.productId === config.productId)
      ? drafts.map((d) => (d.productId === config.productId ? config : d))
      : [...drafts, config];
    setDrafts(updated);
    saveDrafts(updated);
    showToast('Draft saved ✓');
  };

  const handlePublish = async () => {
    if (!config.name) return;
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 800));
    const updated = drafts.some((d) => d.productId === config.productId)
      ? drafts.map((d) => (d.productId === config.productId ? config : d))
      : [...drafts, config];
    setDrafts(updated);
    saveDrafts(updated);
    setIsPublishing(false);
    showToast('Planner published! 🎉');
    setTimeout(() => setActiveView('list'), 800);
  };

  const handleNew = () => {
    setConfig(emptyPlannerConfig());
    setStep(1);
    setActiveView('builder');
  };

  const handleOpenDraft = (draft: PlannerConfig) => {
    setConfig(draft);
    setStep(1);
    setActiveView('builder');
  };

  const handleDeleteDraft = (productId: string) => {
    if (!confirm('Delete this planner?')) return;
    const updated = drafts.filter((d) => d.productId !== productId);
    setDrafts(updated);
    saveDrafts(updated);
    showToast('Planner deleted');
  };

  // ---- My Planners list ----
  if (activeView === 'list') {
    return (
      <div className="flex h-full">
        {/* Left sidebar */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-navy-100 bg-white">
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Planner Dashboard</p>
          </div>
          {[
            { icon: <LayoutGrid className="h-4 w-4" />, label: 'Overview', view: 'overview' },
            { icon: <BookOpen className="h-4 w-4" />, label: 'My Planners', active: activeView === 'list', view: 'list' },
            { icon: <Layers className="h-4 w-4" />, label: 'Templates', view: 'templates' },
            { icon: <Star className="h-4 w-4" />, label: 'Favorites', view: 'favorites' },
            { icon: <Trash2 className="h-4 w-4" />, label: 'Trash', view: 'trash' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveView(item.view as typeof activeView)}
              className={cn(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors',
                (item.active || activeView === item.view)
                  ? 'border-l-2 border-brand bg-brand-50 text-brand-700'
                  : 'text-navy-500 hover:bg-navy-50 hover:text-navy-800'
              )}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <div className="mt-4 border-t border-navy-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Planner Engine</p>
          </div>
          {[
            { icon: <Plus className="h-4 w-4" />, label: 'Create New Planner', action: handleNew },
            { icon: <Book className="h-4 w-4" />, label: 'Planner Templates' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-navy-500 hover:bg-navy-50 hover:text-navy-800"
            >
              {item.icon} {item.label}
            </button>
          ))}

          {/* Need Help */}
          <div className="mx-3 mt-auto mb-4 rounded-xl border border-brand-100 bg-brand-50 p-3">
            <p className="text-xs font-semibold text-navy-800">Need Help?</p>
            <p className="mt-1 text-[11px] leading-relaxed text-navy-500">
              Learn how to create powerful planners that get results.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top toolbar */}
          <div className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-3">
            <div>
              <h1 className="text-xl font-bold text-navy-900">Planner Engine</h1>
              <p className="text-sm text-navy-400">Create. Customize. Plan. Achieve.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleNew} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                <Plus className="h-4 w-4" /> Create New Planner
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeView === 'overview' && (
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-navy-900">Overview</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[{label:'Total Planners',val:drafts.length,color:'text-brand'},{label:'Published',val:drafts.filter(d=>d.name).length,color:'text-emerald-500'},{label:'Favorites',val:0,color:'text-amber-500'}].map(s=>(
                    <div key={s.label} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card text-center">
                      <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
                      <p className="text-sm text-navy-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                  <p className="font-semibold text-navy-800 mb-3">Recent Planners</p>
                  {drafts.length === 0 ? <p className="text-sm text-navy-400">No planners yet.</p> : drafts.slice(0,5).map(d=>(
                    <button key={d.productId} type="button" onClick={()=>handleOpenDraft(d)} className="flex items-center gap-3 rounded-lg p-2 w-full text-left hover:bg-navy-50">
                      <span className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{background:d.theme.primaryColor}}>{d.name?.[0]??'P'}</span>
                      <span className="text-sm font-medium text-navy-800">{d.name||'Untitled'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'templates' && (
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-navy-900">Planner Templates</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {['Business Startup','Weekly Productivity','Goal Achievement','Project Management','Monthly Budget','Fitness & Health'].map((name,i)=>(
                    <button key={name} type="button" onClick={handleNew} className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-5 text-left shadow-card hover:shadow-cardHover">
                      <div className="h-20 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{background:['#1061EC','#7C3AED','#059669','#D97706','#E11D48','#0EA5A0'][i]}}>{name.split(' ')[0]}</div>
                      <p className="font-semibold text-navy-800 text-sm">{name} Planner</p>
                      <p className="text-xs text-brand-600 font-medium">Use this template →</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'favorites' && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <Star className="h-16 w-16 text-navy-200" />
                <p className="font-semibold text-navy-800">No favorites yet</p>
                <p className="text-sm text-navy-400">Star your planners to find them quickly here.</p>
              </div>
            )}

            {activeView === 'trash' && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <Trash2 className="h-16 w-16 text-navy-200" />
                <p className="font-semibold text-navy-800">Trash is empty</p>
                <p className="text-sm text-navy-400">Deleted planners will appear here.</p>
              </div>
            )}

            {activeView === 'list' && (<>
            <h2 className="mb-1 text-2xl font-extrabold text-navy-900">My Planners</h2>
            <p className="mb-6 text-sm text-navy-400">Design a powerful planner to help your audience plan, organize and achieve their goals.</p>

            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-navy-200 bg-white py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                  <BookOpen className="h-8 w-8" />
                </span>
                <div>
                  <p className="font-semibold text-navy-800">No planners yet</p>
                  <p className="text-sm text-navy-400">Create your first planner to get started.</p>
                </div>
                <button
                  type="button"
                  onClick={handleNew}
                  className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  <Plus className="h-4 w-4" /> Create New Planner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft) => (
                  <div key={draft.productId} className="group rounded-2xl border border-navy-100 bg-white shadow-card hover:shadow-cardHover">
                    <div
                      className="flex h-28 items-end rounded-t-2xl p-4"
                      style={{ background: `linear-gradient(135deg, ${draft.theme.primaryColor}, ${draft.theme.accentColor})` }}
                    >
                      {draft.coverImage && <img src={draft.coverImage} alt="" className="absolute inset-0 h-full w-full rounded-t-2xl object-cover opacity-20" />}
                      <h3 className="text-sm font-bold text-white">{draft.name}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-navy-400 line-clamp-2">{draft.description || 'No description'}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">{draft.category}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteDraft(draft.productId)}
                            className="rounded-lg p-1.5 text-navy-300 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDraft(draft)}
                            className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                          >
                            Edit <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>)}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-navy-100 bg-white px-6 py-2 text-center text-xs text-navy-400">
          © 2026 BGrowth Club. All rights reserved.
          <span className="ml-4 text-navy-300">Planner Engine™ | Plan. Organize. Achieve.</span>
        </div>
      </div>
    );
  }

  // ---- Builder workspace ----
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('list')}
            className="text-sm font-medium text-navy-500 hover:text-navy-800"
          >
            ← My Planners
          </button>
          <span className="text-navy-200">/</span>
          <span className="text-sm font-semibold text-navy-800">{config.name || 'New Planner'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSaveDraft} className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50">
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || !config.name}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            🚀 {isPublishing ? 'Publishing…' : 'Publish Planner'}
          </button>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex items-center gap-0 border-b border-navy-100 bg-white px-4 py-0">
        {STEPS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors border-b-2',
              step === s.id
                ? 'border-brand text-brand-700'
                : 'border-transparent text-navy-400 hover:text-navy-700'
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                step === s.id ? 'bg-brand text-white' : step > s.id ? 'bg-emerald-500 text-white' : 'bg-navy-100 text-navy-500'
              )}
            >
              {step > s.id ? '✓' : s.id}
            </span>
            {s.label}
            {idx < STEPS.length - 1 && <ChevronRight className="ml-2 h-3.5 w-3.5 text-navy-200" />}
          </button>
        ))}
      </div>

      {/* 4-column workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Col 1: Details */}
        <div className="w-[280px] shrink-0 overflow-y-auto border-r border-navy-100 bg-white p-4">
          <Step1Details config={config} onChange={updateConfig} />
        </div>

        {/* Col 2: Layout */}
        <div className="w-[240px] shrink-0 overflow-y-auto border-r border-navy-100 bg-white p-4">
          <Step2Layout config={config} onChange={updateConfig} />
        </div>

        {/* Col 3: Sections or Customize or Review */}
        <div className="flex-1 overflow-y-auto border-r border-navy-100 bg-white p-4">
          {step <= 3 && <Step3Sections config={config} onChange={updateConfig} />}
          {step === 4 && <Step4Customize config={config} onChange={updateConfig} />}
          {step === 5 && (
            <Step5Review
              config={config}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              isPublishing={isPublishing}
            />
          )}
        </div>

        {/* Col 4: Live Preview */}
        <div className="w-[240px] shrink-0 overflow-hidden border-l border-navy-100 bg-white">
          <PlannerPreview config={config} />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t border-navy-100 bg-white px-6 py-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
          disabled={step === 1}
          className="rounded-xl border border-navy-200 px-5 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50 disabled:opacity-40"
        >
          Cancel
        </button>
        <span className="text-xs text-navy-400">Step {step} of {STEPS.length}</span>
        <button
          type="button"
          onClick={() => step < 5 ? setStep((s) => (s + 1) as Step) : handlePublish()}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {step === 5 ? '🚀 Publish' : 'Next Step →'}
        </button>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
