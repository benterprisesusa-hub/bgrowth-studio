import { useState, useEffect } from 'react';
import { StudioHome } from './studio/StudioHome';
import { StudioNav } from './studio/StudioNav';
import { ChecklistBuilderApp } from './modules/checklist-builder/ChecklistBuilderApp';
import { PlannerEngine } from './modules/planner-engine/PlannerEngine';
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
  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    const params = new URLSearchParams(window.location.search);
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
    if (!activeTool) applyBrandTheme('#1061EC');
  }, [activeTool]);

  useEffect(() => {
    document.title = activeTool
      ? `${TOOL_NAMES[activeTool]} | BGrowth Studio`
      : 'BGrowth Studio';
  }, [activeTool]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f6fb] font-sans">
      <StudioNav
        activeTool={activeTool ?? undefined}
        toolName={activeTool ? TOOL_NAMES[activeTool] : undefined}
        ownerEmail={ownerEmail}
        onHome={() => setActiveTool(null)}
      />
      <div className="flex-1 overflow-hidden">
        {!activeTool && <StudioHome ownerEmail={ownerEmail} onSelect={(tool) => setActiveTool(tool as ActiveTool)} />}
        {activeTool === 'checklist' && <ChecklistBuilderApp ownerEmail={ownerEmail} embedded />}
        {activeTool === 'planner' && <PlannerEngine ownerEmail={ownerEmail} />}
      </div>
    </div>
  );
}
