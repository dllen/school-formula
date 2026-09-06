import type { Env, UserResponse } from '../types';
import { verifyJWT } from '../lib/jwt';

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

function toUserResponse(row: Record<string, unknown>): UserResponse {
  return {
    id: row.id as string,
    email: row.email as string,
    nickname: (row.nickname as string) || null,
    avatar_url: (row.avatar_url as string) || null,
    tier: row.tier as 'free' | 'plus' | 'pro',
    email_verified: !!(row.email_verified as number),
  };
}

async function getAuthenticatedUser(request: Request, env: Env): Promise<UserResponse | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const payload = await verifyJWT(authHeader.slice(7), env);
  if (!payload) return null;

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(payload.sub)
    .first();
  if (!user) return null;

  return toUserResponse(user);
}

const TIER_ORDER = { free: 0, plus: 1, pro: 2 };
export function hasTierAccess(userTier: string, requiredTier: string): boolean {
  return TIER_ORDER[userTier as keyof typeof TIER_ORDER] >= TIER_ORDER[requiredTier as keyof typeof TIER_ORDER];
}

export async function handleUser(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const endpoint = path.replace('/api/user/', '');
  const user = await getAuthenticatedUser(request, env);

  // GET /api/user/me
  if (endpoint === 'me' && request.method === 'GET') {
    if (!user) return errorResponse('未登录', 401);
    return jsonResponse({ user });
  }

  // PUT /api/user/config
  if (endpoint === 'config' && request.method === 'PUT') {
    if (!user) return errorResponse('未登录', 401);
    const body = await request.json().catch(() => null) as { nickname?: string } | null;

    if (body?.nickname !== undefined) {
      await env.DB.prepare('UPDATE users SET nickname = ?, updated_at = ? WHERE id = ?')
        .bind(body.nickname, new Date().toISOString(), user.id)
        .run();
    }

    const updated = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(user.id)
      .first();
    return jsonResponse({ user: toUserResponse(updated!) });
  }

  return errorResponse('未找到端点', 404);
}
