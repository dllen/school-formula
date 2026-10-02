// src/services/ai/tutorial.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { requiresApiKey } from './config';
import { friendlyAIError } from './errors';
import { getAIConfig } from './storage';

// 原 prompt 模板从 ai.ts L137-228 完整复制；行为不变约束
const TUTORIAL_PROMPT = (unitTitle: string, context: string) => `
你是一位经验丰富的小学数学教研老师，擅长把抽象的数学概念讲得通俗易懂、生动有趣。
请根据以下学习目标，为家长和孩子生成一节关于"${unitTitle}"的完整家庭辅导教程。
背景信息：${context}

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 🎯 本课目标
（根据学习目标，用 3-5 条清晰列出孩子学完这课后应达到的目标）

# 📖 知识讲解
（围绕学习目标，用孩子能听懂的语言讲解核心概念，配合生活案例、比喻或小故事，深入浅出。必要时使用 Mermaid 语法或 SVG 代码插入图解。）

# ✏️ 例题精讲
（2-3 道由易到难的典型例题，每道题写出完整解题步骤和思路点拨）

# 🧩 亲子互动
（设计一个 5-10 分钟的小游戏或互动活动，让家长和孩子一起完成，巩固本课内容）

# 📝 课后练习
（3-5 道练习题，附参考答案和简要解析）
`;

export const generateTutorialContent = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    const prompt = TUTORIAL_PROMPT(unitTitle, context);

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
        console.error('AI Tutorial Generation Error:', error);
        throw friendlyAIError(error, config);
    }
};
