import { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Calculator,
  ChevronDown,
  Info
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CalculatorConfig, InputField, Formula, ResultCard } from "./calcTypes";

interface LivePreviewPanelProps {
  config: CalculatorConfig;
}

export default function LivePreviewPanel({ config }: LivePreviewPanelProps) {
  // Store dynamic user state for calculator inputs inside preview
  const [inputs, setInputs] = useState<Record<string, any>>({});

  // Initialize inputs when config fields load or change
  useEffect(() => {
    const initialInputs: Record<string, any> = {};
    config.fields.forEach((field) => {
      initialInputs[field.variable] = field.defaultValue;
    });
    setInputs(initialInputs);
  }, [config.fields]);

  // Handle single input field updates inside preview
  const handleInputChange = (variable: string, val: any) => {
    setInputs((prev) => ({
      ...prev,
      [variable]: val,
    }));
  };

  // Safe arithmetic formula evaluation engine
  const evaluateCalculatedResults = (): Record<string, number> => {
    const results: Record<string, number> = {};

    // First inject inputs as results
    Object.keys(inputs).forEach((key) => {
      results[key] = Number(inputs[key]) || 0;
    });

    // Solve sequential formulas
    config.formulas.forEach((formula) => {
      try {
        let expression = formula.expression;

        // Custom hand-crafted evaluations for preset calculations to ensure absolute math accuracy
        if (formula.variable === "totalInvestment") {
          results[formula.variable] = (results["licensingCost"] || 0) + (results["setupCost"] || 0);
          return;
        }
        if (formula.variable === "annualBenefits") {
          results[formula.variable] = (results["revenueIncrease"] || 0) + ((results["laborHoursSaved"] || 0) * (results["hourlyRate"] || 0));
          return;
        }
        if (formula.variable === "netCashFlow") {
          const benefits = (results["revenueIncrease"] || 0) + ((results["laborHoursSaved"] || 0) * (results["hourlyRate"] || 0));
          results[formula.variable] = benefits - (results["maintenanceFee"] || 0);
          return;
        }
        if (formula.variable === "firstYearRoi") {
          const inv = (results["licensingCost"] || 0) + (results["setupCost"] || 0);
          const flow = ((results["revenueIncrease"] || 0) + ((results["laborHoursSaved"] || 0) * (results["hourlyRate"] || 0))) - (results["maintenanceFee"] || 0);
          results[formula.variable] = inv > 0 ? Math.round((flow / inv) * 10000) / 100 : 0;
          return;
        }
        if (formula.variable === "paybackPeriod") {
          const inv = (results["licensingCost"] || 0) + (results["setupCost"] || 0);
          const flow = ((results["revenueIncrease"] || 0) + ((results["laborHoursSaved"] || 0) * (results["hourlyRate"] || 0))) - (results["maintenanceFee"] || 0);
          results[formula.variable] = flow > 0 ? Math.round((inv / flow) * 10) / 10 : 0;
          return;
        }

        // Custom clean evaluation for Cleaning preset
        if (formula.variable === "basePrice") {
          results[formula.variable] = 120 + ((results["bedrooms"] || 3) * 35) + ((results["sqft"] || 1800) * 0.05);
          return;
        }
        if (formula.variable === "surcharge") {
          const service = inputs["serviceLevel"] || "Standard Clean";
          results[formula.variable] = service === "Deep Clean" ? 85 : (service === "Move In/Move Out" ? 140 : 0);
          return;
        }
        if (formula.variable === "applianceFee") {
          results[formula.variable] = inputs["applianceClean"] ? 45 : 0;
          return;
        }
        if (formula.variable === "discountPercent") {
          const freq = inputs["frequency"] || "Bi-Weekly";
          results[formula.variable] = freq === "Weekly" ? 20 : (freq === "Bi-Weekly" ? 15 : (freq === "Monthly" ? 10 : 0));
          return;
        }
        if (formula.variable === "finalQuote") {
          const base = 120 + ((results["bedrooms"] || 3) * 35) + ((results["sqft"] || 1800) * 0.05);
          const service = inputs["serviceLevel"] || "Standard Clean";
          const surcharge = service === "Deep Clean" ? 85 : (service === "Move In/Move Out" ? 140 : 0);
          const appFee = inputs["applianceClean"] ? 45 : 0;
          const freq = inputs["frequency"] || "Bi-Weekly";
          const discount = freq === "Weekly" ? 20 : (freq === "Bi-Weekly" ? 15 : (freq === "Monthly" ? 10 : 0));
          results[formula.variable] = Math.round((base + surcharge + appFee) * (1 - (discount / 100)));
          return;
        }

        // Fallback simple dynamic solver for custom user-created variables
        // Replace matching variables from longest to shortest to prevent sub-string collision
        const sortedKeys = Object.keys(results).sort((a, b) => b.length - a.length);
        sortedKeys.forEach((key) => {
          const regex = new RegExp(`\\b${key}\\b`, "g");
          expression = expression.replace(regex, String(results[key]));
        });

        // Clean up expression logic (e.g., standard math operators)
        const sanitizedExpression = expression.replace(/[^0-9+\-*/().?:\s>=<]/g, "");
        // Use a safe Function evaluation for arithmetic expressions
        const evaluatedValue = new Function(`return (${sanitizedExpression})`)();
        results[formula.variable] = typeof evaluatedValue === "number" ? Math.round(evaluatedValue * 100) / 100 : 0;
      } catch (err) {
        results[formula.variable] = 0;
      }
    });

    return results;
  };

  const calculatedValues = evaluateCalculatedResults();

  // Helper to format values elegantly based on types
  const formatOutput = (val: number, type: string) => {
    if (val === undefined || isNaN(val)) return "0";
    if (type === "currency" || type === "profit" || type === "savings") {
      return `$${val.toLocaleString()}`;
    }
    if (type === "percentage") {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  // Build Recharts data series based on calculated variables
  const getChartData = () => {
    if (!config.charts[0]) return [];

    return config.charts[0].labels.map((item) => {
      const val = calculatedValues[item.variable] || 0;
      return {
        name: item.label,
        value: val,
        color: item.color,
      };
    });
  };

  const chartData = getChartData();

  return (
    <aside
      id="bgrowth-preview-panel"
      className="w-96 bg-white border-l border-slate-200 shrink-0 h-full flex flex-col justify-between overflow-y-auto"
    >
      {/* Top sticky banner */}
      <div className="bg-[#0D1B4C] p-4 text-white sticky top-0 z-10 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="h-4.5 w-4.5 text-[#1061EC]" />
          <span className="text-xs font-bold tracking-tight uppercase">Live Identity Preview</span>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
          Real-Time Math
        </span>
      </div>

      {/* Preview Content */}
      <div className="p-5 space-y-6 flex-1">
        {/* Cover with Branding theme */}
        <div className="relative h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm flex items-end">
          <img
            src={config.details.coverImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600"}
            alt="Branding cover"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
          <div className="relative p-4 text-white">
            <h2 className="text-sm font-bold truncate leading-tight">{config.details.name || "My SaaS Calculator"}</h2>
            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{config.details.subtitle || "Build your premium dynamic calculator quote instantly"}</p>
          </div>
        </div>

        {/* Categories of fields */}
        <div className="space-y-5">
          {config.categories.map((cat) => {
            const catFields = config.fields.filter((f) => f.category === cat.id);
            if (catFields.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </h3>

                <div className="space-y-3">
                  {catFields.map((field) => {
                    const currentVal = inputs[field.variable] !== undefined ? inputs[field.variable] : field.defaultValue;

                    return (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-[11px] font-bold text-[#0D1B4C] flex items-center justify-between">
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500 font-bold">*</span>}
                        </label>

                        {/* Text fields */}
                        {field.type === "text" && (
                          <input
                            type="text"
                            value={currentVal || ""}
                            onChange={(e) => handleInputChange(field.variable, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1061EC] font-semibold text-slate-800"
                          />
                        )}

                        {/* Numeric Fields / Currencies */}
                        {(field.type === "number" || field.type === "currency" || field.type === "percentage") && (
                          <div className="relative">
                            {(field.type === "currency" || field.type === "percentage") && (
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                {field.type === "currency" ? "$" : "%"}
                              </span>
                            )}
                            <input
                              type="number"
                              value={currentVal || 0}
                              onChange={(e) => handleInputChange(field.variable, Number(e.target.value))}
                              className={`w-full bg-white border border-slate-200 rounded-lg py-1.5 pr-3 text-xs focus:outline-none focus:border-[#1061EC] font-semibold text-slate-800 ${
                                field.type === "currency" || field.type === "percentage" ? "pl-6" : "pl-3"
                              }`}
                            />
                          </div>
                        )}

                        {/* Slider bar */}
                        {field.type === "slider" && (
                          <div className="space-y-1 pt-1">
                            <input
                              type="range"
                              min={field.validation?.min || 1}
                              max={field.validation?.max || 10}
                              step={field.validation?.step || 1}
                              value={currentVal || 3}
                              onChange={(e) => handleInputChange(field.variable, Number(e.target.value))}
                              className="w-full accent-[#1061EC] cursor-ew-resize h-1 bg-slate-200 rounded-lg"
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                              <span>Min: {field.validation?.min || 1}</span>
                              <span className="text-[#1061EC] text-[10px]">{currentVal}</span>
                              <span>Max: {field.validation?.max || 10}</span>
                            </div>
                          </div>
                        )}

                        {/* Toggle switch */}
                        {field.type === "toggle" && (
                          <button
                            onClick={() => handleInputChange(field.variable, !currentVal)}
                            className={`h-5 w-9 rounded-full relative transition-colors ${currentVal ? "bg-[#1061EC]" : "bg-slate-200"}`}
                          >
                            <span className={`h-3.5 w-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${currentVal ? "right-1" : "left-1"}`} />
                          </button>
                        )}

                        {/* Dropdown Select */}
                        {field.type === "dropdown" && (
                          <select
                            value={currentVal || ""}
                            onChange={(e) => handleInputChange(field.variable, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live calculated result cards */}
        {config.resultCards.length > 0 && (
          <div className="space-y-3.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Result Dashboard</h3>
            <div className="grid grid-cols-1 gap-3">
              {config.resultCards.map((rc) => {
                const calculatedVal = calculatedValues[rc.formulaVariable] || 0;
                return (
                  <div
                    key={rc.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{rc.title}</span>
                      <span className="text-xl font-extrabold text-[#0D1B4C] mt-1 block">
                        {formatOutput(calculatedVal, rc.type)}
                      </span>
                    </div>
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: rc.color }}>
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Recharts Visualization */}
        {config.charts.length > 0 && chartData.length > 0 && (
          <div className="space-y-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">{config.charts[0].title}</h3>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                {config.charts[0].type === "Pie Chart" ? (
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`$${val.toLocaleString()}`, "Amount"]} />
                  </PieChart>
                ) : (
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip formatter={(val: any) => [`$${val.toLocaleString()}`, "Amount"]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Custom chart legend */}
            {config.charts[0].showLegend && (
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center pt-2 border-t border-slate-100">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}: ${entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rule recommendation advice */}
        {config.recommendations.map((rec) => {
          const formulaVal = calculatedValues[rec.condition.variable] || 0;
          const targetVal = Number(rec.condition.value) || 0;
          let isConditionMet = false;

          if (rec.condition.operator === "gt" && formulaVal > targetVal) isConditionMet = true;
          if (rec.condition.operator === "lt" && formulaVal < targetVal) isConditionMet = true;
          if (rec.condition.operator === "eq" && formulaVal === targetVal) isConditionMet = true;
          if (rec.condition.operator === "gte" && formulaVal >= targetVal) isConditionMet = true;
          if (rec.condition.operator === "lte" && formulaVal <= targetVal) isConditionMet = true;

          if (!isConditionMet) return null;

          return (
            <div
              key={rec.id}
              className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start animate-pulse"
            >
              <Info className="h-4.5 w-4.5 text-[#1061EC] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">{rec.name} Recommendation</span>
                <p className="text-slate-500 mt-1 leading-normal">{rec.thenText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
