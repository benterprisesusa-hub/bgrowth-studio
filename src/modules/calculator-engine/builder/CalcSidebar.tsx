
import {
  LayoutDashboard,
  Calculator,
  FileSpreadsheet,
  Cpu,
  Variable,
  Wand2,
  BarChart3,
  Settings,
  HelpCircle,
  FolderOpen
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  activeStep,
  setActiveStep
}: SidebarProps) {
  const menuGroups = [
    {
      title: "CORE ENGINE",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "builder", label: "Calculator Builder", icon: Calculator },
        { id: "templates", label: "Templates", icon: FileSpreadsheet },
      ],
    },
    {
      title: "LIBRARY",
      items: [
        { id: "formula-library", label: "Formula Library", icon: Cpu },
        { id: "variable-library", label: "Variable Library", icon: Variable },
        { id: "ai-builder", label: "AI Generator", icon: Wand2 },
      ],
    },
    {
      title: "ANALYTICS & MGMT",
      items: [
        { id: "reports", label: "Reports & Uses", icon: BarChart3 },
        { id: "settings", label: "Settings", icon: Settings },
        { id: "resources", label: "Guides & Docs", icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside
      id="bgrowth-sidebar"
      className="w-64 bg-[#0D1B4C] text-white flex flex-col justify-between border-r border-slate-800 shrink-0 h-full select-none"
    >
      <div className="flex flex-col flex-1 overflow-y-auto py-6">
        {/* Logo Container */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="h-9 w-9 bg-[#1061EC] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(16,97,236,0.3)] shrink-0">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg leading-tight block">
              BGrowth
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              Calculator Engine
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      if (item.id === "builder" && activeStep === 0) {
                        setActiveStep(1); // Default to Step 1 Details
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left ${
                      isActive
                        ? "bg-[#1061EC] text-white shadow-lg shadow-blue-500/10"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User workspace indicators */}
      <div className="p-4 border-t border-slate-800 bg-[#09143C]">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40 text-blue-300 font-semibold text-xs">
            BG
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-white block truncate">
              BGrowth Admin Workspace
            </span>
            <span className="text-[10px] text-emerald-400 font-mono block flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              Live Sandbox mode
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
