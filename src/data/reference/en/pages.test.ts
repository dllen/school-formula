import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES_EN } from './index';

/** 只允许小写字母、数字与连字符——即可以直接进 URL 路径段的 slug。 */
const slugIsServiceable = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

describe('English reference pages', () => {
  it('carries the six charts that existed before the rewrite', () => {
    expect(REFERENCE_PAGES_EN.map((page) => page.slug).sort()).toEqual([
      'irregular-verbs',
      'metric-conversions',
      'multiplication-chart',
      'physics-constants',
      'squares-cubes-roots',
      'trigonometric-identities',
    ]);
  });

  it('maps every page to one of the three categories', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(['math', 'science', 'english']).toContain(page.category);
    }
  });

  it('uses URL-safe slugs', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(slugIsServiceable(page.slug)).toBe(true);
    }
  });

  it('keeps every related slug pointing at a real page', () => {
    const slugs = new Set(REFERENCE_PAGES_EN.map((page) => page.slug));
    for (const page of REFERENCE_PAGES_EN) {
      for (const related of page.related) {
        expect(slugs).toContain(related);
      }
    }
  });

  // 边界就是目标本身（summary 60–90、description 150–160），一点余量都不留。
  // 前两版都死在「留点余量」上：40/100 盖住了 47–56 / 117–142 的缺口，
  // 148/165 又放过了 161 的超长值。有余量就等于没有约束。
  it('holds summary and description inside the SEO length targets', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(page.summary.length).toBeGreaterThanOrEqual(60);
      expect(page.summary.length).toBeLessThanOrEqual(90);
      expect(page.description.length).toBeGreaterThanOrEqual(150);
      expect(page.description.length).toBeLessThanOrEqual(160);
    }
  });

  it('holds intro inside the target length', () => {
    for (const page of REFERENCE_PAGES_EN) {
      const words = page.intro.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(80);
      expect(words).toBeLessThanOrEqual(120);
    }
  });

  it('gives every page at least three FAQ entries and two how-to-use steps', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(page.faq.length).toBeGreaterThanOrEqual(3);
      expect(page.howToUse.length).toBeGreaterThanOrEqual(2);
      expect(page.blocks.length).toBeGreaterThanOrEqual(1);
    }
  });
});
