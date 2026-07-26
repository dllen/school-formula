import OpenAI from 'openai';

// Define the configuration structure
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu';
    apiKey: string;
    baseUrl: string;
    model: string;
}

// Default constants for different providers
export const PROVIDER_DEFAULTS: Record<string, Partial<AIConfig>> = {
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
    },
    deepseek: {
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
    },
    zhipu: {
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4', // CHECKME: Valid model name for Zhipu
    },
    custom: {
        baseUrl: '',
        model: '',
    }
};

const STORAGE_KEY = 'school_formula_ai_config';

export const getAIConfig = (): AIConfig | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const saveAIConfig = (config: AIConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const generateKnowledgeContent = async (
    topic: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true // Enabling for client-side usage
    });

    const prompt = `
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
        throw error;
    }
};

export const generateTutorialContent = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
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
        throw error;
    }
};

export const generatePracticeQuestions = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
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
