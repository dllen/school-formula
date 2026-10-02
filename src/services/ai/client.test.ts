// src/services/ai/client.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));

import OpenAI from 'openai';
import { createOpenAIClient } from './client';

describe('createOpenAIClient', () => {
    beforeEach(() => {
        vi.mocked(OpenAI).mockClear();
    });

    it('sends a placeholder key for ollama, whose SDK key field is required but ignored', () => {
        createOpenAIClient({
            provider: 'ollama',
            apiKey: '',
            baseUrl: 'http://localhost:11434/v1',
            model: 'qwen2.5',
        });

        // 传空串会被 openai SDK 直接拒掉，根本走不到网络。
        expect(OpenAI).toHaveBeenCalledWith(
            expect.objectContaining({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' }),
        );
    });

    it('passes the real key through for the hosted providers', () => {
        createOpenAIClient({
            provider: 'openai',
            apiKey: 'sk-x',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4o',
        });

        expect(OpenAI).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'sk-x' }));
    });
});
