// src/services/ai/practice.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 PRACTICE_PROMPT 从 ai.ts L228-323 完整复制；行为不变约束
const PRACTICE_PROMPT = (unitTitle: string, context: string) => `
你是一位经验丰富的小学数学老师。请根据以下信息，再生成 5 道与本单元学习目标匹配的补充练习题。
单元：${unitTitle}
背景信息：${context}

要求：
- 题目类型可以是选择、填空、判断或解答；
- 难度要有梯度，覆盖基础、提高和挑战；
- 每道题附参考答案和简要解析。

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 📝 补充练习题

1. [题目]
   - 答案：
   - 解析：

2. [题目]
   - 答案：
   - 解析：

（以此类推，共 5 道题）
`;

export const generatePracticeQuestions = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    const prompt = PRACTICE_PROMPT(unitTitle, context);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }

    if (!config.apiKey) {
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
        console.error('AI Practice Generation Error:', error);
        throw error;
    }
};
