// src/services/ai/errors.ts
import type { AIConfig } from './config';

/**
 * 浏览器对「Ollama 服务没起」和「跨域被拦」抛出的是同一句 `Failed to fetch`——从脚本里
 * 分辨不出是哪一个。所以两种情况给同一条提示，让用户两项都查。
 *
 * `connection error` 是 openai SDK 把 fetch 失败包成 APIConnectionError 之后的措辞。
 */
const CONNECTION_PATTERN = /failed to fetch|networkerror|load failed|connection error|econnrefused/i;

function asError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

function statusOf(error: unknown): number | undefined {
    if (typeof error !== 'object' || error === null) return undefined;
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : undefined;
}

/**
 * 把错误链上各层的 message 拼起来找特征。openai SDK 会把原始错误塞进 `cause`，
 * 只看最外层会漏掉 `Failed to fetch`。
 */
function messageChain(error: unknown, depth = 0): string {
    if (depth > 3 || typeof error !== 'object' || error === null) return '';
    const own = error instanceof Error ? error.message : '';
    return `${own} ${messageChain((error as { cause?: unknown }).cause, depth + 1)}`;
}

/**
 * 把 Ollama 的失败翻译成用户能照着做的中文提示。非 Ollama provider、以及认不出的
 * 失败一律原样透出——不吞错误是这一层的底线。
 *
 * 存在的理由：这几个失败点从界面看几乎一样（AI 不回话），但处理和排查方式完全不同。
 */
export function friendlyAIError(
    error: unknown,
    config: Pick<AIConfig, 'provider' | 'baseUrl' | 'model'>,
): Error {
    const original = asError(error);
    if (config.provider !== 'ollama') return original;

    const message = messageChain(error);

    if (CONNECTION_PATTERN.test(message)) {
        const endpoint = config.baseUrl || 'http://localhost:11434/v1';
        return new Error(
            `无法连接本地 Ollama（${endpoint}）。请确认：\n` +
                '· ollama serve 正在运行\n' +
                '· OLLAMA_ORIGINS 已包含本站域名——Ollama 默认只放行 127.0.0.1 与 0.0.0.0，' +
                '未放行时浏览器会把跨域拦截报成同样的连接失败',
        );
    }

    if (statusOf(error) === 404 || /not found/i.test(message)) {
        return new Error(
            `找不到模型「${config.model}」，先在终端执行：ollama pull ${config.model}`,
        );
    }

    return original;
}
