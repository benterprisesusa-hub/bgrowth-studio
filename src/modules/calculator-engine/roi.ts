import type { CalculatorConfig } from './types';

export const roiCalc: CalculatorConfig = {
  productId: 'roi-calculator',
  name: 'ROI Calculator',
  subtitle: 'Calculate your return on investment and break-even point.',
  category: 'Business Calculators',
  icon: 'trending-up',
  primaryColor: '#7C3AED',
  notesEnabled: true,

  sections: [
    {
      id: 'investment',
      number: 1,
      title: 'Investment Details',
      description: 'Enter your investment information.',
      icon: 'dollar-sign',
      fields: [
        { id: 'initial_investment', label: 'Initial Investment', type: 'currency', defaultValue: 10000, prefix: '$', required: true },
        { id: 'monthly_revenue', label: 'Monthly Revenue', type: 'currency', defaultValue: 5000, prefix: '$', required: true },
        { id: 'monthly_costs', label: 'Monthly Costs', type: 'currency', defaultValue: 3000, prefix: '$', required: true },
        { id: 'investment_period', label: 'Investment Period (months)', type: 'number', defaultValue: 12, min: 1, max: 120, suffix: 'mo' },
      ],
    },
  ],

  formulas: [
    { id: 'monthly_profit', name: 'Monthly Profit', expression: 'monthly_revenue - monthly_costs', variables: ['monthly_revenue', 'monthly_costs'] },
    { id: 'total_revenue', name: 'Total Revenue', expression: 'monthly_revenue * investment_period', variables: ['monthly_revenue', 'investment_period'] },
    { id: 'total_costs_period', name: 'Total Costs', expression: 'monthly_costs * investment_period + initial_investment', variables: ['monthly_costs', 'investment_period', 'initial_investment'] },
    { id: 'net_profit', name: 'Net Profit', expression: 'total_revenue - total_costs_period', variables: ['total_revenue', 'total_costs_period'] },
    { id: 'roi_pct', name: 'ROI %', expression: 'initial_investment > 0 ? (net_profit / initial_investment) * 100 : 0', variables: ['net_profit', 'initial_investment'] },
    { id: 'breakeven_months', name: 'Break-even (months)', expression: 'monthly_profit > 0 ? initial_investment / monthly_profit : 0', variables: ['initial_investment', 'monthly_profit'] },
    { id: 'profit_margin_pct', name: 'Profit Margin', expression: 'total_revenue > 0 ? (net_profit / total_revenue) * 100 : 0', variables: ['net_profit', 'total_revenue'] },
  ],

  results: [
    { id: 'r_roi', label: 'ROI', formulaId: 'roi_pct', type: 'percentage', highlight: true, description: 'Return on Investment' },
    { id: 'r_net', label: 'Net Profit', formulaId: 'net_profit', type: 'currency' },
    { id: 'r_breakeven', label: 'Break-even', formulaId: 'breakeven_months', type: 'number', suffix: ' months' },
    { id: 'r_margin', label: 'Profit Margin', formulaId: 'profit_margin_pct', type: 'percentage' },
  ],

  quickCalcs: [
    { label: 'Monthly Profit', formulaId: 'monthly_profit', type: 'currency' },
    { label: 'Total Revenue', formulaId: 'total_revenue', type: 'currency' },
    { label: 'Break-even', formulaId: 'breakeven_months', type: 'number', suffix: ' mo' },
  ],
};
