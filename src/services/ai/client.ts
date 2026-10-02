// src/services/ai/client.ts
// Internal helper — not exported via barrel. Use generator functions instead.
import OpenAI from 'openai';
import type { AIConfig } from './config';

/**
 * Ollama 不校验密钥，但 openai SDK 的 `apiKey` 字段是必填的——传空串会在构造时直接抛错，
 * 根本走不到网络。所以给一个占位值；Ollama 官方文档对它的措辞就是
 * "required but ignored"。界面上不展示这个值，用户看到的仍是「无需 API Key」。
 */
const OLLAMA_PLACEHOLDER_KEY = 'ollama';

export function createOpenAIClient(config: AIConfig): OpenAI {
    return new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey || OLLAMA_PLACEHOLDER_KEY,
        dangerouslyAllowBrowser: true,
    });
}
