import React from 'react';
import { HelpCircle, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  credits: number;
  currentTab: string;
}

export default function Header({ credits, currentTab }: HeaderProps) {
  // Determine text based on tab
  const getTitles = () => {
    switch (currentTab) {
      case 'create':
        return { title: "Welcome back! 👋", subtitle: "What will you create today?" };
      case 'dashboard':
        return { title: "Business Dashboard 📊", subtitle: "Track views, sales, downloads and credit metrics" };
      case 'products':
        return { title: "My Product Library 🗃️", subtitle: "Edit, publish, template, or archive your creations" };
      case 'analytics':
        return { title: "Global Studio Analytics 📈", subtitle: "Observe monetization and conversion funnels" };
      case 'settings':
        return { title: "Platform Settings ⚙️", subtitle: "Configure integrations, credits cost, and credentials" };
      default:
        return { title: "BGrowth Studio™", subtitle: "Accelerating your digital product passive income" };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      {/* Title block */}
      <div>
        <h1 className="font-bold text-slate-800 text-sm leading-snug tracking-tight">{title}</h1>
        <p className="text-[11px] text-slate-400 font-medium -mt-0.5">{subtitle}</p>
      </div>

      {/* Action items block */}
      <div className="flex items-center gap-4">
        {/* Credits counter capsule */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 shadow-sm shadow-indigo-50/30">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" />
          <span className="text-[11px] font-bold text-indigo-700 tracking-tight">
            AI Credits: {credits.toLocaleString()}
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-100"></div>

        {/* Help Circle */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="How it works">
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* Notification Bell */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer relative" title="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-100"></div>

        {/* Initials Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm shadow-indigo-100">
          JS
        </div>
      </div>
    </header>
  );
}
