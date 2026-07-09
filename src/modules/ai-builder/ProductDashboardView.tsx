import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Settings,
  Eye,
  Download,
  Share2,
  Trash2,
  Save,
  Plus,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ClipboardList,
  Calendar,
  Calculator as CalcIcon,
  ShoppingBag,
  FileText,
  Search,
  CheckSquare,
  Compass,
  DollarSign,
  Briefcase,
  Layers,
  Globe,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { DigitalProduct, ProductType, AICreditCost } from './types';

interface ProductDashboardViewProps {
  product: DigitalProduct;
  onBack: () => void;
  onUpdateProduct: (updated: DigitalProduct) => void;
  onImproveProduct: (action: string, instruction?: string) => Promise<void>;
  isImproving: boolean;
  creditsCostConfigs: AICreditCost[];
}

export default function ProductDashboardView({
  product,
  onBack,
  onUpdateProduct,
  onImproveProduct,
  isImproving,
  creditsCostConfigs
}: ProductDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'content' | 'assets' | 'marketing' | 'seo' | 'marketplace' | 'pricing' | 'analytics' | 'versions'>('overview');
  
  // Quick Copy notifications helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // AI improve states
  const [translateLanguage, setTranslateLanguage] = useState('Spanish');
  const [customInstruct, setCustomInstruct] = useState('');

  // Local state modifiers for checklist/tasks
  const handleToggleChecklistTask = (taskId: string) => {
    if (!product.content.checklist) return;
    const updatedTasks = product.content.checklist.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, isCompleted: !t.isCompleted };
      }
      return t;
    });
    
    const updated = {
      ...product,
      content: {
        ...product.content,
        checklist: { tasks: updatedTasks }
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateProduct(updated);
  };

  const handleEditChecklistTask = (taskId: string, field: string, value: any) => {
    if (!product.content.checklist) return;
    const updatedTasks = product.content.checklist.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, [field]: value };
      }
      return t;
    });
    
    const updated = {
      ...product,
      content: {
        ...product.content,
        checklist: { tasks: updatedTasks }
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateProduct(updated);
  };

  const handleAddChecklistTask = () => {
    if (!product.content.checklist) return;
    const newTask = {
      id: "chk_" + Date.now(),
      title: "New Checklist Task",
      description: "Describe what needs to be accomplished in this task.",
      subtasks: ["New subtask 1"],
      tips: ["Pro tip"],
      whyItMatters: "Why this step is critical.",
      bestPractices: ["Best practice recommendation"],
      warnings: ["Operational warning"],
      notes: "Context notes",
      isCompleted: false
    };

    const updated = {
      ...product,
      content: {
        ...product.content,
        checklist: {
          tasks: [...product.content.checklist.tasks, newTask]
        }
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateProduct(updated);
  };

  // Dynamic formula inputs helper for calculators
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>(() => {
    const defaultVals: Record<string, number> = {};
    product.content.calculator?.inputs.forEach(input => {
      defaultVals[input.key] = input.defaultValue;
    });
    return defaultVals;
  });

  const handleCalcInputChange = (key: string, val: number) => {
    setCalcInputs(prev => ({ ...prev, [key]: val }));
  };

  // Live Calculator Calculation Output
  const evaluateCalculatorResult = () => {
    if (!product.content.calculator) return 0;
    try {
      // Use basic arithmetic solver manually to prevent dangerous unsafe eval
      const { baseFee, miles, rate, overhead } = calcInputs;
      // Formula: (baseFee + (miles * rate)) - overhead
      if (baseFee !== undefined && miles !== undefined && rate !== undefined && overhead !== undefined) {
        return (baseFee + (miles * rate)) - overhead;
      }
      // Simple fallback base fee evaluation
      return (calcInputs.basePrice || 0) - (calcInputs.overhead || 0);
    } catch {
      return 0;
    }
  };

  const calcResult = evaluateCalculatorResult();

  // Version restoring trigger
  const handleRestoreVersion = (verState: any, verLabel: string) => {
    if (!verState) return;
    const updated = {
      ...product,
      structure: verState.structure,
      content: verState.content,
      assets: verState.assets,
      marketing: verState.marketing,
      marketplace: verState.marketplace,
      seo: verState.seo,
      updatedAt: new Date().toISOString()
    };
    onUpdateProduct(updated);
    alert(`Product successfully restored to ${verLabel}!`);
  };

  // Get active Icon Component based on cover metadata
  const getCoverIconComponent = () => {
    const iconName = product.assets.cover.iconName;
    switch (iconName) {
      case 'CheckSquare': return ClipboardList;
      case 'BookOpen': return BookOpen;
      case 'ClipboardList': return ClipboardList;
      case 'Target': return Compass;
      case 'Briefcase': return Briefcase;
      case 'Layers': return Layers;
      default: return Sparkles;
    }
  };

  const CoverIcon = getCoverIconComponent();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
      
      {/* Product Dashboard Action Bar */}
      <div className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/10 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-100"></div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 text-xs tracking-tight">
              {product.structure.name}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {product.structure.productType}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              v{product.structure.version}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick operations */}
          <button
            onClick={() => {
              // Trigger a save simulation
              const nextVer = (parseFloat(product.structure.version) + 0.1).toFixed(1);
              const copy = JSON.parse(JSON.stringify(product));
              copy.structure.version = nextVer;
              copy.updatedAt = new Date().toISOString();
              copy.versions.push({
                version: nextVer,
                timestamp: new Date().toISOString(),
                updatedBy: "BGrowth User",
                changeLog: "Manual edit and save",
                state: JSON.parse(JSON.stringify({
                  structure: copy.structure,
                  content: copy.content,
                  assets: copy.assets,
                  marketing: copy.marketing,
                  marketplace: copy.marketplace,
                  seo: copy.seo
                }))
              });
              onUpdateProduct(copy);
              alert("Changes saved and compiled as new version!");
            }}
            className="px-3.5 py-1.5 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Checkpoint</span>
          </button>

          <button className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm shadow-indigo-100 transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP Pack</span>
          </button>
        </div>
      </div>

      {/* Tab bar sub-nav */}
      <div className="h-11 border-b border-slate-100 bg-white flex items-center px-8 shrink-0 overflow-x-auto scrollbar-none gap-5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'content', label: 'Product Content' },
          { id: 'assets', label: 'Visual Assets' },
          { id: 'marketing', label: 'Marketing copy' },
          { id: 'seo', label: 'SEO Metadata' },
          { id: 'marketplace', label: 'Marketplaces' },
          { id: 'pricing', label: 'Publish & Sell' },
          { id: 'analytics', label: 'Live Analytics' },
          { id: 'versions', label: 'Version History' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`h-full border-b-2 text-xs font-bold px-1 transition-all flex items-center ${
              activeSubTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace container splitting workspace and the AI floating controller */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Work Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          
          {/* Sub-tab view: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Product Card Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Cover mockup */}
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${product.assets.cover.bgGradientStart} ${product.assets.cover.bgGradientEnd} ${product.assets.cover.textColor} flex flex-col justify-between h-72 shadow-lg relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-white/80">
                      BGrowth Premium standard
                    </span>
                    <CoverIcon className="w-5 h-5 opacity-90 text-white" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight leading-tight">
                      {product.structure.name}
                    </h3>
                    <p className="text-[10px] text-white/80 line-clamp-2 mt-2 leading-relaxed">
                      {product.structure.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2 text-[10px] text-white/80">
                    <span className="font-medium">By {product.structure.author}</span>
                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      v{product.structure.version}
                    </span>
                  </div>
                </div>

                {/* Quick Strategy details card */}
                <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-600 block mb-1">
                      Product description
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">
                      {product.structure.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {product.structure.longDescription}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {product.structure.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-4 mt-4 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase">Difficulty</span>
                      <strong className="text-xs text-slate-700 font-bold mt-0.5 block">{product.structure.difficulty}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase">Setup SLA</span>
                      <strong className="text-xs text-indigo-600 font-bold mt-0.5 block">{product.structure.estimatedCompletionTime}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase">Language</span>
                      <strong className="text-xs text-slate-700 font-bold mt-0.5 block">{product.structure.language}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Report Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Compass className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs tracking-tight">AI Strategy & Market Analysis</h4>
                    <span className="text-[10px] text-slate-400 block font-medium">Auto-derived from product vetting algorithms</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Target & Outcome */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Target Customer Profile</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-semibold">{product.analysis.targetAudience}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Primary Core Business Goal</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{product.analysis.businessGoal}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Customer Desired Outcome</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{product.analysis.desiredOutcome}</p>
                    </div>
                  </div>

                  {/* Right Column: Painpoints & monetization */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Customer Pain Points</span>
                      <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1 mt-1">
                        {product.analysis.customerPainPoints.map((p, idx) => (
                          <li key={idx} className="leading-relaxed">{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Selling & Monetization Opportunities</span>
                      <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1 mt-1">
                        {product.analysis.sellingOpportunities.map((o, idx) => (
                          <li key={idx} className="leading-relaxed font-medium text-slate-700">{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features and Benefits card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h5 className="font-bold text-slate-800 text-xs tracking-tight mb-3">Key Features Included</h5>
                  <ul className="space-y-2">
                    {product.structure.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h5 className="font-bold text-slate-800 text-xs tracking-tight mb-3">Customer Realized Benefits</h5>
                  <ul className="space-y-2">
                    {product.structure.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                        <span className="font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: CONTENT */}
          {activeSubTab === 'content' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* CHECKLISTS CONTENT RENDERER */}
              {product.content.checklist && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight">Interactive Checklist Tasks</h4>
                      <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Toggle completed, customize subtasks, or add tips</p>
                    </div>
                    <button
                      onClick={handleAddChecklistTask}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Checklist Step</span>
                    </button>
                  </div>

                  {product.content.checklist.tasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                        task.isCompleted ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={!!task.isCompleted}
                          onChange={() => handleToggleChecklistTask(task.id)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-200 rounded mt-1 cursor-pointer"
                        />
                        <div className="flex-1">
                          {/* Task Name */}
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => handleEditChecklistTask(task.id, 'title', e.target.value)}
                            className="font-bold text-slate-800 text-xs tracking-tight bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none w-full"
                          />
                          {/* Task Description */}
                          <textarea
                            value={task.description}
                            onChange={(e) => handleEditChecklistTask(task.id, 'description', e.target.value)}
                            className="text-xs text-slate-500 mt-1 bg-transparent border border-transparent hover:border-slate-100 focus:border-slate-200 focus:bg-slate-50 focus:outline-none w-full h-12 py-1 px-1.5 rounded resize-none leading-relaxed"
                          />

                          {/* Grid for parameters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-50">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Subtasks</span>
                              <div className="space-y-1.5">
                                {task.subtasks.map((sub, sidx) => (
                                  <div key={sidx} className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <span className="font-semibold">{sub}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-bold text-amber-600 block mb-1">Pro Tips & Warnings</span>
                              <ul className="space-y-1.5 text-[11px] text-slate-600">
                                {task.tips.map((tip, tidx) => (
                                  <li key={tidx} className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-100/50">
                                    <strong>Tip:</strong> {tip}
                                  </li>
                                ))}
                                {task.warnings.map((warn, widx) => (
                                  <li key={widx} className="bg-rose-50 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-100/50">
                                    <strong>Warning:</strong> {warn}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-3 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-50">
                            <strong>Why it matters:</strong> {task.whyItMatters}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* GUIDE CONTENT RENDERER */}
              {product.content.guide && (
                <div className="space-y-5">
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Guide Chapters</h4>
                  {product.content.guide.sections.map((sec) => (
                    <div key={sec.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <input
                        type="text"
                        value={sec.title}
                        className="font-bold text-slate-800 text-xs block mb-2 w-full border-b border-transparent focus:border-indigo-600 focus:outline-none pb-1"
                        onChange={() => {}} // simulated bind
                      />
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-50">
                        {sec.content}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] text-slate-500 border-t border-slate-50 pt-4">
                        <div>
                          <strong className="text-slate-700 block mb-1">Examples Included:</strong>
                          {sec.examples.map((ex, i) => <span key={i} className="block italic mt-0.5">• {ex}</span>)}
                        </div>
                        <div>
                          <strong className="text-slate-700 block mb-1">Resources Link:</strong>
                          {sec.resources.map((res, i) => <span key={i} className="block text-indigo-600 font-semibold mt-0.5">• {res}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* COURSES CONTENT RENDERER */}
              {product.content.course && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight">Structured Course Outline</h4>
                  {product.content.course.modules.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <div className="border-b border-slate-50 pb-3 mb-3">
                        <span className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Course Module</span>
                        <h5 className="font-bold text-slate-800 text-xs mt-0.5">{mod.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{mod.description}</p>
                      </div>

                      <div className="space-y-4">
                        {mod.lessons.map((les) => (
                          <div key={les.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <h6 className="font-bold text-slate-800 text-xs mb-1.5">{les.title}</h6>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">{les.content}</p>
                            
                            <div className="text-[11px] bg-white p-3 rounded-lg border border-slate-100">
                              <span className="font-bold text-indigo-600 block mb-1">Takeaway exercise:</span>
                              <p className="text-slate-500">{les.exercise}</p>
                            </div>

                            <div className="mt-3 text-[11px] bg-indigo-50/30 p-3 rounded-lg border border-indigo-50/50">
                              <span className="font-bold text-indigo-700 block mb-1">Lesson Quiz Question:</span>
                              <p className="text-slate-700 font-medium mb-1.5">{les.quiz.question}</p>
                              {les.quiz.options.map((opt, oidx) => (
                                <div key={oidx} className="flex items-center gap-1.5 text-slate-500 mt-0.5 font-semibold">
                                  <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                  <span>{opt} {opt === les.quiz.correctAnswer && "✅ (Correct Answer)"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PLANNER CONTENT RENDERER */}
              {product.content.planner && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight">Structured Planners Workspace</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Daily Planner */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <span className="text-[10px] text-blue-600 font-bold uppercase block mb-3">Daily schedule theme</span>
                      <div className="space-y-2">
                        {product.content.planner.daily.schedule.map((sch, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                            <span className="font-bold text-indigo-600 shrink-0 w-20">{sch.time}</span>
                            <span className="text-slate-600 flex-1 ml-4 font-medium">{sch.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Planner */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                      <div>
                        <span className="text-[10px] text-blue-600 font-bold uppercase block mb-2">Weekly goals</span>
                        <ul className="space-y-1 list-disc pl-4 text-xs text-slate-600 font-medium">
                          {product.content.planner.weekly.goals.map((g, i) => <li key={i}>{g}</li>)}
                        </ul>
                      </div>
                      <div className="border-t border-slate-50 pt-3">
                        <span className="text-[10px] text-blue-600 font-bold uppercase block mb-2">Focus Days</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.content.planner.weekly.focusDays.map((fd, i) => (
                            <div key={i} className="p-2 bg-slate-50 rounded-lg text-center border border-slate-100">
                              <span className="font-bold text-slate-800 text-[10px] block">{fd.day}</span>
                              <span className="text-[9px] text-slate-400 block line-clamp-1 mt-0.5">{fd.theme}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CALCULATORS CONTENT RENDERER */}
              {product.content.calculator && (
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight">Interactive Mathematical Calculator Workspace</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input controllers */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                      <span className="text-[10px] text-emerald-600 uppercase font-bold block mb-2 border-b border-slate-50 pb-2">Inputs Modifier</span>
                      
                      {product.content.calculator.inputs.map((inp) => (
                        <div key={inp.key} className="flex items-center justify-between gap-4">
                          <label className="text-xs font-semibold text-slate-600">{inp.label}</label>
                          <div className="flex items-center border border-slate-100 bg-slate-50 rounded-xl px-3 py-1 text-xs focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:bg-white focus-within:border-indigo-600 transition-all shrink-0">
                            {inp.type === 'currency' && <DollarSign className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                            <input
                              type="number"
                              value={calcInputs[inp.key] !== undefined ? calcInputs[inp.key] : inp.defaultValue}
                              onChange={(e) => handleCalcInputChange(inp.key, parseFloat(e.target.value) || 0)}
                              className="w-16 bg-transparent text-right font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calculated live output */}
                    <div className="bg-white rounded-2xl border border-emerald-100 bg-emerald-50/10 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-600 uppercase font-bold block mb-2 border-b border-emerald-100/50 pb-2">Live Calculation output</span>
                        <div className="mt-3">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Active Formula</span>
                          <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded block mt-1 font-mono">
                            {product.content.calculator.formula}
                          </code>
                        </div>
                      </div>

                      <div className="border-t border-emerald-100/50 pt-4 mt-4">
                        <span className="text-xs text-slate-500 font-medium">Estimated Net Earnings</span>
                        <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                          ${calcResult.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-emerald-600/80 mt-1 font-medium leading-relaxed">
                          "Convenience, travel time, convenience printing and notary log indices are accounted dynamically."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab view: ASSETS */}
          {activeSubTab === 'assets' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Visual Marketing Assets Mockups</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Cover mockup block */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block mb-3">Product Digital Cover (PDF / Notion Banner)</span>
                  <div className={`p-8 rounded-xl bg-gradient-to-br ${product.assets.cover.bgGradientStart} ${product.assets.cover.bgGradientEnd} ${product.assets.cover.textColor} flex flex-col justify-between h-80 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-widest uppercase font-bold text-white/80">
                        BGrowth Certified Premium
                      </span>
                      <CoverIcon className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xl tracking-tight leading-tight">
                        {product.structure.name}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-2 mt-2 leading-relaxed">
                        {product.structure.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2 text-[11px] text-white/80">
                      <span className="font-medium">Creator: {product.structure.author}</span>
                      <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                        White-Label Lic.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social banner mockup */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase block mb-3">Social Media Promotion Card (Instagram / LinkedIn)</span>
                    <div className="bg-slate-950 text-white rounded-xl p-6 h-56 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                        <span className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase">Hot Release</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white leading-tight">
                          {product.assets.socialMediaBanner.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {product.assets.socialMediaBanner.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">bgrowth.studio/shop</span>
                        <span className="text-[9px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded">
                          {product.assets.socialMediaBanner.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-600 font-bold block mb-1">Generated Mockups Layouts:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {product.assets.mockups.map((m, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 text-center rounded-lg border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-700 capitalize block">{m.type} mockup</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">{m.label.substring(0, 16)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: MARKETING */}
          {activeSubTab === 'marketing' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Automated Marketing Copy Suite</h4>
              
              {/* Sales copy */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-indigo-600 uppercase font-bold">High-Converting Long Sales Copy</span>
                  <button
                    onClick={() => handleCopyText(product.marketing.longSalesCopy, 'sales_copy')}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'sales_copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'sales_copy' ? 'Copied' : 'Copy Long Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line font-medium bg-slate-50 p-4 rounded-xl border border-slate-50">
                  {product.marketing.longSalesCopy}
                </p>
              </div>

              {/* Email campaign sequence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.marketing.emailCampaign.map((email, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
                        <span className="text-[10px] text-indigo-600 uppercase font-bold">Email {idx + 1} (Day {email.day})</span>
                        <button
                          onClick={() => handleCopyText(`${email.subject}\n\n${email.body}`, `email_${idx}`)}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                      <strong className="text-xs text-slate-800 block mb-2">Subject: {email.subject}</strong>
                      <p className="text-[11px] text-slate-500 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {email.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab view: SEO */}
          {activeSubTab === 'seo' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">SEO Audit & Crawler Metadata</h4>
              
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Search Keyword Title</label>
                    <input
                      type="text"
                      value={product.seo.title}
                      className="w-full px-3.5 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">SEO URL Slug path</label>
                    <input
                      type="text"
                      value={product.seo.slug}
                      className="w-full px-3.5 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">SEO Meta Title (Under 60 chars)</label>
                    <input
                      type="text"
                      value={product.seo.metaTitle}
                      className="w-full px-3.5 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">SEO Meta Description</label>
                    <textarea
                      value={product.seo.metaDescription}
                      className="w-full h-16 px-3.5 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50 resize-none"
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Alt image tag description</label>
                    <input
                      type="text"
                      value={product.seo.imageAltText}
                      className="w-full px-3.5 py-1.5 border border-slate-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: MARKETPLACE */}
          {activeSubTab === 'marketplace' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Automated Marketplace Listing copies</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Etsy */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-indigo-600">Etsy Listing draft</span>
                    <span className="text-xs text-slate-700 font-extrabold">${product.marketplace.etsy.price}</span>
                  </div>
                  <strong className="text-xs text-slate-800 block">Title: {product.marketplace.etsy.title}</strong>
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed max-h-40 overflow-y-auto">
                    {product.marketplace.etsy.description}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    <strong>Materials:</strong> {product.marketplace.etsy.materials.join(', ')}
                  </div>
                </div>

                {/* Gumroad */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-indigo-600">Gumroad listing draft</span>
                    <span className="text-xs text-slate-700 font-extrabold">${product.marketplace.gumroad.price}</span>
                  </div>
                  <strong className="text-xs text-slate-800 block">Product: {product.marketplace.gumroad.title}</strong>
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed max-h-40 overflow-y-auto">
                    {product.marketplace.gumroad.description}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    <strong>Button Action:</strong> {product.marketplace.gumroad.buttonText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: PRICING & PUBLISHING */}
          {activeSubTab === 'pricing' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-4 border-b border-slate-50 pb-3">Publishing and Store Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Set Retail Store Price ($)</label>
                    <div className="flex items-center border border-slate-100 bg-slate-50 rounded-xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:bg-white focus-within:border-indigo-600 transition-all">
                      <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                      <input
                        type="number"
                        defaultValue={29.99}
                        className="w-full bg-transparent font-bold text-xs focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Publish Status</label>
                    <select className="w-full px-3.5 py-1.5 border border-slate-100 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none">
                      <option>Draft</option>
                      <option>Active / Published</option>
                      <option>Private</option>
                      <option>Scheduled Release</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-5 space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">Select destination marketplaces:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'BGrowth Digital Store', connected: true },
                      { name: 'Etsy Integration', connected: false },
                      { name: 'Shopify Store Connector', connected: false },
                      { name: 'Gumroad API', connected: false }
                    ].map((market, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">{market.name}</span>
                        <input type="checkbox" defaultChecked={market.connected} className="w-4 h-4 text-indigo-600 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const copy = JSON.parse(JSON.stringify(product));
                    copy.status = 'Published';
                    onUpdateProduct(copy);
                    alert("Digital Product published directly to BGrowth Store successfully!");
                  }}
                  className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all"
                >
                  Publish Now
                </button>
              </div>
            </div>
          )}

          {/* Sub-tab view: ANALYTICS */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Product-Specific Performance metrics</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Gross Sales Views</span>
                  <strong className="text-2xl font-extrabold text-slate-800 mt-1 block">
                    {product.analytics.views.toLocaleString()}
                  </strong>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Downloads</span>
                  <strong className="text-2xl font-extrabold text-indigo-600 mt-1 block">
                    {product.analytics.downloads.toLocaleString()}
                  </strong>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Conversion Rate</span>
                  <strong className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                    {product.analytics.conversionRate.toFixed(1)}%
                  </strong>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Net Earned Revenue</span>
                  <strong className="text-2xl font-extrabold text-slate-800 mt-1 block">
                    ${product.analytics.revenue.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <span className="text-xs font-bold text-slate-800 block mb-3">Traffic Sources Analysis</span>
                <div className="space-y-3">
                  {product.analytics.trafficSources.map((src, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>{src.source}</span>
                        <span className="font-bold">{src.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${src.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: VERSIONS */}
          {activeSubTab === 'versions' && (
            <div className="space-y-6 max-w-4xl">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Version history and checkpoints</h4>
              
              <div className="space-y-4">
                {product.versions.map((ver, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-xs">Version {ver.version}</span>
                        <span className="text-[10px] text-slate-400">{new Date(ver.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                        Change log: {ver.changeLog}
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1">Author: {ver.updatedBy}</span>
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(ver.state, `Version ${ver.version}`)}
                      disabled={!ver.state}
                      className="px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50/20 text-indigo-600 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Restore Version
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic AI Sidebar panel to continuously improve/audit */}
        <div className="w-72 border-l border-slate-100 bg-white flex flex-col h-full shrink-0">
          
          <div className="p-4 border-b border-slate-50 flex items-center gap-2 bg-indigo-50/10">
            <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
            <div>
              <span className="font-extrabold text-slate-800 text-xs tracking-tight">AI Co-Creator Agent</span>
              <p className="text-[9px] text-slate-400 font-semibold block -mt-0.5">ESTIMATED COST: 30 CREDITS</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            
            {/* Quick action modifiers */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Core Actions</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Improve Product', desc: 'Adds insights and tasks' },
                  { name: 'Improve SEO', desc: 'Upgrades key SEO tags' },
                  { name: 'Generate Better Title', desc: 'Creates catchy names' },
                  { name: 'Create Bundle', desc: 'Adds bundle options' }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => onImproveProduct(act.name)}
                    disabled={isImproving}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <span className="font-bold text-slate-800 text-[11px] block group-hover:text-indigo-600 transition-colors">
                      {act.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{act.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Translation modifier */}
            <div className="border-t border-slate-50 pt-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Translate Content</span>
              <div className="space-y-2">
                <select
                  value={translateLanguage}
                  onChange={(e) => setTranslateLanguage(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option>Spanish</option>
                  <option>German</option>
                  <option>French</option>
                  <option>Portuguese</option>
                  <option>Japanese</option>
                  <option>Hindi</option>
                </select>
                <button
                  onClick={() => onImproveProduct('Translate Product', translateLanguage)}
                  disabled={isImproving}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Translate Entire Product</span>
                </button>
              </div>
            </div>

            {/* Custom instruct modifier */}
            <div className="border-t border-slate-50 pt-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Custom AI Instruct</span>
              <textarea
                value={customInstruct}
                onChange={(e) => setCustomInstruct(e.target.value)}
                placeholder="e.g. 'Translate to Spanish', 'Rewrite descriptions in a witty startup tone', 'Add HIPAA warnings'..."
                className="w-full h-20 px-3 py-2 border border-slate-100 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none leading-relaxed text-slate-600"
              />
              <button
                onClick={() => {
                  if (!customInstruct.trim()) return;
                  onImproveProduct('Custom Instruct', customInstruct);
                  setCustomInstruct('');
                }}
                disabled={isImproving || !customInstruct.trim()}
                className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <span>Apply Instruct</span>
              </button>
            </div>

          </div>

          {/* Dynamic AI improving loader */}
          {isImproving && (
            <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center gap-2 text-indigo-700 animate-pulse text-[11px] font-bold justify-center">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>AI Agent Refining assets...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
