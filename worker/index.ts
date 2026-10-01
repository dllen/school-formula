import { handleAuth } from './routes/auth';
import { handleUser } from './routes/user';
import { handleAI } from './routes/ai';
import { hostRedirect, legacyViewRedirect } from './lib/redirect';
import { assetCandidates, isSeoFile } from './lib/static-paths';
import type { Env } from './types';

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function getAllowedOrigins(env: Env): string[] {
  const origins = env.ALLOWED_ORIGINS
    ? normalizeOrigin(env.ALLOWED_ORIGINS).split(',').filter(Boolean)
    : [];
  if (env.FRONTEND_URL && !origins.includes(normalizeOrigin(env.FRONTEND_URL))) {
    origins.push(normalizeOrigin(env.FRONTEND_URL));
  }
  return origins;
}

function getAllowedOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get('Origin');
  if (!requestOrigin) return env.FRONTEND_URL;

  const normalizedRequest = normalizeOrigin(requestOrigin);
  const allowedOrigins = getAllowedOrigins(env);
  return allowedOrigins.includes(normalizedRequest)
    ? normalizedRequest
    : env.FRONTEND_URL;
}

async function serveStatic(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  for (const candidate of assetCandidates(url.pathname)) {
    try {
      const response = await env.ASSETS.fetch(new Request(url.origin + candidate, request));
      if (response.status === 404) continue;
      // robots.txt / sitemap.xml must be the real files: a missing file must 404 rather
      // than let the assets SPA fallback return the app shell (which crawlers can't read).
      if (isSeoFile(candidate) && (response.headers.get('Content-Type') ?? '').includes('text/html')) {
        continue;
      }
      return response;
    } catch {
      // 尝试下一个候选
    }
  }
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsOrigin = getAllowedOrigin(request, env);

    const redirect = hostRedirect(url) ?? (request.method === 'GET' ? legacyViewRedirect(url) : null);
    if (redirect) {
      return Response.redirect(redirect, 301);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Content-Type': 'application/json',
    };

    try {
      let response: Response;

      if (path.startsWith('/api/auth/')) {
        response = await handleAuth(request, env, path);
      } else if (path.startsWith('/api/user/')) {
        response = await handleUser(request, env, path);
      } else if (path.startsWith('/api/ai/')) {
        response = await handleAI(request, env);
      } else if (path === '/api/health') {
        response = new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      } else {
        response = await serveStatic(request, env);
        return response;
      }

      const newHeaders = new Headers(response.headers);
      // 只补 CORS 头；Content-Type 由各路由自己设置（如 SSE 流是 text/event-stream），不覆盖
      newHeaders.set('Access-Control-Allow-Origin', corsOrigin);
      if (!newHeaders.has('Content-Type')) {
        newHeaders.set('Content-Type', 'application/json');
      }
      return new Response(response.body, { status: response.status, headers: newHeaders });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return new Response(JSON.stringify({ error: message }), { status: 500, headers: corsHeaders });
    }
  },
};
