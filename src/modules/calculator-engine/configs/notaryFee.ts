import type { CalculatorConfig } from '../types';

export const notaryFeeCalc: CalculatorConfig = {
  productId: 'notary-fee-calculator',
  name: 'Notary Fee Calculator',
  subtitle: 'Calculate your notary service fees and travel charges.',
  category: 'Pricing Calculators',
  icon: 'file-text',
  primaryColor: '#F59E0B',
  notesEnabled: true,

  sections: [
    {
      id: 'service',
      number: 1,
      title: 'Service Details',
      description: 'Enter the notary service information.',
      icon: 'file-text',
      fields: [
        { id: 'service_type', label: 'Service Type', type: 'select', defaultValue: 'loan_signing', required: true, options: [
          { label: 'Loan Signing', value: 'loan_signing' },
          { label: 'General Notary', value: 'general' },
          { label: 'Mobile Notary', value: 'mobile' },
          { label: 'Apostille', value: 'apostille' },
        ]},
        { id: 'num_signatures', label: 'Number of Signatures', type: 'number', defaultValue: 1, min: 1, required: true },
        { id: 'num_documents', label: 'Number of Documents', type: 'number', defaultValue: 1, min: 1 },
        { id: 'travel_miles', label: 'Travel Distance (miles)', type: 'number', defaultValue: 0, suffix: 'mi' },
      ],
    },
    {
      id: 'rates',
      number: 2,
      title: 'Your Rates',
      description: 'Enter your fee structure.',
      icon: 'dollar-sign',
      fields: [
        { id: 'base_fee', label: 'Base Fee', type: 'currency', defaultValue: 75, prefix: '$', required: true },
        { id: 'per_signature_fee', label: 'Fee per Signature', type: 'currency', defaultValue: 10, prefix: '$' },
        { id: 'per_document_fee', label: 'Fee per Document', type: 'currency', defaultValue: 5, prefix: '$' },
        { id: 'travel_rate', label: 'Travel Rate per Mile', type: 'currency', defaultValue: 0.725, prefix: '$', suffix: '/mi' },
        { id: 'wait_time_fee', label: 'Wait Time Fee (per hour)', type: 'currency', defaultValue: 25, prefix: '$' },
        { id: 'wait_hours', label: 'Wait Time (hours)', type: 'number', defaultValue: 0, suffix: 'hrs' },
      ],
    },
  ],

  formulas: [
    { id: 'signature_fees', name: 'Signature Fees', expression: 'num_signatures * per_signature_fee', variables: ['num_signatures', 'per_signature_fee'] },
    { id: 'document_fees', name: 'Document Fees', expression: 'num_documents * per_document_fee', variables: ['num_documents', 'per_document_fee'] },
    { id: 'travel_fees', name: 'Travel Fees', expression: 'travel_miles * travel_rate', variables: ['travel_miles', 'travel_rate'] },
    { id: 'wait_fees', name: 'Wait Time Fees', expression: 'wait_hours * wait_time_fee', variables: ['wait_hours', 'wait_time_fee'] },
    { id: 'total_fee', name: 'Total Fee', expression: 'base_fee + signature_fees + document_fees + travel_fees + wait_fees', variables: ['base_fee', 'signature_fees', 'document_fees', 'travel_fees', 'wait_fees'] },
    { id: 'tax_amount', name: 'Tax (8%)', expression: 'total_fee * 0.08', variables: ['total_fee'] },
    { id: 'grand_total', name: 'Grand Total', expression: 'total_fee + tax_amount', variables: ['total_fee', 'tax_amount'] },
  ],

  results: [
    { id: 'r_total', label: 'Service Fee', formulaId: 'total_fee', type: 'currency' },
    { id: 'r_tax', label: 'Tax (8%)', formulaId: 'tax_amount', type: 'currency' },
    { id: 'r_grand', label: 'Total Charge', formulaId: 'grand_total', type: 'currency', highlight: true, description: 'Total including tax' },
  ],

  quickCalcs: [
    { label: 'Signature Fees', formulaId: 'signature_fees', type: 'currency' },
    { label: 'Travel Fees', formulaId: 'travel_fees', type: 'currency' },
    { label: 'Wait Time Fees', formulaId: 'wait_fees', type: 'currency' },
  ],
};
