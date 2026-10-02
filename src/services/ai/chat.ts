// src/services/ai/chat.ts
import { chatGateway, type ChatMessage } from '../gateway';
import { createOpenAIClient } from './client';
import { requiresApiKey } from './config';
import { friendlyAIError } from './errors';
import { getAIConfig } from './storage';

export const generateChat = async (
    messages: ChatMessage[],
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    if (config.provider === 'gateway') {
        await chatGateway({ messages }, onStream);
        return;
    }

    if (requiresApiKey(config) && !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = createOpenAIClient(config);
    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Chat Error:', error);
        const friendly = friendlyAIError(error, config);
        if (friendly !== error) console.error('AI Chat Error (friendly):', friendly.message);
        throw friendly;
    }
};
