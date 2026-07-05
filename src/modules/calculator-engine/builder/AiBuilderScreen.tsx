import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Wand2,
  Cpu,
  Sliders,
  Play,
  Terminal,
  Send,
  HelpCircle,
  Settings,
  Flame,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AiBuilderScreenProps {
  aiPrompt: string;
  setAiPrompt: (p: string) => void;
  isGenerating: boolean;
  onGenerateAi: () => void;
}

export default function AiBuilderScreen({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  onGenerateAi,
}: AiBuilderScreenProps) {
  // Advanced AI Workbench states
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [customSystemPrompt, setCustomSystemPrompt] = useState(
    "Always enforce strictly positive calculations. Never return empty arrays. Match BGrowth Slate theme aesthetics."
  );

  // Chat message simulation
  const [chatLog, setChatLog] = useState([
    {
      sender: "system",
      text: "BGrowth Gemini Engine v2.5 Sandbox connection online. Ready to compile code structures.",
      time: "15:00:10",
    },
    {
      sender: "ai",
      text: "Hello! I am your AI Builder. Type any calculator description in the console below, and I will instantly design its entire mathematical structure, visual inputs, formula engine, and Recharts graphs.",
      time: "15:00:12",
    },
  ]);

  // Compiler output log simulator
  const [compilerLogs, setCompilerLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Trigger compiler logs animation when generation is running
  useEffect(() => {
    if (isGenerating) {
      setCompilerLogs([]);
      const stages = [
        "⚡ Connecting to BGrowth Gemini Core gateway API...",
        "🧠 Parsing natural language requirement tokens...",
        "🔧 Synthesizing UI Inputs: Creating dynamic fields, validating default boundaries...",
        "📐 Compiling Algebra: Structuring algebraic formulas, checking circular dependencies...",
        "📊 Generating Charts: Creating responsive Recharts datasets...",
        "🔔 Crafting Recommendations: Adding smart warning systems...",
        "✨ Validation OK: Hydrating model tree state & launching preview simulator...",
      ];

      let delay = 0;
      stages.forEach((stage, idx) => {
        setTimeout(() => {
          setCompilerLogs((prev) => [...prev, stage]);
        }, delay);
        delay += idx === 0 ? 500 : idx === 1 ? 800 : idx === 2 ? 1200 : idx === 3 ? 1500 : idx === 4 ? 1200 : 900;
      });
    }
  }, [isGenerating]);

  // Scroll to logs end
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [compilerLogs]);

  const handleSendPrompt = () => {
    if (!aiPrompt.trim()) return;

    // Append user message
    setChatLog((prev) => [
      ...prev,
      {
        sender: "user",
        text: aiPrompt,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    // Call the AI build sequence
    onGenerateAi();
  };

  const promptPresets = [
    "Solar Energy ROI & Carbon Offset Estimator",
    "Car Lease Loan Payment Comparison Tool",
    "Fitness Gym Membership Savings & Upgrade Pricing",
    "Freelance Web Developer Project Pricing Quote Calculator",
  ];

  return (
    <div id="ai-builder-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-[#1061EC]" />
          AI Calculator Generator & Workbench
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Instruct Gemini to build customized calculator widgets, inject validation rules, and optimize math parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: AI Workbench Console & Chat Log */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[600px] justify-between shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          {/* Terminal Console Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-mono font-bold text-slate-200">GEMINI_WORKBENCH@BGROWTH:~</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
          </div>

          {/* Interactive Chat Log & Compiler Logs */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-[11px] leading-relaxed">
            {chatLog.map((log, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  log.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    log.sender === "user"
                      ? "bg-blue-500 text-white"
                      : log.sender === "system"
                      ? "bg-slate-800 text-slate-300"
                      : "bg-[#1061EC] text-white"
                  }`}
                >
                  {log.sender === "user" ? "U" : log.sender === "system" ? "S" : "AI"}
                </div>
                <div
                  className={`p-3 rounded-xl border ${
                    log.sender === "user"
                      ? "bg-blue-600/10 border-blue-500/20 text-blue-200"
                      : log.sender === "system"
                      ? "bg-slate-900/50 border-slate-800/80 text-slate-400"
                      : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                >
                  <p>{log.text}</p>
                  <span className="text-[9px] text-slate-500 mt-1.5 block text-right">
                    {log.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Live Compiler logs output */}
            {compilerLogs.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                  ▶ COMPILING MODEL TREE LOGS:
                </span>
                <div className="space-y-1 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {compilerLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-slate-300 animate-pulse">
                      <span className="text-emerald-500 font-bold">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Prompt Console Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isGenerating) handleSendPrompt();
                }}
                disabled={isGenerating}
                placeholder="Describe what calculator you wish to construct..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500 flex-1 placeholder:text-slate-600"
              />
              <button
                onClick={handleSendPrompt}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-[#1061EC] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1061EC] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block"></span>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Compile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Advanced Generator Tuning Parameters */}
        <div className="space-y-5">
          {/* Model settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
              <Sliders className="h-4.5 w-4.5 text-[#1061EC]" />
              Gemini Parameters
            </h3>

            <div className="space-y-3.5 text-xs font-medium">
              {/* Select Model */}
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Model Selection</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultralight, Instant)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Math-Intelligence)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Context-Aware)</option>
                </select>
              </div>

              {/* Temperature */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Temperature</label>
                  <span className="text-[#1061EC] text-[10px] font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[#1061EC] cursor-ew-resize h-1 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold font-mono">
                  <span>Deterministic (0.1)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Custom directives */}
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Custom System Directives</label>
                <textarea
                  rows={2}
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder="Enforce positive outcomes, align branding, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#1061EC] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quick presets list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
            <h3 className="text-sm font-bold text-[#0D1B4C] flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#1061EC]" />
              Quick Presets Prompt Gallery
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Click any blueprint below to load it instantly inside the prompt console input.
            </p>

            <div className="space-y-2">
              {promptPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAiPrompt(preset)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/20 hover:border-blue-400 text-xs font-semibold text-slate-700 transition-all line-clamp-2"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
