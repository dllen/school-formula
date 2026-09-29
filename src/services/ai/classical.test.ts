// src/services/ai/classical.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// generateClassicalInterpretation has NO gateway branch (Phase 2 behavior
// preservation: original implementation only supported direct providers).
// Therefore we do NOT mock '../gateway' here.
vi.mock('openai', () => ({ default: vi.fn() }));

import OpenAI from 'openai';
import { generateClassicalInterpretation } from './classical';

describe('generateClassicalInterpretation', () => {
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
                yield { choices: [{ delta: { content: '古文解读：' } }] };
                yield { choices: [{ delta: { content: '...' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generateClassicalInterpretation(
            '项羽本纪',
            'shiji',
            ['原文段落一'],
            onStream,
        );

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, '古文解读：');
        expect(onStream).toHaveBeenNthCalledWith(2, '...');
    });
});
