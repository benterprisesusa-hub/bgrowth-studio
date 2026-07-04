import { useState } from 'react';
import CalcSidebar from './builder/CalcSidebar';
import CalcHeader from './builder/CalcHeader';
import WorkspaceSteps from './builder/WorkspaceSteps';
import LivePreviewPanel from './builder/LivePreviewPanel';
import TemplatesScreen from './builder/TemplatesScreen';
import FormulaLibraryScreen from './builder/FormulaLibraryScreen';
import VariableLibraryScreen from './builder/VariableLibraryScreen';
import AiBuilderScreen from './builder/AiBuilderScreen';
import ReportsScreen from './builder/ReportsScreen';
import SettingsScreen from './builder/SettingsScreen';
import GuidesScreen from './builder/GuidesScreen';
import type { CalculatorConfig } from './builder/calcTypes';

const DefaultConfig: CalculatorConfig = {
  details: {
    name: 'ROI Calculator',
    subtitle: 'Evaluate the return on investment of your business project',
    description: 'Quickly compute initial project ROI, payback period, and total operational savings.',
    industry: 'SaaS & Technology',
    category: 'Finance',
    difficulty: 'Intermediate',
    themeColor: '#1061EC',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    icon: 'TrendingUp',
    tags: ['ROI', 'Finance', 'Investment'],
    estimatedTime: '2-3 mins',
    version: '1.0.0',
    seoTitle: 'SaaS Project ROI Calculator',
    seoDescription: 'Calculate return on investment for business projects.',
  },
  categories: [
    { id: 'cat-1', name: 'Project Investment', fieldsCount: 2 },
    { id: 'cat-2', name: 'Revenue & Savings', fieldsCount: 3 },
    { id: 'cat-3', name: 'Operational Cost', fieldsCount: 1 },
  ],
  fields: [
    { id: 'f-1', label: 'Software Licensing Cost', variable: 'licensingCost', type: 'currency', required: true, category: 'cat-1', defaultValue: 25000, validation: { min: 0 } },
    { id: 'f-2', label: 'Implementation & Training', variable: 'setupCost', type: 'currency', required: true, category: 'cat-1', defaultValue: 10000, validation: { min: 0 } },
    { id: 'f-3', label: 'Projected Annual Revenue Increase', variable: 'revenueIncrease', type: 'currency', required: true, category: 'cat-2', defaultValue: 85000, validation: { min: 0 } },
    { id: 'f-4', label: 'Annual Labor Hours Saved', variable: 'laborHoursSaved', type: 'number', required: false, category: 'cat-2', defaultValue: 400, validation: { min: 0 } },
    { id: 'f-5', label: 'Average Hourly Labor Rate', variable: 'hourlyRate', type: 'currency', required: false, category: 'cat-2', defaultValue: 45, validation: { min: 0 } },
    { id: 'f-6', label: 'Annual Maintenance Fee', variable: 'maintenanceFee', type: 'currency', required: true, category: 'cat-3', defaultValue: 5000, validation: { min: 0 } },
  ],
  formulas: [
    { id: 'for-1', name: 'Total Initial Investment', variable: 'totalInvestment', description: 'Sum of license and setup costs', expression: 'licensingCost + setupCost', returnType: 'Currency', rounding: '0 Decimals', format: '$1,234' },
    { id: 'for-2', name: 'Total Annual Benefits', variable: 'annualBenefits', description: 'Revenue increase + hourly savings', expression: 'revenueIncrease + (laborHoursSaved * hourlyRate)', returnType: 'Currency', rounding: '0 Decimals', format: '$1,234' },
    { id: 'for-3', name: 'Net Annual Cash Flow', variable: 'netCashFlow', description: 'Benefits minus recurring maintenance', expression: 'annualBenefits - maintenanceFee', returnType: 'Currency', rounding: '0 Decimals', format: '$1,234' },
    { id: 'for-4', name: 'Project First-Year ROI', variable: 'firstYearRoi', description: 'Percentage return in year 1', expression: '(netCashFlow / totalInvestment) * 100', returnType: 'Percentage', rounding: '2 Decimals', format: '12.34%' },
    { id: 'for-5', name: 'Payback Period', variable: 'paybackPeriod', description: 'Time to recover investment in years', expression: 'totalInvestment / netCashFlow', returnType: 'Number', rounding: '2 Decimals', format: '12.34' },
  ],
  resultCards: [
    { id: 'rc-1', title: 'First-Year ROI', formulaVariable: 'firstYearRoi', description: 'Your percentage return in Year 1', type: 'percentage', icon: 'Percent', color: '#1061EC', decimals: 2 },
    { id: 'rc-2', title: 'Net Annual Benefit', formulaVariable: 'netCashFlow', description: 'Clear savings generated yearly', type: 'profit', icon: 'TrendingUp', color: '#22C55E', decimals: 0 },
    { id: 'rc-3', title: 'Payback Period', formulaVariable: 'paybackPeriod', description: 'Years until fully amortized', type: 'status', icon: 'Clock', color: '#F59E0B', decimals: 1 },
  ],
  charts: [
    {
      id: 'ch-1', title: 'Cost vs. Savings Breakdown', type: 'Bar Chart', dataSource: 'Breakdown',
      labels: [
        { label: 'Total Investment', variable: 'totalInvestment', color: '#EF4444' },
        { label: 'Net Annual Benefit', variable: 'netCashFlow', color: '#22C55E' },
        { label: 'Maintenance Fee', variable: 'maintenanceFee', color: '#F59E0B' },
      ],
      showLegend: true,
    },
  ],
  recommendations: [
    { id: 'rec-1', name: 'Outstanding ROI', condition: { variable: 'firstYearRoi', operator: 'gt', value: 50 }, thenText: 'Your ROI exceeds 50%! This project is highly recommended.', priority: 'High', icon: 'Success' },
    { id: 'rec-2', name: 'Moderate Payback', condition: { variable: 'paybackPeriod', operator: 'gt', value: 2 }, thenText: 'Payback is longer than 2 years. Monitor costs closely.', priority: 'Medium', icon: 'Warning' },
  ],
};

interface CalculatorBuilderProps {
  ownerEmail: string;
}

export function CalculatorBuilder({ ownerEmail }: CalculatorBuilderProps) {
  const [config, setConfig] = useState<CalculatorConfig>(DefaultConfig);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<string>('builder');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const updateConfig = (updater: (prev: CalculatorConfig) => CalculatorConfig) => {
    setConfig((prev) => updater(prev));
  };

  const handleSelectPreset = (presetKey: string) => {
    setConfig(DefaultConfig);
    setCurrentTab('builder');
    setActiveStep(1);
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    const apiKey = localStorage.getItem('bgrowth.ai.apiKey');
    if (!apiKey) {
      alert('Please connect your AI API key in Settings to use AI features.');
      setCurrentTab('settings');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [{ role: 'user', content: `Generate a calculator config JSON for: ${aiPrompt}. Return only valid JSON.` }],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.content[0]?.text ?? '';
        const match = text.match(/\{[\s\S]*\}/);
        if (match) { setConfig(JSON.parse(match[0])); setCurrentTab('builder'); setActiveStep(1); }
      }
    } catch (err) {
      alert('AI generation failed. Check your API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('bgrowth.calculator.builder.drafts') ?? '[]');
      const idx = drafts.findIndex((d: CalculatorConfig) => d.details.name === config.details.name);
      if (idx >= 0) drafts[idx] = config; else drafts.push(config);
      localStorage.setItem('bgrowth.calculator.builder.drafts', JSON.stringify(drafts));
      alert('Draft saved!');
    } catch { alert('Failed to save.'); }
  };

  const handlePublish = () => { handleSave(); alert('Calculator published! 🎉'); };
  const handlePreview = () => { setActiveStep(8); setCurrentTab('builder'); };
  const handleReset = () => { if (confirm('Reset to default template?')) { setConfig(DefaultConfig); setActiveStep(1); } };

  const renderContent = () => {
    switch (currentTab) {
      case 'templates':
        return <div className="flex-1 overflow-auto"><TemplatesScreen onSelectPreset={handleSelectPreset} setCurrentTab={setCurrentTab} setActiveStep={setActiveStep} /></div>;
      case 'formula-library':
        return <div className="flex-1 overflow-auto"><FormulaLibraryScreen /></div>;
      case 'variable-library':
        return <div className="flex-1 overflow-auto"><VariableLibraryScreen /></div>;
      case 'ai-connector':
        return <div className="flex-1 overflow-auto"><AiBuilderScreen aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isGenerating={isGenerating} onGenerateAi={handleGenerateAi} /></div>;
      case 'reports':
        return <div className="flex-1 overflow-auto"><ReportsScreen /></div>;
      case 'settings':
        return <div className="flex-1 overflow-auto"><SettingsScreen /></div>;
      case 'guides':
        return <div className="flex-1 overflow-auto"><GuidesScreen /></div>;
      default:
        return (
          <div className="flex flex-1 overflow-hidden">
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
            <LivePreviewPanel config={config} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <CalcSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} activeStep={activeStep} setActiveStep={setActiveStep} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CalcHeader
          config={config}
          activeStep={activeStep}
          currentTab={currentTab}
          onPreview={handlePreview}
          onSave={handleSave}
          onPublish={handlePublish}
          onReset={handleReset}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {renderContent()}
      </div>
    </div>
  );
}
