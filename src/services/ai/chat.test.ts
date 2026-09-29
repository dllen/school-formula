// src/services/ai/chat.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({
    chatGateway: vi.fn(),
}));

import OpenAI from 'openai';
import type { ChatMessage } from '../gateway';
import { chatGateway } from '../gateway';
import { generateChat } from './chat';

const MESSAGES: ChatMessage[] = [
    { role: 'user', content: 'Hi' },
    { role: 'assistant', content: 'Hello!' },
];

describe('generateChat', () => {
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
        vi.mocked(chatGateway).mockReset();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'AI: ' } }] };
                yield { choices: [{ delta: { content: 'response' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(function (this: unknown) {
            return {
                chat: { completions: { create: mockCreate } },
            };
        } as never);

        await generateChat(MESSAGES, onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'AI: ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'response');
    });

    it('uses chatGateway when provider is gateway', async () => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'gateway',
                apiKey: '',
                baseUrl: '',
                model: '',
            }),
        );
        vi.mocked(chatGateway).mockResolvedValue('');

        await generateChat(MESSAGES, onStream);

        expect(chatGateway).toHaveBeenCalledTimes(1);
        expect(chatGateway).toHaveBeenCalledWith(
            expect.objectContaining({ messages: MESSAGES }),
            onStream,
        );
    });
});
