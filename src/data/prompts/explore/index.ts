import type { PromptTemplate } from '../types';
import { crossDisciplinePrompt } from './cross-discipline';
import { frontierSciencePrompt } from './frontier-science';
import { historySciencePrompt } from './history-science';
import { handsOnProjectPrompt } from './hands-on-project';
import { debateTopicPrompt } from './debate-topic';
import { careerConnectionPrompt } from './career-connection';

export const EXPLORE_PROMPTS: PromptTemplate[] = [
  crossDisciplinePrompt,
  frontierSciencePrompt,
  historySciencePrompt,
  handsOnProjectPrompt,
  debateTopicPrompt,
  careerConnectionPrompt,
];
