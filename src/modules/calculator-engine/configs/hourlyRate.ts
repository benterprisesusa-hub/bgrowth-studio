import type { CalculatorConfig } from '../types';

export const hourlyRateCalc: CalculatorConfig = {
  productId: 'hourly-rate-calculator',
  name: 'Freelancer Hourly Rate Calculator',
  subtitle: 'Calculate the perfect hourly rate for your freelance business.',
  category: 'Business Calculators',
  icon: 'clock',
  primaryColor: '#7C3AED',
  notesEnabled: true,

  sections: [
    {
      id: 'expenses',
      number: 1,
      title: 'Annual Expenses',
      description: 'Enter your yearly business and personal expenses.',
      icon: 'dollar-sign',
      fields: [
        { id: 'annual_salary_goal', label: 'Desired Annual Income', type: 'currency', defaultValue: 60000, prefix: '$', required: true },
        { id: 'business_expenses', label: 'Annual Business Expenses', type: 'currency', defaultValue: 5000, prefix: '$' },
        { id: 'taxes_pct', label: 'Tax Rate %', type: 'percentage', defaultValue: 30, suffix: '%' },
        { id: 'vacation_weeks', label: 'Vacation Weeks per Year', type: 'number', defaultValue: 2, min: 0, max: 52 },
        { id: 'billable_hours_per_week', label: 'Billable Hours per Week', type: 'number', defaultValue: 30, min: 1, max: 60, suffix: 'hrs', required: true },
        { id: 'profit_margin_pct', label: 'Desired Profit Margin %', type: 'percentage', defaultValue: 20, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'work_weeks', name: 'Work Weeks per Year', expression: '52 - vacation_weeks', variables: ['vacation_weeks'] },
    { id: 'annual_billable_hours', name: 'Annual Billable Hours', expression: 'work_weeks * billable_hours_per_week', variables: ['work_weeks', 'billable_hours_per_week'] },
    { id: 'tax_amount', name: 'Tax Amount', expression: 'annual_salary_goal * (taxes_pct / 100)', variables: ['annual_salary_goal', 'taxes_pct'] },
    { id: 'total_needed', name: 'Total Annual Revenue Needed', expression: 'annual_salary_goal + business_expenses + tax_amount', variables: ['annual_salary_goal', 'business_expenses', 'tax_amount'] },
    { id: 'base_rate', name: 'Base Hourly Rate', expression: 'annual_billable_hours > 0 ? total_needed / annual_billable_hours : 0', variables: ['total_needed', 'annual_billable_hours'] },
    { id: 'recommended_rate', name: 'Recommended Rate (with profit)', expression: 'base_rate * (1 + profit_margin_pct / 100)', variables: ['base_rate', 'profit_margin_pct'] },
    { id: 'monthly_revenue', name: 'Monthly Revenue at Rate', expression: 'recommended_rate * billable_hours_per_week * 4', variables: ['recommended_rate', 'billable_hours_per_week'] },
    { id: 'annual_revenue', name: 'Annual Revenue at Rate', expression: 'recommended_rate * annual_billable_hours', variables: ['recommended_rate', 'annual_billable_hours'] },
  ],

  results: [
    { id: 'r_base', label: 'Minimum Rate', formulaId: 'base_rate', type: 'currency', suffix: '/hr' },
    { id: 'r_recommended', label: 'Recommended Rate', formulaId: 'recommended_rate', type: 'currency', highlight: true, description: 'per hour' },
    { id: 'r_monthly', label: 'Est. Monthly Revenue', formulaId: 'monthly_revenue', type: 'currency' },
    { id: 'r_annual', label: 'Est. Annual Revenue', formulaId: 'annual_revenue', type: 'currency' },
  ],

  quickCalcs: [
    { label: 'Billable Hours/Year', formulaId: 'annual_billable_hours', type: 'number', suffix: ' hrs' },
    { label: 'Tax Amount', formulaId: 'tax_amount', type: 'currency' },
    { label: 'Revenue Needed', formulaId: 'total_needed', type: 'currency' },
  ],
};
