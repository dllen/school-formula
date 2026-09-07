import type { PromptTemplate } from '../types';
import { gradientPrompt } from './gradient';
import { examPaperPrompt } from './exam-paper';
import { mistakeFocusedPrompt } from './mistake-focused';
import { conceptCheckPrompt } from './concept-check';
import { challengePrompt } from './challenge';
import { adaptivePrompt } from './adaptive';
import { primaryLevelGeneratePrompt } from './primary-level';
import { middleLevelGeneratePrompt } from './middle-level';
import { highLevelGeneratePrompt } from './high-level';

export const GENERATE_PROMPTS: PromptTemplate[] = [
  gradientPrompt,
  examPaperPrompt,
  mistakeFocusedPrompt,
  conceptCheckPrompt,
  challengePrompt,
  adaptivePrompt,
  primaryLevelGeneratePrompt,
  middleLevelGeneratePrompt,
  highLevelGeneratePrompt,
];
