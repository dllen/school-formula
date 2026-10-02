import { describe, expect, it } from 'vitest';
import { OG_ROUTES } from './og-routes';
import { ogImagePath, ogImageUrl } from './og';

describe('ogImagePath', () => {
  it('resolves every English page that has a generated image', () => {
    for (const { route, path } of OG_ROUTES) {
      expect(ogImagePath(route), route).toBe(path);
    }
  });

  it('returns undefined for pages without a generated image', () => {
    // 中文页刻意不生成 og 图（276 张图的成本换接近零的社交回报）。
    expect(ogImagePath('/')).toBeUndefined();
    expect(ogImagePath('/tutorial')).toBeUndefined();
    expect(ogImagePath('/knowledge/p-mor-010')).toBeUndefined();
  });

  it('normalizes the trailing-slash variants of a route', () => {
    expect(ogImagePath('/en/math')).toBe('og/math.png');
    expect(ogImagePath('/en/math/')).toBe('og/math.png');
    expect(ogImagePath('/en')).toBe('og/en.png');
    expect(ogImagePath('/en/')).toBe('og/en.png');
  });
});

describe('ogImageUrl', () => {
  it('is absolute against the canonical origin', () => {
    expect(ogImageUrl('/en/math/multiplication-chart')).toBe(
      'https://syy.global/og/math/multiplication-chart.png',
    );
  });

  it('is undefined when there is no image', () => {
    expect(ogImageUrl('/')).toBeUndefined();
  });
});
