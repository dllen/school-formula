import { handleAuth } from './routes/auth';
import { handleUser } from './routes/user';
import { handleAI } from './routes/ai';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

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
      if (path.startsWith('/api/auth/')) {
        response = await handleAuth(request, env, path);
      } else if (path.startsWith('/api/user/')) {
        response = await handleUser(request, env, path);
      } else if (path.startsWith('/api/ai/')) {
        response = await handleAI(request, env, path);
      } else if (path === '/api/health') {
        response = new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      } else {
        response = new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
      }

      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, { status: response.status, headers: newHeaders });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return new Response(JSON.stringify({ error: message }), { status: 500, headers: corsHeaders });
    }
  },
};
