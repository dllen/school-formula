import { getToken } from '../utils/jwt';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  verify: (email: string, code: string) =>
    apiFetch('/api/auth/verify', { method: 'POST', body: JSON.stringify({ email, code }) }),

  resend: (email: string) =>
    apiFetch('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email }) }),

  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),

  forgot: (email: string) =>
    apiFetch('/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) }),

  reset: (email: string, code: string, password: string) =>
    apiFetch('/api/auth/reset', { method: 'POST', body: JSON.stringify({ email, code, password }) }),

  getMe: () => apiFetch('/api/user/me'),

  updateConfig: (data: Record<string, unknown>) =>
    apiFetch('/api/user/config', { method: 'PUT', body: JSON.stringify(data) }),
};
