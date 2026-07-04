import type { ChecklistConfig } from '../../engine/types';

export type TemplateStatus = 'Active' | 'Archived';
export type InstanceStatus = 'In Progress' | 'Completed';

export interface ChecklistTemplate {
  templateId: string;
  ownerEmail: string;
  name: string;
  /** Stringified ChecklistConfig JSON as stored in Sheets. */
  configJson: string;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

/** Template with the config already parsed — used at runtime. */
export interface ParsedTemplate extends Omit<ChecklistTemplate, 'configJson'> {
  config: ChecklistConfig;
}

export interface ChecklistInstance {
  instanceId: string;
  templateId: string;
  ownerEmail: string;
  clientOrJobRef: string;
  /** Stringified ChecklistData JSON as stored in Sheets. */
  dataJson: string;
  progressPercent: number;
  status: InstanceStatus;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------
// Navigation / view state
// -----------------------------------------------------------------------
export type BuilderView =
  | { screen: 'templates' }
  | { screen: 'builder'; existingDraft?: import('./builderTypes').BuilderDraft }
  | { screen: 'instances'; template: ParsedTemplate }
  | { screen: 'fill'; template: ParsedTemplate; instance: ChecklistInstance }
  | { screen: 'newInstance'; template: ParsedTemplate };
