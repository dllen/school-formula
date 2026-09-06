import type { Env } from '../types';
import { verifyJWT } from '../lib/jwt';
import { hasTierAccess } from './user';

function jsonResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleAI(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 验证 JWT
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('未登录', 401);
  }

  const payload = await verifyJWT(authHeader.slice(7), env);
  if (!payload) return errorResponse('令牌无效或已过期', 401);

  // 检查 Pro 权限
  if (!hasTierAccess(payload.tier, 'pro')) {
    return errorResponse('此功能需要 Pro 会员', 403, 'UPGRADE_REQUIRED');
  }

  // AI 生成代理（服务端托管 API Key）
  if (path === '/api/ai/generate') {
    const body = await request.json().catch(() => null) as { prompt?: string; model?: string } | null;
    if (!body?.prompt) return errorResponse('缺少 prompt');

    // TODO: 调用 OpenAI/DeepSeek API（用服务端配置的 Key）
    // 当前返回占位
    return jsonResponse({
      result: 'AI 功能即将上线，敬请期待',
      model: body.model || 'default',
    });
  }

  return errorResponse('未找到端点', 404);
}
