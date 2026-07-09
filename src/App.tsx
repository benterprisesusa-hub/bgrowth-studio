import { useState, useEffect, useCallback, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudioHome } from './studio/StudioHome';
import { StudioNav } from './studio/StudioNav';
import { ChecklistBuilderApp } from './modules/checklist-builder/ChecklistBuilderApp';
import { PlannerEngine } from './modules/planner-engine/PlannerEngine';
import { CalculatorEngine } from './modules/calculator-engine/CalculatorEngine';
import { AIBuilder } from './modules/ai-builder/AIBuilder';
import { ProductHeader } from './components/ProductHeader';
import { Sidebar } from './components/Sidebar';
import { WorkflowAccordion } from './engine/components/WorkflowAccordion';
import { Footer } from './components/Footer';
import { PrintableSummary } from './engine/components/PrintableSummary';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { useProgress } from './engine/useProgress';
import { buildZodSchema, requiredFieldPaths } from './engine/schemaBuilder';
import { buildDefaultValues } from './engine/defaultValues';
import { applyBrandTheme } from './engine/theme';
import { loadFormData, saveFormData, clearFormData, loadOpenSection, saveOpenSection } from './lib/storage';
import { downloadElementAsPdf } from './lib/pdf';
import { api_getTemplate } from './modules/checklist-builder/api';
import type { ChecklistConfig, ChecklistData } from './engine/types';

type ActiveTool = null | 'checklist' | 'planner' | 'calculator' | 'ai-builder';

const TOOL_NAMES: Record<string, string> = {
  checklist: 'Checklist Builder',
  planner: 'Planner Engine',
  calculator: 'Calculator Engine',
  'ai-builder': 'AI Product Builder',
};

// -----------------------------------------------------------------------
// Public Fill — renders a checklist from ?template=ID
// -----------------------------------------------------------------------
function PublicFill({ templateId }: { templateId: string }) {
  const [config, setConfig] = useState<ChecklistConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api_getTemplate(templateId)
      .then((t) => {
        const parsed = JSON.parse(t.configJson) as ChecklistConfig;
        setConfig(parsed);
        applyBrandTheme(parsed.brand.primaryColor);
        document.title = `${parsed.brand.name} | BGrowth Club`;
      })
      .catch(() => setError('Checklist not found or unavailable.'))
      .finally(() => setLoading(false));
  }, [templateId]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f4f6fb]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );

  if (error || !config) return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#f4f6fb] text-center">
      <p className="text-lg font-bold text-navy-800">Checklist not found</p>
      <p className="text-sm text-navy-400">{error}</p>
    </div>
  );

  return <PublicFillInner config={config} storageId={`public-${templateId}`} />;
}

function PublicFillInner({ config, storageId }: { config: ChecklistConfig; storageId: string }) {
  const methods = useForm<ChecklistData>({
    resolver: zodResolver(buildZodSchema(config)) as never,
    mode: 'onBlur',
    defaultValues: loadFormData(storageId) ?? buildDefaultValues(config),
  });
  const { watch, trigger, reset } = methods;
  const values = watch();
  const progress = useProgress(config, values);
  const [activeId, setActiveId] = useState(() => loadOpenSection(storageId) ?? config.sections[0].id);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => saveFormData(storageId, values), 500);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  useEffect(() => { saveOpenSection(storageId, activeId); }, [storageId, activeId]);

  const handleContinue = async (id: string) => {
    const section = config.sections.find((s) => s.id === id);
    const fieldPaths = section ? requiredFieldPaths(section) : [];
    if (fieldPaths.length > 0) {
      const valid = await trigger(fieldPaths as Parameters<typeof trigger>[0]);
      if (!valid) return;
    }
    saveFormData(storageId, methods.getValues());
    const next = config.sections[config.sections.findIndex((s) => s.id === id) + 1];
    if (next) setActiveId(next.id);
    else showToast('Checklist complete — nice work!');
  };

  const stepListItems = config.sections.map((section) => {
    const p = progress.sections[section.id];
    const status = section.id === activeId ? ('active' as const) : p.isComplete ? ('completed' as const) : ('pending' as const);
    return { id: section.id, number: section.number, title: section.title, subtitle: p.isOptional ? 'Optional' : `${p.filled} / ${p.total} completed`, status };
  });

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[#f4f6fb]">
        <ProductHeader
          title={config.brand.name}
          onSave={() => { setIsSaving(true); saveFormData(storageId, methods.getValues()); setTimeout(() => { setIsSaving(false); showToast('Saved'); }, 350); }}
          onPrint={() => window.print()}
          onDownloadPdf={async () => {
            if (!printableRef.current) return;
            setIsGeneratingPdf(true);
            try { await downloadElementAsPdf(printableRef.current, `${config.brand.name}.pdf`); showToast('PDF downloaded'); }
            finally { setIsGeneratingPdf(false); }
          }}
          onReset={() => setResetDialogOpen(true)}
          isSaving={isSaving}
          isGeneratingPdf={isGeneratingPdf}
        />
        <main className="no-print mx-auto flex max-w-[1280px] flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-start">
          <Sidebar percent={progress.percent} completed={progress.completedFields} total={progress.totalFields} items={stepListItems} activeId={activeId} onSelect={setActiveId} />
          <section className="min-w-0 flex-1">
            <WorkflowAccordion config={config} activeId={activeId} onSelect={setActiveId} onContinue={handleContinue} progressBySection={progress.sections} />
          </section>
        </main>
        <Footer footer={config.footer} />
        <PrintableSummary ref={printableRef} config={config} data={values} percent={progress.percent} />
        <ConfirmDialog open={resetDialogOpen} title="Reset the entire checklist?" description="This clears every field stored in this browser." confirmLabel="Reset Form" onConfirm={() => { clearFormData(storageId); reset(buildDefaultValues(config)); setActiveId(config.sections[0].id); setResetDialogOpen(false); showToast('Form has been reset'); }} onCancel={() => setResetDialogOpen(false)} />
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </FormProvider>
  );
}

// -----------------------------------------------------------------------
// Public Calculator Fill — renders a calculator from ?calc=ID
// -----------------------------------------------------------------------
function PublicCalcFill({ calcId }: { calcId: string }) {
  useEffect(() => {
    document.title = 'Calculator | BGrowth Club';
  }, [calcId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="font-sans bg-[#f4f6fb]">
      <CalculatorEngine ownerEmail="" initialCalcId={calcId} />
    </div>
  );
}

// -----------------------------------------------------------------------
export function App({ ownerEmail }: { ownerEmail: string }) {
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get('template');
  const calcId = params.get('calc');
  const plannerId = params.get('planner');

  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    const tool = params.get('tool');
    if (tool === 'checklist' || tool === 'planner' || tool === 'calculator' || tool === 'ai-builder') return tool;
    return null;
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTool) url.searchParams.set('tool', activeTool);
    else url.searchParams.delete('tool');
    window.history.replaceState(null, '', url.toString());
  }, [activeTool]);

  useEffect(() => {
    if (!activeTool && !templateId && !calcId && !plannerId) applyBrandTheme('#1061EC');
  }, [activeTool, templateId, calcId, plannerId]);

  useEffect(() => {
    document.title = activeTool ? `${TOOL_NAMES[activeTool]} | BGrowth Studio` : 'BGrowth Studio';
  }, [activeTool]);

  if (templateId) return <PublicFill templateId={templateId} />;

  if (calcId) return <PublicCalcFill calcId={calcId} />;

  if (plannerId) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="font-sans">
      <PlannerEngine ownerEmail="" initialPlannerId={plannerId} />
    </div>
  );

  if (activeTool) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="font-sans bg-[#f4f6fb]">
      <StudioNav activeTool={activeTool} toolName={TOOL_NAMES[activeTool]} ownerEmail={ownerEmail} onHome={() => setActiveTool(null)} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTool === 'checklist' && <ChecklistBuilderApp ownerEmail={ownerEmail} embedded />}
        {activeTool === 'planner' && <PlannerEngine ownerEmail={ownerEmail} />}
        {activeTool === 'calculator' && <CalculatorEngine ownerEmail={ownerEmail} />}
        {activeTool === 'ai-builder' && <AIBuilder ownerEmail={ownerEmail} />}
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-[#f4f6fb]">
      <StudioNav ownerEmail={ownerEmail} onHome={() => setActiveTool(null)} />
      <StudioHome ownerEmail={ownerEmail} onSelect={(tool) => setActiveTool(tool as ActiveTool)} />
    </div>
  );
}
