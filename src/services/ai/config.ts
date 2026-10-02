// src/services/ai/config.ts
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu' | 'ollama' | 'gateway';
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
    // Ollama 自带的 OpenAI 兼容端点，所以 client.ts 那条 openai SDK 路径可以原样复用。
    // 模型预填 qwen2.5：面向中文用户且是常被拉取的模型；用户没 pull 过时会拿到
    // 「找不到模型」的提示而不是静默失败。
    ollama: {
        baseUrl: 'http://localhost:11434/v1',
        model: 'qwen2.5',
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
    return ['custom', 'openai', 'deepseek', 'zhipu', 'ollama', 'gateway'].includes(p);
}

/**
 * 该 provider 是否需要用户自己填 API Key。
 *
 * 两个例外：`gateway` 由 Worker 侧凭 JWT 鉴权，密钥不下发到浏览器；
 * `ollama` 跑在本机、不校验密钥（它的 OpenAI 兼容层要求 SDK 传一个 key 字段，
 * 但忽略其值——见 client.ts 的占位串）。
 *
 * 抽成共享判据是因为原先这条判断散在六个生成器里，逐处写
 * `!config.apiKey && config.provider !== 'gateway'` 时，加一个免密钥 provider
 * 就会漏掉其中几处，表现为「配置看起来没问题，一调用就被 API Key 拦下」。
 */
export function requiresApiKey(config: Pick<AIConfig, 'provider'>): boolean {
    return config.provider !== 'gateway' && config.provider !== 'ollama';
}
