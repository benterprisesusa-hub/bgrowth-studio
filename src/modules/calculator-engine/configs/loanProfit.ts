import type { CalculatorConfig } from '../types';

export const loanProfitCalc: CalculatorConfig = {
  productId: 'loan-signing-profit-calculator',
  name: 'Loan Signing Profit Calculator',
  subtitle: 'Analyze your loan signing business profitability.',
  category: 'Profit Calculators',
  icon: 'file-check-2',
  primaryColor: '#CA8A04',
  notesEnabled: true,

  sections: [
    {
      id: 'signings',
      number: 1,
      title: 'Signing Details',
      description: 'Enter your loan signing information.',
      icon: 'file-text',
      fields: [
        { id: 'signings_per_month', label: 'Signings per Month', type: 'number', defaultValue: 20, min: 1, required: true },
        { id: 'fee_per_signing', label: 'Fee per Signing', type: 'currency', defaultValue: 125, prefix: '$', required: true },
        { id: 'avg_travel_miles', label: 'Avg Travel Miles per Signing', type: 'number', defaultValue: 15, suffix: 'mi' },
        { id: 'avg_time_hours', label: 'Avg Time per Signing (hours)', type: 'number', defaultValue: 1.5, suffix: 'hrs' },
        { id: 'print_cost', label: 'Print/Supply Cost per Signing', type: 'currency', defaultValue: 8, prefix: '$' },
      ],
    },
    {
      id: 'expenses',
      number: 2,
      title: 'Monthly Expenses',
      description: 'Enter your monthly business costs.',
      icon: 'dollar-sign',
      fields: [
        { id: 'monthly_insurance', label: 'E&O Insurance', type: 'currency', defaultValue: 50, prefix: '$' },
        { id: 'monthly_platform', label: 'Platform Fees (Snapdocs, etc.)', type: 'currency', defaultValue: 30, prefix: '$' },
        { id: 'monthly_phone', label: 'Phone & Data', type: 'currency', defaultValue: 80, prefix: '$' },
        { id: 'monthly_other', label: 'Other Monthly Expenses', type: 'currency', defaultValue: 50, prefix: '$' },
        { id: 'mileage_rate', label: 'IRS Mileage Rate', type: 'currency', defaultValue: 0.725, prefix: '$', suffix: '/mi' },
        { id: 'tax_rate', label: 'Self-Employment Tax Rate %', type: 'percentage', defaultValue: 30, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'gross_revenue', name: 'Gross Revenue', expression: 'signings_per_month * fee_per_signing', variables: ['signings_per_month', 'fee_per_signing'] },
    { id: 'total_miles', name: 'Total Miles', expression: 'signings_per_month * avg_travel_miles', variables: ['signings_per_month', 'avg_travel_miles'] },
    { id: 'mileage_deduction', name: 'Mileage Deduction', expression: 'total_miles * mileage_rate', variables: ['total_miles', 'mileage_rate'] },
    { id: 'print_costs', name: 'Total Print Costs', expression: 'signings_per_month * print_cost', variables: ['signings_per_month', 'print_cost'] },
    { id: 'fixed_expenses', name: 'Fixed Monthly Expenses', expression: 'monthly_insurance + monthly_platform + monthly_phone + monthly_other', variables: ['monthly_insurance', 'monthly_platform', 'monthly_phone', 'monthly_other'] },
    { id: 'total_expenses', name: 'Total Expenses', expression: 'mileage_deduction + print_costs + fixed_expenses', variables: ['mileage_deduction', 'print_costs', 'fixed_expenses'] },
    { id: 'net_profit', name: 'Net Profit (before tax)', expression: 'gross_revenue - total_expenses', variables: ['gross_revenue', 'total_expenses'] },
    { id: 'tax_amount', name: 'Estimated Tax', expression: 'net_profit > 0 ? net_profit * (tax_rate / 100) : 0', variables: ['net_profit', 'tax_rate'] },
    { id: 'take_home', name: 'Take Home Pay', expression: 'net_profit - tax_amount', variables: ['net_profit', 'tax_amount'] },
    { id: 'profit_per_signing', name: 'Profit per Signing', expression: 'signings_per_month > 0 ? take_home / signings_per_month : 0', variables: ['take_home', 'signings_per_month'] },
    { id: 'hourly_effective_rate', name: 'Effective Hourly Rate', expression: 'avg_time_hours > 0 && signings_per_month > 0 ? take_home / (avg_time_hours * signings_per_month) : 0', variables: ['take_home', 'avg_time_hours', 'signings_per_month'] },
    { id: 'annual_take_home', name: 'Annual Take Home', expression: 'take_home * 12', variables: ['take_home'] },
  ],

  results: [
    { id: 'r_gross', label: 'Gross Revenue', formulaId: 'gross_revenue', type: 'currency' },
    { id: 'r_takehome', label: 'Monthly Take Home', formulaId: 'take_home', type: 'currency', highlight: true, description: 'After expenses & taxes' },
    { id: 'r_per_signing', label: 'Profit per Signing', formulaId: 'profit_per_signing', type: 'currency' },
    { id: 'r_hourly', label: 'Effective Hourly Rate', formulaId: 'hourly_effective_rate', type: 'currency', suffix: '/hr' },
  ],

  quickCalcs: [
    { label: 'Annual Take Home', formulaId: 'annual_take_home', type: 'currency' },
    { label: 'Mileage Deduction', formulaId: 'mileage_deduction', type: 'currency' },
    { label: 'Total Expenses', formulaId: 'total_expenses', type: 'currency' },
    { label: 'Tax Amount', formulaId: 'tax_amount', type: 'currency' },
  ],
};
