import type { PromptTemplate } from '../types';
import { deepConceptPrompt } from './deep-concept';
import { storyBasedPrompt } from './story-based';
import { socraticPrompt } from './socratic';
import { bridgeAnalogyPrompt } from './bridge-analogy';
import { visualExplainPrompt } from './visual-explain';
import { misconceptionPrompt } from './misconception';
import { primaryLevelExplainPrompt } from './primary-level';
import { middleLevelExplainPrompt } from './middle-level';
import { highLevelExplainPrompt } from './high-level';

export const EXPLAIN_PROMPTS: PromptTemplate[] = [
  deepConceptPrompt,
  storyBasedPrompt,
  socraticPrompt,
  bridgeAnalogyPrompt,
  visualExplainPrompt,
  misconceptionPrompt,
  primaryLevelExplainPrompt,
  middleLevelExplainPrompt,
  highLevelExplainPrompt,
];
