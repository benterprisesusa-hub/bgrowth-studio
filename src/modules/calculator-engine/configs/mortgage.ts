import type { CalculatorConfig } from '../types';

export const mortgageCalc: CalculatorConfig = {
  productId: 'mortgage-calculator',
  name: 'Mortgage Calculator',
  subtitle: 'Calculate your monthly mortgage payment and total cost.',
  category: 'Investment Calculators',
  icon: 'home',
  primaryColor: '#475569',
  notesEnabled: true,

  sections: [
    {
      id: 'loan',
      number: 1,
      title: 'Loan Details',
      description: 'Enter your mortgage information.',
      icon: 'home',
      fields: [
        { id: 'home_price', label: 'Home Price', type: 'currency', defaultValue: 300000, prefix: '$', required: true },
        { id: 'down_payment', label: 'Down Payment', type: 'currency', defaultValue: 60000, prefix: '$', required: true },
        { id: 'interest_rate', label: 'Annual Interest Rate', type: 'percentage', defaultValue: 7.0, suffix: '%', required: true },
        { id: 'loan_term', label: 'Loan Term', type: 'select', defaultValue: '30', required: true, options: [
          { label: '10 Years', value: '10' },
          { label: '15 Years', value: '15' },
          { label: '20 Years', value: '20' },
          { label: '30 Years', value: '30' },
        ]},
        { id: 'property_tax_annual', label: 'Annual Property Tax', type: 'currency', defaultValue: 3000, prefix: '$' },
        { id: 'insurance_annual', label: 'Annual Home Insurance', type: 'currency', defaultValue: 1200, prefix: '$' },
        { id: 'pmi_rate', label: 'PMI Rate %', type: 'percentage', defaultValue: 0.5, suffix: '%', tooltip: 'Required if down payment < 20%' },
      ],
    },
  ],

  formulas: [
    { id: 'loan_amount', name: 'Loan Amount', expression: 'home_price - down_payment', variables: ['home_price', 'down_payment'] },
    { id: 'down_payment_pct', name: 'Down Payment %', expression: 'home_price > 0 ? (down_payment / home_price) * 100 : 0', variables: ['down_payment', 'home_price'] },
    { id: 'monthly_rate', name: 'Monthly Rate', expression: 'interest_rate / 100 / 12', variables: ['interest_rate'] },
    { id: 'num_payments', name: 'Number of Payments', expression: 'loan_term * 12', variables: ['loan_term'] },
    { id: 'monthly_principal', name: 'Monthly P&I Payment', expression: 'monthly_rate > 0 ? loan_amount * (monthly_rate * Math.pow(1 + monthly_rate, num_payments)) / (Math.pow(1 + monthly_rate, num_payments) - 1) : loan_amount / num_payments', variables: ['loan_amount', 'monthly_rate', 'num_payments'] },
    { id: 'monthly_tax', name: 'Monthly Property Tax', expression: 'property_tax_annual / 12', variables: ['property_tax_annual'] },
    { id: 'monthly_insurance', name: 'Monthly Insurance', expression: 'insurance_annual / 12', variables: ['insurance_annual'] },
    { id: 'monthly_pmi', name: 'Monthly PMI', expression: 'down_payment_pct < 20 ? loan_amount * (pmi_rate / 100) / 12 : 0', variables: ['down_payment_pct', 'loan_amount', 'pmi_rate'] },
    { id: 'total_monthly', name: 'Total Monthly Payment', expression: 'monthly_principal + monthly_tax + monthly_insurance + monthly_pmi', variables: ['monthly_principal', 'monthly_tax', 'monthly_insurance', 'monthly_pmi'] },
    { id: 'total_interest', name: 'Total Interest Paid', expression: '(monthly_principal * num_payments) - loan_amount', variables: ['monthly_principal', 'num_payments', 'loan_amount'] },
    { id: 'total_cost', name: 'Total Cost of Home', expression: 'down_payment + (monthly_principal * num_payments) + (property_tax_annual * loan_term) + (insurance_annual * loan_term)', variables: ['down_payment', 'monthly_principal', 'num_payments', 'property_tax_annual', 'loan_term', 'insurance_annual'] },
  ],

  results: [
    { id: 'r_monthly', label: 'Monthly Payment (P&I)', formulaId: 'monthly_principal', type: 'currency' },
    { id: 'r_total', label: 'Total Monthly Payment', formulaId: 'total_monthly', type: 'currency', highlight: true, description: 'Including tax, insurance & PMI' },
    { id: 'r_interest', label: 'Total Interest Paid', formulaId: 'total_interest', type: 'currency' },
    { id: 'r_cost', label: 'Total Cost of Home', formulaId: 'total_cost', type: 'currency' },
  ],

  quickCalcs: [
    { label: 'Loan Amount', formulaId: 'loan_amount', type: 'currency' },
    { label: 'Down Payment %', formulaId: 'down_payment_pct', type: 'percentage' },
    { label: 'Monthly PMI', formulaId: 'monthly_pmi', type: 'currency' },
    { label: 'Monthly Tax', formulaId: 'monthly_tax', type: 'currency' },
  ],
};
