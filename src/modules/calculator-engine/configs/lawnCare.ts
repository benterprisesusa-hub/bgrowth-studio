import type { CalculatorConfig } from '../types';

export const lawnCareCalc: CalculatorConfig = {
  productId: 'lawn-care-calculator',
  name: 'Lawn Care Estimate Calculator',
  subtitle: 'Calculate your lawn care and landscaping service price.',
  category: 'Pricing Calculators',
  icon: 'leaf',
  primaryColor: '#16A34A',
  notesEnabled: true,

  sections: [
    {
      id: 'property',
      number: 1,
      title: 'Property Details',
      description: 'Enter the property and service information.',
      icon: 'home',
      fields: [
        { id: 'lawn_size', label: 'Lawn Size (sq ft)', type: 'number', defaultValue: 2000, suffix: 'sq ft', required: true },
        { id: 'service_type', label: 'Service Type', type: 'select', defaultValue: 'mowing', required: true, options: [
          { label: 'Mowing Only', value: 'mowing' },
          { label: 'Mowing + Edging', value: 'mowing_edging' },
          { label: 'Full Service (Mow, Edge, Trim, Blow)', value: 'full' },
          { label: 'Fertilization', value: 'fertilization' },
          { label: 'Aeration', value: 'aeration' },
        ]},
        { id: 'frequency', label: 'Service Frequency', type: 'select', defaultValue: 'weekly', options: [
          { label: 'One Time', value: 'once' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Bi-Weekly', value: 'biweekly' },
          { label: 'Monthly', value: 'monthly' },
        ]},
        { id: 'obstacles', label: 'Number of Obstacles (trees, beds)', type: 'number', defaultValue: 0, min: 0 },
        { id: 'travel_miles', label: 'Travel Distance (miles)', type: 'number', defaultValue: 5, suffix: 'mi' },
      ],
    },
    {
      id: 'rates',
      number: 2,
      title: 'Your Rates',
      description: 'Enter your pricing structure.',
      icon: 'dollar-sign',
      fields: [
        { id: 'base_rate_per_sqft', label: 'Base Rate per 1000 sq ft', type: 'currency', defaultValue: 35, prefix: '$', required: true },
        { id: 'obstacle_fee', label: 'Fee per Obstacle', type: 'currency', defaultValue: 5, prefix: '$' },
        { id: 'equipment_cost', label: 'Equipment/Fuel Cost', type: 'currency', defaultValue: 15, prefix: '$' },
        { id: 'labor_hours', label: 'Estimated Labor Hours', type: 'number', defaultValue: 1, suffix: 'hrs' },
        { id: 'hourly_rate', label: 'Labor Rate per Hour', type: 'currency', defaultValue: 20, prefix: '$' },
        { id: 'travel_rate', label: 'Travel Rate per Mile', type: 'currency', defaultValue: 0.725, prefix: '$' },
        { id: 'markup_pct', label: 'Profit Markup %', type: 'percentage', defaultValue: 35, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'base_cost', name: 'Base Cost', expression: '(lawn_size / 1000) * base_rate_per_sqft', variables: ['lawn_size', 'base_rate_per_sqft'] },
    { id: 'obstacle_cost', name: 'Obstacle Cost', expression: 'obstacles * obstacle_fee', variables: ['obstacles', 'obstacle_fee'] },
    { id: 'labor_cost', name: 'Labor Cost', expression: 'labor_hours * hourly_rate', variables: ['labor_hours', 'hourly_rate'] },
    { id: 'travel_cost', name: 'Travel Cost', expression: 'travel_miles * travel_rate', variables: ['travel_miles', 'travel_rate'] },
    { id: 'total_cost', name: 'Total Cost', expression: 'base_cost + obstacle_cost + labor_cost + equipment_cost + travel_cost', variables: ['base_cost', 'obstacle_cost', 'labor_cost', 'equipment_cost', 'travel_cost'] },
    { id: 'profit', name: 'Profit', expression: 'total_cost * (markup_pct / 100)', variables: ['total_cost', 'markup_pct'] },
    { id: 'quote_price', name: 'Quote Price', expression: 'total_cost + profit', variables: ['total_cost', 'profit'] },
    { id: 'profit_margin', name: 'Profit Margin', expression: 'quote_price > 0 ? (profit / quote_price) * 100 : 0', variables: ['profit', 'quote_price'] },
    { id: 'monthly_revenue', name: 'Monthly Revenue', expression: 'frequency === "weekly" ? quote_price * 4 : frequency === "biweekly" ? quote_price * 2 : quote_price', variables: ['quote_price', 'frequency'] },
  ],

  results: [
    { id: 'r_cost', label: 'Your Cost', formulaId: 'total_cost', type: 'currency' },
    { id: 'r_quote', label: 'Service Price', formulaId: 'quote_price', type: 'currency', highlight: true, description: 'Recommended price per visit' },
    { id: 'r_profit', label: 'Profit per Visit', formulaId: 'profit', type: 'currency' },
    { id: 'r_margin', label: 'Profit Margin', formulaId: 'profit_margin', type: 'percentage' },
  ],

  quickCalcs: [
    { label: 'Monthly Revenue', formulaId: 'monthly_revenue', type: 'currency' },
    { label: 'Labor Cost', formulaId: 'labor_cost', type: 'currency' },
    { label: 'Travel Cost', formulaId: 'travel_cost', type: 'currency' },
  ],
};
