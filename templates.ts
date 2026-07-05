import { businessStartupPlanner } from './businessStartup';
import { weeklyProductivityPlanner } from './weeklyProductivity';
import { goalAchievementPlanner } from './goalAchievement';
import { cleaningBusinessPlanner } from './cleaningBusiness';
import type { PlannerConfig } from '../types';

export const PLANNER_TEMPLATES: PlannerConfig[] = [
  businessStartupPlanner,
  weeklyProductivityPlanner,
  goalAchievementPlanner,
  cleaningBusinessPlanner,
];
