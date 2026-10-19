import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import worker from './index';
import type { Env, ExecutionContext } from './types';

/** Files the mock assets binding serves; anything else triggers the SPA fallback. */
type Assets = Record<string, { body: string; contentType: string }>;

function makeEnv(assets: Assets): Env {
  return {
    FRONTEND_URL: 'https://syy.global',
    ALLOWED_ORIGINS: 'https://syy.global',
    ASSETS: {
      fetch: async (request: Request) => {
        const { pathname } = new URL(request.url);
        const file = assets[pathname];
        if (file) {
          return new Response(file.body, {
            status: 200,
            headers: { 'Content-Type': file.contentType },
          });
        }
        // Cloudflare assets SPA fallback: unknown paths return the app shell.
        return new Response('<!doctype html><html><body>app shell</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      },
    },
  } as unknown as Env;
}

/**
 * `ctx` 是边缘执行上下文。生产里它来自 Cloudflare 运行时；测试里只要满足
 * `applyEdgeCache` 用到的最小面（waitUntil / passThroughOnException）即可。
 */
function makeCtx(): ExecutionContext & { waitUntilCalls: Promise<unknown>[] } {
  const waitUntilCalls: Promise<unknown>[] = [];
  return {
    waitUntil(promise: Promise<unknown>) {
      waitUntilCalls.push(promise);
    },
    passThroughOnException() {},
    waitUntilCalls,
  };
}

function get(path: string, env: Env, ctx?: ExecutionContext): Promise<Response> {
  return worker.fetch(
    new Request(`https://syy.global${path}`),
    env,
    ctx ?? makeCtx(),
  );
}

describe('worker static serving', () => {
  it('serves the generated robots.txt and sitemap.xml verbatim', async () => {
    const env = makeEnv({
      '/robots.txt': { body: 'User-agent: *\nAllow: /\n', contentType: 'text/plain' },
      '/sitemap.xml': { body: '<?xml version="1.0"?><urlset></urlset>', contentType: 'application/xml' },
    });
    expect(await (await get('/robots.txt', env)).text()).toContain('User-agent: *');
    expect((await get('/sitemap.xml', env)).headers.get('Content-Type')).toContain('xml');
  });

  it('404s a missing SEO file instead of falling back to the app shell', async () => {
    const env = makeEnv({});
    const robots = await get('/robots.txt', env);
    expect(robots.status).toBe(404);
    expect(await robots.text()).not.toContain('app shell');
    expect((await get('/sitemap.xml', env)).status).toBe(404);
  });

  it('still falls back to the SPA shell for unknown app routes', async () => {
    const env = makeEnv({});
    const response = await get('/some-client-route', env);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('app shell');
  });

  it('serves a prerendered page when the directory index exists', async () => {
    const env = makeEnv({
      '/tutorial/index.html': { body: '<html><body><h1>系统教程</h1></body></html>', contentType: 'text/html' },
    });
    expect(await (await get('/tutorial', env)).text()).toContain('系统教程');
  });

  it('keeps the JSON health endpoint working', async () => {
    const response = await get('/api/health', makeEnv({}));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});

/**
 * 边缘缓存：HTML 走 CDN-shared cache（`s-maxage=3600` + `stale-while-revalidate`），
 * hashed assets 走 `immutable` 长期缓存，`/api/*` 永不缓存。
 *
 * 用最小内存 fake 替换 Cloudflare 的 `caches.default`：每条 case 自己定义 match/put
 * 行为，再断言 Cache-Control 头。
 */
describe('worker edge caching', () => {
  const originalCaches = (globalThis as { caches?: unknown }).caches;

  beforeEach(() => {
    (globalThis as { caches?: unknown }).caches = undefined;
  });

  afterEach(() => {
    if (originalCaches === undefined) {
      delete (globalThis as { caches?: unknown }).caches;
    } else {
      (globalThis as { caches?: unknown }).caches = originalCaches;
    }
  });

  it('sets shared CDN cache headers on prerendered HTML', async () => {
    const env = makeEnv({
      '/en/math/multiplication-chart/index.html': {
        body: '<html><body>chart</body></html>',
        contentType: 'text/html; charset=utf-8',
      },
    });
    const response = await get('/en/math/multiplication-chart/', env);
    const cacheControl = response.headers.get('Cache-Control') ?? '';
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate');
  });

  it('sets a long immutable cache header on hashed assets', async () => {
    const env = makeEnv({
      '/assets/index-abc123.js': {
        body: 'console.log("x");',
        contentType: 'application/javascript',
      },
    });
    const response = await get('/assets/index-abc123.js', env);
    const cacheControl = response.headers.get('Cache-Control') ?? '';
    expect(cacheControl).toContain('immutable');
    expect(cacheControl).toContain('max-age=31536000');
  });

  it('writes GET HTML responses to caches.default via ctx.waitUntil', async () => {
    const stored = new Map<string, Response>();
    (globalThis as unknown as { caches: { default: Cache } }).caches = {
      default: {
        match: async (key: Request) => stored.get(key.url),
        put: async (key: Request, value: Response) => {
          stored.set(key.url, value);
        },
      },
    };
    const env = makeEnv({
      '/en/math/multiplication-chart/index.html': {
        body: '<html><body>chart</body></html>',
        contentType: 'text/html; charset=utf-8',
      },
    });
    const ctx = makeCtx();
    await get('/en/math/multiplication-chart/', env, ctx);
    // waitUntil 是 fire-and-forget；waitUntilCalls 拿到写入 promise 后 await 让 put 真正完成。
    await Promise.all(ctx.waitUntilCalls);
    expect(stored.size).toBe(1);
    const cached = stored.get('https://syy.global/en/math/multiplication-chart/');
    expect(cached).toBeDefined();
    expect(cached?.headers.get('Cache-Control')).toContain('s-maxage=3600');
  });

  it('serves a cache HIT with the X-Cache header on a repeat GET', async () => {
    const cached = new Response('<html><body>cached chart</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
    (globalThis as unknown as { caches: { default: Cache } }).caches = {
      default: {
        match: async () => cached,
        put: async () => undefined,
      },
    };
    const env = makeEnv({
      '/en/math/multiplication-chart/index.html': {
        body: '<html><body>fresh</body></html>',
        contentType: 'text/html; charset=utf-8',
      },
    });
    const response = await get('/en/math/multiplication-chart/', env);
    expect(response.headers.get('X-Cache')).toBe('HIT');
    expect(await response.text()).toContain('cached chart');
  });
});
