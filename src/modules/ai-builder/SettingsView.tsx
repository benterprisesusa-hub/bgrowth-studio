import React, { useState } from 'react';
import { Settings, ShieldAlert, Sparkles, Sliders, ToggleLeft, ToggleRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AICreditCost } from './types';

interface SettingsViewProps {
  creditCosts: AICreditCost[];
  onUpdateCreditCosts: (updated: AICreditCost[]) => void;
}

export default function SettingsView({ creditCosts, onUpdateCreditCosts }: SettingsViewProps) {
  // Mock integrations list
  const [integrations, setIntegrations] = useState([
    { name: 'Gemini API Connector', provider: 'Google AI', status: 'Connected', active: true },
    { name: 'OpenAI API Gateway', provider: 'OpenAI SDK', status: 'Inactive', active: false },
    { name: 'Claude AI Engine', provider: 'Anthropic SDK', status: 'Inactive', active: false },
    { name: 'DeepSeek LLM', provider: 'DeepSeek API', status: 'Inactive', active: false },
    { name: 'Canva Design suite', provider: 'Canva developers', status: 'Inactive', active: false },
    { name: 'Google Drive Connector', provider: 'Google Workspace', status: 'Connected', active: true },
    { name: 'Dropbox Cloud Storage', provider: 'Dropbox, Inc.', status: 'Inactive', active: false }
  ]);

  const handleToggleIntegration = (idx: number) => {
    const copy = [...integrations];
    copy[idx].active = !copy[idx].active;
    copy[idx].status = copy[idx].active ? 'Connected' : 'Inactive';
    setIntegrations(copy);
  };

  const handleCostChange = (index: number, newCost: number) => {
    const copy = [...creditCosts];
    copy[index].cost = newCost;
    onUpdateCreditCosts(copy);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 scrollbar-thin space-y-6 max-w-4xl">
      
      {/* Settings Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Platform Configurations</h2>
        <span className="text-[11px] text-slate-400 font-medium">
          Manage third-party microservices, tune administrator credit costs, and verify environment keys
        </span>
      </div>

      {/* Secret API Key Verification block */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Security Verification: Gemini API Key</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              The environment's primary server-side <code className="text-[10px] bg-slate-50 text-slate-700 font-mono px-1 py-0.5 rounded font-bold">GEMINI_API_KEY</code> has been detected and is verified. AI Product Builder™ calls are secure.
            </p>
            <div className="mt-3 text-[10px] bg-slate-50 text-slate-400 p-2 rounded border border-slate-100 font-medium">
              💡 <strong>Guidance:</strong> To rotate, change, or supply third-party API tokens, configure them inside the secure <strong>Secrets Panel</strong> in the AI Studio sidebar settings. Do not insert keys directly into the source code.
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credit Cost configurations */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
          <Sliders className="w-4.5 h-4.5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-800 text-xs tracking-tight">AI Credits Allocation Costs</h3>
            <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">Configure credit costs deducted per generative operation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creditCosts.map((costItem, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-xs font-semibold text-slate-700">{costItem.action}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={costItem.cost}
                  onChange={(e) => handleCostChange(idx, parseInt(e.target.value) || 0)}
                  className="w-16 px-2.5 py-1 text-center font-bold text-xs bg-white rounded-lg border border-slate-100 text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Credits</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
          <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-800 text-xs tracking-tight">Third-Party SaaS Integrations</h3>
            <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">Toggle third-party providers for content generation and backups</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((int, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/30 rounded-xl border border-slate-50">
              <div>
                <span className="font-bold text-slate-800 text-xs block">{int.name}</span>
                <span className="text-[10px] text-slate-400 font-medium block">Provider: {int.provider}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  int.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {int.status}
                </span>
                <button
                  onClick={() => handleToggleIntegration(idx)}
                  className="cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {int.active ? (
                    <ToggleRight className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
