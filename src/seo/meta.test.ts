import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { REFERENCE_PAGES } from '../data/reference';
import { PRERENDER_PATHS } from '../prerender/routes';
import { buildSeoMeta, canonicalUrl } from './meta';
import { brandFor } from './site';

const ZH = brandFor({ code: 'zh-CN', prefix: '' });
const EN = brandFor({ code: 'en', prefix: '/en' });

describe('canonicalUrl', () => {
  it('uses a trailing slash for root and directory routes', () => {
    expect(canonicalUrl('/')).toBe('https://syy.global/');
    expect(canonicalUrl('/tutorial')).toBe('https://syy.global/tutorial/');
    expect(canonicalUrl('/knowledge/p-math-1/')).toBe('https://syy.global/knowledge/p-math-1/');
    expect(canonicalUrl('/en')).toBe('https://syy.global/en/');
    expect(canonicalUrl('/en/math/multiplication-chart')).toBe(
      'https://syy.global/en/math/multiplication-chart/',
    );
  });

  it('strips query and hash', () => {
    expect(canonicalUrl('/practice?kp=p-math-1#x')).toBe('https://syy.global/practice/');
  });
});

describe('buildSeoMeta', () => {
  it('gives every prerendered route a distinct title, description and canonical', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const canonicals = new Set<string>();

    for (const path of PRERENDER_PATHS) {
      const meta = buildSeoMeta(path);
      expect(meta.title.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(0);
      titles.add(meta.title);
      descriptions.add(meta.description);
      canonicals.add(meta.canonical);
    }

    expect(titles.size).toBe(PRERENDER_PATHS.length);
    expect(descriptions.size).toBe(PRERENDER_PATHS.length);
    expect(canonicals.size).toBe(PRERENDER_PATHS.length);
  });

  it('derives knowledge titles and LearningResource JSON-LD from the point', () => {
    const point = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    const meta = buildSeoMeta(`/knowledge/${point.id}`);
    expect(meta.title).toContain(point.title);
    expect(meta.description).toContain(point.description);
    expect(meta.htmlLang).toBe('zh-CN');
    const types = meta.jsonLd.map((block) => block['@type']);
    expect(types).toContain('LearningResource');
    expect(types).toContain('BreadcrumbList');
  });

  it('emits WebSite + Organization JSON-LD and hreflang on the Chinese home page', () => {
    const meta = buildSeoMeta('/');
    const types = meta.jsonLd.map((block) => block['@type']);
    expect(types).toEqual(['WebSite', 'Organization']);
    expect(meta.alternates).toEqual([
      { hreflang: 'zh-CN', href: 'https://syy.global/' },
      { hreflang: 'x-default', href: 'https://syy.global/' },
    ]);
    expect(meta.og.siteName).toBe(ZH.name);
    expect(meta.og.locale).toBe(ZH.ogLocale);
    expect(meta.htmlLang).toBe('zh-CN');
  });

  it('renders the English reference surface with English head tags and alternates', () => {
    const meta = buildSeoMeta('/en');
    expect(meta.title).toContain(EN.name);
    expect(meta.description).toBe(EN.description);
    expect(meta.htmlLang).toBe('en');
    expect(meta.og.locale).toBe('en_US');
    expect(meta.alternates).toEqual([
      { hreflang: 'en', href: 'https://syy.global/en/' },
      { hreflang: 'x-default', href: 'https://syy.global/en/' },
    ]);
  });

  it('gives every English reference chart its own English metadata', () => {
    for (const page of REFERENCE_PAGES) {
      const path = `/en/${page.category}/${page.slug}`;
      const meta = buildSeoMeta(path);
      expect(meta.title).toBe(`${page.title} - ${EN.name}`);
      expect(meta.description).toBe(page.description);
      expect(meta.canonical).toBe(`https://syy.global/en/${page.category}/${page.slug}/`);
      expect(meta.htmlLang).toBe('en');
      expect(meta.alternates[0]).toEqual({
        hreflang: 'en',
        href: `https://syy.global/en/${page.category}/${page.slug}/`,
      });
    }
  });

  it('leaves Chinese pages English-free (no /en alternate)', () => {
    const meta = buildSeoMeta('/practice');
    expect(meta.alternates.map((a) => a.hreflang)).toEqual(['zh-CN', 'x-default']);
    expect(meta.alternates.every((a) => !a.href.includes('/en'))).toBe(true);
  });

  it('falls back to generic copy for unknown routes without throwing', () => {
    const meta = buildSeoMeta('/totally-unknown');
    expect(meta.title).toBe(ZH.name);
    expect(meta.description).toBe(ZH.description);
  });
});
