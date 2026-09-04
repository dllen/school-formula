import type { PromptTemplate } from '../types';
import { rootCausePrompt } from './root-cause';
import { conceptGapPrompt } from './concept-gap';
import { thinkingPathPrompt } from './thinking-path';
import { transferPracticePrompt } from './transfer-practice';
import { metaCognitionPrompt } from './meta-cognition';
import { errorPatternPrompt } from './error-pattern';

export const ERROR_ANALYSIS_PROMPTS: PromptTemplate[] = [
  rootCausePrompt,
  conceptGapPrompt,
  thinkingPathPrompt,
  transferPracticePrompt,
  metaCognitionPrompt,
  errorPatternPrompt,
];
