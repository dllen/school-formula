// src/services/ai/config.test.ts
import { describe, expect, it } from 'vitest';
import type { AIConfig } from './config';
import { isValidProvider, PROVIDER_DEFAULTS, requiresApiKey } from './config';

const config = (overrides: Partial<AIConfig>): AIConfig => ({
    provider: 'openai',
    apiKey: 'sk-x',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    ...overrides,
});

describe('isValidProvider', () => {
    it('accepts ollama', () => {
        expect(isValidProvider('ollama')).toBe(true);
    });

    it('rejects anything not in the union', () => {
        expect(isValidProvider('llama')).toBe(false);
        expect(isValidProvider('')).toBe(false);
    });
});

describe('PROVIDER_DEFAULTS.ollama', () => {
    it('points at the OpenAI-compatible endpoint and prefills a model', () => {
        expect(PROVIDER_DEFAULTS.ollama.baseUrl).toBe('http://localhost:11434/v1');
        expect(PROVIDER_DEFAULTS.ollama.model).toBe('qwen2.5');
    });
});

describe('requiresApiKey', () => {
    it('is false for gateway, which is authenticated by the Worker', () => {
        expect(requiresApiKey(config({ provider: 'gateway', apiKey: '' }))).toBe(false);
    });

    it('is false for ollama, which needs no key', () => {
        expect(requiresApiKey(config({ provider: 'ollama', apiKey: '' }))).toBe(false);
    });

    it('is true for every hosted provider', () => {
        for (const provider of ['openai', 'deepseek', 'zhipu', 'custom'] as const) {
            expect(requiresApiKey(config({ provider }))).toBe(true);
        }
    });
});
