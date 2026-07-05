
import {
  Search,
  Bell,
  Eye,
  Save,
  Copy,
  Upload,
  Download,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  History
} from "lucide-react";
import { CalculatorConfig } from "./calcTypes";

interface HeaderProps {
  config: CalculatorConfig;
  activeStep: number;
  currentTab: string;
  ownerEmail?: string;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  onReset: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  config,
  activeStep,
  currentTab,
  ownerEmail = 'benterprisesusa@gmail.com',
  onPreview,
  onSave,
  onPublish,
  onReset,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left section: breadcrumbs & status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-900 cursor-pointer">BGrowth Engine</span>
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-slate-300" />
          <span className="hover:text-slate-900 cursor-pointer">
            {currentTab === "dashboard" ? "Dashboard" : "Builder"}
          </span>
          {currentTab === "builder" && (
            <>
              <ChevronRight className="h-3.5 w-3.5 mx-1 text-slate-300" />
              <span className="text-slate-900 font-semibold truncate max-w-[150px]">
                {config.details.name || "Untitled Calculator"}
              </span>
            </>
          )}
        </div>

        {/* Live status Pill */}
        {currentTab === "builder" && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-medium">
            <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
            Syncing Active
          </div>
        )}
      </div>

      {/* Middle Section: Global Search */}
      <div className="relative max-w-xs w-64 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search formulas, inputs..."
          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Right Section: Core Actions & Profile */}
      <div className="flex items-center gap-3">
        {currentTab === "builder" && (
          <div className="flex items-center gap-2 border-r border-slate-100 pr-4 mr-2">
            <button
              onClick={onReset}
              title="Reset configuration to template"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <History className="h-4 w-4" />
            </button>
            <button
              onClick={onPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={onPublish}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1061EC] hover:bg-[#0d50c5] rounded-lg shadow-[0_2px_8px_rgba(16,97,236,0.15)] transition-all duration-200"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Publish</span>
            </button>
          </div>
        )}

        {/* Profile and Notification */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-all duration-200">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin Profile"
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold text-slate-900 block leading-tight truncate max-w-[120px]">
                {ownerEmail.split('@')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block">
                BGrowth Studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
