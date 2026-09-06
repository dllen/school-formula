import { handleAuth } from './routes/auth';
import { handleUser } from './routes/user';
import { handleAI } from './routes/ai';
import type { Env } = './types';

async function serveStatic(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // For non-file paths (SPA routes), serve index.html
    if (!path.includes('.')) {
      return await env.ASSETS.fetch(url.origin + '/index.html');
    }
    return await env.ASSETS.fetch(request);
  } catch {
    // Fallback to index.html for SPA routing
    try {
      return await env.ASSETS.fetch(url.origin + '/index.html');
    } catch {
      return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.FRONTEND_URL,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': env.FRONTEND_URL,
      'Content-Type': 'application/json',
    };

    try {
      let response: Response;

      // API routes
      if (path.startsWith('/api/auth/')) {
        response = await handleAuth(request, env, path);
      } else if (path.startsWith('/api/user/')) {
        response = await handleUser(request, env, path);
      } else if (path.startsWith('/api/ai/')) {
        response = await handleAI(request, env, path);
      } else if (path === '/api/health') {
        response = new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      } else {
        // Serve static assets (frontend)
        response = await serveStatic(request, env);
        return response;
      }

      // Add CORS headers to API responses
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, { status: response.status, headers: newHeaders });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return new Response(JSON.stringify({ error: message }), { status: 500, headers: corsHeaders });
    }
  },
};
