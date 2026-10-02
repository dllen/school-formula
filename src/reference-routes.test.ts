import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  categoryPath,
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  isReferenceCategory,
  REFERENCE_CATEGORIES,
  referencePartsForAppPath,
  referencePath,
} from './reference-routes';

describe('English route table', () => {
  it('has a home, three category hubs and one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(REFERENCE_CATEGORIES).toEqual(['math', 'science', 'english']);
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(
      1 + REFERENCE_CATEGORIES.length + REFERENCE_PAGES.length,
    );
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/');
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/multiplication-chart/');
  });

  it('exposes React Router patterns with a :category segment', () => {
    expect(ENGLISH_CATEGORY_ROUTE).toBe('/en/:category');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/:category/:slug');
  });

  it('builds category and chart paths', () => {
    expect(categoryPath('math')).toBe('/en/math/');
    expect(referencePath('math', 'multiplication-chart')).toBe('/en/math/multiplication-chart/');
    expect(referencePath('english', 'irregular-verbs')).toBe('/en/english/irregular-verbs/');
  });

  it('routes every authored page to a path under its own category', () => {
    for (const page of REFERENCE_PAGES) {
      expect(ENGLISH_ROUTE_PATHS).toContain(referencePath(page.category, page.slug));
    }
  });

  // REFERENCE_CATEGORIES 是手写数组，ReferenceCategory 是联合类型；加第四个学科
  // 却忘了改数组，isReferenceCategory 会否掉它，而 referencePath/sitemap/prerender
  // 照旧产出——一个 200 的「Page not found」软 404。这条断言把两者焊在一起。
  it('lists every category the data actually uses', () => {
    const used = new Set(REFERENCE_PAGES.map((page) => page.category));
    expect([...used].sort()).toEqual([...REFERENCE_CATEGORIES].sort());
  });

  it('splits an app path into category and slug', () => {
    expect(referencePartsForAppPath('/math/multiplication-chart')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math/multiplication-chart/')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math')).toBeNull();
    expect(referencePartsForAppPath('/math/a/b')).toBeNull();
    expect(referencePartsForAppPath('/tutorial')).toBeNull();
  });

  it('recognises only the three known categories', () => {
    expect(isReferenceCategory('science')).toBe(true);
    expect(isReferenceCategory('reference')).toBe(false);
    expect(isReferenceCategory('')).toBe(false);
  });
});
