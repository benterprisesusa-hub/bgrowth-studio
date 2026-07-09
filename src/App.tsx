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

  // When a tool is active, use fixed full-screen layout
  // When on home, use natural scroll layout
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
      <StudioNav
        ownerEmail={ownerEmail}
        onHome={() => setActiveTool(null)}
      />
      <StudioHome
        ownerEmail={ownerEmail}
        onSelect={(tool) => setActiveTool(tool as ActiveTool)}
      />
    </div>
  );
}
