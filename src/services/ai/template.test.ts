// src/services/ai/template.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import type { PromptTemplate } from '../../data/prompts/types';
import { generateFromTemplate } from './template';

// Minimal PromptTemplate covering only the fields required by generateFromTemplate.
// TypeScript will complain about missing fields; we satisfy the rest with `as`
// inside the const literal (only `id`, `title`, `scenario`, `template` matter
// at runtime for the SUT — the other fields exist purely for type-level
// documentation).
const MOCK_TEMPLATE = {
    id: 'tpl-test',
    title: 'Test Template',
    scenario: 'explain' as const,
    icon: '🧪',
    description: 'Test template for unit testing',
    tags: ['test'],
    template: 'Hello {{name}}',
    variables: [],
    grades: ['primary' as const],
    subjects: ['数学'],
    usageCount: 0,
    rating: 0,
    author: 'test',
} as PromptTemplate;

describe('generateFromTemplate', () => {
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
                yield { choices: [{ delta: { content: 'Hello ' } }] };
                yield { choices: [{ delta: { content: 'World' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generateFromTemplate(MOCK_TEMPLATE, { name: 'World' }, onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Hello ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'World');
    });
});
