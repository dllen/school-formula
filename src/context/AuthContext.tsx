import { useState, useEffect, useCallback, useMemo, useContext, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { getToken, setToken, clearToken, getRefreshToken, setRefreshToken, clearRefreshToken } from '../utils/jwt';

export interface User {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  tier: 'free' | 'plus' | 'pro';
  email_verified: boolean;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ email: string }>;
  verify: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// API base 优先级：VITE_API_BASE（新）> VITE_API_URL（旧/开发 proxy）> 按域名推导（多域名生产环境）
const API_BASE: string =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  `https://api.${location.hostname}`;

// 并发刷新排队：多个请求同时 401 时只发一次 refresh（后端 refresh 轮换会删旧 token，并发会互相踩）
let refreshPromise: Promise<boolean> | null = null;

async function consumeRefresh(doRefresh: () => Promise<boolean>): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 真正的 refresh：用 refresh token 换新 access（轮换）
  const doRefresh = useCallback(async (): Promise<boolean> => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const resp = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setToken(data.tokens.access);
        setRefreshToken(data.tokens.refresh);
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, []);

  // 通用 API 封装：自动附加 Bearer；401 时排队 refresh 并重放一次
  const apiFetch = useCallback(async (path: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers);
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (resp.status !== 401 || !token) return resp;
    const refreshed = await consumeRefresh(doRefresh);
    if (!refreshed) {
      clearToken();
      clearRefreshToken();
      setUser(null);
      return resp; // 返回原始 401
    }
    const retryHeaders = new Headers(options.headers);
    retryHeaders.set('Authorization', `Bearer ${getToken()}`);
    return fetch(`${API_BASE}${path}`, { ...options, headers: retryHeaders });
  }, [doRefresh]);

  const refreshUser = useCallback(async () => {
    const resp = await apiFetch('/api/user/me');
    if (resp.ok) {
      setUser((await resp.json()).user);
    } else {
      // apiFetch 内部已在 refresh 失败时清状态；此处兜底单次 401
      setUser(null);
    }
    setIsLoading(false);
  }, [apiFetch]);

  useEffect(() => {
    const load = async () => { await refreshUser(); };
    load();
  }, [refreshUser]);

  // 统一错误处理：透传后端 { error, code } + HTTP status
  const throwError = async (resp: Response, fallback: string): Promise<never> => {
    const err = await resp.json().catch(() => ({ error: fallback }));
    const e = new Error(err.error || fallback) as Error & { code?: string; status?: number };
    e.code = err.code;
    e.status = resp.status;
    throw e;
  };

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) await throwError(resp, '登录失败');
    const data = await resp.json();
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) await throwError(resp, '注册失败');
    return resp.json() as Promise<{ email: string }>;
  }, []);

  const verify = useCallback(async (email: string, code: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!resp.ok) await throwError(resp, '验证失败');
    const data = await resp.json();
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, []);

  const resendCode = useCallback(async (email: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) await throwError(resp, '重发失败');
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) await throwError(resp, '发送失败');
  }, []);

  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    });
    if (!resp.ok) await throwError(resp, '重置失败');
  }, []);

  const logout = useCallback(() => {
    const token = getToken();
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearToken();
    clearRefreshToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verify,
    resendCode,
    forgotPassword,
    resetPassword,
    logout,
    refreshUser,
  }), [user, isLoading, login, register, verify, resendCode, forgotPassword, resetPassword, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
