// src/services/ai/tutorial.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generateTutorialContent } from './tutorial';

describe('generateTutorialContent', () => {
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
                yield { choices: [{ delta: { content: '# Tutorial ' } }] };
                yield { choices: [{ delta: { content: 'content' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generateTutorialContent('Unit 1', 'context', onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, '# Tutorial ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'content');
    });
});
