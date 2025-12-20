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
