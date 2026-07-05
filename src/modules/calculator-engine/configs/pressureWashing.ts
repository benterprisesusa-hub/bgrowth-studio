import type { CalculatorConfig } from '../types';

export const pressureWashingCalc: CalculatorConfig = {
  productId: 'pressure-washing-calculator',
  name: 'Pressure Washing Estimate Calculator',
  subtitle: 'Calculate your pressure washing service price instantly.',
  category: 'Pricing Calculators',
  icon: 'droplets',
  primaryColor: '#0EA5A0',
  notesEnabled: true,

  sections: [
    {
      id: 'job',
      number: 1,
      title: 'Job Details',
      description: 'Enter the property and service details.',
      icon: 'home',
      fields: [
        { id: 'surface_type', label: 'Surface Type', type: 'select', defaultValue: 'driveway', required: true, options: [
          { label: 'Driveway', value: 'driveway' },
          { label: 'House Exterior', value: 'house' },
          { label: 'Deck/Patio', value: 'deck' },
          { label: 'Sidewalk', value: 'sidewalk' },
          { label: 'Roof', value: 'roof' },
        ]},
        { id: 'square_footage', label: 'Square Footage', type: 'number', defaultValue: 500, suffix: 'sq ft', required: true },
        { id: 'stories', label: 'Number of Stories', type: 'number', defaultValue: 1, min: 1, max: 4 },
        { id: 'condition', label: 'Surface Condition', type: 'select', defaultValue: 'moderate', options: [
          { label: 'Light (easy clean)', value: 'light' },
          { label: 'Moderate', value: 'moderate' },
          { label: 'Heavy (stains/mold)', value: 'heavy' },
        ]},
        { id: 'travel_miles', label: 'Travel Distance (miles)', type: 'number', defaultValue: 10, suffix: 'mi' },
      ],
    },
    {
      id: 'costs',
      number: 2,
      title: 'Your Costs & Rates',
      description: 'Enter your pricing structure.',
      icon: 'dollar-sign',
      fields: [
        { id: 'base_rate', label: 'Base Rate per sq ft', type: 'currency', defaultValue: 0.15, prefix: '$', suffix: '/sqft', required: true },
        { id: 'story_surcharge', label: 'Per Story Surcharge', type: 'currency', defaultValue: 50, prefix: '$' },
        { id: 'condition_surcharge', label: 'Heavy Condition Surcharge', type: 'currency', defaultValue: 75, prefix: '$' },
        { id: 'chemical_cost', label: 'Chemical & Supply Cost', type: 'currency', defaultValue: 30, prefix: '$' },
        { id: 'travel_rate', label: 'Travel Rate per Mile', type: 'currency', defaultValue: 0.725, prefix: '$' },
        { id: 'markup_pct', label: 'Profit Markup %', type: 'percentage', defaultValue: 40, suffix: '%' },
      ],
    },
  ],

  formulas: [
    { id: 'surface_cost', name: 'Surface Cost', expression: 'square_footage * base_rate', variables: ['square_footage', 'base_rate'] },
    { id: 'story_cost', name: 'Story Surcharge', expression: 'stories > 1 ? (stories - 1) * story_surcharge : 0', variables: ['stories', 'story_surcharge'] },
    { id: 'condition_cost', name: 'Condition Cost', expression: 'condition === "heavy" ? condition_surcharge : condition === "moderate" ? condition_surcharge * 0.5 : 0', variables: ['condition', 'condition_surcharge'] },
    { id: 'travel_cost', name: 'Travel Cost', expression: 'travel_miles * travel_rate', variables: ['travel_miles', 'travel_rate'] },
    { id: 'total_cost', name: 'Total Cost', expression: 'surface_cost + story_cost + condition_cost + chemical_cost + travel_cost', variables: ['surface_cost', 'story_cost', 'condition_cost', 'chemical_cost', 'travel_cost'] },
    { id: 'profit', name: 'Profit', expression: 'total_cost * (markup_pct / 100)', variables: ['total_cost', 'markup_pct'] },
    { id: 'quote_price', name: 'Quote Price', expression: 'total_cost + profit', variables: ['total_cost', 'profit'] },
    { id: 'profit_margin', name: 'Profit Margin', expression: 'quote_price > 0 ? (profit / quote_price) * 100 : 0', variables: ['profit', 'quote_price'] },
    { id: 'price_per_sqft', name: 'Price per Sq Ft', expression: 'square_footage > 0 ? quote_price / square_footage : 0', variables: ['quote_price', 'square_footage'] },
  ],

  results: [
    { id: 'r_cost', label: 'Your Cost', formulaId: 'total_cost', type: 'currency' },
    { id: 'r_quote', label: 'Quote Price', formulaId: 'quote_price', type: 'currency', highlight: true, description: 'Recommended price for this job' },
    { id: 'r_profit', label: 'Profit', formulaId: 'profit', type: 'currency' },
    { id: 'r_margin', label: 'Profit Margin', formulaId: 'profit_margin', type: 'percentage' },
  ],

  quickCalcs: [
    { label: 'Price per Sq Ft', formulaId: 'price_per_sqft', type: 'currency' },
    { label: 'Travel Cost', formulaId: 'travel_cost', type: 'currency' },
    { label: 'Your Cost', formulaId: 'total_cost', type: 'currency' },
  ],
};
