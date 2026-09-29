import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

export interface CacheOptions {
  /** 缓存根目录。 */
  cacheDir: string;
  /** TTL 毫秒。 */
  ttlMs?: number;
}

/** URL → 文件名（sha256 前 16 字符）。 */
function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

/** 缓存路径：<cacheDir>/<adapter-kind>/<hash>.html */
export function cachePath(cacheDir: string, kind: string, url: string): string {
  return join(cacheDir, kind, `${hashUrl(url)}.html`);
}

/** 读缓存；命中且未过期返回内容，未命中或过期返回 null。 */
export function readCache(cacheDir: string, kind: string, url: string, ttlMs = DEFAULT_TTL_MS): string | null {
  const p = cachePath(cacheDir, kind, url);
  if (!existsSync(p)) return null;
  const ageMs = Date.now() - statSync(p).mtimeMs;
  if (ageMs > ttlMs) return null;
  return readFileSync(p, 'utf-8');
}

/** 写缓存（确保目录存在）。 */
export function writeCache(cacheDir: string, kind: string, url: string, content: string): void {
  const p = cachePath(cacheDir, kind, url);
  mkdirSync(join(cacheDir, kind), { recursive: true });
  writeFileSync(p, content, 'utf-8');
}

/** 清空某 adapter 的缓存。 */
export function clearCache(cacheDir: string, kind: string): void {
  const dir = join(cacheDir, kind);
  if (existsSync(dir)) {
    // 仅删除 .html 文件，不删子目录
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.html')) unlinkSync(join(dir, f));
    }
  }
}
