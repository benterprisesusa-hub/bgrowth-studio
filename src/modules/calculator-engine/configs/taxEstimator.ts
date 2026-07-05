import type { CalculatorConfig } from '../types';

export const taxEstimatorCalc: CalculatorConfig = {
  productId: 'tax-estimator-calculator',
  name: 'Tax Estimator Calculator',
  subtitle: 'Estimate your self-employment and business taxes.',
  category: 'Tax Calculators',
  icon: 'percent',
  primaryColor: '#DC2626',
  notesEnabled: true,

  sections: [
    {
      id: 'income',
      number: 1,
      title: 'Income & Revenue',
      description: 'Enter your income information.',
      icon: 'trending-up',
      fields: [
        { id: 'gross_revenue', label: 'Gross Revenue / Income', type: 'currency', defaultValue: 50000, prefix: '$', required: true },
        { id: 'business_expenses', label: 'Business Expenses', type: 'currency', defaultValue: 10000, prefix: '$' },
        { id: 'other_deductions', label: 'Other Deductions', type: 'currency', defaultValue: 0, prefix: '$' },
        { id: 'filing_status', label: 'Filing Status', type: 'select', defaultValue: 'single', required: true, options: [
          { label: 'Single', value: 'single' },
          { label: 'Married Filing Jointly', value: 'married' },
          { label: 'Head of Household', value: 'head' },
        ]},
        { id: 'state_rate', label: 'State Tax Rate %', type: 'percentage', defaultValue: 5, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'net_income', name: 'Net Income', expression: 'gross_revenue - business_expenses - other_deductions', variables: ['gross_revenue', 'business_expenses', 'other_deductions'] },
    { id: 'se_tax', name: 'Self-Employment Tax (15.3%)', expression: 'net_income * 0.153 * 0.9235', variables: ['net_income'] },
    { id: 'se_deduction', name: 'SE Tax Deduction', expression: 'se_tax * 0.5', variables: ['se_tax'] },
    { id: 'agi', name: 'Adjusted Gross Income', expression: 'net_income - se_deduction', variables: ['net_income', 'se_deduction'] },
    { id: 'federal_tax', name: 'Federal Income Tax (est.)', expression: 'agi > 44725 ? (agi - 44725) * 0.22 + 5147 : agi > 11000 ? (agi - 11000) * 0.12 + 1100 : agi * 0.10', variables: ['agi'] },
    { id: 'state_tax', name: 'State Tax', expression: 'agi * (state_rate / 100)', variables: ['agi', 'state_rate'] },
    { id: 'total_tax', name: 'Total Tax', expression: 'se_tax + federal_tax + state_tax', variables: ['se_tax', 'federal_tax', 'state_tax'] },
    { id: 'effective_rate', name: 'Effective Tax Rate', expression: 'gross_revenue > 0 ? (total_tax / gross_revenue) * 100 : 0', variables: ['total_tax', 'gross_revenue'] },
    { id: 'quarterly_payment', name: 'Quarterly Payment', expression: 'total_tax / 4', variables: ['total_tax'] },
    { id: 'take_home', name: 'Take Home Pay', expression: 'net_income - total_tax', variables: ['net_income', 'total_tax'] },
  ],

  results: [
    { id: 'r_total', label: 'Total Tax Estimate', formulaId: 'total_tax', type: 'currency', highlight: true, description: 'Estimated annual tax' },
    { id: 'r_quarterly', label: 'Quarterly Payment', formulaId: 'quarterly_payment', type: 'currency' },
    { id: 'r_takehome', label: 'Take Home Pay', formulaId: 'take_home', type: 'currency' },
    { id: 'r_rate', label: 'Effective Tax Rate', formulaId: 'effective_rate', type: 'percentage' },
  ],

  quickCalcs: [
    { label: 'Self-Employment Tax', formulaId: 'se_tax', type: 'currency' },
    { label: 'Federal Tax', formulaId: 'federal_tax', type: 'currency' },
    { label: 'State Tax', formulaId: 'state_tax', type: 'currency' },
    { label: 'Net Income', formulaId: 'net_income', type: 'currency' },
  ],
};
