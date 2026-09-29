// src/services/ai/knowledge.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({
    default: vi.fn(),
}));
vi.mock('../gateway', () => ({
    callGateway: vi.fn(),
}));

import OpenAI from 'openai';
import { callGateway } from '../gateway';
import { generateKnowledgeContent } from './knowledge';

describe('generateKnowledgeContent', () => {
    let onStream: (chunk: string) => void;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();

        // Reset callGateway mock between tests
        vi.mocked(callGateway).mockReset();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback (happy path)', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'Hello ' } }] };
                yield { choices: [{ delta: { content: 'world' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generateKnowledgeContent('加法', '小学一年级 数学', onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'gpt-4o',
                messages: expect.arrayContaining([
                    expect.objectContaining({ role: 'user' }),
                ]),
                stream: true,
            }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Hello ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'world');
    });

    it('uses callGateway when provider is gateway', async () => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'gateway',
                apiKey: '',
                baseUrl: '',
                model: '',
            }),
        );
        vi.mocked(callGateway).mockResolvedValue('');

        await generateKnowledgeContent('加法', 'context', onStream);

        expect(callGateway).toHaveBeenCalledTimes(1);
        expect(callGateway).toHaveBeenCalledWith(
            expect.objectContaining({ prompt: expect.any(String) }),
            onStream,
        );
    });
});
