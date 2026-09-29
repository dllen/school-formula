// src/services/ai/client.ts
// Internal helper — not exported via barrel. Use generator functions instead.
import OpenAI from 'openai';
import type { AIConfig } from './config';

export function createOpenAIClient(config: AIConfig): OpenAI {
    return new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
    });
}
