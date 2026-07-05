import type { CalculatorConfig } from '../types';

export const businessProfitCalc: CalculatorConfig = {
  productId: 'business-profit-calculator',
  name: 'Business Profit Calculator',
  subtitle: 'Analyze your business revenue, costs and profitability.',
  category: 'Profit Calculators',
  icon: 'bar-chart-2',
  primaryColor: '#1E3A5F',
  notesEnabled: true,

  sections: [
    {
      id: 'revenue',
      number: 1,
      title: 'Revenue',
      description: 'Enter your business revenue.',
      icon: 'trending-up',
      fields: [
        { id: 'monthly_revenue', label: 'Monthly Revenue', type: 'currency', defaultValue: 20000, prefix: '$', required: true },
        { id: 'other_income', label: 'Other Income', type: 'currency', defaultValue: 0, prefix: '$' },
      ],
    },
    {
      id: 'expenses',
      number: 2,
      title: 'Expenses',
      description: 'Enter your monthly business expenses.',
      icon: 'dollar-sign',
      fields: [
        { id: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'currency', defaultValue: 8000, prefix: '$', required: true, tooltip: 'Direct costs of products/services' },
        { id: 'payroll', label: 'Payroll & Labor', type: 'currency', defaultValue: 4000, prefix: '$' },
        { id: 'rent', label: 'Rent & Utilities', type: 'currency', defaultValue: 1000, prefix: '$' },
        { id: 'marketing', label: 'Marketing & Advertising', type: 'currency', defaultValue: 500, prefix: '$' },
        { id: 'insurance', label: 'Insurance', type: 'currency', defaultValue: 200, prefix: '$' },
        { id: 'software', label: 'Software & Tools', type: 'currency', defaultValue: 200, prefix: '$' },
        { id: 'other_expenses', label: 'Other Expenses', type: 'currency', defaultValue: 500, prefix: '$' },
        { id: 'tax_rate', label: 'Tax Rate %', type: 'percentage', defaultValue: 25, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'total_revenue', name: 'Total Revenue', expression: 'monthly_revenue + other_income', variables: ['monthly_revenue', 'other_income'] },
    { id: 'gross_profit', name: 'Gross Profit', expression: 'total_revenue - cogs', variables: ['total_revenue', 'cogs'] },
    { id: 'gross_margin', name: 'Gross Margin %', expression: 'total_revenue > 0 ? (gross_profit / total_revenue) * 100 : 0', variables: ['gross_profit', 'total_revenue'] },
    { id: 'total_opex', name: 'Total Operating Expenses', expression: 'payroll + rent + marketing + insurance + software + other_expenses', variables: ['payroll', 'rent', 'marketing', 'insurance', 'software', 'other_expenses'] },
    { id: 'ebitda', name: 'EBITDA', expression: 'gross_profit - total_opex', variables: ['gross_profit', 'total_opex'] },
    { id: 'tax_amount', name: 'Tax Amount', expression: 'ebitda > 0 ? ebitda * (tax_rate / 100) : 0', variables: ['ebitda', 'tax_rate'] },
    { id: 'net_profit', name: 'Net Profit', expression: 'ebitda - tax_amount', variables: ['ebitda', 'tax_amount'] },
    { id: 'net_margin', name: 'Net Profit Margin %', expression: 'total_revenue > 0 ? (net_profit / total_revenue) * 100 : 0', variables: ['net_profit', 'total_revenue'] },
    { id: 'annual_profit', name: 'Annual Net Profit', expression: 'net_profit * 12', variables: ['net_profit'] },
    { id: 'total_expenses', name: 'Total Expenses', expression: 'cogs + total_opex + tax_amount', variables: ['cogs', 'total_opex', 'tax_amount'] },
  ],

  results: [
    { id: 'r_gross', label: 'Gross Profit', formulaId: 'gross_profit', type: 'currency' },
    { id: 'r_net', label: 'Net Profit', formulaId: 'net_profit', type: 'currency', highlight: true, description: 'Monthly after all expenses & taxes' },
    { id: 'r_margin', label: 'Net Profit Margin', formulaId: 'net_margin', type: 'percentage' },
    { id: 'r_annual', label: 'Annual Net Profit', formulaId: 'annual_profit', type: 'currency' },
  ],

  charts: [
    {
      id: 'profit_breakdown',
      title: 'Revenue Breakdown',
      type: 'donut',
      slices: [
        { label: 'Net Profit', formulaId: 'net_profit', color: '#16A34A' },
        { label: 'COGS', formulaId: 'cogs', color: '#DC2626' },
        { label: 'Operating Expenses', formulaId: 'total_opex', color: '#F59E0B' },
        { label: 'Taxes', formulaId: 'tax_amount', color: '#7C3AED' },
      ],
    },
  ],

  quickCalcs: [
    { label: 'Gross Margin %', formulaId: 'gross_margin', type: 'percentage' },
    { label: 'EBITDA', formulaId: 'ebitda', type: 'currency' },
    { label: 'Total Expenses', formulaId: 'total_expenses', type: 'currency' },
    { label: 'Annual Profit', formulaId: 'annual_profit', type: 'currency' },
  ],
};
