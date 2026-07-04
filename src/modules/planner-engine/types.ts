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

export const LAYOUT_SECTIONS: Record<string, PlannerSectionConfig[]> = {
  classic: [
    { id: 'welcome', _key: 'k-welcome', type: 'text', title: 'Welcome Page', description: 'Introduction and planner overview', icon: 'file-text', enabled: true, estimatedPages: 1 },
    { id: 'vision', _key: 'k-vision', type: 'goals', title: 'Vision & Goals', description: 'Define your vision and set goals', icon: 'file-text', enabled: true, estimatedPages: 3 },
    { id: 'action', _key: 'k-action', type: 'worksheet', title: 'Action Plan', description: 'Plan your steps and strategy', icon: 'file-check-2', enabled: true, estimatedPages: 2 },
    { id: 'tasks', _key: 'k-tasks', type: 'checklist', title: 'Tasks & To-Do List', description: 'Organize tasks and daily actions', icon: 'clipboard-list', enabled: true, estimatedPages: 4 },
    { id: 'notes', _key: 'k-notes', type: 'notes', title: 'Notes', description: 'Extra notes and ideas', icon: 'notebook-pen', enabled: true, estimatedPages: 2 },
    { id: 'reflection', _key: 'k-reflection', type: 'reflection', title: 'Review & Reflection', description: 'Review, reflect and improve', icon: 'book-open', enabled: true, estimatedPages: 2 },
  ],
  weekly: [
    { id: 'week_goals', _key: 'k-wg', type: 'goals', title: 'Weekly Goals', description: 'Set your goals for the week', icon: 'file-text', enabled: true, estimatedPages: 1 },
    { id: 'week_schedule', _key: 'k-ws', type: 'calendar', title: 'Weekly Schedule', description: 'Plan each day of the week', icon: 'calendar-days', enabled: true, estimatedPages: 4 },
    { id: 'week_tasks', _key: 'k-wt', type: 'checklist', title: 'Task List', description: 'Daily tasks and priorities', icon: 'clipboard-list', enabled: true, estimatedPages: 2 },
    { id: 'week_habits', _key: 'k-wh', type: 'habit-tracker', title: 'Habit Tracker', description: 'Track your weekly habits', icon: 'calendar-days', enabled: true, estimatedPages: 2 },
    { id: 'week_notes', _key: 'k-wn', type: 'notes', title: 'Notes', description: 'Weekly notes and ideas', icon: 'notebook-pen', enabled: true, estimatedPages: 1 },
  ],
  monthly: [
    { id: 'month_overview', _key: 'k-mo', type: 'text', title: 'Monthly Overview', description: 'Big picture for the month', icon: 'file-text', enabled: true, estimatedPages: 1 },
    { id: 'month_goals', _key: 'k-mg', type: 'goals', title: 'Monthly Goals', description: 'Goals to achieve this month', icon: 'file-text', enabled: true, estimatedPages: 2 },
    { id: 'month_calendar', _key: 'k-mc', type: 'calendar', title: 'Monthly Calendar', description: 'Calendar and important dates', icon: 'calendar-days', enabled: true, estimatedPages: 4 },
    { id: 'month_habits', _key: 'k-mh', type: 'habit-tracker', title: 'Habit Tracker', description: 'Track your monthly habits', icon: 'calendar-days', enabled: true, estimatedPages: 4 },
    { id: 'month_budget', _key: 'k-mb', type: 'budget', title: 'Monthly Budget', description: 'Track income and expenses', icon: 'dollar-sign', enabled: true, estimatedPages: 2 },
    { id: 'month_reflection', _key: 'k-mr', type: 'reflection', title: 'Monthly Reflection', description: 'Review your month', icon: 'book-open', enabled: true, estimatedPages: 2 },
  ],
  goals: [
    { id: 'goal_vision', _key: 'k-gv', type: 'text', title: 'Vision Statement', description: 'Your big picture vision', icon: 'file-text', enabled: true, estimatedPages: 1 },
    { id: 'goal_set', _key: 'k-gs', type: 'goals', title: 'Goal Setting', description: 'Define your SMART goals', icon: 'file-text', enabled: true, estimatedPages: 3 },
    { id: 'goal_milestones', _key: 'k-gm', type: 'milestones', title: 'Milestones', description: 'Key milestones on your journey', icon: 'file-text', enabled: true, estimatedPages: 2 },
    { id: 'goal_action', _key: 'k-ga', type: 'worksheet', title: 'Action Steps', description: 'Concrete steps to reach your goals', icon: 'file-check-2', enabled: true, estimatedPages: 2 },
    { id: 'goal_track', _key: 'k-gt', type: 'habit-tracker', title: 'Progress Tracker', description: 'Track your daily progress', icon: 'calendar-days', enabled: true, estimatedPages: 4 },
  ],
  project: [
    { id: 'proj_overview', _key: 'k-po', type: 'text', title: 'Project Overview', description: 'Project summary and objectives', icon: 'file-text', enabled: true, estimatedPages: 1 },
    { id: 'proj_plan', _key: 'k-pp', type: 'worksheet', title: 'Project Plan', description: 'Scope, timeline and resources', icon: 'file-check-2', enabled: true, estimatedPages: 3 },
    { id: 'proj_milestones', _key: 'k-pm', type: 'milestones', title: 'Milestones & Deadlines', description: 'Key project milestones', icon: 'file-text', enabled: true, estimatedPages: 2 },
    { id: 'proj_tasks', _key: 'k-pt', type: 'checklist', title: 'Task List', description: 'Project tasks and assignments', icon: 'clipboard-list', enabled: true, estimatedPages: 4 },
    { id: 'proj_budget', _key: 'k-pb', type: 'budget', title: 'Budget', description: 'Project budget and expenses', icon: 'dollar-sign', enabled: true, estimatedPages: 2 },
    { id: 'proj_notes', _key: 'k-pn', type: 'notes', title: 'Notes', description: 'Project notes and ideas', icon: 'notebook-pen', enabled: true, estimatedPages: 2 },
  ],
  business: [
    { id: 'biz_overview', _key: 'k-bo', type: 'text', title: 'Business Overview', description: 'Mission, vision and values', icon: 'file-text', enabled: true, estimatedPages: 2 },
    { id: 'biz_goals', _key: 'k-bg', type: 'goals', title: 'Business Goals', description: 'Annual and quarterly goals', icon: 'file-text', enabled: true, estimatedPages: 3 },
    { id: 'biz_strategy', _key: 'k-bs', type: 'worksheet', title: 'Strategy & Action Plan', description: 'Strategic initiatives and actions', icon: 'file-check-2', enabled: true, estimatedPages: 3 },
    { id: 'biz_finance', _key: 'k-bf', type: 'budget', title: 'Financial Plan', description: 'Revenue, costs and projections', icon: 'dollar-sign', enabled: true, estimatedPages: 4 },
    { id: 'biz_tasks', _key: 'k-bt', type: 'checklist', title: 'Action Items', description: 'Weekly and monthly action items', icon: 'clipboard-list', enabled: true, estimatedPages: 4 },
    { id: 'biz_notes', _key: 'k-bn', type: 'notes', title: 'Notes', description: 'Business notes and ideas', icon: 'notebook-pen', enabled: true, estimatedPages: 2 },
  ],
  blank: [],
};

export const DEFAULT_SECTIONS: PlannerSectionConfig[] = [
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
