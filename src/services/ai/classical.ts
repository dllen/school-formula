// src/services/ai/classical.ts
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 CLASSICAL_PROMPT 从 ai.ts L323-383 完整复制；行为不变约束。
// 注：原 generateClassicalInterpretation 仅支持直连 provider（无 gateway 分支）。
const CLASSICAL_PROMPT = (sourceName: string, title: string, content: string) => `
你是一位精通中国古代史与文言文的名师。请针对${sourceName}中的「${title}」篇，对以下原文进行深度解读。

原文内容：
${content}

请严格按以下 markdown 格式输出（不要输出其他无关内容）：

# 📜 文白对照
将原文按段落翻译成通俗易懂的现代汉语，每段先列原文，再列译文。

# 🏛️ 历史背景
介绍该篇所处的时代背景、相关历史事件与写作意图。

# 👤 人物与事件分析
分析文中关键人物的性格、动机与命运，或事件的前因后果。

# 💡 现实意义与教育启示
结合现代生活，谈谈这段历史对学生和家长的启示，如何从中汲取智慧。

请保持语言亲切、适合中小学生家长辅导孩子阅读。
`;

export const generateClassicalInterpretation = async (
    title: string,
    source: 'shiji' | 'zizhi',
    content: string[],
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = createOpenAIClient(config);

    const sourceName = source === 'shiji' ? '《史记》' : '《资治通鉴》';
    const prompt = CLASSICAL_PROMPT(sourceName, title, content.join('\n\n'));

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
        console.error('AI Classical Interpretation Error:', error);
        throw error;
    }
};
