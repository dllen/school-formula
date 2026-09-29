// src/services/ai/config.ts
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu' | 'gateway';
    apiKey: string;
    baseUrl: string;
    model: string;
}

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
    },
    gateway: {
        baseUrl: '',
        model: '',
    },
};

export function isValidProvider(p: string): p is AIConfig['provider'] {
    return ['custom', 'openai', 'deepseek', 'zhipu', 'gateway'].includes(p);
}
