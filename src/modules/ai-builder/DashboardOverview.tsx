import React from 'react';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  CirclePlay,
  FolderDot,
  DollarSign,
  ChevronRight,
  ClipboardList,
  Calendar,
  Calculator as CalcIcon,
  BookOpen,
  FileText
} from 'lucide-react';
import { DigitalProduct } from './types';

interface DashboardOverviewProps {
  products: DigitalProduct[];
  credits: number;
  onTabChange: (tab: string) => void;
  onSelectProduct: (product: DigitalProduct) => void;
}

export default function DashboardOverview({
  products,
  credits,
  onTabChange,
  onSelectProduct
}: DashboardOverviewProps) {
  // Aggregate stats
  const totalViews = products.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);
  const totalDownloads = products.reduce((acc, p) => acc + (p.analytics?.downloads || 0), 0);
  const totalSales = products.reduce((acc, p) => acc + (p.analytics?.sales || 0), 0);
  const totalRevenue = products.reduce((acc, p) => acc + (p.analytics?.revenue || 0), 0);
  const avgConversionRate = products.length > 0
    ? (products.reduce((acc, p) => acc + (p.analytics?.conversionRate || 0), 0) / products.length).toFixed(1)
    : "0.0";
  
  const draftCount = products.filter(p => p.status === 'Draft').length;
  const publishedCount = products.filter(p => p.status === 'Published').length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'Checklist': return ClipboardList;
      case 'Planner': return Calendar;
      case 'Calculator': return CalcIcon;
      case 'Course': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 scrollbar-thin space-y-6">
      
      {/* Platform welcome and credits quick status */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">BGrowth Creator Studio</h2>
            <p className="text-[11px] text-slate-400 font-medium">
              You currently have <strong className="text-slate-700">{publishedCount}</strong> published products and <strong className="text-slate-700">{draftCount}</strong> drafts active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">AI Credits Allotted</span>
            <span className="text-sm font-extrabold text-slate-800 block">{credits.toLocaleString()} Credits</span>
          </div>
          <button
            onClick={() => onTabChange('create')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 cursor-pointer transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* KPI item 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Global Product Views</span>
            <strong className="text-xl font-extrabold text-slate-800 mt-0.5 block">{totalViews.toLocaleString()}</strong>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <span>+18.4%</span>
              <span className="text-[9px] text-slate-400 font-medium">this month</span>
            </span>
          </div>
        </div>

        {/* KPI item 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/50 flex items-center justify-center shrink-0">
            <FolderDot className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Downloads</span>
            <strong className="text-xl font-extrabold text-slate-800 mt-0.5 block">{totalDownloads.toLocaleString()}</strong>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <span>+12.1%</span>
              <span className="text-[9px] text-slate-400 font-medium">this week</span>
            </span>
          </div>
        </div>

        {/* KPI item 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0">
            <CirclePlay className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Checkout Conversion</span>
            <strong className="text-xl font-extrabold text-slate-800 mt-0.5 block">{avgConversionRate}%</strong>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <span>+1.2%</span>
              <span className="text-[9px] text-slate-400 font-medium">avg listing</span>
            </span>
          </div>
        </div>

        {/* KPI item 4 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Creator Revenue</span>
            <strong className="text-xl font-extrabold text-slate-800 mt-0.5 block">${totalRevenue.toLocaleString()}</strong>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <span>+$350.00</span>
              <span className="text-[9px] text-slate-400 font-medium">last 7 days</span>
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Recently Updated creations list */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-xs tracking-tight">Active Product Works</h3>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Continue editing your recent generative drafts</p>
              </div>
              <button
                onClick={() => onTabChange('products')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all products</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No active products. Use "Create with AI" to start your first product!
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentProducts.map((p) => {
                  const IconComp = getCategoryIcon(p.structure.productType);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                          <IconComp className="w-4.5 h-4.5" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-slate-800 text-xs block truncate leading-tight">
                            {p.structure.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">
                            {p.structure.productType} • v{p.structure.version}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {p.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Platform tips and monetization tutorials */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-xs tracking-tight">Etsy & Shopify Selling Tips</h3>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Scale your passive income storefronts</p>
          </div>

          <div className="space-y-3">
            {[
              { title: "White Label Licensing", desc: "Every checklist generated is 100% royalty-free. You own the content." },
              { title: "Optimize with SEO Slugs", desc: "Always synchronize slug modifications on Etsy with the SEO keywords provided." },
              { title: "Upsell premium planners", desc: "Embed custom calculator spreadsheets inside Gumroad packages to charge a premium." }
            ].map((tip, idx) => (
              <div key={idx} className="p-3 bg-indigo-50/20 rounded-xl border border-indigo-50/50">
                <span className="font-bold text-slate-800 text-[11px] block">{tip.title}</span>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
