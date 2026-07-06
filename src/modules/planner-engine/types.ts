/**
 * BGrowth Planner Engine™ — Complete Type System
 */

// -----------------------------------------------------------------------
// Block types
// -----------------------------------------------------------------------
export type BlockType =
  | 'calendar'
  | 'checklist'
  | 'notes'
  | 'goals'
  | 'progress'
  | 'worksheet'
  | 'milestones'
  | 'timeline'
  | 'image'
  | 'resources'
  | 'form_fields';

// -----------------------------------------------------------------------
// Block configs (how each block is configured in the builder)
// -----------------------------------------------------------------------
export interface CalendarBlockConfig {
  type: 'calendar';
  view: 'monthly' | 'weekly';
  showWeekNumbers: boolean;
}

export interface ChecklistBlockConfig {
  type: 'checklist';
  items: { id: string; label: string; required: boolean }[];
  allowAddItems: boolean;
}

export interface NotesBlockConfig {
  type: 'notes';
  placeholder: string;
  maxLength: number;
  lineRuled: boolean;
}

export interface GoalsBlockConfig {
  type: 'goals';
  goals: { id: string; label: string; placeholder: string }[];
  showProgress: boolean;
  showDeadline: boolean;
}

export interface ProgressBlockConfig {
  type: 'progress';
  habits: { id: string; label: string; color: string }[];
  trackingPeriod: 'daily' | 'weekly';
  days: number;
}

export interface WorksheetBlockConfig {
  type: 'worksheet';
  questions: { id: string; question: string; type: 'text' | 'textarea' | 'number'; placeholder?: string }[];
}

export interface MilestonesBlockConfig {
  type: 'milestones';
  milestones: { id: string; label: string; placeholder: string }[];
  showDate: boolean;
  showStatus: boolean;
}

export interface TimelineBlockConfig {
  type: 'timeline';
  events: { id: string; label: string; placeholder: string }[];
  orientation: 'vertical' | 'horizontal';
}

export interface ImageBlockConfig {
  type: 'image';
  prompt: string;
  allowUpload: boolean;
  caption: string;
}

export interface ResourcesBlockConfig {
  type: 'resources';
  resources: { id: string; label: string; url?: string }[];
  allowAddItems: boolean;
}

export interface FormFieldsBlockConfig {
  type: 'form_fields';
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'textarea' | 'select';
    placeholder?: string;
    required: boolean;
    options?: string[]; // for select type
  }[];
}

export type BlockConfig =
  | CalendarBlockConfig
  | ChecklistBlockConfig
  | NotesBlockConfig
  | GoalsBlockConfig
  | ProgressBlockConfig
  | WorksheetBlockConfig
  | MilestonesBlockConfig
  | TimelineBlockConfig
  | ImageBlockConfig
  | ResourcesBlockConfig
  | FormFieldsBlockConfig;

// -----------------------------------------------------------------------
// Planner block (a section in the planner)
// -----------------------------------------------------------------------
export interface PlannerBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  config: BlockConfig;
}

// -----------------------------------------------------------------------
// Planner settings
// -----------------------------------------------------------------------
export type PageSize = 'A4' | 'Letter' | 'A5';
export type PageOrientation = 'portrait' | 'landscape';
export type PlannerDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type PlannerLanguage = 'English' | 'Portuguese' | 'Spanish';
export type PlannerCategory =
  | 'Business' | 'Personal' | 'Health & Fitness' | 'Finance'
  | 'Education' | 'Creative' | 'Productivity' | 'Lifestyle' | 'Other';

export interface PlannerSettings {
  name: string;
  description: string;
  coverImage: string | null;
  icon: string;
  primaryColor: string;
  accentColor: string;
  category: PlannerCategory;
  difficulty: PlannerDifficulty;
  language: PlannerLanguage;
  author: string;
  tags: string[];
  estimatedDuration: string;
  pageSize: PageSize;
  pageOrientation: PageOrientation;
  exportPdf: boolean;
  exportPrint: boolean;
  allowShare: boolean;
  version: string;
}

// -----------------------------------------------------------------------
// Full planner config
// -----------------------------------------------------------------------
export interface PlannerConfig {
  id: string;
  settings: PlannerSettings;
  blocks: PlannerBlock[];
  isTemplate?: boolean;
  templateName?: string;
  createdAt: string;
  updatedAt: string;
  publishStatus: 'draft' | 'published';
  uses: number;
}

// -----------------------------------------------------------------------
// Fill data (what the user fills in)
// -----------------------------------------------------------------------
export type BlockFillData = Record<string, unknown>;
export type PlannerFillData = Record<string, BlockFillData>;

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------
export const BLOCK_TYPE_INFO: Record<BlockType, { label: string; icon: string; description: string; color: string }> = {
  calendar: { label: 'Calendar', icon: '📅', description: 'Track dates and events', color: '#1061EC' },
  checklist: { label: 'Checklist', icon: '✅', description: 'Tasks and to-dos', color: '#059669' },
  notes: { label: 'Notes', icon: '📝', description: 'Free-form writing space', color: '#7C3AED' },
  goals: { label: 'Goals', icon: '🎯', description: 'Set and track goals', color: '#DC2626' },
  progress: { label: 'Progress Tracker', icon: '📊', description: 'Habit and progress tracking', color: '#D97706' },
  worksheet: { label: 'Worksheet', icon: '📄', description: 'Questions and exercises', color: '#0EA5A0' },
  milestones: { label: 'Milestones', icon: '📌', description: 'Key achievement markers', color: '#7C3AED' },
  timeline: { label: 'Timeline', icon: '⏰', description: 'Visual timeline of events', color: '#475569' },
  image: { label: 'Image', icon: '📷', description: 'Vision board or inspiration', color: '#E11D48' },
  resources: { label: 'Resources', icon: '📎', description: 'Links and references', color: '#CA8A04' },
  form_fields: { label: 'Form Fields', icon: '📋', description: 'Custom form with various field types', color: '#1061EC' },
};

export const PLANNER_CATEGORIES: PlannerCategory[] = [
  'Business', 'Personal', 'Health & Fitness', 'Finance',
  'Education', 'Creative', 'Productivity', 'Lifestyle', 'Other',
];

export const THEME_COLORS = [
  '#1061EC', '#7C3AED', '#059669', '#DC2626',
  '#D97706', '#0EA5A0', '#475569', '#E11D48',
  '#CA8A04', '#16A34A', '#1E3A5F', '#9333EA',
];

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------
export function newId(): string {
  return `id-${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultSettings(): PlannerSettings {
  return {
    name: '',
    description: '',
    coverImage: null,
    icon: '📋',
    primaryColor: '#1061EC',
    accentColor: '#0B1D3A',
    category: 'Business',
    difficulty: 'Beginner',
    language: 'English',
    author: '',
    tags: [],
    estimatedDuration: '30 minutes/day',
    pageSize: 'A4',
    pageOrientation: 'portrait',
    exportPdf: true,
    exportPrint: true,
    allowShare: true,
    version: '1.0',
  };
}

export function defaultBlock(type: BlockType): PlannerBlock {
  const info = BLOCK_TYPE_INFO[type];
  const configs: Record<BlockType, BlockConfig> = {
    calendar: { type: 'calendar', view: 'monthly', showWeekNumbers: false },
    checklist: { type: 'checklist', items: [{ id: newId(), label: 'Task 1', required: false }], allowAddItems: true },
    notes: { type: 'notes', placeholder: 'Write your thoughts here...', maxLength: 2000, lineRuled: true },
    goals: { type: 'goals', goals: [{ id: newId(), label: 'Goal 1', placeholder: 'Describe your goal...' }], showProgress: true, showDeadline: true },
    progress: { type: 'progress', habits: [{ id: newId(), label: 'Habit 1', color: '#1061EC' }], trackingPeriod: 'daily', days: 30 },
    worksheet: { type: 'worksheet', questions: [{ id: newId(), question: 'Question 1', type: 'textarea', placeholder: 'Your answer...' }] },
    milestones: { type: 'milestones', milestones: [{ id: newId(), label: 'Milestone 1', placeholder: 'Describe this milestone...' }], showDate: true, showStatus: true },
    timeline: { type: 'timeline', events: [{ id: newId(), label: 'Event 1', placeholder: 'Describe this event...' }], orientation: 'vertical' },
    image: { type: 'image', prompt: 'Upload your vision board or inspiration image', allowUpload: true, caption: '', preImage: null, preCaption: '' },
    resources: { type: 'resources', resources: [{ id: newId(), label: 'Resource 1', url: '' }], allowAddItems: true },
    form_fields: { type: 'form_fields', sectionTitle: 'Section 1', description: '', icon: '📋', whyItMatters: '', tip: '', optional: false, fields: [
      { id: newId(), label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
      { id: newId(), label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
    ]},
  };

  return {
    id: newId(),
    title: info.label,
    description: info.description,
    icon: info.icon,
    color: info.color,
    enabled: true,
    config: configs[type],
  };
}

export function emptyPlanner(): PlannerConfig {
  return {
    id: newId(),
    settings: defaultSettings(),
    blocks: [],
    publishStatus: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uses: 0,
  };
}

// Storage
const STORAGE_KEY = 'bgrowth.planners';

export function loadPlanners(): PlannerConfig[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

export function savePlanners(planners: PlannerConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planners));
  } catch (e) {
    // If storage quota exceeded, save without cover images
    try {
      const stripped = planners.map(p => ({
        ...p,
        settings: { ...p.settings, coverImage: null }
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
      console.warn('Cover images stripped due to storage limits');
    } catch { /* ignore */ }
  }
}
