// src/services/ai/errors.test.ts
import { describe, expect, it } from 'vitest';
import { friendlyAIError } from './errors';

const OLLAMA = {
    provider: 'ollama' as const,
    baseUrl: 'http://localhost:11434/v1',
    model: 'qwen2.5',
};

const OPENAI = {
    provider: 'openai' as const,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
};

/** openai SDK 把 fetch 失败包成 APIConnectionError，原始 TypeError 挂在 cause 上。 */
const sdkConnectionError = () => {
    const error = new Error('Connection error.') as Error & { cause?: unknown };
    error.cause = new TypeError('Failed to fetch');
    return error;
};

describe('friendlyAIError', () => {
    it('names both the service and CORS when Ollama cannot be reached', () => {
        const result = friendlyAIError(new TypeError('Failed to fetch'), OLLAMA);
        expect(result.message).toContain('无法连接');
        expect(result.message).toContain('http://localhost:11434/v1');
        expect(result.message).toContain('ollama serve');
        // CORS 是本项目最容易踩的坑：Ollama 默认只放行 127.0.0.1 与 0.0.0.0。
        expect(result.message).toContain('OLLAMA_ORIGINS');
    });

    it('recognises the connection error the openai SDK wraps fetch failures into', () => {
        expect(friendlyAIError(sdkConnectionError(), OLLAMA).message).toContain('OLLAMA_ORIGINS');
    });

    it('tells the user how to pull a missing model', () => {
        const error = Object.assign(new Error('model "qwen2.5" not found'), { status: 404 });
        const result = friendlyAIError(error, OLLAMA);
        expect(result.message).toContain('qwen2.5');
        expect(result.message).toContain('ollama pull qwen2.5');
    });

    it('treats a bare 404 as a missing model even without a recognisable message', () => {
        const error = Object.assign(new Error('Not Found'), { status: 404 });
        expect(friendlyAIError(error, OLLAMA).message).toContain('ollama pull qwen2.5');
    });

    it('passes unrecognised Ollama failures through untouched', () => {
        const error = Object.assign(new Error('internal server error'), { status: 500 });
        expect(friendlyAIError(error, OLLAMA)).toBe(error);
    });

    it('passes anything through unchanged for providers that are not Ollama', () => {
        const connection = new TypeError('Failed to fetch');
        expect(friendlyAIError(connection, OPENAI)).toBe(connection);
    });

    it('wraps a non-Error throw rather than losing it', () => {
        const result = friendlyAIError('boom', OPENAI);
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('boom');
    });
});
