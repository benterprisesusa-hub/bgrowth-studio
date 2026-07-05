import { useState } from "react";
import {
  Cpu,
  Search,
  BookOpen,
  Copy,
  Check,
  Play,
  Settings,
  HelpCircle,
  PlusCircle,
  CheckCircle,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  Info
} from "lucide-react";

export default function FormulaLibraryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Formula sandbox variables state
  const [sandboxExpr, setSandboxExpr] = useState("(revenue - marketingCost) / marketingCost");
  const [sandboxResult, setSandboxResult] = useState<number | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [sandboxInputs, setSandboxInputs] = useState<Record<string, number>>({
    revenue: 150000,
    marketingCost: 40000,
    laborHours: 350,
    hourlyRate: 50,
  });

  const categories = ["All", "Finance", "SaaS Metrics", "Service Quotes", "Conditionals"];

  const libraryFormulas = [
    {
      id: "roi-simple",
      name: "Simple Return on Investment (ROI)",
      category: "Finance",
      description: "Standard calculation of returns relative to the original capital investment.",
      expression: "(revenueIncrease - projectCost) / projectCost * 100",
      returnType: "Percentage",
      variables: ["revenueIncrease", "projectCost"],
      example: "((85000 - 35000) / 35000) * 100 = 142.8%"
    },
    {
      id: "payback",
      name: "Simple Payback Period",
      category: "Finance",
      description: "Estimated number of years required to amortize or recover the initial investment cost.",
      expression: "initialInvestment / netAnnualCashFlow",
      returnType: "Number (Years)",
      variables: ["initialInvestment", "netAnnualCashFlow"],
      example: "35000 / 12500 = 2.8 Years"
    },
    {
      id: "cac-simple",
      name: "Customer Acquisition Cost (CAC)",
      category: "SaaS Metrics",
      description: "Aggregates total marketing and sales expenses divided by the number of acquired users.",
      expression: "totalSalesMarketingSpend / acquiredCustomers",
      returnType: "Currency",
      variables: ["totalSalesMarketingSpend", "acquiredCustomers"],
      example: "12000 / 150 = $80.00"
    },
    {
      id: "ltv-saas",
      name: "Customer Lifetime Value (LTV)",
      category: "SaaS Metrics",
      description: "Calculates the total revenue a business can reasonably expect from a single customer account.",
      expression: "averageMonthlyRevenuePerUser / monthlyChurnRate",
      returnType: "Currency",
      variables: ["averageMonthlyRevenuePerUser", "monthlyChurnRate"],
      example: "120 / 0.03 = $4,000.00"
    },
    {
      id: "quote-bedroom",
      name: "Flat-rate Cleaning Quote base",
      category: "Service Quotes",
      description: "Formulates service quotes by combining a base rate, variable room rates, and square footage weights.",
      expression: "120 + (bedroomsCount * 35) + (sqft * 0.05)",
      returnType: "Currency",
      variables: ["bedroomsCount", "sqft"],
      example: "120 + (3 * 35) + (1800 * 0.05) = $315.00"
    },
    {
      id: "volume-discount",
      name: "Multi-tier volume discount rate",
      category: "Conditionals",
      description: "Uses nested conditional ternary operators to assign discount weights based on frequency.",
      expression: "frequency === 'Weekly' ? 20 : (frequency === 'Bi-Weekly' ? 15 : (frequency === 'Monthly' ? 10 : 0))",
      returnType: "Percentage",
      variables: ["frequency"],
      example: "Bi-Weekly = 15%"
    },
    {
      id: "tax-bracket",
      name: "Dynamic bracket surcharge fee",
      category: "Conditionals",
      description: "Evaluates standard tier pricing surcharges using strict threshold evaluation limits.",
      expression: "subtotal > 1000 ? subtotal * 0.12 : subtotal * 0.08",
      returnType: "Currency",
      variables: ["subtotal"],
      example: "1200 * 0.12 = $144.00"
    }
  ];

  const handleCopy = (expr: string, id: string) => {
    navigator.clipboard.writeText(expr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run Sandbox calculation safely
  const runSandboxEval = () => {
    try {
      setSandboxError(null);
      let expression = sandboxExpr;

      // Replace variables inside expression
      const sortedKeys = Object.keys(sandboxInputs).sort((a, b) => b.length - a.length);
      sortedKeys.forEach((key) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        expression = expression.replace(regex, String(sandboxInputs[key]));
      });

      // Sanitize
      const sanitized = expression.replace(/[^0-9+\-*/().?:\s>=<]/g, "");
      const result = new Function(`return (${sanitized})`)();

      if (typeof result !== "number" || isNaN(result)) {
        throw new Error("Result is not a valid number");
      }
      setSandboxResult(Math.round(result * 100) / 100);
    } catch (err: any) {
      setSandboxError(err.message || "Invalid math operators");
      setSandboxResult(null);
    }
  };

  const filteredFormulas = libraryFormulas.filter((f) => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.expression.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="formula-library-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#1061EC]" />
            Formula & Logic Reference Library
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and copy battle-tested algebraic formulas to construct beautiful client-side pricing models.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas or syntax..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1061EC]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Formula catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Categories Row */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
            {filteredFormulas.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:border-[#1061EC] transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#1061EC] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                      {f.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#0D1B4C] mt-1.5">{f.name}</h3>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(f.expression, f.id)}
                    className="p-1.5 rounded-lg border border-slate-200/80 bg-slate-50 text-slate-500 hover:text-[#1061EC] hover:bg-blue-50/50 transition-colors"
                    title="Copy expression"
                  >
                    {copiedId === f.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-normal">{f.description}</p>

                {/* Mathematical layout container */}
                <div className="bg-[#0D1B4C] rounded-xl p-3.5 font-mono text-xs text-white shadow-inner flex items-center justify-between">
                  <span className="font-semibold text-blue-200 truncate leading-relaxed">
                    {f.expression}
                  </span>
                  <span className="text-[9px] bg-emerald-500/25 text-emerald-400 font-extrabold uppercase px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {f.returnType}
                  </span>
                </div>

                {/* Details list */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold uppercase text-slate-400">Variables required:</span>
                    {f.variables.map((v) => (
                      <span key={v} className="bg-slate-50 text-slate-600 border border-slate-200 font-mono px-1.5 py-0.5 rounded-md">
                        {v}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase">Example:</span>{" "}
                    <span className="text-slate-500 font-mono">{f.example}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredFormulas.length === 0 && (
              <div className="py-12 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                <HelpCircle className="h-10 w-10 text-slate-300" />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">No Formulas Matched</span>
                  <p className="text-xs text-slate-400 mt-0.5">Try searching for other words like 'ROI' or 'Discount'.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Evaluator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4 self-start">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#1061EC]" />
              Formula Math Sandbox
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Test any algebraic expression instantly with live variables.</p>
          </div>

          {/* Sandbox Variables Mock Controls */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sandbox Input States</span>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.keys(sandboxInputs).map((key) => (
                <div key={key} className="space-y-0.5">
                  <label className="block text-[10px] font-semibold text-slate-600 font-mono">{key}</label>
                  <input
                    type="number"
                    value={sandboxInputs[key]}
                    onChange={(e) =>
                      setSandboxInputs((prev) => ({
                        ...prev,
                        [key]: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1061EC]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sandbox Expression Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">Arithmetic Expression</label>
            <textarea
              rows={2}
              value={sandboxExpr}
              onChange={(e) => setSandboxExpr(e.target.value)}
              placeholder="e.g. (revenue - marketingCost) / marketingCost"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#1061EC] placeholder:text-slate-300"
            />
          </div>

          {/* Sandbox Controls */}
          <button
            onClick={runSandboxEval}
            className="w-full py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Evaluate Expression</span>
          </button>

          {/* Sandbox evaluation output */}
          {(sandboxResult !== null || sandboxError !== null) && (
            <div className={`p-4 rounded-xl border ${sandboxError ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>
              {sandboxError ? (
                <div className="flex gap-2 items-start text-xs font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <p>Syntax Error: {sandboxError}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Result Output</span>
                    <span className="text-xl font-extrabold block mt-0.5">{sandboxResult}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/35 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Perfect Math
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
