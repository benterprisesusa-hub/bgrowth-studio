import type { SectionType, FieldType } from '../../engine/types';

export interface DraftField {
  _key: string;
  id: string;
  label: string;
  type: FieldType;
  icon: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean;
}

export interface DraftItem {
  _key: string;
  id: string;
  label: string;
}

export interface DraftSection {
  _key: string;
  id: string;
  number: number;
  type: SectionType;
  title: string;
  description: string;
  icon: string;
  optional?: boolean;
  whyItMatters?: string;
  tip?: string;
  fields?: DraftField[];
  items?: DraftItem[];
}

export interface BuilderDraft {
  templateId?: string;
  name: string;
  primaryColor: string;
  sections: DraftSection[];
}

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  form: 'Form Fields',
  checklist: 'Checklist',
  notes: 'Notes',
  outcome: 'Outcome',
};

export const SECTION_TYPE_DESCRIPTIONS: Record<SectionType, string> = {
  form: 'Text inputs, selects, dropdowns',
  checklist: 'Items users check off one by one',
  notes: 'A free-text area for extra notes',
  outcome: 'Final status toggles (at least one required)',
};

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  email: 'Email',
  phone: 'Phone',
  date: 'Date',
  time: 'Time',
  number: 'Number',
  select: 'Dropdown',
  textarea: 'Long Text',
};

export const ICON_OPTIONS = [
  { value: 'user', label: 'Person' },
  { value: 'users', label: 'People' },
  { value: 'user-round', label: 'Contact' },
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Email' },
  { value: 'calendar-days', label: 'Calendar' },
  { value: 'clock', label: 'Clock' },
  { value: 'map-pin', label: 'Location' },
  { value: 'building', label: 'Building' },
  { value: 'building-2', label: 'Company' },
  { value: 'map', label: 'Map' },
  { value: 'hash', label: 'Number' },
  { value: 'notebook-pen', label: 'Notes' },
  { value: 'file-text', label: 'Document' },
  { value: 'file-search', label: 'File Search' },
  { value: 'file-check-2', label: 'File Check' },
  { value: 'book-open', label: 'Book' },
  { value: 'clipboard-list', label: 'Checklist' },
  { value: 'shield-check', label: 'Shield' },
  { value: 'check-circle-2', label: 'Check Circle' },
  { value: 'dollar-sign', label: 'Money' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'pen-line', label: 'Pen' },
];

export const BRAND_COLOR_PRESETS = [
  { label: 'Royal Blue', value: '#1061EC' },
  { label: 'Teal', value: '#0EA5A0' },
  { label: 'Emerald', value: '#16A34A' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#E11D48' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Slate', value: '#475569' },
  { label: 'Navy', value: '#1E3A5F' },
];
