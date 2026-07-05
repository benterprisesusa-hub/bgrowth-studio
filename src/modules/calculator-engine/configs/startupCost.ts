import type { CalculatorConfig } from '../types';

export const startupCostCalc: CalculatorConfig = {
  productId: 'startup-cost-calculator',
  name: 'Startup Cost Calculator',
  subtitle: 'Estimate the total cost to launch your business.',
  category: 'Business Calculators',
  icon: 'rocket',
  primaryColor: '#1061EC',
  notesEnabled: true,

  sections: [
    {
      id: 'one_time',
      number: 1,
      title: 'One-Time Startup Costs',
      description: 'Enter your initial business setup costs.',
      icon: 'dollar-sign',
      fields: [
        { id: 'legal_fees', label: 'Legal & Registration Fees', type: 'currency', defaultValue: 500, prefix: '$' },
        { id: 'equipment', label: 'Equipment & Tools', type: 'currency', defaultValue: 2000, prefix: '$' },
        { id: 'vehicle', label: 'Vehicle / Transportation', type: 'currency', defaultValue: 0, prefix: '$' },
        { id: 'website', label: 'Website & Branding', type: 'currency', defaultValue: 500, prefix: '$' },
        { id: 'inventory', label: 'Initial Inventory/Supplies', type: 'currency', defaultValue: 1000, prefix: '$' },
        { id: 'office_setup', label: 'Office/Space Setup', type: 'currency', defaultValue: 0, prefix: '$' },
        { id: 'training', label: 'Training & Certifications', type: 'currency', defaultValue: 500, prefix: '$' },
        { id: 'other_startup', label: 'Other Startup Costs', type: 'currency', defaultValue: 500, prefix: '$' },
      ],
    },
    {
      id: 'monthly',
      number: 2,
      title: 'Monthly Operating Costs',
      description: 'Enter your ongoing monthly expenses.',
      icon: 'calendar',
      fields: [
        { id: 'monthly_rent', label: 'Rent / Lease', type: 'currency', defaultValue: 0, prefix: '$' },
        { id: 'monthly_insurance', label: 'Insurance', type: 'currency', defaultValue: 150, prefix: '$' },
        { id: 'monthly_marketing', label: 'Marketing & Advertising', type: 'currency', defaultValue: 200, prefix: '$' },
        { id: 'monthly_software', label: 'Software & Subscriptions', type: 'currency', defaultValue: 100, prefix: '$' },
        { id: 'monthly_other', label: 'Other Monthly Expenses', type: 'currency', defaultValue: 200, prefix: '$' },
        { id: 'runway_months', label: 'Months of Runway Needed', type: 'number', defaultValue: 3, min: 1, max: 24, suffix: 'mo' },
      ],
    },
  ],

  formulas: [
    { id: 'total_one_time', name: 'Total One-Time Costs', expression: 'legal_fees + equipment + vehicle + website + inventory + office_setup + training + other_startup', variables: ['legal_fees', 'equipment', 'vehicle', 'website', 'inventory', 'office_setup', 'training', 'other_startup'] },
    { id: 'total_monthly', name: 'Total Monthly Costs', expression: 'monthly_rent + monthly_insurance + monthly_marketing + monthly_software + monthly_other', variables: ['monthly_rent', 'monthly_insurance', 'monthly_marketing', 'monthly_software', 'monthly_other'] },
    { id: 'runway_cost', name: 'Operating Runway', expression: 'total_monthly * runway_months', variables: ['total_monthly', 'runway_months'] },
    { id: 'total_startup', name: 'Total Startup Capital Needed', expression: 'total_one_time + runway_cost', variables: ['total_one_time', 'runway_cost'] },
    { id: 'recommended_reserve', name: 'Recommended Reserve (20%)', expression: 'total_startup * 0.20', variables: ['total_startup'] },
    { id: 'total_with_reserve', name: 'Total with Reserve', expression: 'total_startup + recommended_reserve', variables: ['total_startup', 'recommended_reserve'] },
  ],

  results: [
    { id: 'r_onetime', label: 'One-Time Costs', formulaId: 'total_one_time', type: 'currency' },
    { id: 'r_monthly', label: 'Monthly Operating', formulaId: 'total_monthly', type: 'currency' },
    { id: 'r_runway', label: 'Runway Cost', formulaId: 'runway_cost', type: 'currency' },
    { id: 'r_total', label: 'Total Capital Needed', formulaId: 'total_with_reserve', type: 'currency', highlight: true, description: 'Including 20% reserve' },
  ],

  quickCalcs: [
    { label: 'Without Reserve', formulaId: 'total_startup', type: 'currency' },
    { label: 'Reserve Fund', formulaId: 'recommended_reserve', type: 'currency' },
    { label: 'Monthly Burn Rate', formulaId: 'total_monthly', type: 'currency' },
  ],
};
