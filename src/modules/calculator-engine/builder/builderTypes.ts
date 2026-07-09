/**
 * BGrowth Calculator Builder — Type System
 * Covers all 9 builder screens from the mockup.
 */

export type FieldType =
  | 'number' | 'currency' | 'percentage' | 'text'
  | 'dropdown' | 'radio' | 'checkbox' | 'toggle' | 'slider';

export type FormulaReturnType = 'currency' | 'percentage' | 'number' | 'text';
export type ChartType = 'pie' | 'bar' | 'line' | 'donut';
export type RuleOperator = 'less_than' | 'greater_than' | 'equal_to' | 'not_equal_to' | 'between';
export type RulePriority = 'high' | 'medium' | 'low';
export type RuleIcon = 'warning' | 'info' | 'success' | 'error';

// -----------------------------------------------------------------------
// Input Field
// -----------------------------------------------------------------------
export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface BuilderField {
  id: string;
  label: string;
  type: FieldType;
  variableName: string;       // used in formulas, e.g. "squareFootage"
  required: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: DropdownOption[]; // for dropdown/radio
}

// -----------------------------------------------------------------------
// Input Category (group of fields)
// -----------------------------------------------------------------------
export interface BuilderCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  fields: BuilderField[];
}

// -----------------------------------------------------------------------
// Formula
// -----------------------------------------------------------------------
export interface BuilderFormula {
  id: string;
  name: string;
  description: string;
  expression: string;         // JS-like expression using variableNames
  returnType: FormulaReturnType;
  rounding: '0' | '2' | '4';
  format: string;             // e.g. "$ 1,234.56"
  isValid: boolean;
}

// -----------------------------------------------------------------------
// Result Card
// -----------------------------------------------------------------------
export interface ResultCard {
  id: string;
  title: string;
  description: string;
  formulaId: string;
  icon: string;
  color: string;
  format: FormulaReturnType;
  decimals: number;
  highlight?: boolean;
}

// -----------------------------------------------------------------------
// Chart
// -----------------------------------------------------------------------
export interface ChartSlice {
  label: string;
  formulaId: string;
  color: string;
}

export interface BuilderChart {
  id: string;
  name: string;
  type: ChartType;
  slices: ChartSlice[];
  showLegend: boolean;
}

// -----------------------------------------------------------------------
// Recommendation Rule
// -----------------------------------------------------------------------
export interface RecommendationRule {
  id: string;
  name: string;
  description: string;
  icon: RuleIcon;
  priority: RulePriority;
  // IF
  fieldOrFormulaId: string;
  operator: RuleOperator;
  value: number;
  value2?: number;  // for 'between'
  // THEN
  message: string;
}

// -----------------------------------------------------------------------
// Publish Settings
// -----------------------------------------------------------------------
export interface PublishSettings {
  status: 'draft' | 'public' | 'private';
  allowSaveResults: boolean;
  allowPdfExport: boolean;
  allowPrint: boolean;
  allowShare: boolean;
}

// -----------------------------------------------------------------------
// Full Calculator Draft (what gets saved/edited)
// -----------------------------------------------------------------------
export interface CalculatorDraft {
  id: string;
  // Step 2 — Details
  name: string;
  subtitle: string;
  shortDescription: string;
  industry: string;
  category: string;
  themeColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  icon: string;
  tags: string[];
  coverImage: string | null;
  // Step 3-4 — Inputs
  categories: BuilderCategory[];
  // Step 5 — Formulas
  formulas: BuilderFormula[];
  // Step 6 — Results
  resultCards: ResultCard[];
  // Step 7 — Charts
  charts: BuilderChart[];
  // Step 8 — Rules
  rules: RecommendationRule[];
  // Step 9 — Publish
  publishSettings: PublishSettings;
  // Meta
  createdAt: string;
  updatedAt: string;
  uses: number;
}

// -----------------------------------------------------------------------
// Builder step type
// -----------------------------------------------------------------------
export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const BUILDER_STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Inputs' },
  { id: 3, label: 'Formulas' },
  { id: 4, label: 'Results' },
  { id: 5, label: 'Settings' },
  { id: 6, label: 'Preview' },
] as const;

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------
export const INDUSTRIES = [
  'Cleaning Services', 'Real Estate', 'Finance', 'Healthcare',
  'Construction', 'Legal', 'Marketing', 'Technology', 'Education',
  'Food & Beverage', 'Transportation', 'Retail', 'Other',
];

export const CATEGORIES = [
  'Pricing', 'Cost', 'Profit', 'ROI', 'Tax', 'Mortgage',
  'Budget', 'Time', 'Investment', 'Commission', 'Other',
];

export const THEME_COLORS = [
  '#1061EC', '#7C3AED', '#059669', '#D97706',
  '#E11D48', '#0EA5A0', '#475569', '#1E3A5F',
  '#DC2626', '#EA580C', '#CA8A04', '#16A34A',
];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  number: 'Number',
  currency: 'Currency',
  percentage: 'Percentage',
  text: 'Text',
  dropdown: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkbox',
  toggle: 'Toggle',
  slider: 'Slider',
};

export const CATEGORY_COLORS = [
  '#1061EC', '#7C3AED', '#059669', '#D97706',
  '#E11D48', '#0EA5A0', '#475569', '#DC2626',
];

export const CATEGORY_ICONS = [
  'home', 'building-2', 'dollar-sign', 'clock',
  'package', 'percent', 'tag', 'file-text',
  'users', 'map-pin', 'shield-check', 'calculator',
];

export function newId(): string {
  return `id-${Math.random().toString(36).slice(2, 9)}`;
}

export function newVariableName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^\s+|\s+$/g, '') || 'variable';
}

export function emptyDraft(): CalculatorDraft {
  return {
    id: newId(),
    name: '',
    subtitle: '',
    shortDescription: '',
    industry: 'Cleaning Services',
    category: 'Pricing',
    themeColor: '#1061EC',
    difficulty: 'Beginner',
    estimatedTime: '2-3 minutes',
    icon: 'calculator',
    tags: [],
    coverImage: null,
    categories: [],
    formulas: [],
    resultCards: [],
    charts: [],
    rules: [],
    publishSettings: {
      status: 'draft',
      allowSaveResults: true,
      allowPdfExport: true,
      allowPrint: true,
      allowShare: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uses: 0,
  };
}

// Storage helpers
const DRAFTS_KEY = 'bgrowth.calculator.drafts';

export function loadDrafts(): CalculatorDraft[] {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) ?? '[]'); } catch { return []; }
}

export function saveDrafts(drafts: CalculatorDraft[]): void {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts)); } catch { /* */ }
}
