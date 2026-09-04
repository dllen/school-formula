import type { PromptTemplate } from '../types';
import { gameBasedPrompt } from './game-based';
import { dialogueScriptPrompt } from './dialogue-script';
import { experimentKitPrompt } from './experiment-kit';
import { storyCoCreatePrompt } from './story-co-create';
import { quizBattlePrompt } from './quiz-battle';
import { realLifeTaskPrompt } from './real-life-task';

export const INTERACTION_PROMPTS: PromptTemplate[] = [
  gameBasedPrompt,
  dialogueScriptPrompt,
  experimentKitPrompt,
  storyCoCreatePrompt,
  quizBattlePrompt,
  realLifeTaskPrompt,
];
