export const ACCESS_TOKEN_KEY = 'sf_access_token';
export const REFRESH_TOKEN_KEY = 'sf_refresh_token';

import { storageGet, storageSet, storageRemove } from './storage';

// access token 内存缓存：token 双写（内存 + localStorage），每次读取走内存，
// 避免高频请求的 localStorage 同步 IO；clearToken 同步置空
let memoryAccess: string | null = null;

export function getToken(): string | null {
  return memoryAccess ?? storageGet(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  memoryAccess = token;
  storageSet(ACCESS_TOKEN_KEY, token);
}

export function clearToken(): void {
  memoryAccess = null;
  storageRemove(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return storageGet(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  storageSet(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  storageRemove(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
