import { describe, expect, it } from 'vitest';
import worker from './index';
import type { Env } from './types';

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

function get(path: string, env: Env): Promise<Response> {
  return worker.fetch(new Request(`https://syy.global${path}`), env);
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
