import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cachePath, readCache, writeCache, clearCache } from './cache.js';

let cacheDir: string;
const URL = 'https://example.com/page';

beforeEach(() => {
  cacheDir = mkdtempSync(join(tmpdir(), 'extract-cache-'));
});

afterEach(() => {
  rmSync(cacheDir, { recursive: true, force: true });
});

describe('cachePath', () => {
  it('returns a stable path under cacheDir/<kind>/<hash>.html', () => {
    const p = cachePath(cacheDir, 'shiji', URL);
    expect(p).toContain(join(cacheDir, 'shiji'));
    expect(p.endsWith('.html')).toBe(true);
    expect(cachePath(cacheDir, 'shiji', URL)).toBe(p); // 稳定
  });
});

describe('writeCache + readCache', () => {
  it('roundtrips content', () => {
    writeCache(cacheDir, 'shiji', URL, '<html>hi</html>');
    expect(readCache(cacheDir, 'shiji', URL)).toBe('<html>hi</html>');
  });

  it('returns null on cache miss', () => {
    expect(readCache(cacheDir, 'shiji', URL)).toBe(null);
  });

  it('treats expired as miss when ttlMs=0', () => {
    writeCache(cacheDir, 'shiji', URL, '<html>hi</html>');
    // 等几毫秒，让 mtime 拉开
    const before = Date.now();
    while (Date.now() - before < 5) {/* spin */}
    expect(readCache(cacheDir, 'shiji', URL, 0)).toBe(null);
  });
});

describe('clearCache', () => {
  it('removes only .html files in kind subdir', () => {
    writeCache(cacheDir, 'shiji', URL, '<html>hi</html>');
    writeCache(cacheDir, 'shiji', 'https://other', '<html>other</html>');
    clearCache(cacheDir, 'shiji');
    expect(existsSync(cachePath(cacheDir, 'shiji', URL))).toBe(false);
    expect(existsSync(cachePath(cacheDir, 'shiji', 'https://other'))).toBe(false);
  });
});
