import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User } from './auth-context';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  getToken,
  setToken,
  clearToken,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
} from '../utils/jwt';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/** 后端认证成功响应：{ user, tokens: { access, refresh } } */
interface AuthSuccessResponse {
  user: User;
  tokens: { access: string; refresh: string };
}

/** 后端用户信息响应：{ user } */
interface UserResponse {
  user: User;
}

// 多域名生产环境映射：站点域名 → API 域名
const API_DOMAIN_MAP: Record<string, string> = {
  'syy.one': 'api.syy.one',
  'syy.global': 'api.syy.global',
  'syy.mobi': 'api.syy.mobi',
};

function resolveApiBase(): string {
  const hostname = location.hostname;
  for (const [suffix, apiDomain] of Object.entries(API_DOMAIN_MAP)) {
    if (hostname === suffix || hostname.endsWith(`.${suffix}`)) {
      return `https://${apiDomain}`;
    }
  }
  return `https://api.${hostname}`;
}

// API base 优先级：VITE_API_BASE（新）> VITE_API_URL（旧/开发 proxy）> 按域名推导（多域名生产环境）
const API_BASE: string =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  resolveApiBase();

// 并发刷新排队：多个请求同时 401 时只发一次 refresh（后端 refresh 轮换会删旧 token，并发会互相踩）
let refreshPromise: Promise<boolean> | null = null;

async function consumeRefresh(doRefresh: () => Promise<boolean>): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 真正的 refresh：用 refresh token 换新 access（轮换）
  // I2: 写入前校验 token 未被 logout/新登录改变（防止 logout-racing 与多标签页双轮换踩踏）
  // I4: getRefreshToken 移入 try（隐私模式 storage 拒绝时不会让 refresh promise reject）
  const doRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const sent = getRefreshToken();
      if (!sent) return false;
      const resp = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: sent }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as AuthSuccessResponse;
        if (getRefreshToken() === sent) {
          setToken(data.tokens.access);
          setRefreshToken(data.tokens.refresh);
          return true;
        }
      }
    } catch {
      /* ignore */
    }
    return false;
  }, []);

  // 通用 API 封装：自动附加 Bearer；401 时排队 refresh 并重放一次
  // I3: 重放再 401 → 清状态（spec §3.4.5）
  const apiFetch = useCallback(
    async (path: string, options: RequestInit = {}): Promise<Response> => {
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
      const retryResp = await fetch(`${API_BASE}${path}`, { ...options, headers: retryHeaders });
      if (retryResp.status === 401) {
        clearToken();
        clearRefreshToken();
        setUser(null);
      }
      return retryResp;
    },
    [doRefresh],
  );

  // I1: try/catch/finally —— 网络异常或畸形 JSON 时 isLoading 不会卡死，无 unhandled rejection
  const refreshUser = useCallback(async () => {
    try {
      const resp = await apiFetch('/api/user/me');
      if (resp.ok) {
        const data = (await resp.json()) as UserResponse;
        setUser(data.user);
      } else {
        // apiFetch 内部已在 refresh 失败时清状态；此处兜底单次 401
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  // 启动恢复会话（refresh → getMe）
  useEffect(() => {
    const load = async () => {
      await refreshUser();
    };
    load();
  }, [refreshUser]);

  // spec §4.3: 多标签页同步 —— A 标签页登录/登出 → storage 事件 → B 标签页同步状态
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === REFRESH_TOKEN_KEY) {
        if (e.newValue) {
          refreshUser();
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refreshUser]);

  // M2: throwError 用 useCallback 包裹，与兄弟回调形状一致
  const throwError = useCallback(async (resp: Response, fallback: string): Promise<never> => {
    const err = await resp.json().catch(() => ({ error: fallback }));
    const e = new Error(err.error || fallback) as Error & { code?: string; status?: number };
    e.code = err.code;
    e.status = resp.status;
    throw e;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) await throwError(resp, '登录失败');
    const data = (await resp.json()) as AuthSuccessResponse;
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, [throwError]);

  // 方案 2：注册免邮箱验证，后端直接签发 token；注册即登录
  const register = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) await throwError(resp, '注册失败');
    const data = (await resp.json()) as AuthSuccessResponse;
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, [throwError]);

  const forgotPassword = useCallback(async (email: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) await throwError(resp, '发送失败');
  }, [throwError]);

  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    });
    if (!resp.ok) await throwError(resp, '重置失败');
  }, [throwError]);

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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, forgotPassword, resetPassword, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
