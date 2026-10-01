// src/services/ai/storage.ts
import type { AIConfig } from './config';
import { storageGet, storageSet } from '../../utils/storage';

const STORAGE_KEY = 'school_formula_ai_config';

export const getAIConfig = (): AIConfig | null => {
    const stored = storageGet(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AIConfig) : null;
};

export const saveAIConfig = (config: AIConfig): void => {
    storageSet(STORAGE_KEY, JSON.stringify(config));
};
