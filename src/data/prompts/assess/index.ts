import type { PromptTemplate } from '../types';
import { answerReviewPrompt } from './answer-review';
import { rubricBasedPrompt } from './rubric-based';
import { peerReviewPrompt } from './peer-review';
import { selfAssessmentPrompt } from './self-assessment';
import { progressCheckPrompt } from './progress-check';
import { oralDefensePrompt } from './oral-defense';

export const ASSESS_PROMPTS: PromptTemplate[] = [
  answerReviewPrompt,
  rubricBasedPrompt,
  peerReviewPrompt,
  selfAssessmentPrompt,
  progressCheckPrompt,
  oralDefensePrompt,
];
