import { describe, expect, it } from 'vitest';
import { getReferencePage, pagesInCategory, REFERENCE_PAGES } from './index';

describe('reference page index', () => {
  it('exposes every authored page', () => {
    expect(REFERENCE_PAGES).toHaveLength(6);
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
