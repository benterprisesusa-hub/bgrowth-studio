import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  ChevronDown,
  Library,
  FolderHeart,
  Rocket,
  BarChart3,
  ShoppingBag,
  BookOpen,
  Settings as SettingsIcon,
  Crown,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 gap-2.5 border-b border-slate-50">
        <div className="relative group shrink-0">
          <img src="/logo.jpg" alt="BGrowth Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div>
          <span className="font-bold text-slate-800 tracking-tight block leading-tight">BGrowth</span>
          <span className="text-[10px] text-indigo-600 font-medium tracking-widest uppercase block -mt-0.5">Studio</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
        <button
          onClick={() => onTabChange('create')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'create'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${currentTab === 'create' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Create with AI</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
        </button>

        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'dashboard'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('products')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'products'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <FolderKanban className={`w-4 h-4 ${currentTab === 'products' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Products</span>
        </button>

        {/* Builder Suite with dropdown simulation */}
        <div className="space-y-1">
          <button
            onClick={() => onTabChange('products')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-400" />
            <span>Builder Suite</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto text-slate-400" />
          </button>
        </div>

        <button
          onClick={() => onTabChange('templates')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'templates'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Library className={`w-4 h-4 ${currentTab === 'templates' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Template Library</span>
        </button>

        <button
          onClick={() => onTabChange('assets')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'assets'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <FolderHeart className={`w-4 h-4 ${currentTab === 'assets' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Asset Manager</span>
        </button>

        <button
          onClick={() => onTabChange('launch')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'launch'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Rocket className={`w-4 h-4 ${currentTab === 'launch' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Launch Engine</span>
        </button>

        <button
          onClick={() => onTabChange('analytics')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'analytics'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${currentTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => onTabChange('marketplace')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'marketplace'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className={`w-4 h-4 ${currentTab === 'marketplace' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Marketplace</span>
        </button>

        <button
          onClick={() => onTabChange('knowledge')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'knowledge'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${currentTab === 'knowledge' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Knowledge Base</span>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'settings'
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className={`w-4 h-4 ${currentTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Settings</span>
        </button>
      </div>

      {/* Upgrade Callout */}
      <div className="p-4 mx-4 mb-3 bg-indigo-50/50 rounded-2xl border border-indigo-50/80 flex flex-col items-center text-center">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
          <Crown className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-800 text-xs tracking-tight">Upgrade to Pro</span>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-1">
          Unlock more builders, AI credits, and advanced features.
        </p>
        <button className="w-full mt-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-100">
          Upgrade Now
        </button>
      </div>

      {/* User Info Footprint */}
      <div className="p-4 border-t border-slate-50 flex items-center gap-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="BGrowth User"
            className="w-9 h-9 rounded-full object-cover border border-indigo-100"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="flex-1 overflow-hidden">
          <span className="font-semibold text-slate-800 text-xs block truncate leading-tight">BGrowth User</span>
          <span className="text-[10px] text-slate-400 block truncate font-medium">BGrowth Creator</span>
        </div>
        <ChevronUp className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 shrink-0" />
      </div>
    </aside>
  );
}
