import { useState } from "react";
import {
  Folder,
  Globe,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  TrendingUp,
  Percent,
  Activity,
  PlusCircle,
  ListPlus,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Play,
  FileSpreadsheet,
  Grid,
  BarChart2,
  Cpu,
  Share2,
  Code,
  Laptop,
  Tablet,
  Smartphone,
  Check,
  Menu,
  Eye
} from "lucide-react";
import {
  CalculatorConfig,
  InputField,
  Formula,
  ResultCard,
  ChartSettings,
  RecommendationRule,
  InputCategory
} from "./calcTypes";

import TemplatesScreen from "./TemplatesScreen";
import FormulaLibraryScreen from "./FormulaLibraryScreen";
import VariableLibraryScreen from "./VariableLibraryScreen";
import AiBuilderScreen from "./AiBuilderScreen";
import ReportsScreen from "./ReportsScreen";
import SettingsScreen from "./SettingsScreen";
import GuidesScreen from "./GuidesScreen";

interface WorkspaceStepsProps {
  config: CalculatorConfig;
  updateConfig: (updater: (prev: CalculatorConfig) => CalculatorConfig) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSelectPreset: (presetKey: string) => void;
  aiPrompt: string;
  setAiPrompt: (p: string) => void;
  isGenerating: boolean;
  onGenerateAi: () => void;
}

export default function WorkspaceSteps({
  config,
  updateConfig,
  activeStep,
  setActiveStep,
  currentTab,
  setCurrentTab,
  onSelectPreset,
  aiPrompt,
  setAiPrompt,
  isGenerating,
  onGenerateAi
}: WorkspaceStepsProps) {
  // Local active states for lists
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFormulaId, setEditingFormulaId] = useState<string | null>(null);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activePreviewDevice, setActivePreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copiedCode, setCopiedCode] = useState(false);

  // Field types list
  const fieldTypes = [
    { label: "Currency", value: "currency" },
    { label: "Percentage", value: "percentage" },
    { label: "Number", value: "number" },
    { label: "Dropdown Select", value: "dropdown" },
    { label: "Toggle Switch", value: "toggle" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Slider Bar", value: "slider" },
    { label: "Date Picker", value: "date" },
    { label: "Text Field", value: "text" },
  ];

  // Helper to handle simple text changes in Details
  const handleDetailChange = (key: keyof typeof config.details, value: any) => {
    updateConfig((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value,
      },
    }));
  };

  // Step 1: Details View
  const renderDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-[#0D1B4C]">Calculator Core Details</h2>
          <p className="text-xs text-slate-500 mt-1">Configure your calculator's identity, metadata, and branding parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#1061EC]" />
              Branding & Meta Settings
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Calculator Name *</label>
                <input
                  type="text"
                  value={config.details.name}
                  onChange={(e) => handleDetailChange("name", e.target.value)}
                  placeholder="e.g. ROI Calculator, Clean Quote Builder"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Headline</label>
                <input
                  type="text"
                  value={config.details.subtitle}
                  onChange={(e) => handleDetailChange("subtitle", e.target.value)}
                  placeholder="e.g. Instantly estimate savings and investment payback period"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={config.details.description}
                  onChange={(e) => handleDetailChange("description", e.target.value)}
                  placeholder="Explain exactly what metrics are analyzed and calculated in this engine..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Classification & Metadata */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#1061EC]" />
              Industry & Theme Color
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={config.details.industry}
                  onChange={(e) => handleDetailChange("industry", e.target.value)}
                  placeholder="e.g. Real Estate, Home Services"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={config.details.category}
                  onChange={(e) => handleDetailChange("category", e.target.value)}
                  placeholder="e.g. Finance, ROI, Pricing"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Color Code</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.details.themeColor}
                    onChange={(e) => handleDetailChange("themeColor", e.target.value)}
                    className="h-8 w-8 border border-slate-200 rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={config.details.themeColor}
                    onChange={(e) => handleDetailChange("themeColor", e.target.value)}
                    placeholder="#1061EC"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty level</label>
                <select
                  value={config.details.difficulty}
                  onChange={(e) => handleDetailChange("difficulty", e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={config.details.coverImage}
                  onChange={(e) => handleDetailChange("coverImage", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Comp Time</label>
                  <input
                    type="text"
                    value={config.details.estimatedTime}
                    onChange={(e) => handleDetailChange("estimatedTime", e.target.value)}
                    placeholder="e.g. 2-3 mins"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={config.details.seoTitle}
                    onChange={(e) => handleDetailChange("seoTitle", e.target.value)}
                    placeholder="e.g. SaaS ROI Calculator"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Meta Description Footer */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-4 items-start">
          <Info className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">SEO & Core Branding Identity</span>
            <p className="text-slate-500 mt-1">
              BGrowth custom calculators generate dynamic title tags and meta fields so they can rank independently on Google and boost your domain's organic lead capture automatically.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(16,97,236,0.2)] transition-all"
          >
            <span>Continue to Input Categories</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 2: Input Categories View
  const renderCategoriesStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-[#0D1B4C]">Step 2: Logical Input Categories</h2>
          <p className="text-xs text-slate-500 mt-1">Organize calculator fields into logical groups. Clean navigation reduces user friction.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create and modify categories */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-[#0D1B4C]">Create Custom Category</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category Title</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Business Expenses"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1061EC] focus:bg-white font-medium text-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  if (!newCategoryName.trim()) return;
                  updateConfig((prev) => ({
                    ...prev,
                    categories: [
                      ...prev.categories,
                      {
                        id: `cat-${Date.now()}`,
                        name: newCategoryName.trim(),
                        fieldsCount: 0,
                      },
                    ],
                  }));
                  setNewCategoryName("");
                }}
                className="w-full py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Active category lists */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C]">Active Calculator Categories</h3>

            <div className="divide-y divide-slate-100">
              {config.categories.map((cat, index) => (
                <div key={cat.id} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-[#0D1B4C] group-hover:text-[#1061EC] transition-colors">
                        {cat.name}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Contains {config.fields.filter(f => f.category === cat.id).length} fields
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        // Duplicate category
                        const newId = `cat-${Date.now()}`;
                        updateConfig((prev) => ({
                          ...prev,
                          categories: [
                            ...prev.categories,
                            { id: newId, name: `${cat.name} Copy`, fieldsCount: 0 },
                          ],
                        }));
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={config.categories.length <= 1}
                      onClick={() => {
                        // Delete category
                        updateConfig((prev) => ({
                          ...prev,
                          categories: prev.categories.filter((c) => c.id !== cat.id),
                          fields: prev.fields.filter((f) => f.category !== cat.id),
                        }));
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Back to Details
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
          >
            <span>Continue to Input Builder</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Input Builder
  const renderInputBuilderStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0D1B4C]">Step 3: Calculator Input Builder</h2>
            <p className="text-xs text-slate-500 mt-1">Design the fields, variables, types, and validations that users fill out.</p>
          </div>
          <button
            onClick={() => {
              const newFieldId = `f-${Date.now()}`;
              updateConfig((prev) => ({
                ...prev,
                fields: [
                  ...prev.fields,
                  {
                    id: newFieldId,
                    label: "New Custom Field",
                    variable: "customField",
                    type: "number",
                    required: true,
                    category: prev.categories[0]?.id || "cat-1",
                    defaultValue: 100,
                  },
                ],
              }));
              setEditingFieldId(newFieldId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Input Field</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">Variable Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Required</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {config.fields.map((field) => {
                const isEditing = editingFieldId === field.id;
                return (
                  <tr key={field.id} className={`hover:bg-slate-50/50 transition-colors ${isEditing ? "bg-blue-50/20" : ""}`}>
                    <td className="py-3 px-4 max-w-[200px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => ({
                              ...prev,
                              fields: prev.fields.map((f) => f.id === field.id ? { ...f, label: val } : f),
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800"
                        />
                      ) : (
                        <span className="font-bold text-[#0D1B4C]">{field.label}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={field.variable}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                            updateConfig((prev) => ({
                              ...prev,
                              fields: prev.fields.map((f) => f.id === field.id ? { ...f, variable: val } : f),
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 font-mono"
                        />
                      ) : (
                        <span className="text-[#1061EC] bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                          {field.variable}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            updateConfig((prev) => ({
                              ...prev,
                              fields: prev.fields.map((f) => f.id === field.id ? { ...f, type: val } : f),
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          {fieldTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                          {field.type}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            fields: prev.fields.map((f) => f.id === field.id ? { ...f, required: !f.required } : f),
                          }));
                        }}
                        className={`h-5 w-9 rounded-full relative transition-colors ${field.required ? "bg-[#1061EC]" : "bg-slate-200"}`}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${field.required ? "right-1" : "left-1"}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={field.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => ({
                              ...prev,
                              fields: prev.fields.map((f) => f.id === field.id ? { ...f, category: val } : f),
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          {config.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600">
                          {config.categories.find((c) => c.id === field.category)?.name || "Unassigned"}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingFieldId(isEditing ? null : field.id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                          isEditing ? "bg-green-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isEditing ? "Done" : "Configure"}
                      </button>
                      <button
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            fields: prev.fields.filter((f) => f.id !== field.id),
                          }));
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Categories
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <span>Continue to Formula Builder</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Formula Builder
  const renderFormulaBuilderStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0D1B4C]">Step 4: Formula & Logic Builder</h2>
            <p className="text-xs text-slate-500 mt-1">Implement calculations cleanly. No code required. Live syntax feedback included.</p>
          </div>
          <button
            onClick={() => {
              const newForId = `for-${Date.now()}`;
              updateConfig((prev) => ({
                ...prev,
                formulas: [
                  ...prev.formulas,
                  {
                    id: newForId,
                    name: "New Complex Formula",
                    variable: "totalResult",
                    description: "Multiplies inputs logically",
                    expression: "100 + (customField * 1.5)",
                    returnType: "Currency",
                    rounding: "2 Decimals",
                    format: "$1,234.56",
                  },
                ],
              }));
              setEditingFormulaId(newForId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Formula</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left panel: Available Variables */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic Input Variables</h3>
            <p className="text-[11px] text-slate-400">Drag or type these keys into your math expressions.</p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {config.fields.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                  <span className="text-xs text-[#0D1B4C] font-bold truncate">{f.label}</span>
                  <code className="text-[10px] text-[#1061EC] bg-blue-50/50 border border-blue-100 px-1.5 py-0.5 rounded font-bold font-mono">
                    {f.variable}
                  </code>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formula Intermediaries</h3>
              {config.formulas.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100 font-medium">
                  <span className="text-xs text-amber-900 font-bold truncate">{f.name}</span>
                  <code className="text-[10px] text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded font-bold font-mono">
                    {f.variable}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas Center Canvas & Right properties */}
          <div className="lg:col-span-3 space-y-4">
            {config.formulas.map((formula) => {
              const isEditing = editingFormulaId === formula.id;
              return (
                <div key={formula.id} className={`bg-white border rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${isEditing ? "border-[#1061EC] ring-1 ring-blue-100" : "border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formula.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => ({
                              ...prev,
                              formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, name: val } : f),
                            }));
                          }}
                          className="text-sm font-bold text-slate-800 border-b border-slate-200 focus:outline-none focus:border-[#1061EC]"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#0D1B4C]">{formula.name}</span>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">Variable key: <span className="font-mono font-bold text-[#1061EC]">{formula.variable}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingFormulaId(isEditing ? null : formula.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          isEditing ? "bg-green-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isEditing ? "Apply" : "Edit Formula"}
                      </button>
                      <button
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            formulas: prev.formulas.filter((f) => f.id !== formula.id),
                          }));
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Math Expression Input / Display */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mathematical Formula Expression</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formula.expression}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => ({
                              ...prev,
                              formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, expression: val } : f),
                            }));
                          }}
                          placeholder="e.g. licensingCost + setupCost"
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                        />
                      ) : (
                        <div className="bg-[#0D1B4C] rounded-xl p-3 flex items-center justify-between font-mono text-xs text-white shadow-inner">
                          <span className="font-bold tracking-wide text-blue-200">
                            {formula.variable} <span className="text-white">=</span> {formula.expression}
                          </span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">
                            Valid syntax
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Variable Name</label>
                          <input
                            type="text"
                            value={formula.variable}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                              updateConfig((prev) => ({
                                ...prev,
                                formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, variable: val } : f),
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Return Type</label>
                          <select
                            value={formula.returnType}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              updateConfig((prev) => ({
                                ...prev,
                                formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, returnType: val } : f),
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                          >
                            <option value="Currency">Currency</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Boolean</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Rounding</label>
                          <select
                            value={formula.rounding}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              updateConfig((prev) => ({
                                ...prev,
                                formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, rounding: val } : f),
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                          >
                            <option value="0 Decimals">0 Decimals</option>
                            <option value="1 Decimal">1 Decimal</option>
                            <option value="2 Decimals">2 Decimals</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Format String</label>
                          <input
                            type="text"
                            value={formula.format}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateConfig((prev) => ({
                                ...prev,
                                formulas: prev.formulas.map((f) => f.id === formula.id ? { ...f, format: val } : f),
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Inputs
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <span>Continue to Result Cards</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Result Cards
  const renderResultCardsStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0D1B4C]">Step 5: High-Impact Result Cards</h2>
            <p className="text-xs text-slate-500 mt-1">Pick critical output formulas to display as large, prominent key metrics cards.</p>
          </div>
          <button
            onClick={() => {
              const newCardId = `rc-${Date.now()}`;
              updateConfig((prev) => ({
                ...prev,
                resultCards: [
                  ...prev.resultCards,
                  {
                    id: newCardId,
                    title: "Net Annual Benefits",
                    formulaVariable: prev.formulas[0]?.variable || "netCashFlow",
                    description: "Estimated annual returns",
                    type: "profit",
                    icon: "TrendingUp",
                    color: "#22C55E",
                    decimals: 0,
                  },
                ],
              }));
              setEditingResultId(newCardId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Result Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.resultCards.map((card) => {
            const isEditing = editingResultId === card.id;
            return (
              <div key={card.id} className={`bg-white border rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${isEditing ? "border-[#1061EC] ring-1 ring-blue-100" : "border-slate-200"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-semibold" style={{ backgroundColor: card.color }}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingResultId(isEditing ? null : card.id)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-700 font-bold border border-slate-200 rounded"
                    >
                      {isEditing ? "Save" : "Config"}
                    </button>
                    <button
                      onClick={() => {
                        updateConfig((prev) => ({
                          ...prev,
                          resultCards: prev.resultCards.filter((rc) => rc.id !== card.id),
                        }));
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            resultCards: prev.resultCards.map((rc) => rc.id === card.id ? { ...rc, title: val } : rc),
                          }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Linked Formula</label>
                      <select
                        value={card.formulaVariable}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            resultCards: prev.resultCards.map((rc) => rc.id === card.id ? { ...rc, formulaVariable: val } : rc),
                          }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        {config.formulas.map((f) => (
                          <option key={f.id} value={f.variable}>{f.name} ({f.variable})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Display Mode</label>
                        <select
                          value={card.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            updateConfig((prev) => ({
                              ...prev,
                              resultCards: prev.resultCards.map((rc) => rc.id === card.id ? { ...rc, type: val } : rc),
                            }));
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option value="currency">Currency</option>
                          <option value="percentage">Percentage</option>
                          <option value="profit">Profit / Savings</option>
                          <option value="score">Score</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Theme Color</label>
                        <input
                          type="color"
                          value={card.color}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => ({
                              ...prev,
                              resultCards: prev.resultCards.map((rc) => rc.id === card.id ? { ...rc, color: val } : rc),
                            }));
                          }}
                          className="w-full h-7 border border-slate-200 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide leading-tight">{card.title}</h4>
                    <span className="text-xl font-bold text-[#0D1B4C] mt-1 block">
                      {card.type === "currency" ? "$" : ""}
                      {card.formulaVariable === "firstYearRoi" ? "242.86%" : (card.formulaVariable === "finalQuote" ? "$268.00" : "12.4K")}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{card.description || "Outputs calculated dynamic values."}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Formulas
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <span>Continue to Charts</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 6: Charts Builder
  const renderChartsStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0D1B4C]">Step 6: Chart Settings</h2>
            <p className="text-xs text-slate-500 mt-1">Enable visual representation of metrics like cost-distribution, comparisons, or gains.</p>
          </div>
          <button
            onClick={() => {
              const newChId = `ch-${Date.now()}`;
              updateConfig((prev) => ({
                ...prev,
                charts: [
                  ...prev.charts,
                  {
                    id: newChId,
                    title: "Dynamic Visual Breakdown",
                    type: "Pie Chart",
                    dataSource: "Breakdown",
                    labels: [
                      { label: "Operation Fee", variable: prev.formulas[0]?.variable || "basePrice", color: "#1061EC" },
                    ],
                    showLegend: true,
                  },
                ],
              }));
              setEditingChartId(newChId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Chart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {config.charts.map((chart) => {
            const isEditing = editingChartId === chart.id;
            return (
              <div key={chart.id} className={`lg:col-span-3 bg-white border rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${isEditing ? "border-[#1061EC]" : "border-slate-200"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#0D1B4C]">{chart.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Chart type: {chart.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingChartId(isEditing ? null : chart.id)}
                      className="px-3 py-1 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg"
                    >
                      {isEditing ? "Save Settings" : "Configure Chart"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Chart Title</label>
                      <input
                        type="text"
                        value={chart.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            charts: prev.charts.map((ch) => ch.id === chart.id ? { ...ch, title: val } : ch),
                          }));
                        }}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Visual Format</label>
                      <select
                        value={chart.type}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          updateConfig((prev) => ({
                            ...prev,
                            charts: prev.charts.map((ch) => ch.id === chart.id ? { ...ch, type: val } : ch),
                          }));
                        }}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                      >
                        <option value="Bar Chart">Bar Chart</option>
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Line Chart">Line Chart</option>
                        <option value="Area Chart">Area Chart</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <button
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            charts: prev.charts.map((ch) => ch.id === chart.id ? { ...ch, showLegend: !ch.showLegend } : ch),
                          }));
                        }}
                        className={`h-5 w-9 rounded-full relative transition-colors ${chart.showLegend ? "bg-[#1061EC]" : "bg-slate-200"} mr-2`}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${chart.showLegend ? "right-1" : "left-1"}`} />
                      </button>
                      <span className="text-xs font-semibold text-slate-700">Display Chart Legend</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Result Cards
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <span>Continue to Recommendations</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 7: Recommendation Rules
  const renderRecommendationsStep = () => {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0D1B4C]">Step 7: Smart Recommendation Rules</h2>
            <p className="text-xs text-slate-500 mt-1">Set up custom IF / THEN rules. Display smart tips and advice depending on calculated results.</p>
          </div>
          <button
            onClick={() => {
              const newRuleId = `rec-${Date.now()}`;
              updateConfig((prev) => ({
                ...prev,
                recommendations: [
                  ...prev.recommendations,
                  {
                    id: newRuleId,
                    name: "Rule Recommendation",
                    condition: {
                      variable: prev.formulas[0]?.variable || "paybackPeriod",
                      operator: "gt",
                      value: 3,
                    },
                    thenText: "Payback is quite long. Consider optimizing setup cost or recurring fees.",
                    priority: "Medium",
                    icon: "Warning",
                  },
                ],
              }));
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Rule Card</span>
          </button>
        </div>

        <div className="space-y-4">
          {config.recommendations.map((rec) => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#0D1B4C] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#1061EC]" />
                  {rec.name}
                </span>
                <button
                  onClick={() => {
                    updateConfig((prev) => ({
                      ...prev,
                      recommendations: prev.recommendations.filter((r) => r.id !== rec.id),
                    }));
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Condition Visualizer */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider px-1 bg-slate-200 rounded">IF</span>
                  <select
                    value={rec.condition.variable}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateConfig((prev) => ({
                        ...prev,
                        recommendations: prev.recommendations.map((r) => r.id === rec.id ? { ...r, condition: { ...r.condition, variable: val } } : r),
                      }));
                    }}
                    className="bg-white border border-slate-200 rounded px-2 py-1"
                  >
                    {config.formulas.map((f) => (
                      <option key={f.id} value={f.variable}>{f.variable}</option>
                    ))}
                  </select>

                  <select
                    value={rec.condition.operator}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      updateConfig((prev) => ({
                        ...prev,
                        recommendations: prev.recommendations.map((r) => r.id === rec.id ? { ...r, condition: { ...r.condition, operator: val } } : r),
                      }));
                    }}
                    className="bg-white border border-slate-200 rounded px-1.5 py-1"
                  >
                    <option value="gt">&gt;</option>
                    <option value="lt">&lt;</option>
                    <option value="eq">=</option>
                    <option value="gte">&gt;=</option>
                    <option value="lte">&lt;=</option>
                  </select>

                  <input
                    type="number"
                    value={rec.condition.value}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateConfig((prev) => ({
                        ...prev,
                        recommendations: prev.recommendations.map((r) => r.id === rec.id ? { ...r, condition: { ...r.condition, value: val } } : r),
                      }));
                    }}
                    className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-center"
                  />
                </div>

                <div className="md:col-span-1 text-center text-slate-400 font-bold uppercase text-[9px]">THEN</div>

                {/* Output message */}
                <div className="md:col-span-6">
                  <input
                    type="text"
                    value={rec.thenText}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateConfig((prev) => ({
                        ...prev,
                        recommendations: prev.recommendations.map((r) => r.id === rec.id ? { ...r, thenText: val } : r),
                      }));
                    }}
                    placeholder="e.g. Highlight amazing projected savings!"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Charts
          </button>
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <span>Continue to Preview & Publish</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 8: Preview & Publish
  const renderPreviewPublishStep = () => {
    const embedCode = `<iframe src="https://ais-dev-dklyqyaiblwtdvtwt7qmxr-76344077441.us-east1.run.app/calculator-embed?id=custom-b-growth" width="100%" height="700" style="border:none; border-radius:12px;" allow="geolocation"></iframe>`;

    return (
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-[#0D1B4C]">Step 8: Preview & Production Publish</h2>
          <p className="text-xs text-slate-500 mt-1">Review your responsiveness simulator, custom CSS overrides, and copy production widget scripts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Responsive simulator selection */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0D1B4C]">Responsive Simulator</h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setActivePreviewDevice("desktop")}
                  className={`p-1.5 rounded-md ${activePreviewDevice === "desktop" ? "bg-white text-[#1061EC] shadow" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Laptop className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActivePreviewDevice("tablet")}
                  className={`p-1.5 rounded-md ${activePreviewDevice === "tablet" ? "bg-white text-[#1061EC] shadow" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActivePreviewDevice("mobile")}
                  className={`p-1.5 rounded-md ${activePreviewDevice === "mobile" ? "bg-white text-[#1061EC] shadow" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Simulating device */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center min-h-[350px]">
              <div
                className="bg-white border border-slate-300 rounded-xl shadow-lg transition-all duration-300 overflow-hidden"
                style={{
                  width: activePreviewDevice === "desktop" ? "100%" : activePreviewDevice === "tablet" ? "640px" : "360px",
                  height: "450px",
                }}
              >
                {/* Embedded mock header */}
                <div className="bg-[#0D1B4C] text-white p-4 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-bold">{config.details.name || "Calculator"}</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">Embed Preview</span>
                </div>

                <div className="p-5 overflow-y-auto h-[380px] space-y-4">
                  {/* Category */}
                  {config.categories.map((cat) => (
                    <div key={cat.id} className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5">{cat.name}</h4>
                      <div className="space-y-3">
                        {config.fields
                          .filter((f) => f.category === cat.id)
                          .map((field) => (
                            <div key={field.id} className="space-y-1">
                              <label className="block text-[11px] font-semibold text-slate-700">{field.label}</label>
                              {field.type === "dropdown" ? (
                                <select className="w-full border border-slate-200 bg-slate-50 rounded px-2 py-1.5 text-xs">
                                  {field.options?.map((o) => (
                                    <option key={o}>{o}</option>
                                  ))}
                                </select>
                              ) : field.type === "toggle" ? (
                                <div className="h-5 w-9 rounded-full bg-[#1061EC] relative"><span className="h-3.5 w-3.5 rounded-full bg-white absolute top-0.75 right-1" /></div>
                              ) : (
                                <input
                                  type="text"
                                  defaultValue={field.defaultValue}
                                  className="w-full border border-slate-200 bg-slate-50 rounded px-2.5 py-1 text-xs"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Public access and publish settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-[#0D1B4C]">Access Controls</h3>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-[#0D1B4C] block">Visibility</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Who can view this calculator?</span>
                </div>
                <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold">
                  <option>Publicly Indexed</option>
                  <option>Private Link Only</option>
                  <option>Password Shielded</option>
                </select>
              </div>

              {/* Embedding Instructions */}
              <div className="space-y-2">
                <span className="font-bold text-[#0D1B4C] block">Iframe Widget Embed Code</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Copy and paste this production iframe block directly into Webflow, Framer, WordPress, or Shopify.
                </p>
                <div className="relative bg-slate-900 rounded-xl p-3 font-mono text-[10px] text-[#A5B4FC] overflow-x-auto select-all border border-slate-800">
                  {embedCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0D1B4C] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedCode ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <Code className="h-4 w-4" />}
                  <span>{copiedCode ? "Copied Embed Script!" : "Copy Embed Script"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Back to Recommendations
          </button>
          <button
            onClick={() => {
              alert("Calculator has been published successfully onto BGrowth Cloud Engine™ network!");
              setCurrentTab("dashboard");
            }}
            className="flex items-center gap-1.5 px-8 py-2.5 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Publish To Production Network</span>
          </button>
        </div>
      </div>
    );
  };

  // Switch wrapper for builder steps
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return renderDetailsStep();
      case 2:
        return renderCategoriesStep();
      case 3:
        return renderInputBuilderStep();
      case 4:
        return renderFormulaBuilderStep();
      case 5:
        return renderResultCardsStep();
      case 6:
        return renderChartsStep();
      case 7:
        return renderRecommendationsStep();
      case 8:
        return renderPreviewPublishStep();
      default:
        return renderDetailsStep();
    }
  };

  // Dashboard Page Renderer
  const renderDashboard = () => {
    // Recent calculators inside dashboard
    const drafts: any[] = JSON.parse(localStorage.getItem('bgrowth.calculator.drafts') ?? '[]');
    const published = drafts.filter((d: any) => d.publishSettings?.status === 'public').length;
    const totalUses = drafts.reduce((s: number, d: any) => s + (d.uses ?? 0), 0);

    const listItems = drafts.slice(0, 4).map((d: any) => ({
      id: d.id,
      name: d.details?.name || 'Untitled',
      type: d.details?.industry || 'General',
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : 'Recently',
      status: d.publishSettings?.status === 'public' ? 'Published' : 'Draft',
      usesCount: d.uses ?? 0,
    }));

    const statistics = [
      { label: "My Calculators", value: String(drafts.length), desc: "Created in BGrowth Studio" },
      { label: "Published", value: String(published), desc: "Live and accessible" },
      { label: "Total Uses", value: String(totalUses), desc: "Across all calculators" },
      { label: "Templates", value: "24", desc: "Ready to use" },
    ];

    return (
      <div className="space-y-6">
        {/* Banner with AI Builder Trigger */}
        <div className="bg-gradient-to-r from-[#0D1B4C] via-[#09143C] to-[#1061EC] rounded-2xl p-6 text-white shadow-[0_10px_30px_rgba(16,97,236,0.15)] relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Gemini AI Integration Active
            </span>
            <h1 className="text-2xl font-bold mt-3 text-white tracking-tight">Create unlimited SaaS calculators using AI</h1>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              Describe what calculator you wish to construct, and BGrowth Calculator Engine™ will auto-fill your details, variables, formula math, and chart parameters instantly.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Pressure Washing Estimate Calculator..."
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs placeholder:text-slate-400 text-white focus:outline-none focus:bg-white/20 transition-all flex-1"
              />
              <button
                onClick={onGenerateAi}
                disabled={isGenerating}
                className="bg-[#1061EC] hover:bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block"></span>
                    <span>Building...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Decorative mesh background element */}
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4 scale-150">
            <Cpu className="h-64 w-64 text-blue-500" />
          </div>
        </div>

        {/* Numerical stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statistics.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl font-bold text-[#0D1B4C] mt-1 block tracking-tight">{stat.value}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent calculators table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0D1B4C]">Recent Calculators</h2>
              <p className="text-[11px] text-slate-400">Manage and edit your active calculator configurations.</p>
            </div>
            <button
              onClick={() => {
                onSelectPreset("cleaning");
                setCurrentTab("builder");
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-[#1061EC] hover:bg-blue-50 border border-blue-100 rounded-lg transition-all"
            >
              Start Blank Calculator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Calculator Name</th>
                  <th className="py-3 px-4">Industry Sector</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4">Publishing Status</th>
                  <th className="py-3 px-4">Completed Uses</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {listItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                      No calculators yet. Create your first one using the builder!
                    </td>
                  </tr>
                ) : listItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0D1B4C]">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.type}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.updatedAt}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{item.usesCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectPreset(item.id === "clean" ? "cleaning" : "roi");
                          setCurrentTab("builder");
                        }}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-[#1061EC]"
                      >
                        Launch Config
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      {currentTab === "dashboard" && renderDashboard()}
      {currentTab === "builder" && (
        <div className="space-y-6">
          {/* Progress Wizard Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-2 overflow-x-auto">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Categories" },
              { num: 3, label: "Inputs" },
              { num: 4, label: "Formulas" },
              { num: 5, label: "Result Cards" },
              { num: 6, label: "Charts" },
              { num: 7, label: "Rules" },
              { num: 8, label: "Publish" },
            ].map((step) => {
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className="flex items-center gap-1.5 shrink-0 focus:outline-none group text-left"
                >
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                      isActive
                        ? "bg-[#1061EC] text-white border-[#1061EC] shadow-md shadow-blue-500/15"
                        : isPast
                        ? "bg-[#0D1B4C] text-white border-[#0D1B4C]"
                        : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isActive ? "text-[#1061EC]" : "text-slate-400 group-hover:text-slate-800"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.num < 8 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Active Step Workspace Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_rgba(13,27,76,0.02)] min-h-[500px]">
            {renderStepContent()}
          </div>
        </div>
      )}
      {currentTab === "templates" && (
        <TemplatesScreen
          onSelectPreset={onSelectPreset}
          setCurrentTab={setCurrentTab}
          setActiveStep={setActiveStep}
        />
      )}
      {currentTab === "formula-library" && <FormulaLibraryScreen />}
      {currentTab === "variable-library" && <VariableLibraryScreen config={config} />}
      {currentTab === "ai-builder" && (
        <AiBuilderScreen
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          isGenerating={isGenerating}
          onGenerateAi={onGenerateAi}
        />
      )}
      {currentTab === "reports" && <ReportsScreen />}
      {currentTab === "settings" && <SettingsScreen />}
      {currentTab === "resources" && <GuidesScreen />}
    </div>
  );
}
