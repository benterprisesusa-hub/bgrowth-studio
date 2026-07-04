export type PlannerSectionType =
  | 'text'
  | 'rich-text'
  | 'checklist'
  | 'worksheet'
  | 'goals'
  | 'milestones'
  | 'habit-tracker'
  | 'calendar'
  | 'timeline'
  | 'budget'
  | 'table'
  | 'notes'
  | 'reflection'
  | 'vision-board'
  | 'quote'
  | 'custom';

export interface PlannerSectionConfig {
  id: string;
  _key: string;
  type: PlannerSectionType;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  /** estimated pages this section produces */
  estimatedPages: number;
}

export type PlannerLayout =
  | 'classic'
  | 'weekly'
  | 'monthly'
  | 'goals'
  | 'project'
  | 'business'
  | 'blank';

export interface PlannerTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily: 'poppins' | 'inter' | 'playfair';
}

export interface PlannerConfig {
  productId: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  audience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: string;
  estimatedDuration: string;
  coverImage: string | null;
  layout: PlannerLayout;
  theme: PlannerTheme;
  sections: PlannerSectionConfig[];
  tags: string[];
}

export const PLANNER_LAYOUT_OPTIONS: { id: PlannerLayout; name: string; description: string }[] = [
  { id: 'classic', name: 'Classic Planner', description: 'A structured planner with sections for goals, planning, action steps and tracking.' },
  { id: 'weekly', name: 'Weekly Planner', description: 'Focus on weekly planning, schedules, tasks and weekly goals.' },
  { id: 'monthly', name: 'Monthly Planner', description: 'Plan by month with calendars, goals, tasks and habit tracking.' },
  { id: 'goals', name: 'Goal Planner', description: 'Step-by-step goal achievement with milestones and tracking.' },
  { id: 'project', name: 'Project Planner', description: 'Step-by-step project planning with milestones, tasks and deadlines.' },
  { id: 'business', name: 'Business Planner', description: 'Comprehensive business planning with strategy and execution tracking.' },
  { id: 'blank', name: 'Custom Layout', description: 'Build your own layout from scratch with full flexibility.' },
];

export const PLANNER_SECTION_DEFAULTS: Record<PlannerSectionType, { icon: string; estimatedPages: number }> = {
  'text': { icon: 'file-text', estimatedPages: 1 },
  'rich-text': { icon: 'notebook-pen', estimatedPages: 2 },
  'checklist': { icon: 'clipboard-list', estimatedPages: 1 },
  'worksheet': { icon: 'file-check-2', estimatedPages: 2 },
  'goals': { icon: 'target', estimatedPages: 3 },
  'milestones': { icon: 'flag', estimatedPages: 2 },
  'habit-tracker': { icon: 'calendar-check', estimatedPages: 4 },
  'calendar': { icon: 'calendar-days', estimatedPages: 2 },
  'timeline': { icon: 'clock', estimatedPages: 2 },
  'budget': { icon: 'dollar-sign', estimatedPages: 3 },
  'table': { icon: 'table', estimatedPages: 1 },
  'notes': { icon: 'file-text', estimatedPages: 2 },
  'reflection': { icon: 'book-open', estimatedPages: 2 },
  'vision-board': { icon: 'image', estimatedPages: 1 },
  'quote': { icon: 'quote', estimatedPages: 1 },
  'custom': { icon: 'plus-circle', estimatedPages: 1 },
};

export const PLANNER_CATEGORIES = [
  'Business', 'Personal Development', 'Health & Fitness', 'Finance',
  'Education', 'Creative', 'Productivity', 'Lifestyle', 'Career', 'Other',
];

export const PLANNER_AUDIENCES = [
  'Entrepreneurs', 'Students', 'Professionals', 'Creatives',
  'Coaches', 'Teams', 'Families', 'Everyone',
];

export const THEME_COLOR_PRESETS = [
  { label: 'Royal Blue', primary: '#1061EC', accent: '#0B1D3A' },
  { label: 'Violet', primary: '#7C3AED', accent: '#1E1B4B' },
  { label: 'Emerald', primary: '#059669', accent: '#064E3B' },
  { label: 'Rose', primary: '#E11D48', accent: '#4C0519' },
  { label: 'Amber', primary: '#D97706', accent: '#451A03' },
  { label: 'Teal', primary: '#0EA5A0', accent: '#042F2E' },
  { label: 'Slate', primary: '#475569', accent: '#0F172A' },
  { label: 'Indigo', primary: '#4F46E5', accent: '#1E1B4B' },
];

export const DEFAULT_SECTIONS: PlannerSectionConfig[] = [
  { id: 'welcome', _key: 'k-welcome', type: 'text', title: 'Welcome Page', description: 'Introduction and planner overview', icon: 'file-text', enabled: true, estimatedPages: 1 },
  { id: 'vision', _key: 'k-vision', type: 'goals', title: 'Vision & Goals', description: 'Define your vision and set goals', icon: 'target', enabled: true, estimatedPages: 3 },
  { id: 'action', _key: 'k-action', type: 'worksheet', title: 'Action Plan', description: 'Plan your steps and strategy', icon: 'file-check-2', enabled: true, estimatedPages: 2 },
  { id: 'tasks', _key: 'k-tasks', type: 'checklist', title: 'Tasks & To-Do List', description: 'Organize tasks and daily actions', icon: 'clipboard-list', enabled: true, estimatedPages: 4 },
  { id: 'schedule', _key: 'k-schedule', type: 'calendar', title: 'Schedule', description: 'Calendar and important dates', icon: 'calendar-days', enabled: true, estimatedPages: 4 },
  { id: 'resources', _key: 'k-resources', type: 'notes', title: 'Resources', description: 'Important resources and contacts', icon: 'book-open', enabled: true, estimatedPages: 2 },
  { id: 'notes', _key: 'k-notes', type: 'notes', title: 'Notes', description: 'Extra notes and ideas', icon: 'notebook-pen', enabled: true, estimatedPages: 4 },
  { id: 'progress', _key: 'k-progress', type: 'habit-tracker', title: 'Progress Tracker', description: 'Track your progress and results', icon: 'calendar-check', enabled: true, estimatedPages: 4 },
  { id: 'reflection', _key: 'k-reflection', type: 'reflection', title: 'Review & Reflection', description: 'Review, reflect and improve', icon: 'book-open', enabled: true, estimatedPages: 2 },
];

export function emptyPlannerConfig(): PlannerConfig {
  return {
    productId: `planner-${Date.now()}`,
    name: '',
    description: '',
    category: 'Business',
    subcategory: '',
    audience: 'Entrepreneurs',
    difficulty: 'Beginner',
    goal: '',
    estimatedDuration: '',
    coverImage: null,
    layout: 'classic',
    theme: { primaryColor: '#1061EC', accentColor: '#0B1D3A', fontFamily: 'poppins' },
    sections: [...DEFAULT_SECTIONS],
    tags: [],
  };
}
