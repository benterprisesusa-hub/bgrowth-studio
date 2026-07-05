import { useState } from "react";
import {
  Variable,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  Cpu,
  Bookmark,
  ShieldAlert,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Settings,
  Grid,
  Info
} from "lucide-react";
import { CalculatorConfig } from "./calcTypes";

interface VariableLibraryScreenProps {
  config: CalculatorConfig;
}

export default function VariableLibraryScreen({ config }: VariableLibraryScreenProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Constants list state
  const [globalConstants, setGlobalConstants] = useState([
    { name: "ANNUAL_WORKING_HOURS", value: 2080, description: "Standard business hours per year (40 hours/week * 52 weeks)" },
    { name: "DEFAULT_TAX_RATE", value: 0.21, description: "Corporate tax threshold rate for financial model formulas" },
    { name: "INFLATION_RATE", value: 0.03, description: "Year-over-year asset and cost escalation index multiplier" },
    { name: "AVERAGE_RETENTION_RATE", value: 0.94, description: "SaaS baseline monthly user preservation multiplier (94%)" },
  ]);

  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCopy = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleAddConstant = () => {
    if (!newName || !newValue) return;
    setGlobalConstants((prev) => [
      ...prev,
      {
        name: newName.replace(/[^a-zA-Z0-9_]/g, "").toUpperCase(),
        value: Number(newValue) || 0,
        description: newDesc || "Custom system constant multiplier",
      },
    ]);
    setNewName("");
    setNewValue("");
    setNewDesc("");
  };

  return (
    <div id="variable-library-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
          <Variable className="h-5 w-5 text-[#1061EC]" />
          Variable & Dictionary Library
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage system data models, inspect live calculation variables, and reference global constants within equations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle: Active Calculator Variables */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
              <Grid className="h-4.5 w-4.5 text-[#1061EC]" />
              Active Calculator Variables ({config.fields.length + config.formulas.length})
            </h3>
            <p className="text-xs text-slate-400">
              The following variables can be referenced inside visual builder calculations or custom webhook mappings.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Label / Name</th>
                    <th className="py-2.5 px-3">Variable Key</th>
                    <th className="py-2.5 px-3">Source Type</th>
                    <th className="py-2.5 px-3">Data Format</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {/* Dynamic Inputs */}
                  {config.fields.map((field) => (
                    <tr key={field.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#0D1B4C]">{field.label}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-[#1061EC] bg-blue-50 px-2 py-0.5 rounded font-bold">
                          {field.variable}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          Dynamic Input
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-500 uppercase text-[10px]">
                        {field.type}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleCopy(field.variable)}
                          className="p-1 text-slate-400 hover:text-[#1061EC]"
                        >
                          {copiedVar === field.variable ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Formula Intermediaries */}
                  {config.formulas.map((formula) => (
                    <tr key={formula.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#0D1B4C]">{formula.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          {formula.variable}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          Derived Logic
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-500 uppercase text-[10px]">
                        {formula.returnType}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleCopy(formula.variable)}
                          className="p-1 text-slate-400 hover:text-[#1061EC]"
                        >
                          {copiedVar === formula.variable ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Global Constants Configurator */}
        <div className="space-y-6">
          {/* Create custom constants */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
              <Bookmark className="h-4.5 w-4.5 text-[#1061EC]" />
              Global Constant Variables
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Predefine static company values that can be referenced by name in any active calculator's formulas.
            </p>

            <div className="space-y-3">
              {/* Form fields */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Constant ID (Capitalized)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  placeholder="e.g. FLAT_FEES_RATE"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold uppercase text-slate-800 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Value</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddConstant}
                    className="w-full py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Standard flat rates for freight delivery"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                />
              </div>
            </div>

            {/* List of active constants */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Constants</span>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {globalConstants.map((constant) => (
                  <div key={constant.name} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 relative group">
                    <button
                      onClick={() => {
                        setGlobalConstants((prev) => prev.filter((c) => c.name !== constant.name));
                      }}
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#0D1B4C]">{constant.name}</span>
                      <span className="font-mono text-xs font-extrabold text-[#1061EC] bg-blue-50 px-2 py-0.5 rounded-md">
                        {constant.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{constant.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
