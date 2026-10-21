import { handleAuth } from './routes/auth';
import { handleUser } from './routes/user';
import { handleAI } from './routes/ai';
import { hostRedirect, isRedirectableMethod, legacyReferenceRedirect, legacyViewRedirect } from './lib/redirect';
import { assetCandidates, isSeoFile } from './lib/static-paths';
import { cacheControlFor } from './lib/cache';
import type { Env, ExecutionContext } from './types';

/** 404 响应体。刻意不用应用外壳——软 404 会被爬虫当作可索引的薄页面。 */
function notFoundBody(): string {
  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Page not found</title>',
    '</head><body><h1>Page not found</h1>',
    '<p>This page does not exist. <a href="/en/">Browse the reference charts</a>.</p>',
    '</body></html>',
  ].join('');
}

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
  return new Response(notFoundBody(), {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/**
 * 边缘缓存：把 prerendered HTML 写到 `caches.default`，给所有响应加 `Cache-Control` 头。
 * 只缓存 GET 的、成功的、HTML 响应；`/api/*` 和非 GET 不缓存（auth/session 语义必须
 * 不被 CDN 持有）。缓存键用 `url.origin + path`，剥掉 query 以避免每个 query 都生
 * 一份单独的缓存条目。
 *
 * 在 Node 测试环境下没有 `caches`，所有分支都用 `typeof` 守卫跳过。
 */
async function applyEdgeCache(
  request: Request,
  url: URL,
  response: Response,
  ctx: ExecutionContext,
): Promise<Response> {
  const contentType = response.headers.get('Content-Type') ?? '';
  const cacheControl = cacheControlFor(url.pathname, contentType);
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Cache-Control', cacheControl);
  const built = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });

  // 只缓存 GET HTML 响应；其它情况直接返回带头的副本。
  const isHtml = contentType.includes('text/html');
  const isGet = request.method === 'GET';
  const cacheable = isGet && isHtml && response.ok;
  if (!cacheable || typeof caches === 'undefined' || !caches.default) {
    return built;
  }

  const cacheKey = new Request(url.origin + url.pathname);
  const cached = await caches.default.match(cacheKey);
  if (cached) {
    const hitHeaders = new Headers(cached.headers);
    hitHeaders.set('X-Cache', 'HIT');
    hitHeaders.set('Cache-Control', cacheControl);
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers: hitHeaders,
    });
  }

  // 命中失败：clone 一个写入缓存，原响应（body 流）照常返回给客户端。
  const clone = built.clone();
  ctx.waitUntil(caches.default.put(cacheKey, clone));
  return built;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsOrigin = getAllowedOrigin(request, env);

    const legacyRedirect = isRedirectableMethod(request.method)
      ? (legacyReferenceRedirect(url) ?? legacyViewRedirect(url))
      : null;
    const redirect = hostRedirect(url) ?? legacyRedirect;
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
        response = await handleAI(request, env, ctx);
      } else if (path === '/api/health/db') {
        // TEMP DIAGNOSTIC — remove after checking D1 state in production.
        try {
          const result = await env.DB.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
          ).all();
          const tables = (result.results as Array<{ name: string }>).map((row) => row.name);
          response = new Response(JSON.stringify({ ok: true, tables }), { headers: corsHeaders });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          response = new Response(JSON.stringify({ ok: false, error: message }), { headers: corsHeaders });
        }
      } else if (path === '/api/health') {
        response = new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      } else {
        response = await serveStatic(request, env);
        return await applyEdgeCache(request, url, response, ctx);
      }

      const newHeaders = new Headers(response.headers);
      // 只补 CORS 头；Content-Type 由各路由自己设置（如 SSE 流是 text/event-stream），不覆盖
      newHeaders.set('Access-Control-Allow-Origin', corsOrigin);
      if (!newHeaders.has('Content-Type')) {
        newHeaders.set('Content-Type', 'application/json');
      }
      return new Response(response.body, { status: response.status, headers: newHeaders });
    } catch (err) {
      // 故意不回传 err.message：它可能包含 D1 / KV / 上游 AI 网关的内部细节
      // （路径、token、上游错误体），对客户端没有用处，又会泄漏 PII / 内部拓扑。
      // 仍然在服务端用 console.error 留出可观测性。
      console.error('worker fetch error', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: corsHeaders });
    }
  },
};
