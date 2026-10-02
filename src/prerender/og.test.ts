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
    // 名字里的 1/3/6 必须真被断言。只写 toHaveLength(10) 的话，把一张图表页换成
    // 第二个 hub 照样能过——真正有鉴别力的是这条拆分。
    expect(OG_ROUTES.filter((entry) => entry.kind === 'home')).toHaveLength(1);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'hub')).toHaveLength(3);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'chart')).toHaveLength(6);
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
    // 不能只写 startsWith('/en')：'/english/…' 也满足它，而那不是英文面。
    for (const entry of OG_ROUTES) {
      expect(entry.route === '/en/' || entry.route.startsWith('/en/'), entry.route).toBe(true);
    }
  });
});

describe('writeOgImages', () => {
  it('writes one distinct 1200×630 PNG per route', async () => {
    const distDir = mkdtempSync(join(tmpdir(), 'og-test-'));
    try {
      const written = await writeOgImages(distDir);
      expect(written).toBe(10);

      // 逐张核对：文件真在盘上、是真 PNG、尺寸对。只读回一张的话，
      // 「渲染一张然后复制十份」这种 bug 能整个溜过去。
      const pngs = OG_ROUTES.map((entry) => {
        const png = readFileSync(join(distDir, entry.path));
        // PNG 魔术字节
        expect(png.subarray(0, 8), entry.path).toEqual(
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        );
        expect(png.byteLength, entry.path).toBeGreaterThan(2000);
        // PNG 的 IHDR：宽在 16..19 字节、高在 20..23，都是大端。
        expect(png.readUInt32BE(16), entry.path).toBe(1200);
        expect(png.readUInt32BE(20), entry.path).toBe(630);
        return png;
      });

      // 十张内容互不相同——同一张图复制十份同样是坏的。
      expect(new Set(pngs.map((png) => png.toString('base64'))).size).toBe(10);

      expect(readdirSync(join(distDir, 'og/math'))).toContain('metric-conversions.png');
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  }, 120_000);

  it('degrades to zero cards instead of rejecting when the renderer cannot be prepared', async () => {
    // spec:220 —— 渲染失败回退，不 throw。字体缺失（spec:381 恰好点名的场景
    // "不提交字体文件它直接报错"）与 wasm 初始化失败都发生在这里，而 writeOgImages
    // 是被 entry-prerender.ts 顶层 await 的：从这里抛出去就是 unhandled rejection，
    // 整个 `npm run build` 死。这条用例就是钉住那个「不 throw」。
    const distDir = mkdtempSync(join(tmpdir(), 'og-fallback-'));
    try {
      await expect(
        writeOgImages(distDir, () => Promise.reject(new Error('ENOENT: missing font'))),
      ).resolves.toBe(0);
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  });
});
