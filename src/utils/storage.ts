// renderToString（Node）与隐私模式下 localStorage 不可用/会抛 SecurityError，
// 所有 localStorage 访问必须经此收口，保证 SSR 渲染不炸。
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function storageGet(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // 静默：SSR / 隐私模式下写入失败不影响渲染
  }
}

export function storageRemove(key: string): void {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // 同上
  }
}
