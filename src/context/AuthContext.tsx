import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
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
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
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

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
      } else if (resp.status === 401) {
        const refreshed = await tryRefresh();
        if (!refreshed) {
          clearToken();
          clearRefreshToken();
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [tryRefresh]);

  useEffect(() => {
    const load = async () => { await refreshUser(); };
    load();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '登录失败' }));
      throw new Error(err.error || '登录失败');
    }
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
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '注册失败' }));
      throw new Error(err.error || '注册失败');
    }
    return resp.json();
  }, []);

  const verify = useCallback(async (email: string, code: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '验证失败' }));
      throw new Error(err.error || '验证失败');
    }
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
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '重发失败' }));
      throw new Error(err.error || '重发失败');
    }
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
    logout,
    refreshUser,
  }), [user, isLoading, login, register, verify, resendCode, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
