import type { Env, UserResponse } from '../types';
import { signJWT, verifyJWT, generateRefreshToken } from '../lib/jwt';
import { hashPassword, verifyPassword } from '../lib/password';
import { generateVerificationCode, sendVerificationEmail } from '../lib/email';

function jsonResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 400, code?: string): Response {
  return new Response(JSON.stringify({ error, code }), {
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handleAuth(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const endpoint = path.replace('/api/auth/', '');

  // POST /api/auth/register
  if (endpoint === 'register' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body?.password) {
      return errorResponse('邮箱和密码不能为空');
    }
    if (!EMAIL_REGEX.test(body.email)) {
      return errorResponse('邮箱格式不正确');
    }
    if (body.password.length < 8) {
      return errorResponse('密码至少 8 位');
    }

    // 检查邮箱是否已注册
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (existing) {
      return errorResponse('该邮箱已被注册', 409, 'EMAIL_TAKEN');
    }

    // 创建用户（方案 2：注册免验证，邮箱仅用于找回，直接激活）
    const userId = crypto.randomUUID().replace(/-/g, '');
    const passwordHash = await hashPassword(body.password);
    await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, email_verified) VALUES (?, ?, ?, 1)'
    )
      .bind(userId, body.email.toLowerCase(), passwordHash)
      .run();

    // 记录注册日志
    await env.DB.prepare(
      'INSERT INTO login_logs (user_id, email, success, ip, user_agent) VALUES (?, ?, 1, ?, ?)'
    )
      .bind(userId, body.email.toLowerCase(), request.headers.get('cf-connecting-ip') || '', request.headers.get('user-agent') || '')
      .run();

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) return errorResponse('注册失败，请重试', 500);

    // 注册即登录：签发 access + refresh
    const access = await signJWT(user.id as string, user.tier as string, env);
    const refresh = generateRefreshToken();
    const refreshHash = await hashToken(refresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(user.id as string, refreshHash, refreshExpires)
      .run();

    return jsonResponse({
      user: toUserResponse(user),
      tokens: { access, refresh },
    });
  }

  // POST /api/auth/login
  if (endpoint === 'login' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body?.password) {
      return errorResponse('邮箱和密码不能为空');
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) {
      return errorResponse('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(body.password, user.password_hash as string);
    if (!valid) {
      return errorResponse('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');
    }
    if (!user.email_verified) {
      return errorResponse('请先验证邮箱', 403, 'EMAIL_NOT_VERIFIED');
    }

    const access = await signJWT(user.id as string, user.tier as string, env);
    const refresh = generateRefreshToken();
    const refreshHash = await hashToken(refresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(user.id as string, refreshHash, refreshExpires)
      .run();

    // 记录登录日志
    await env.DB.prepare(
      'INSERT INTO login_logs (user_id, email, success, ip, user_agent) VALUES (?, ?, 1, ?, ?)'
    )
      .bind(user.id as string, body.email.toLowerCase(), request.headers.get('cf-connecting-ip') || '', request.headers.get('user-agent') || '')
      .run();

    return jsonResponse({
      user: toUserResponse(user),
      tokens: { access, refresh },
    });
  }

  // POST /api/auth/refresh
  if (endpoint === 'refresh' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { refresh?: string } | null;
    if (!body?.refresh) return errorResponse('缺少刷新令牌');

    const refreshHash = await hashToken(body.refresh);
    const session = await env.DB.prepare(
      'SELECT s.*, u.tier FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.refresh_token_hash = ? AND s.expires_at > ?'
    )
      .bind(refreshHash, new Date().toISOString())
      .first<{ user_id: string; tier: string }>();

    if (!session) return errorResponse('无效的刷新令牌', 401, 'INVALID_REFRESH');

    // 轮换：删除旧 refresh，发新的
    await env.DB.prepare('DELETE FROM sessions WHERE refresh_token_hash = ?')
      .bind(refreshHash)
      .run();

    const access = await signJWT(session.user_id, session.tier, env);
    const newRefresh = generateRefreshToken();
    const newRefreshHash = await hashToken(newRefresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(session.user_id, newRefreshHash, refreshExpires)
      .run();

    return jsonResponse({ tokens: { access, refresh: newRefresh } });
  }

  // POST /api/auth/logout
  if (endpoint === 'logout' && request.method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const payload = await verifyJWT(authHeader.slice(7), env);
      if (payload) {
        // 删除该用户所有会话
        await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?')
          .bind(payload.sub)
          .run();
      }
    }
    return jsonResponse({ message: '已登出' });
  }

  // POST /api/auth/forgot
  if (endpoint === 'forgot' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string } | null;
    if (!body?.email) return errorResponse('邮箱不能为空');

    const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) {
      // 不泄露邮箱是否存在
      return jsonResponse({ message: '如果邮箱存在，验证码已发送' });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO email_verifications (email, code, purpose, expires_at) VALUES (?, ?, ?, ?)'
    )
      .bind(body.email.toLowerCase(), code, 'reset_password', expiresAt)
      .run();

    await sendVerificationEmail(body.email.toLowerCase(), code, env);
    return jsonResponse({ message: '如果邮箱存在，验证码已发送' });
  }

  // POST /api/auth/reset
  if (endpoint === 'reset' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; code?: string; password?: string } | null;
    if (!body?.email || !body?.code || !body?.password) {
      return errorResponse('邮箱、验证码和新密码不能为空');
    }
    if (body.password.length < 8) {
      return errorResponse('密码至少 8 位');
    }

    const record = await env.DB.prepare(
      'SELECT code, expires_at FROM email_verifications WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1'
    )
      .bind(body.email.toLowerCase(), 'reset_password')
      .first<{ code: string; expires_at: string }>();

    if (!record || record.code !== body.code) {
      return errorResponse('验证码错误', 400, 'INVALID_CODE');
    }
    if (new Date(record.expires_at) < new Date()) {
      return errorResponse('验证码已过期', 400, 'CODE_EXPIRED');
    }

    const newHash = await hashPassword(body.password);
    await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?')
      .bind(newHash, new Date().toISOString(), body.email.toLowerCase())
      .run();

    await env.DB.prepare('DELETE FROM email_verifications WHERE email = ?')
      .bind(body.email.toLowerCase())
      .run();

    return jsonResponse({ message: '密码重置成功' });
  }

  return errorResponse('未找到端点', 404);
}
