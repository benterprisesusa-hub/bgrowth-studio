import { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Search,
  Code,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  MessageSquare,
  Hash
} from "lucide-react";

export default function GuidesScreen() {
  const [activeGuide, setActiveGuide] = useState("overview");
  const [activeCodeTab, setActiveCodeTab] = useState("html");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const guides = [
    { id: "overview", label: "Overview & Architecture" },
    { id: "syntax", label: "Syntax & Math Operators" },
    { id: "webhooks", label: "HubSpot & CRM Webhooks" },
    { id: "api", label: "JavaScript & Event API" },
  ];

  const codeSnippets: Record<string, string> = {
    html: `<!-- Standard dynamic iframe embed widget -->\n<iframe \n  src="https://calculator.bgrowth.com/embed/saas-project-roi" \n  width="100%" \n  height="700" \n  style="border:none; border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.04);"\n  allow="geolocation"\n></iframe>`,
    react: `// Standard React integration wrapper component\n\n\nexport default function BGrowthCalculatorWidget() {\n  return (\n    <div className="calculator-widget-container max-w-4xl mx-auto p-4">\n      <iframe \n        src="https://calculator.bgrowth.com/embed/saas-project-roi" \n        width="100%" \n        height="700" \n        title="SaaS ROI Estimator"\n        style={{ border: "none", borderRadius: "16px" }}\n      />\n    </div>\n  );\n}`,
    vue: `<!-- Vue 3 Integration Component -->\n<template>\n  <div class="calculator-container">\n    <iframe \n      src="https://calculator.bgrowth.com/embed/saas-project-roi" \n      width="100%" \n      height="700" \n      style="border:none; border-radius:16px;"\n    />\n  </div>\n</template>\n\n<script setup>\n// Ready to render within standard vue-router layouts\n</script>`,
    api: `// Programmatic JSON calculation API proxy\nconst fetchCalculatorQuote = async (inputs) => {\n  const res = await fetch("https://api.bgrowth.com/v1/calculators/eval", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({\n      calculatorId: "saas-project-roi",\n      variables: {\n        licensingCost: 25000,\n        setupCost: 10000,\n        revenueIncrease: 85000,\n      }\n    })\n  });\n  const results = await res.json();\n  return results.calculations;\n};`,
  };

  const handleCopyCode = (tab: string) => {
    navigator.clipboard.writeText(codeSnippets[tab]);
    setCopiedId(tab);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="guides-documentation-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#1061EC]" />
          Guides & Developer Documentation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore implementation guides, arithmetic syntax guidelines, and programmable JSON integration APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side: Navigation manual chapters */}
        <div className="md:col-span-1 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] space-y-1 self-start">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
            Manual Chapters
          </span>
          {guides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setActiveGuide(guide.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                activeGuide === guide.id
                  ? "bg-[#1061EC] text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <span>{guide.label}</span>
              <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${activeGuide === guide.id ? "text-white" : "text-slate-400"}`} />
            </button>
          ))}
        </div>

        {/* Center/Right Panel: Interactive guide logs */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6 min-h-[500px]">
          {/* OVERVIEW CONTENT */}
          {activeGuide === "overview" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-[#1061EC]" />
                  Overview & Calculator Architecture
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Learn the basics of client-side no-code arithmetic compile layers.</p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed space-y-3">
                <p>
                  BGrowth Calculator Engine is a robust, lightweight, highly optimized pricing and ROI widget builder. Every calculator follows a reactive compile sequence:
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2.5">
                  <div className="flex gap-2 items-start">
                    <span className="h-5 w-5 rounded-md bg-blue-100 text-[#1061EC] text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <span className="font-bold text-slate-800">Dynamic User Input:</span>
                      <p className="text-slate-500 mt-0.5">Captures values using standard visual inputs (Sliders, Toggles, Text fields, Selects).</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="h-5 w-5 rounded-md bg-blue-100 text-[#1061EC] text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <span className="font-bold text-slate-800">Sequential Math Solver:</span>
                      <p className="text-slate-500 mt-0.5">Evaluates expressions in a linear priority chain, guaranteeing immediate accurate calculations without page flicker.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="h-5 w-5 rounded-md bg-blue-100 text-[#1061EC] text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <span className="font-bold text-slate-800">Visual Recharts Hydration:</span>
                      <p className="text-slate-500 mt-0.5">Paints real-time distribution charts and logs conversion statistics automatically.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYNTAX CONTENT */}
          {activeGuide === "syntax" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
                  <Hash className="h-4.5 w-4.5 text-[#1061EC]" />
                  Arithmetic & Logic Operators
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">How to write formulas and expressions without coding errors.</p>
              </div>

              <div className="overflow-x-auto border border-slate-150 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Operator</th>
                      <th className="py-2.5 px-3">Meaning / Usage</th>
                      <th className="py-2.5 px-3">Example Syntax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    <tr>
                      <td className="py-3 px-3 font-mono text-[#1061EC]">+ - * /</td>
                      <td className="py-3 px-3">Standard arithmetic functions (Add, Subtract, Multiply, Divide)</td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-500">(revenue - cost) * 12</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono text-[#1061EC]">=== !== &gt; &lt;</td>
                      <td className="py-3 px-3">Equality and boundary logical operators</td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-500">subtotal &gt;= 1500</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono text-[#1061EC]">? :</td>
                      <td className="py-3 px-3">Conditional Ternary Operator (IF / ELSE structures)</td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-500">hasPromo ? 15 : 0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WEBHOOKS CONTENT */}
          {activeGuide === "webhooks" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
                  <Terminal className="h-4.5 w-4.5 text-[#1061EC]" />
                  CRM Webhooks & HubSpot Integration
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">How lead tracking works under the hood.</p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed space-y-3">
                <p>
                  Upon completing a calculator run, the system automatically posts a standardized REST payload to your configured Webhook URL endpoint. The structure contains:
                </p>
                <div className="relative bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-[#A5B4FC] border border-slate-800 overflow-x-auto">
                  {`{\n  "leadEmail": "martin.fowler@thoughtworks.com",\n  "calculatorId": "saas-project-roi",\n  "completedAt": "2026-07-04T15:00:10Z",\n  "inputs": {\n    "licensingCost": 25000,\n    "setupCost": 10000,\n    "revenueIncrease": 85000\n  },\n  "outputs": {\n    "totalInvestment": 35000,\n    "netCashFlow": 75000,\n    "firstYearRoi": 114.2\n  }\n}`}
                </div>
              </div>
            </div>
          )}

          {/* JAVASCRIPT API & CODE INTEGRATION PLAYGROUND */}
          {activeGuide === "api" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
                  <Code className="h-4.5 w-4.5 text-[#1061EC]" />
                  Code Integrations & APIs
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Copy embed scripts and connect calculators directly into your custom applications.</p>
              </div>

              {/* Tabs control */}
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1 overflow-x-auto">
                {[
                  { id: "html", label: "HTML Iframe" },
                  { id: "react", label: "React Wrapper" },
                  { id: "vue", label: "Vue 3 Component" },
                  { id: "api", label: "REST JSON API" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCodeTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeCodeTab === tab.id
                        ? "bg-white text-[#1061EC] shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Code display terminal */}
              <div className="relative">
                <button
                  onClick={() => handleCopyCode(activeCodeTab)}
                  className="absolute right-3 top-3 p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copiedId === activeCodeTab ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-slate-200 leading-relaxed border border-slate-800 overflow-x-auto select-all max-h-[350px]">
                  <pre className="text-left">{codeSnippets[activeCodeTab]}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
