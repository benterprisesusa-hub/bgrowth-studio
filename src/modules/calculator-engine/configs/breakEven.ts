import type { CalculatorConfig } from '../types';

export const breakEvenCalc: CalculatorConfig = {
  productId: 'break-even-calculator',
  name: 'Break-Even Calculator',
  subtitle: 'Find out how many sales you need to cover your costs.',
  category: 'Business Calculators',
  icon: 'target',
  primaryColor: '#EA580C',
  notesEnabled: true,

  sections: [
    {
      id: 'costs',
      number: 1,
      title: 'Costs & Pricing',
      description: 'Enter your cost structure and pricing.',
      icon: 'dollar-sign',
      fields: [
        { id: 'fixed_costs', label: 'Monthly Fixed Costs', type: 'currency', defaultValue: 3000, prefix: '$', required: true, tooltip: 'Rent, insurance, salaries, subscriptions' },
        { id: 'variable_cost_per_unit', label: 'Variable Cost per Unit/Job', type: 'currency', defaultValue: 50, prefix: '$', required: true, tooltip: 'Materials, labor, supplies per sale' },
        { id: 'price_per_unit', label: 'Price per Unit/Job', type: 'currency', defaultValue: 150, prefix: '$', required: true },
        { id: 'target_profit', label: 'Target Monthly Profit', type: 'currency', defaultValue: 2000, prefix: '$' },
      ],
    },
  ],

  formulas: [
    { id: 'contribution_margin', name: 'Contribution Margin', expression: 'price_per_unit - variable_cost_per_unit', variables: ['price_per_unit', 'variable_cost_per_unit'] },
    { id: 'contribution_margin_ratio', name: 'Contribution Margin Ratio', expression: 'price_per_unit > 0 ? (contribution_margin / price_per_unit) * 100 : 0', variables: ['contribution_margin', 'price_per_unit'] },
    { id: 'break_even_units', name: 'Break-Even Units', expression: 'contribution_margin > 0 ? fixed_costs / contribution_margin : 0', variables: ['fixed_costs', 'contribution_margin'] },
    { id: 'break_even_revenue', name: 'Break-Even Revenue', expression: 'break_even_units * price_per_unit', variables: ['break_even_units', 'price_per_unit'] },
    { id: 'units_for_target', name: 'Units for Target Profit', expression: 'contribution_margin > 0 ? (fixed_costs + target_profit) / contribution_margin : 0', variables: ['fixed_costs', 'target_profit', 'contribution_margin'] },
    { id: 'revenue_for_target', name: 'Revenue for Target Profit', expression: 'units_for_target * price_per_unit', variables: ['units_for_target', 'price_per_unit'] },
    { id: 'daily_units_needed', name: 'Daily Units Needed (for target)', expression: 'units_for_target / 22', variables: ['units_for_target'] },
  ],

  results: [
    { id: 'r_cm', label: 'Contribution Margin', formulaId: 'contribution_margin', type: 'currency' },
    { id: 'r_beu', label: 'Break-Even Units/Jobs', formulaId: 'break_even_units', type: 'number', highlight: true, description: 'per month to cover all costs' },
    { id: 'r_ber', label: 'Break-Even Revenue', formulaId: 'break_even_revenue', type: 'currency' },
    { id: 'r_target', label: 'Units for Target Profit', formulaId: 'units_for_target', type: 'number' },
  ],

  quickCalcs: [
    { label: 'Contribution Margin %', formulaId: 'contribution_margin_ratio', type: 'percentage' },
    { label: 'Revenue for Target', formulaId: 'revenue_for_target', type: 'currency' },
    { label: 'Daily Units Needed', formulaId: 'daily_units_needed', type: 'number' },
  ],
};
