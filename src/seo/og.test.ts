import { describe, expect, it } from 'vitest';
import { OG_ROUTES } from './og-routes';
import { ogImagePath, ogImageUrl, writtenRouteSet } from './og';

/**
 * 「十张图都写成功了」——正常构建下的集合，也是 ogImageUrl 的受控输入。
 * 必须走 writtenRouteSet 而不是 OG_ROUTES.map(r => r.route)：后者是**原始** route
 * （带尾斜杠），而 ogImageUrl 查的是归一化后的键，直接用会永远查不中。
 */
const ALL_WRITTEN = writtenRouteSet(OG_ROUTES);

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
    expect(ogImageUrl('/en/math/multiplication-chart', ALL_WRITTEN)).toBe(
      'https://syy.global/og/math/multiplication-chart.png',
    );
  });

  it('normalizes the route before testing membership', () => {
    // 归一化必须发生在查集合之前：OG_ROUTES 里的 route 带尾斜杠，这里传的是不带的。
    // 少了这一步，这条会 undefined——而正常构建走的就是这个形状。
    expect(ogImageUrl('/en/math/', ALL_WRITTEN)).toBe('https://syy.global/og/math.png');
    expect(ogImageUrl('/en', ALL_WRITTEN)).toBe('https://syy.global/og/en.png');
  });

  it('is undefined when there is no image', () => {
    expect(ogImageUrl('/')).toBeUndefined();
  });

  it('is undefined when this page has a card but its render failed', () => {
    // spec:220 —— 单张失败则省略该页的 og:image，而不是输出一个指向不存在文件的 URL。
    // 按 path 挑掉 hub 那张，而不是按 route 字符串：route 的具体形状（尾斜杠）会变，
    // path 不会。
    const partial = writtenRouteSet(OG_ROUTES.filter((entry) => entry.path !== 'og/math.png'));
    expect(ogImageUrl('/en/math', partial)).toBeUndefined();
    // 同一集合里别的页不受影响。
    expect(ogImageUrl('/en/science', partial)).toBe('https://syy.global/og/science.png');
  });

  it('is undefined when nothing was written at all', () => {
    // 前置条件失败（字体缺失 / wasm 起不来）时 writeOgImages 返回空数组，
    // 此时**每一页**都必须省略标签——这正是 Task 5 那次修复把路径暴露出来的地方。
    expect(ogImageUrl('/en/math', new Set())).toBeUndefined();
    expect(ogImageUrl('/en/math')).toBeUndefined();
  });
});
