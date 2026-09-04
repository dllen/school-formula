import type { PromptTemplate } from '../types';
import { weeklyPlanPrompt } from './weekly-plan';
import { examPrepPrompt } from './exam-prep';
import { summerPlanPrompt } from './summer-plan';
import { weakPointPrompt } from './weak-point';
import { habitBuildingPrompt } from './habit-building';
import { milestonePrompt } from './milestone';

export const PLAN_PROMPTS: PromptTemplate[] = [
  weeklyPlanPrompt,
  examPrepPrompt,
  summerPlanPrompt,
  weakPointPrompt,
  habitBuildingPrompt,
  milestonePrompt,
];
