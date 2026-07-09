import type { CalculatorConfig } from './types';

export const cleaningPricingCalc: CalculatorConfig = {
  productId: 'cleaning-pricing-calculator',
  name: 'Cleaning Service Pricing Calculator',
  subtitle: 'Calculate your costs, time, and ideal pricing for maximum profit.',
  category: 'Pricing Calculators',
  icon: 'sparkles',
  primaryColor: '#1061EC',
  notesEnabled: true,
  footer: 'Calculator Engine™ | Calculate. Analyze. Price. Profit.',

  sections: [
    {
      id: 'job_details',
      number: 1,
      title: 'Job Details',
      description: 'Enter the details of the cleaning job.',
      icon: 'home',
      fields: [
        {
          id: 'property_type',
          label: 'Property Type',
          type: 'select',
          defaultValue: 'residential',
          required: true,
          options: [
            { label: 'Residential Home', value: 'residential' },
            { label: 'Apartment', value: 'apartment' },
            { label: 'Commercial', value: 'commercial' },
            { label: 'Airbnb/Short-term', value: 'airbnb' },
          ],
        },
        {
          id: 'home_size',
          label: 'Home Size (sq ft)',
          type: 'number',
          defaultValue: 2000,
          required: true,
          placeholder: '2,000',
        },
        {
          id: 'bedrooms',
          label: 'Bedrooms',
          type: 'number',
          defaultValue: 3,
          min: 0,
          max: 10,
        },
        {
          id: 'bathrooms',
          label: 'Bathrooms',
          type: 'number',
          defaultValue: 2,
          min: 0,
          max: 10,
        },
        {
          id: 'cleaning_type',
          label: 'Cleaning Type',
          type: 'select',
          defaultValue: 'deep',
          required: true,
          options: [
            { label: 'Standard Cleaning', value: 'standard' },
            { label: 'Deep Cleaning', value: 'deep' },
            { label: 'Move-in/Move-out', value: 'moveout' },
            { label: 'Post-construction', value: 'postconstruction' },
          ],
        },
        {
          id: 'frequency',
          label: 'Frequency',
          type: 'select',
          defaultValue: 'once',
          options: [
            { label: 'One Time', value: 'once' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Bi-Weekly', value: 'biweekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
        },
        {
          id: 'num_cleaners',
          label: 'Number of Cleaners',
          type: 'number',
          defaultValue: 2,
          min: 1,
          max: 10,
          required: true,
        },
        {
          id: 'estimated_hours',
          label: 'Estimated Time (hours)',
          type: 'number',
          defaultValue: 4.5,
          placeholder: '4.5',
          suffix: 'hrs',
        },
      ],
    },
    {
      id: 'costs',
      number: 2,
      title: 'Your Costs',
      description: 'Enter your estimated costs for this job.',
      icon: 'dollar-sign',
      fields: [
        { id: 'labor_rate', label: 'Labor Cost ($/hour per cleaner)', type: 'currency', defaultValue: 20, prefix: '$', required: true, tooltip: 'Hourly rate you pay each cleaner' },
        { id: 'supplies', label: 'Supplies & Materials', type: 'currency', defaultValue: 25, prefix: '$', tooltip: 'Cleaning products, mops, etc.' },
        { id: 'equipment', label: 'Equipment Use', type: 'currency', defaultValue: 15, prefix: '$', tooltip: 'Depreciation of vacuums, steamers, etc.' },
        { id: 'travel', label: 'Travel Cost', type: 'currency', defaultValue: 10, prefix: '$', tooltip: 'Gas and mileage to the job' },
        { id: 'overhead', label: 'Overhead Cost', type: 'currency', defaultValue: 20, prefix: '$', tooltip: 'Insurance, phone, admin, etc.' },
        { id: 'insurance', label: 'Insurance Cost', type: 'currency', defaultValue: 5, prefix: '$' },
        { id: 'marketing', label: 'Marketing Cost', type: 'currency', defaultValue: 10, prefix: '$' },
        { id: 'other_costs', label: 'Other Costs', type: 'currency', defaultValue: 7.5, prefix: '$' },
      ],
    },
  ],

  formulas: [
    { id: 'labor_cost', name: 'Labor Cost', expression: 'labor_rate * num_cleaners * estimated_hours', variables: ['labor_rate', 'num_cleaners', 'estimated_hours'] },
    { id: 'total_cost', name: 'Total Job Cost', expression: 'labor_cost + supplies + equipment + travel + overhead + insurance + marketing + other_costs', variables: ['labor_cost', 'supplies', 'equipment', 'travel', 'overhead', 'insurance', 'marketing', 'other_costs'] },
    { id: 'markup_amount', name: 'Profit', expression: 'total_cost * 0.50', variables: ['total_cost'] },
    { id: 'recommended_price', name: 'Recommended Price', expression: 'total_cost + markup_amount', variables: ['total_cost', 'markup_amount'] },
    { id: 'profit_margin', name: 'Profit Margin %', expression: 'recommended_price > 0 ? (markup_amount / recommended_price) * 100 : 0', variables: ['recommended_price', 'markup_amount'] },
    { id: 'markup_pct', name: 'Markup %', expression: 'total_cost > 0 ? (markup_amount / total_cost) * 100 : 0', variables: ['markup_amount', 'total_cost'] },
    // Scenario calculations
    { id: 'conservative_price', name: 'Conservative Price', expression: 'total_cost * 1.30', variables: ['total_cost'] },
    { id: 'premium_price', name: 'Premium Price', expression: 'total_cost * 1.70', variables: ['total_cost'] },
    { id: 'conservative_profit', name: 'Conservative Profit', expression: 'conservative_price - total_cost', variables: ['conservative_price', 'total_cost'] },
    { id: 'premium_profit', name: 'Premium Profit', expression: 'premium_price - total_cost', variables: ['premium_price', 'total_cost'] },
    { id: 'conservative_margin', name: 'Conservative Margin', expression: 'conservative_price > 0 ? (conservative_profit / conservative_price) * 100 : 0', variables: ['conservative_profit', 'conservative_price'] },
    { id: 'premium_margin', name: 'Premium Margin', expression: 'premium_price > 0 ? (premium_profit / premium_price) * 100 : 0', variables: ['premium_profit', 'premium_price'] },
    // Quick calcs
    { id: 'hourly_rate_total', name: 'Hourly Rate (Total)', expression: 'estimated_hours > 0 ? recommended_price / estimated_hours : 0', variables: ['recommended_price', 'estimated_hours'] },
    { id: 'hourly_rate_per_cleaner', name: 'Hourly Rate (Per Cleaner)', expression: 'num_cleaners > 0 && estimated_hours > 0 ? recommended_price / (num_cleaners * estimated_hours) : 0', variables: ['recommended_price', 'num_cleaners', 'estimated_hours'] },
    { id: 'cost_per_sqft', name: 'Cost per Sq Ft', expression: 'home_size > 0 ? total_cost / home_size : 0', variables: ['total_cost', 'home_size'] },
    { id: 'breakeven_price', name: 'Break-even Price', expression: 'total_cost', variables: ['total_cost'] },
    // Chart slices
    { id: 'labor_pct', name: 'Labor %', expression: 'total_cost > 0 ? (labor_cost / total_cost) * 100 : 0', variables: ['labor_cost', 'total_cost'] },
    { id: 'profit_pct_of_total', name: 'Profit %', expression: 'total_cost > 0 ? (markup_amount / (total_cost + markup_amount)) * 100 : 0', variables: ['markup_amount', 'total_cost'] },
    { id: 'other_costs_pct', name: 'Other Costs %', expression: 'total_cost > 0 ? ((supplies + equipment + travel + overhead + insurance + marketing + other_costs) / total_cost) * 100 : 0', variables: ['supplies', 'equipment', 'travel', 'overhead', 'insurance', 'marketing', 'other_costs', 'total_cost'] },
  ],

  results: [
    { id: 'r_total_cost', label: 'Your Cost', formulaId: 'total_cost', type: 'currency', prefix: '$' },
    { id: 'r_price', label: 'Your Price', formulaId: 'recommended_price', type: 'currency', prefix: '$' },
    { id: 'r_profit', label: 'Profit', formulaId: 'markup_amount', type: 'currency', prefix: '$' },
    { id: 'r_margin', label: 'Profit Margin', formulaId: 'profit_margin', type: 'percentage' },
    { id: 'r_recommended', label: 'Recommended Price', formulaId: 'recommended_price', type: 'currency', highlight: true, description: 'for this job' },
  ],

  charts: [
    {
      id: 'price_breakdown',
      title: 'Price Breakdown',
      type: 'donut',
      slices: [
        { label: 'Labor', formulaId: 'labor_pct', color: '#1061EC' },
        { label: 'Profit', formulaId: 'profit_pct_of_total', color: '#16A34A' },
        { label: 'Other Costs', formulaId: 'other_costs_pct', color: '#F59E0B' },
      ],
    },
  ],

  scenarios: {
    id: 'price_scenarios',
    title: 'Price Scenarios',
    description: 'See how different prices affect your profit.',
    rows: [
      { label: 'Conservative Price', fieldOverrides: {}, resultIds: ['conservative_price', 'conservative_profit', 'conservative_margin'] },
      { label: 'Recommended Price', isRecommended: true, fieldOverrides: {}, resultIds: ['recommended_price', 'markup_amount', 'profit_margin'] },
      { label: 'Premium Price', fieldOverrides: {}, resultIds: ['premium_price', 'premium_profit', 'premium_margin'] },
    ],
  },

  quickCalcs: [
    { label: 'Break-even Price', formulaId: 'breakeven_price', type: 'currency' },
    { label: 'Hourly Rate (Total)', formulaId: 'hourly_rate_total', type: 'currency' },
    { label: 'Hourly Rate (Per Cleaner)', formulaId: 'hourly_rate_per_cleaner', type: 'currency' },
    { label: 'Cost per Sq Ft', formulaId: 'cost_per_sqft', type: 'currency' },
  ],
};
