/**
 * Provider 配置加载 + OpenAI 兼容 Client 工厂
 *
 * 支持 8 个 Provider（均通过 OpenAI 兼容协议接入）：
 *   ollama / deepseek / zhipu / minimax / longcat / moonshot / qwen / openai
 *
 * 配置优先级：CLI 参数 > 环境变量 > 配置文件 > 默认值
 * 环境变量：GENERATE_PROVIDER / GENERATE_API_KEY / GENERATE_BASE_URL / GENERATE_MODEL / GENERATE_CONCURRENCY
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROVIDERS = {
  ollama:    { baseUrl: 'http://localhost:11434/v1',           defaultModel: 'llama3' },
  deepseek:  { baseUrl: 'https://api.deepseek.com/v1',         defaultModel: 'deepseek-chat' },
  zhipu:     { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', defaultModel: 'glm-4' },
  minimax:   { baseUrl: 'https://api.minimax.io/v1',            defaultModel: 'MiniMax-M01' },
  longcat:   { baseUrl: 'https://api.longcat.chat/openai/v1',   defaultModel: 'LongCat-Flash' },
  moonshot:  { baseUrl: 'https://api.moonshot.cn/v1',          defaultModel: 'moonshot-v1-8k' },
  qwen:      { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-plus' },
  openai:    { baseUrl: 'https://api.openai.com/v1',           defaultModel: 'gpt-4o' },
};

export const DEFAULTS = {
  concurrency: 1,
  retryCount: 3,
  retryDelayMs: 2000,
  temperature: 0.7,
  maxTokens: 40096,
  outputMode: 'files',
  validateOutput: true,
  skipExisting: true,
  ranges: [],
};

/** 加载配置：CLI 参数 > 环境变量 > 配置文件 > 默认值 */
export function loadProviderConfig(env = process.env) {
  const configPath = join(__dirname, 'generate-config.json');
  const fileConfig = existsSync(configPath)
    ? JSON.parse(readFileSync(configPath, 'utf8'))
    : {};

  const provider = env.GENERATE_PROVIDER || fileConfig.provider || 'ollama';
  if (!PROVIDERS[provider]) {
    throw new Error(`unknown provider: ${provider}. supported: ${Object.keys(PROVIDERS).join(', ')}`);
  }

  const preset = PROVIDERS[provider];
  const apiKey = env.GENERATE_API_KEY || fileConfig.apiKey || env[`${provider.toUpperCase()}_API_KEY`] || '';

  return {
    provider,
    apiKey,
    baseUrl: env.GENERATE_BASE_URL || fileConfig.baseUrl || preset.baseUrl,
    model: env.GENERATE_MODEL || fileConfig.model || preset.defaultModel,
    concurrency: Number(env.GENERATE_CONCURRENCY || fileConfig.concurrency || DEFAULTS.concurrency),
    retryCount: Number(fileConfig.retryCount ?? DEFAULTS.retryCount),
    retryDelayMs: Number(fileConfig.retryDelayMs ?? DEFAULTS.retryDelayMs),
    temperature: Number(fileConfig.temperature ?? DEFAULTS.temperature),
    maxTokens: Number(fileConfig.maxTokens ?? DEFAULTS.maxTokens),
    outputMode: fileConfig.outputMode || DEFAULTS.outputMode,
    validateOutput: fileConfig.validateOutput ?? DEFAULTS.validateOutput,
    skipExisting: fileConfig.skipExisting ?? DEFAULTS.skipExisting,
    ranges: fileConfig.ranges || DEFAULTS.ranges,
  };
}

export function createClient(config) {
  if (!config.apiKey && config.provider !== 'ollama') {
    throw new Error(`apiKey required for ${config.provider} (set GENERATE_API_KEY)`);
  }
  return new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey || 'ollama-local', // Ollama 允许空 key
    maxRetries: 0, // 我们自己处理重试（跨 provider 一致行为）
  });
}

/** 带指数退避的重试包装 */
export async function withRetry(fn, config, label = '') {
  let lastErr;
  for (let attempt = 0; attempt <= config.retryCount; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isRetryable = !err.status || err.status >= 500 || err.status === 429;
      if (!isRetryable || attempt === config.retryCount) break;
      const delay = config.retryDelayMs * 2 ** attempt;
      console.warn(`  retry ${attempt + 1}/${config.retryCount} for ${label} in ${delay}ms (${err.message})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
