// src/services/ai/storage.ts
import type { AIConfig } from './config';

const STORAGE_KEY = 'school_formula_ai_config';

export const getAIConfig = (): AIConfig | null => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AIConfig) : null;
};

export const saveAIConfig = (config: AIConfig): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
