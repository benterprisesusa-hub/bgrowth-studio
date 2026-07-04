import { useState, useEffect } from 'react';
import { StudioHome } from './studio/StudioHome';
import { StudioNav } from './studio/StudioNav';
import { ChecklistBuilderApp } from './modules/checklist-builder/ChecklistBuilderApp';
import { PlannerEngine } from './modules/planner-engine/PlannerEngine';
import { PublicFillApp } from './App.public';
import { applyBrandTheme } from './engine/theme';

type ActiveTool = null | 'checklist' | 'planner';

const TOOL_NAMES: Record<string, string> = {
  checklist: 'Checklist Builder',
  planner: 'Planner Engine',
};

interface AppProps {
  ownerEmail: string;
}

export function App({ ownerEmail }: AppProps) {
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get('template');

  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    const tool = params.get('tool');
    if (tool === 'checklist' || tool === 'planner') return tool;
    return null;
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTool) { url.searchParams.set('tool', activeTool); }
    else { url.searchParams.delete('tool'); }
    window.history.replaceState(null, '', url.toString());
  }, [activeTool]);

  useEffect(() => {
    if (!activeTool && !templateId) applyBrandTheme('#1061EC');
  }, [activeTool, templateId]);

  useEffect(() => {
    document.title = activeTool
      ? `${TOOL_NAMES[activeTool]} | BGrowth Studio`
      : 'BGrowth Studio';
  }, [activeTool]);

  // Public fill mode — ?template=ID (no login needed, for clients)
  if (templateId) {
    return <PublicFillApp templateId={templateId} />;
  }

  // Tool active — fixed full-screen layout
  if (activeTool) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="font-sans bg-[#f4f6fb]">
        <StudioNav
          activeTool={activeTool}
          toolName={TOOL_NAMES[activeTool]}
          ownerEmail={ownerEmail}
          onHome={() => setActiveTool(null)}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTool === 'checklist' && <ChecklistBuilderApp ownerEmail={ownerEmail} embedded />}
          {activeTool === 'planner' && <PlannerEngine ownerEmail={ownerEmail} />}
        </div>
      </div>
    );
  }

  // Home screen — natural document scroll
  return (
    <div className="font-sans bg-[#f4f6fb]">
      <StudioNav ownerEmail={ownerEmail} onHome={() => setActiveTool(null)} />
      <StudioHome ownerEmail={ownerEmail} onSelect={(tool) => setActiveTool(tool as ActiveTool)} />
    </div>
  );
}
