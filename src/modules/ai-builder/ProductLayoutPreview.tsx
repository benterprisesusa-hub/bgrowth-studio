import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ClipboardList,
  Calendar,
  Calculator as CalcIcon,
  BookOpen,
  FileText,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Smartphone,
  Tablet as TabletIcon,
  Check,
  DollarSign,
  User,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProductLayoutPreviewProps {
  bp: any;
  bpName: string;
  bpType: string;
  bpSellingPrice: number;
}

export default function ProductLayoutPreview({ bp, bpName, bpType, bpSellingPrice }: ProductLayoutPreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet'>('mobile');
  
  // Local state for interactive mockup elements
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [activeCourseLesson, setActiveCourseLesson] = useState<{ mIdx: number; lIdx: number }>({ mIdx: 0, lIdx: 0 });
  const [calcValues, setCalcValues] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'content' | 'about'>('content');

  const structureData = bp?.structure || {};

  // Setup default calculator values when blueprint structure loads
  useEffect(() => {
    if (structureData.inputs && Array.isArray(structureData.inputs)) {
      const initial: Record<string, number> = {};
      structureData.inputs.forEach((inp: any, idx: number) => {
        const key = inp.label || `input_${idx}`;
        initial[key] = Number(inp.defaultValue) || 0;
      });
      setCalcValues(initial);
    }
  }, [structureData.inputs]);

  // Handle checking checklist tasks
  const toggleCheck = (taskKey: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  // Live calculation solver (Safe custom evaluation)
  const calculateResult = () => {
    if (!structureData.inputs) return 0;
    
    // Sum or multiply values depending on keyword indicators to show dynamic mock mathematics
    const values = Object.values(calcValues);
    if (values.length === 0) return 0;

    const lowerFormula = String(structureData.formulas || '').toLowerCase();
    
    if (lowerFormula.includes('*') || lowerFormula.includes('multipl')) {
      return values.reduce((acc, val) => acc * (val || 1), 1);
    }
    
    if (lowerFormula.includes('-') || lowerFormula.includes('overhead')) {
      // Treat first item as primary positive, subtract the rest
      const [first, ...rest] = values;
      return rest.reduce((acc, val) => acc - val, first || 0);
    }

    // Default to sum
    return values.reduce((acc, val) => acc + val, 0);
  };

  // Select cover background gradient style based on category
  const getCoverStyle = () => {
    const type = bpType?.toLowerCase() || 'checklist';
    if (type.includes('checklist')) {
      return {
        gradient: 'from-indigo-600 via-indigo-700 to-blue-800',
        textColor: 'text-white',
        badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
        Icon: ClipboardList
      };
    } else if (type.includes('planner')) {
      return {
        gradient: 'from-blue-600 via-blue-700 to-cyan-800',
        textColor: 'text-white',
        badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
        Icon: Calendar
      };
    } else if (type.includes('calculator')) {
      return {
        gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
        textColor: 'text-white',
        badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
        Icon: CalcIcon
      };
    } else if (type.includes('course')) {
      return {
        gradient: 'from-amber-500 via-orange-600 to-rose-700',
        textColor: 'text-white',
        badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
        Icon: BookOpen
      };
    } else {
      return {
        gradient: 'from-violet-600 via-purple-700 to-fuchsia-800',
        textColor: 'text-white',
        badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
        Icon: FileText
      };
    }
  };

  const cover = getCoverStyle();
  const CoverIcon = cover.Icon;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 h-full">
      
      {/* Visual Header with Mockup Control */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">
            Visual Layout Preview
          </span>
          <h3 className="font-black text-slate-800 text-xs tracking-tight mt-0.5">
            📱 Interactive Product Mockup
          </h3>
        </div>

        {/* Viewport Toggles */}
        <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg shrink-0">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Mobile Layout"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              deviceMode === 'tablet' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Tablet Layout"
          >
            <TabletIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed -mt-1 font-medium">
        This is an active preview of the <strong>{bpType}</strong> template structure. Feel free to interact with checklists, sliders, or lessons to experience the user-interface.
      </p>

      {/* Device Body Container */}
      <div className="flex justify-center items-center py-2 bg-slate-50/50 rounded-2xl border border-slate-50/70 relative">
        <div
          className={`transition-all duration-500 ease-in-out bg-slate-950 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 relative ${
            deviceMode === 'mobile' ? 'w-[290px] min-h-[510px]' : 'w-full max-w-[440px] min-h-[510px]'
          }`}
        >
          {/* Speaker / Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800/50 block"></span>
          </div>

          {/* Device Screen Body */}
          <div className="bg-slate-50 rounded-[2rem] overflow-hidden min-h-[480px] max-h-[480px] overflow-y-auto flex flex-col relative scrollbar-none text-slate-800 font-sans">
            
            {/* 1. Header Banner / Cover Mockup */}
            <div className={`p-5 pt-8 pb-6 bg-gradient-to-br ${cover.gradient} ${cover.textColor} relative overflow-hidden shrink-0`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${cover.badgeColor}`}>
                  {bpType}
                </span>
                <CoverIcon className="w-4 h-4 text-white/90" />
              </div>

              <h4 className="text-sm font-black tracking-tight leading-snug line-clamp-2">
                {bpName || 'Untitled Digital Asset'}
              </h4>
              <p className="text-[9px] text-white/70 mt-1 line-clamp-1 leading-normal font-medium">
                {bp?.overview?.industry || 'Professional Edition'} • {bp?.overview?.language || 'English'}
              </p>

              {/* Cover Bottom Wave overlay styling */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 opacity-10"></div>
            </div>

            {/* In-app Sub-Tabs inside mockup screen */}
            <div className="flex border-b border-slate-200/50 bg-white px-3 shrink-0">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 text-center text-[10px] font-bold border-b-2 transition-all ${
                  activeTab === 'content' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
                }`}
              >
                Conteúdo do Template
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-2 text-center text-[10px] font-bold border-b-2 transition-all ${
                  activeTab === 'about' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
                }`}
              >
                Sobre o Produto
              </button>
            </div>

            {/* 2. Interactive Mockup Content Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
              
              {activeTab === 'about' ? (
                <div className="space-y-3 text-slate-600">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Problem Solved</span>
                    <p className="text-[10px] text-slate-700 font-semibold mt-0.5 leading-relaxed">
                      {bp?.customerGoal?.problemSolved || 'No explicit problem defined in prompt specifications.'}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Expected Outcome</span>
                    <p className="text-[10px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                      {bp?.customerGoal?.expectedOutcome || 'Build scalable operational foundations for target clients.'}
                    </p>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-indigo-900">
                    <div>
                      <span className="text-[8px] text-indigo-500 font-extrabold block uppercase tracking-widest">Recommended Listing Price</span>
                      <strong className="text-sm font-black block mt-0.5">${bpSellingPrice || '29.99'}</strong>
                    </div>
                    <span className="text-[9px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded">
                      Etsy Ready
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* DYNAMIC CONTENT TYPE RENDERERS */}

                  {/* CHECKLIST LAYOUT */}
                  {bpType?.toLowerCase().includes('checklist') && (
                    <div className="space-y-4">
                      {structureData.checklistSections && Array.isArray(structureData.checklistSections) ? (
                        structureData.checklistSections.map((section: any, sIdx: number) => (
                          <div key={sIdx} className="space-y-2">
                            <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest px-1">
                              {section.title || `Módulo ${sIdx + 1}`}
                            </span>
                            
                            <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
                              {section.tasks && Array.isArray(section.tasks) ? (
                                section.tasks.map((task: string, tIdx: number) => {
                                  const key = `${sIdx}_${tIdx}`;
                                  const isDone = !!completedItems[key];
                                  return (
                                    <div
                                      key={tIdx}
                                      onClick={() => toggleCheck(key)}
                                      className="p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                                    >
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        isDone ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                      }`}>
                                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>
                                      <span className={`text-[10px] font-semibold leading-tight transition-all ${
                                        isDone ? 'line-through text-slate-400' : 'text-slate-700'
                                      }`}>
                                        {task}
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-[9px] italic text-slate-400 p-3">Nenhuma tarefa delineada neste bloco.</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 bg-white rounded-xl border border-slate-100">
                          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] text-slate-400 italic">Estrutura de Checklist carregada dinamicamente.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PLANNER LAYOUT */}
                  {bpType?.toLowerCase().includes('planner') && (
                    <div className="space-y-4">
                      {/* Daily scheduler */}
                      {structureData.plannerDaily && Array.isArray(structureData.plannerDaily) && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest px-1">
                            Daily Schedule Plan
                          </span>
                          <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm space-y-2">
                            {structureData.plannerDaily.map((item: string, idx: number) => {
                              const key = `plan_d_${idx}`;
                              const isDone = !!completedItems[key];
                              return (
                                <div
                                  key={idx}
                                  onClick={() => toggleCheck(key)}
                                  className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                    isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className={`text-[10px] font-medium leading-tight ${
                                    isDone ? 'line-through text-slate-400' : 'text-slate-600'
                                  }`}>
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Weekly milestones */}
                      {structureData.plannerWeekly && Array.isArray(structureData.plannerWeekly) && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest px-1">
                            Weekly Core Focus
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {structureData.plannerWeekly.map((item: string, idx: number) => (
                              <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] text-blue-600 font-black">Meta 0{idx + 1}</span>
                                <p className="text-[9px] text-slate-600 font-medium leading-relaxed mt-1">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CALCULATOR LAYOUT */}
                  {bpType?.toLowerCase().includes('calculator') && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-4">
                        <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest">
                          Simulador Matemático
                        </span>
                        
                        <div className="space-y-3">
                          {structureData.inputs && Array.isArray(structureData.inputs) ? (
                            structureData.inputs.map((inp: any, idx: number) => {
                              const key = inp.label || `input_${idx}`;
                              const val = calcValues[key] !== undefined ? calcValues[key] : (inp.defaultValue || 0);
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                    <span>{inp.label}</span>
                                    <span className="text-emerald-600 font-mono font-black">{val}</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max={inp.defaultValue > 1000 ? "10000" : "100"}
                                    value={val}
                                    onChange={(e) => setCalcValues(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-[10px] text-slate-400 italic">No configuration inputs found.</p>
                          )}
                        </div>

                        {/* Interactive Result Card */}
                        <div className="bg-emerald-50 border border-emerald-100/50 p-3 rounded-xl text-center">
                          <span className="text-[8px] text-emerald-600 font-extrabold block uppercase tracking-wider">
                            {structureData.outputs?.[0]?.label || 'Resultado da Fórmula'}
                          </span>
                          <strong className="text-xl font-black text-emerald-800 block mt-1 font-mono">
                            ${calculateResult().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                          <span className="text-[7px] text-slate-400 block mt-0.5 font-mono">
                            Fórmula: {structureData.formulas || 'Soma de Variáveis'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COURSE LAYOUT */}
                  {bpType?.toLowerCase().includes('course') && (
                    <div className="space-y-3">
                      {structureData.courseModules && Array.isArray(structureData.courseModules) ? (
                        <div className="space-y-3">
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest px-1">
                            Módulos de Estudo
                          </span>

                          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 shadow-sm">
                            {structureData.courseModules.map((mod: any, mIdx: number) => {
                              const isActiveMod = activeCourseLesson.mIdx === mIdx;
                              return (
                                <div key={mIdx} className="p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-[8px]">
                                        {mIdx + 1}
                                      </span>
                                      <span>{mod.title}</span>
                                    </h5>
                                  </div>

                                  <div className="space-y-1 pl-5">
                                    {mod.lessons && Array.isArray(mod.lessons) ? (
                                      mod.lessons.map((les: string, lIdx: number) => {
                                        const isSelected = activeCourseLesson.mIdx === mIdx && activeCourseLesson.lIdx === lIdx;
                                        return (
                                          <button
                                            key={lIdx}
                                            onClick={() => setActiveCourseLesson({ mIdx, lIdx })}
                                            className={`w-full text-left p-1.5 rounded text-[9px] font-semibold transition-all flex items-center justify-between ${
                                              isSelected ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                          >
                                            <span className="line-clamp-1">{les}</span>
                                            {isSelected && <span className="text-[8px] bg-amber-600 text-white font-black px-1 rounded">Lendo</span>}
                                          </button>
                                        );
                                      })
                                    ) : (
                                      <p className="text-[8px] italic text-slate-400">Sem lições</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Selected Lesson Viewer Mockup */}
                          {structureData.courseModules[activeCourseLesson.mIdx] && (
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
                              <span className="text-[8px] text-amber-600 font-extrabold uppercase block tracking-wider">Visualização da Lição</span>
                              <h6 className="text-[10px] font-black text-slate-800">
                                {structureData.courseModules[activeCourseLesson.mIdx].lessons?.[activeCourseLesson.lIdx] || 'Selecione uma lição'}
                              </h6>
                              <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                                Conteúdo estruturado para esta aula. Inclui guia em áudio, material didático de leitura complementar e lições de casa práticas para consolidação do conhecimento.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-white rounded-xl border border-slate-100">
                          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] text-slate-400 italic font-medium">Nenhum módulo de curso carregado.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DEFAULT GUIDE/SOP/RESOURCE LAYOUT */}
                  {!bpType?.toLowerCase().includes('checklist') &&
                   !bpType?.toLowerCase().includes('planner') &&
                   !bpType?.toLowerCase().includes('calculator') &&
                   !bpType?.toLowerCase().includes('course') && (
                    <div className="space-y-4">
                      {structureData.guideChapters && Array.isArray(structureData.guideChapters) ? (
                        structureData.guideChapters.map((chap: any, cIdx: number) => (
                          <div key={cIdx} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm space-y-2">
                            <h5 className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded bg-purple-50/80 text-purple-700 font-bold flex items-center justify-center text-[8px]">
                                {cIdx + 1}
                              </span>
                              <span>{chap.title}</span>
                            </h5>
                            <ul className="space-y-1 pl-5">
                              {chap.topics && Array.isArray(chap.topics) && chap.topics.map((top: string, tIdx: number) => (
                                <li key={tIdx} className="text-[9px] text-slate-500 font-medium list-disc leading-relaxed">
                                  {top}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-2">
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest">
                            Guia Editorial & SOP
                          </span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            O template gerado conterá a documentação textual completa do guia ou SOP de forma estruturada em capítulos e lições práticas.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              
            </div>

            {/* Mockup Sticky Footer Action */}
            <div className="h-10 bg-white border-t border-slate-100 px-4 flex items-center justify-between shrink-0">
              <span className="text-[8px] font-bold text-slate-400">© 2026 BGrowth Studio</span>
              <div className="flex items-center gap-1 text-[8px] text-indigo-600 font-black uppercase tracking-wider">
                <span>Visualizar Completo</span>
                <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
