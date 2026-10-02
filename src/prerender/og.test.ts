// @vitest-environment node
// resvg 的 wasm 需要真实的 Node 全局；happy-dom 环境会干扰它的初始化。
import { describe, expect, it } from 'vitest';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { OG_ROUTES, writeOgImages } from './og';

describe('OG_ROUTES', () => {
  it('covers the English surface only: home, three hubs, six charts', () => {
    expect(OG_ROUTES).toHaveLength(10);
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/en.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math/multiplication-chart.png');
  });

  it('never writes outside dist/og', () => {
    for (const entry of OG_ROUTES) {
      expect(entry.path.startsWith('og/')).toBe(true);
      expect(entry.path).not.toContain('..');
    }
  });

  it('does not touch the Chinese pages', () => {
    expect(OG_ROUTES.every((entry) => entry.route.startsWith('/en'))).toBe(true);
  });
});

describe('writeOgImages', () => {
  it('writes one real PNG per route', async () => {
    const distDir = mkdtempSync(join(tmpdir(), 'og-test-'));
    try {
      const written = await writeOgImages(distDir);
      expect(written).toBe(10);

      const png = readFileSync(join(distDir, 'og/math/multiplication-chart.png'));
      // PNG 魔术字节
      expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      expect(png.byteLength).toBeGreaterThan(2000);
      expect(readdirSync(join(distDir, 'og/math'))).toContain('metric-conversions.png');
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  }, 120_000);
});
