// src/services/ai/practice.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generatePracticeQuestions } from './practice';

describe('generatePracticeQuestions', () => {
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
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'Q1. ' } }] };
                yield { choices: [{ delta: { content: 'Q2.' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generatePracticeQuestions('Unit 1', 'context', onStream);

        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Q1. ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'Q2.');
    });
});
