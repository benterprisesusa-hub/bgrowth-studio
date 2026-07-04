export interface CalculatorDetails {
  name: string;
  subtitle: string;
  description: string;
  industry: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  themeColor: string;
  coverImage: string;
  icon: string;
  tags: string[];
  estimatedTime: string;
  version: string;
  seoTitle: string;
  seoDescription: string;
}

export interface InputCategory {
  id: string;
  name: string;
  fieldsCount: number;
}

export interface InputField {
  id: string;
  label: string;
  variable: string;
  type: "text" | "number" | "currency" | "percentage" | "dropdown" | "checkbox" | "toggle" | "slider" | "date";
  required: boolean;
  category: string; // Category id or name
  defaultValue: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface Formula {
  id: string;
  name: string;
  variable: string;
  description: string;
  expression: string;
  returnType: "Currency" | "Percentage" | "Number" | "Boolean";
  rounding: "0 Decimals" | "1 Decimal" | "2 Decimals";
  format: string;
}

export interface ResultCard {
  id: string;
  title: string;
  formulaVariable: string;
  description: string;
  type: "currency" | "percentage" | "status" | "score" | "savings" | "profit";
  icon: string;
  color: string;
  decimals: number;
}

export interface ChartSettings {
  id: string;
  title: string;
  type: "Bar Chart" | "Pie Chart" | "Line Chart" | "Area Chart";
  dataSource: string;
  labels: { label: string; variable: string; color: string }[];
  showLegend: boolean;
}

export interface RecommendationRule {
  id: string;
  name: string;
  condition: {
    variable: string;
    operator: "gt" | "lt" | "eq" | "lte" | "gte";
    value: any;
  };
  thenText: string;
  priority: "High" | "Medium" | "Low";
  icon: "Warning" | "Success" | "Info" | "Danger";
}

export interface CalculatorConfig {
  details: CalculatorDetails;
  categories: InputCategory[];
  fields: InputField[];
  formulas: Formula[];
  resultCards: ResultCard[];
  charts: ChartSettings[];
  recommendations: RecommendationRule[];
}

export interface RecentCalculatorItem {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  status: "Published" | "Draft";
  usesCount: number;
}
