import { describe, expect, it } from 'vitest';
import { getReferencePage, pagesInCategory, REFERENCE_PAGES } from './index';
import { validateReferencePages } from './validate';

describe('reference page index', () => {
  it('exposes every authored page', () => {
    expect(REFERENCE_PAGES).toHaveLength(6);
  });

  // 构建期只在 entry-prerender 里校验一次，validate.test.ts 又只用合成页面——
  // 于是 npm test 单独跑时看不出「实际发布的六个页面」是否合法。这里补上。
  it('ships a dataset that passes build-time validation', () => {
    expect(() => validateReferencePages(REFERENCE_PAGES)).not.toThrow();
  });

  it('looks a page up by slug', () => {
    expect(getReferencePage('multiplication-chart')?.title).toBe('Multiplication Chart (1–12)');
    expect(getReferencePage('no-such-chart')).toBeUndefined();
  });

  it('filters by category, preserving authoring order', () => {
    expect(pagesInCategory('math').map((page) => page.slug)).toEqual([
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
    ]);
    expect(pagesInCategory('science').map((page) => page.slug)).toEqual(['physics-constants']);
    expect(pagesInCategory('english').map((page) => page.slug)).toEqual(['irregular-verbs']);
  });
});
