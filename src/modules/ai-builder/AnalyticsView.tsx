import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { DigitalProduct } from './types';

interface AnalyticsViewProps {
  products: DigitalProduct[];
}

export default function AnalyticsView({ products }: AnalyticsViewProps) {
  const totalViews = products.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);
  const totalCheckouts = products.reduce((acc, p) => acc + (p.analytics?.downloads || 0), 0);
  const totalRevenue = products.reduce((acc, p) => acc + (p.analytics?.revenue || 0), 0);
  const totalCredits = products.reduce((acc, p) => acc + (p.analytics?.aiCreditsUsed || 0), 0);
  const totalBuyers = products.reduce((acc, p) => acc + (p.analytics?.sales || 0), 0);

  const checkoutPct = totalViews > 0 ? parseFloat(((totalCheckouts / totalViews) * 100).toFixed(1)) : 0;
  const buyerPct = totalViews > 0 ? parseFloat(((totalBuyers / totalViews) * 100).toFixed(1)) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 scrollbar-thin space-y-6">
      
      {/* Analytics Head */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Studio Performance & Monetization</h2>
        <span className="text-[11px] text-slate-400 font-medium">
          Detailed telemetry of product views, conversion rates, and revenue streams
        </span>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Traffic Views", count: totalViews.toLocaleString(), trend: totalViews > 0 ? "+12%" : "0%", color: "text-blue-600 bg-blue-50 border-blue-100/50", icon: Users },
          { label: "Checkouts initiated", count: totalCheckouts.toLocaleString(), trend: totalCheckouts > 0 ? "+8.4%" : "0%", color: "text-indigo-600 bg-indigo-50 border-indigo-100/50", icon: ShoppingBag },
          { label: "White-Label Revenue", count: `$${totalRevenue.toFixed(2)}`, trend: totalRevenue > 0 ? "+14.2%" : "0%", color: "text-emerald-600 bg-emerald-50 border-emerald-100/50", icon: DollarSign },
          { label: "AI Credits Consumed", count: totalCredits.toLocaleString(), trend: totalCredits > 0 ? "Normal limits" : "0", color: "text-amber-600 bg-amber-50 border-amber-100/50", icon: Sparkles }
        ].map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">{stat.label}</span>
                <strong className="text-xl font-extrabold text-slate-800 mt-0.5 block">{stat.count}</strong>
                <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Conversion funnel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm md:col-span-2">
          <span className="text-xs font-bold text-slate-800 block mb-4 border-b border-slate-50 pb-2">Listing Conversion Funnel</span>
          <div className="space-y-4">
            {[
              { stage: "1. Impression View on Storefronts", count: `${totalViews.toLocaleString()} views`, pct: totalViews > 0 ? 100 : 0, color: "bg-indigo-600" },
              { stage: "2. Added to cart / Checkout click", count: `${totalCheckouts.toLocaleString()} actions`, pct: checkoutPct, color: "bg-indigo-500" },
              { stage: "3. Confirmed payment & download", count: `${totalBuyers.toLocaleString()} buyers`, pct: buyerPct, color: "bg-indigo-400" }
            ].map((funnel, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{funnel.stage}</span>
                  <span className="font-bold">{funnel.count} ({funnel.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                  <div className={`h-full ${funnel.color} rounded-full`} style={{ width: `${funnel.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic channels chart mockup */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-800 block border-b border-slate-50 pb-2">Referrer Traffic Sources</span>
          <div className="space-y-3">
            {[
              { source: "BGrowth Store marketplace", share: products.length > 0 ? "45%" : "0%" },
              { source: "Etsy Organic Search", share: products.length > 0 ? "25%" : "0%" },
              { source: "Google Search index", share: products.length > 0 ? "15%" : "0%" },
              { source: "Direct Referral link", share: products.length > 0 ? "10%" : "0%" },
              { source: "Social Media share", share: products.length > 0 ? "5%" : "0%" }
            ].map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-500 py-1 border-b border-slate-50 last:border-0 font-medium">
                <span className="text-slate-600 font-semibold">{ref.source}</span>
                <span className="font-bold text-indigo-600">{ref.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
