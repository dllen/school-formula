// src/services/ai/knowledge.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { requiresApiKey } from './config';
import { friendlyAIError } from './errors';
import { getAIConfig } from './storage';

const KNOWLEDGE_PROMPT = (topic: string, context: string) => `
你是一位专业的家庭教育顾问和学科专家。请为家长撰写一份关于"${topic}"的深度辅导指南。
背景信息：${context}

请严格按以下markdown格式输出（不要输出其他无关内容）：

# 💡 深度解析
（用通俗易懂的语言，配合生活案例，深入浅出地讲解该知识点的核心逻辑，适合家长讲给孩子听）

# 🌍 生活应用场景
（列举3-5个日常生活中的具体应用场景，让知识变得有用、有趣）

# 👨‍👩‍👧 亲子互动案例
（设计一个具体的对话或互动游戏脚本，帮助家长指导孩子）

# ✏️ 实战小测验
（3道精选练习题，附带答案和解析）
1. [题目]
   * 答案：
   * 解析：
`;

export const generateKnowledgeContent = async (
    topic: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    const prompt = KNOWLEDGE_PROMPT(topic, context);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }

    if (requiresApiKey(config) && !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = createOpenAIClient(config);
    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw friendlyAIError(error, config);
    }
};
