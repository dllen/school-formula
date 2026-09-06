export const ACCESS_TOKEN_KEY = 'sf_access_token';
export const REFRESH_TOKEN_KEY = 'sf_refresh_token';

// access token 内存缓存：token 双写（内存 + localStorage），每次读取走内存，
// 避免高频请求的 localStorage 同步 IO；clearToken 同步置空
let memoryAccess: string | null = null;

export function getToken(): string | null {
  return memoryAccess ?? localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  memoryAccess = token;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearToken(): void {
  memoryAccess = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
