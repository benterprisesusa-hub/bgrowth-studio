import type { CalculatorConfig } from '../types';

export const commissionCalc: CalculatorConfig = {
  productId: 'commission-calculator',
  name: 'Commission Calculator',
  subtitle: 'Calculate sales commissions and earnings instantly.',
  category: 'Business Calculators',
  icon: 'trending-up',
  primaryColor: '#059669',
  notesEnabled: true,

  sections: [
    {
      id: 'sales',
      number: 1,
      title: 'Sales & Commission Details',
      description: 'Enter your sales information.',
      icon: 'trending-up',
      fields: [
        { id: 'total_sales', label: 'Total Sales Amount', type: 'currency', defaultValue: 10000, prefix: '$', required: true },
        { id: 'commission_type', label: 'Commission Type', type: 'select', defaultValue: 'flat', required: true, options: [
          { label: 'Flat Rate %', value: 'flat' },
          { label: 'Tiered (after threshold)', value: 'tiered' },
          { label: 'Gross Profit %', value: 'profit' },
        ]},
        { id: 'commission_rate', label: 'Commission Rate %', type: 'percentage', defaultValue: 10, suffix: '%', required: true },
        { id: 'base_salary', label: 'Base Salary (monthly)', type: 'currency', defaultValue: 0, prefix: '$' },
        { id: 'cost_of_goods', label: 'Cost of Goods Sold', type: 'currency', defaultValue: 0, prefix: '$', tooltip: 'Used for gross profit commission' },
        { id: 'threshold', label: 'Sales Threshold (tiered)', type: 'currency', defaultValue: 5000, prefix: '$', tooltip: 'Higher rate kicks in above this' },
        { id: 'tiered_rate', label: 'Tiered Rate above Threshold %', type: 'percentage', defaultValue: 15, suffix: '%' },
        { id: 'num_sales', label: 'Number of Sales/Deals', type: 'number', defaultValue: 1, min: 1 },
      ],
    },
  ],

  formulas: [
    { id: 'gross_profit', name: 'Gross Profit', expression: 'total_sales - cost_of_goods', variables: ['total_sales', 'cost_of_goods'] },
    { id: 'flat_commission', name: 'Flat Commission', expression: 'total_sales * (commission_rate / 100)', variables: ['total_sales', 'commission_rate'] },
    { id: 'tiered_commission', name: 'Tiered Commission', expression: 'total_sales > threshold ? (threshold * (commission_rate / 100)) + ((total_sales - threshold) * (tiered_rate / 100)) : total_sales * (commission_rate / 100)', variables: ['total_sales', 'threshold', 'commission_rate', 'tiered_rate'] },
    { id: 'profit_commission', name: 'Profit-Based Commission', expression: 'gross_profit * (commission_rate / 100)', variables: ['gross_profit', 'commission_rate'] },
    { id: 'commission_earned', name: 'Commission Earned', expression: 'commission_type === "tiered" ? tiered_commission : commission_type === "profit" ? profit_commission : flat_commission', variables: ['commission_type', 'tiered_commission', 'profit_commission', 'flat_commission'] },
    { id: 'total_earnings', name: 'Total Earnings', expression: 'base_salary + commission_earned', variables: ['base_salary', 'commission_earned'] },
    { id: 'commission_per_sale', name: 'Commission per Sale', expression: 'num_sales > 0 ? commission_earned / num_sales : 0', variables: ['commission_earned', 'num_sales'] },
    { id: 'annual_projection', name: 'Annual Projection', expression: 'total_earnings * 12', variables: ['total_earnings'] },
  ],

  results: [
    { id: 'r_commission', label: 'Commission Earned', formulaId: 'commission_earned', type: 'currency', highlight: true, description: 'This period' },
    { id: 'r_total', label: 'Total Earnings', formulaId: 'total_earnings', type: 'currency' },
    { id: 'r_per_sale', label: 'Per Sale Average', formulaId: 'commission_per_sale', type: 'currency' },
    { id: 'r_annual', label: 'Annual Projection', formulaId: 'annual_projection', type: 'currency' },
  ],

  quickCalcs: [
    { label: 'Base Salary', formulaId: 'base_salary', type: 'currency' },
    { label: 'Gross Profit', formulaId: 'gross_profit', type: 'currency' },
    { label: 'Annual Projection', formulaId: 'annual_projection', type: 'currency' },
  ],
};
