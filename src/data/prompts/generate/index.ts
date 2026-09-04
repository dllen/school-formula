import type { PromptTemplate } from '../types';
import { gradientPrompt } from './gradient';
import { examPaperPrompt } from './exam-paper';
import { mistakeFocusedPrompt } from './mistake-focused';
import { conceptCheckPrompt } from './concept-check';
import { challengePrompt } from './challenge';
import { adaptivePrompt } from './adaptive';

export const GENERATE_PROMPTS: PromptTemplate[] = [
  gradientPrompt,
  examPaperPrompt,
  mistakeFocusedPrompt,
  conceptCheckPrompt,
  challengePrompt,
  adaptivePrompt,
];
