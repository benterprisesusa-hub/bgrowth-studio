/**
 * BGrowth Calculator Engine™ — Type System
 *
 * A CalculatorConfig fully describes any calculator.
 * The engine reads this config and renders the full UI,
 * runs formulas, and displays results — no code changes needed
 * for new calculators.
 */

// -----------------------------------------------------------------------
// Field types
// -----------------------------------------------------------------------
export type FieldType =
  | 'number'
  | 'currency'
  | 'percentage'
  | 'text'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'slider'
  | 'date';

export interface FieldOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue?: string | number;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  prefix?: string;   // e.g. "$"
  suffix?: string;   // e.g. "hrs"
  min?: number;
  max?: number;
  step?: number;
  options?: FieldOption[];  // for select/radio
}

// -----------------------------------------------------------------------
// Sections (groups of fields)
// -----------------------------------------------------------------------
export interface CalculatorSection {
  id: string;
  number: number;
  title: string;
  description?: string;
  icon: string;
  fields: CalculatorField[];
}

// -----------------------------------------------------------------------
// Formulas
// -----------------------------------------------------------------------
export type FormulaOperator = '+' | '-' | '*' | '/' | '%' | 'if';

/** A single formula that computes one result value from field values. */
export interface Formula {
  id: string;
  name: string;       // internal name, used by results
  /** Expression string using field IDs as variables.
   *  Examples:
   *    "labor_cost + supplies + equipment + travel + overhead"
   *    "total_cost * (1 + markup / 100)"
   *    "total_cost > 0 ? total_cost * markup / 100 : 0"
   *  We evaluate with the Function constructor inside a sandbox.
   */
  expression: string;
  /** Simple formulas: comma-separated list of variable names.
   *  The engine substitutes field values before evaluating. */
  variables: string[];
}

// -----------------------------------------------------------------------
// Results
// -----------------------------------------------------------------------
export type ResultType =
  | 'currency'
  | 'percentage'
  | 'number'
  | 'text'
  | 'status'
  | 'recommendation';

export interface ResultItem {
  id: string;
  label: string;
  formulaId: string;      // references Formula.id
  type: ResultType;
  highlight?: boolean;    // show as the "main" result (large display)
  prefix?: string;
  suffix?: string;
  description?: string;
}

export type ChartType = 'donut' | 'bar' | 'line' | 'progress';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  /** Array of { label, formulaId, color } */
  slices: { label: string; formulaId: string; color: string }[];
}

// -----------------------------------------------------------------------
// Scenarios (comparison table)
// -----------------------------------------------------------------------
export interface ScenarioConfig {
  id: string;
  title: string;
  description?: string;
  /** Each scenario row: label + overrides for specific field values */
  rows: {
    label: string;
    isRecommended?: boolean;
    fieldOverrides: Record<string, number | string>;
    resultIds: string[];  // which results to show in this table
  }[];
}

// -----------------------------------------------------------------------
// Quick calculations (sidebar panel)
// -----------------------------------------------------------------------
export interface QuickCalc {
  label: string;
  formulaId: string;
  type: ResultType;
  prefix?: string;
  suffix?: string;
}

// -----------------------------------------------------------------------
// Full calculator config
// -----------------------------------------------------------------------
export interface CalculatorConfig {
  productId: string;
  name: string;
  subtitle: string;
  category: string;
  icon: string;
  primaryColor: string;
  sections: CalculatorSection[];
  formulas: Formula[];
  results: ResultItem[];
  charts?: ChartConfig[];
  scenarios?: ScenarioConfig;
  quickCalcs?: QuickCalc[];
  notesEnabled?: boolean;
  footer?: string;
}

// -----------------------------------------------------------------------
// Runtime state
// -----------------------------------------------------------------------
/** Flat map of fieldId → value as the user fills in the calculator */
export type CalculatorValues = Record<string, string | number>;

/** Flat map of formulaId → computed number */
export type CalculatorResults = Record<string, number>;

export const CALCULATOR_CATEGORIES = [
  'Pricing Calculators',
  'Profit Calculators',
  'Cost Calculators',
  'Time Calculators',
  'Investment Calculators',
  'Tax Calculators',
  'Real Estate Calculators',
  'Business Calculators',
  'Other Calculators',
];

export function emptyCalculatorConfig(): CalculatorConfig {
  return {
    productId: `calc-${Date.now()}`,
    name: '',
    subtitle: '',
    category: 'Pricing Calculators',
    icon: 'calculator',
    primaryColor: '#1061EC',
    sections: [],
    formulas: [],
    results: [],
    charts: [],
    quickCalcs: [],
    notesEnabled: true,
  };
}
