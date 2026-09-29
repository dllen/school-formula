// src/services/ai/index.ts
// Barrel — explicit re-exports only.
// Internal helpers (createOpenAIClient) and removed generators are NOT exported.

export type { AIConfig } from './config';
export { PROVIDER_DEFAULTS } from './config';
export { getAIConfig, saveAIConfig } from './storage';
export { generateKnowledgeContent } from './knowledge';
export { generateTutorialContent } from './tutorial';
export { generatePracticeQuestions } from './practice';
export { generateClassicalInterpretation } from './classical';
export { generateFromTemplate } from './template';
export { generateChat } from './chat';
