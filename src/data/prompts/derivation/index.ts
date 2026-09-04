import type { PromptTemplate } from '../types';
import { stepByStepPrompt } from './step-by-step';
import { intuitiveProofPrompt } from './intuitive-proof';
import { historicalContextPrompt } from './historical-context';
import { visualProofPrompt } from './visual-proof';
import { realWorldPrompt } from './real-world';
import { extensionPrompt } from './extension';

export const DERIVATION_PROMPTS: PromptTemplate[] = [
  stepByStepPrompt,
  intuitiveProofPrompt,
  historicalContextPrompt,
  visualProofPrompt,
  realWorldPrompt,
  extensionPrompt,
];
