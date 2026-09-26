import { getToken } from '../utils/jwt';
import { API_BASE } from './api-base';

export interface GatewayRequest {
    prompt: string;
    model?: string;
    stream?: boolean;
}

/**
 * 解析 SSE 文本流，逐 chunk 回调 content。
 * 每行格式: "data: {"choices":[{"delta":{"content":"..."}}]}"
 * 遇 "data: [DONE]" 结束。
 */
async function parseSSEStream(
    body: ReadableStream<Uint8Array>,
    onStream: (chunk: string) => void,
): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') return fullContent;
            try {
                const json = JSON.parse(payload);
                const content = json.choices?.[0]?.delta?.content ?? '';
                if (content) {
                    fullContent += content;
                    onStream(content);
                }
            } catch {
                // 忽略非 JSON 行（如空 data:）
            }
        }
    }
    return fullContent;
}

/**
 * 调用 worker /api/ai/gateway 端点（需 JWT）。
 * 流式默认开启，逐 chunk 回调 onStream。
 * 出错时 throw Error（含 worker 返回的 code 字段）。
 */
export async function callGateway(
    request: GatewayRequest,
    onStream: (chunk: string) => void,
): Promise<string> {
    const token = getToken();
    if (!token) {
        throw new Error('未登录，请先登录后使用 AI 功能');
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${API_BASE}/api/ai/gateway`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt: request.prompt,
                model: request.model ?? '',
                stream: request.stream ?? true,
            }),
        });
    } catch {
        throw new Error('AI 服务网络请求失败，请检查网络后重试');
    }

    if (!upstream.ok) {
        let detail = `status=${upstream.status}`;
        try {
            const errBody = (await upstream.json()) as { error?: string; code?: string };
            detail = errBody.error ?? detail;
            if (errBody.code) detail += ` (${errBody.code})`;
        } catch { /* ignore */ }
        throw new Error(detail);
    }

    if (!upstream.body) {
        throw new Error('AI 服务返回空响应');
    }

    return parseSSEStream(upstream.body, onStream);
}


export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatGatewayRequest {
    messages: ChatMessage[];
    model?: string;
    stream?: boolean;
}

/**
 * 调用 worker /api/ai/gateway 端点进行多轮对话（需 JWT）。
 * 与 callGateway 不同，此函数发送完整 messages 数组以支持上下文记忆。
 */
export async function chatGateway(
    request: ChatGatewayRequest,
    onStream: (chunk: string) => void,
): Promise<string> {
    const token = getToken();
    if (!token) {
        throw new Error('未登录，请先登录后使用 AI 功能');
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${API_BASE}/api/ai/gateway`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                messages: request.messages,
                model: request.model ?? '',
                stream: request.stream ?? true,
            }),
        });
    } catch {
        throw new Error('AI 服务网络请求失败，请检查网络后重试');
    }

    if (!upstream.ok) {
        let detail = `status=${upstream.status}`;
        try {
            const errBody = (await upstream.json()) as { error?: string; code?: string };
            detail = errBody.error ?? detail;
            if (errBody.code) detail += ` (${errBody.code})`;
        } catch { /* ignore */ }
        throw new Error(detail);
    }

    if (!upstream.body) {
        throw new Error('AI 服务返回空响应');
    }

    return parseSSEStream(upstream.body, onStream);
}
