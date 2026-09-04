import type { PromptTemplate } from '../types';
import { deepConceptPrompt } from './deep-concept';
import { storyBasedPrompt } from './story-based';
import { socraticPrompt } from './socratic';
import { bridgeAnalogyPrompt } from './bridge-analogy';
import { visualExplainPrompt } from './visual-explain';
import { misconceptionPrompt } from './misconception';

export const EXPLAIN_PROMPTS: PromptTemplate[] = [
  deepConceptPrompt,
  storyBasedPrompt,
  socraticPrompt,
  bridgeAnalogyPrompt,
  visualExplainPrompt,
  misconceptionPrompt,
];
