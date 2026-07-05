import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import WorkspaceSteps from './WorkspaceSteps';
import LivePreviewPanel from './LivePreviewPanel';
import CalcSidebar from './CalcSidebar';
import CalcHeader from './CalcHeader';
import type { CalculatorConfig } from './calcTypes';

const DEFAULT_CONFIG: CalculatorConfig = {
  details: {
    name: '',
    subtitle: '',
    description: '',
    industry: 'Cleaning Services',
    category: 'Pricing',
    difficulty: 'Beginner',
    themeColor: '#1061EC',
    coverImage: '',
    icon: 'Calculator',
    tags: [],
    estimatedTime: '2-3 minutes',
    version: '1.0.0',
    seoTitle: '',
    seoDescription: '',
  },
  categories: [],
  fields: [],
  formulas: [],
  resultCards: [],
  charts: [],
  recommendations: [],
};

interface CalculatorBuilderProps {
  onBack: () => void;
  initialConfig?: CalculatorConfig;
}

export function CalculatorBuilder({ onBack, initialConfig }: CalculatorBuilderProps) {
  const [config, setConfig] = useState<CalculatorConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [activeStep, setActiveStep] = useState(1);
  const [currentTab, setCurrentTab] = useState('workspace');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const updateConfig = useCallback((updater: (prev: CalculatorConfig) => CalculatorConfig) => {
    setConfig(updater);
  }, []);

  const handleSelectPreset = (presetKey: string) => {
    // Load preset configs — expand later
    console.log('Load preset:', presetKey);
  };

  const handleGenerateAi = useCallback(async () => {
    const apiKey = localStorage.getItem('bgrowth.ai.apiKey');
    if (!apiKey) {
      alert('Please add your API key in Settings to use AI features.');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  }, [aiPrompt]);

  const handleSave = () => {
    const drafts = JSON.parse(localStorage.getItem('bgrowth.calculator.drafts') ?? '[]');
    const existing = drafts.findIndex((d: any) => d.details?.name === config.details.name);
    if (existing >= 0) drafts[existing] = config;
    else drafts.push(config);
    localStorage.setItem('bgrowth.calculator.drafts', JSON.stringify(drafts));
    alert('Saved ✓');
  };

  const handlePublish = () => handleSave();
  const handleReset = () => { if (confirm('Reset calculator?')) setConfig(DEFAULT_CONFIG); };

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Back bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> My Calculators
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">
          {config.details.name || 'New Calculator'}
        </span>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <CalcSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <CalcHeader
            config={config}
            activeStep={activeStep}
            currentTab={currentTab}
            onPreview={() => {}}
            onSave={handleSave}
            onPublish={handlePublish}
            onReset={handleReset}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Workspace */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
              <WorkspaceSteps
                config={config}
                updateConfig={updateConfig}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                onSelectPreset={handleSelectPreset}
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                isGenerating={isGenerating}
                onGenerateAi={handleGenerateAi}
              />
            </div>

            {/* Live preview */}
            <div className="hidden w-80 shrink-0 overflow-hidden border-l border-slate-200 xl:block">
              <LivePreviewPanel config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
