/**
 * Core config schema for the Checklist Generator Engine.
 *
 * A ChecklistConfig fully describes a checklist product: its branding,
 * its footer copy, and an ordered list of sections. Every UI component in
 * `src/engine` reads from this shape instead of hardcoded product data —
 * swap the config, get a different product, with no component changes.
 */

export type FieldType = 'text' | 'email' | 'phone' | 'date' | 'time' | 'number' | 'select' | 'textarea';

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  icon: string;
  required?: boolean;
  placeholder?: string;
  /** Required for type === 'select'. */
  options?: string[];
  /** sm:col-span-2 style full-width hint for the field grid. */
  fullWidth?: boolean;
}

export interface ChecklistItemConfig {
  id: string;
  label: string;
}

export type SectionType = 'form' | 'checklist' | 'notes' | 'outcome';

interface SectionBase {
  id: string;
  number: number;
  title: string;
  description: string;
  /** lucide-react icon name, e.g. "user", "calendar-days". See engine/icons.ts. */
  icon: string;
  optional?: boolean;
  whyItMatters?: string;
  tip?: string;
}

export interface FormSectionConfig extends SectionBase {
  type: 'form';
  fields: FieldConfig[];
}

export interface ChecklistSectionConfig extends SectionBase {
  type: 'checklist';
  items: ChecklistItemConfig[];
}

export interface NotesSectionConfig extends SectionBase {
  type: 'notes';
}

export interface OutcomeSectionConfig extends SectionBase {
  type: 'outcome';
  items: ChecklistItemConfig[];
}

export type SectionConfig = FormSectionConfig | ChecklistSectionConfig | NotesSectionConfig | OutcomeSectionConfig;

export interface BrandConfig {
  name: string;
  companyLabel: string;
  /** Base hex color; the engine derives a full 50–900 scale from it at runtime. */
  primaryColor: string;
}

export interface FooterConfig {
  proTip: string;
  helpText: string;
  helpUrl?: string;
}

export interface ChecklistConfig {
  productId: string;
  brand: BrandConfig;
  footer: FooterConfig;
  sections: SectionConfig[];
}

/** Generic filled-in data shape. Keyed by section id.
 *  - form sections    -> Record<fieldId, string>
 *  - checklist/outcome -> Record<itemId, boolean>
 *  - notes sections   -> string
 */
export type ChecklistData = Record<string, Record<string, string> | Record<string, boolean> | string>;
