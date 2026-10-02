import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { REFERENCE_PAGES } from '../data/reference';
import { PRERENDER_PATHS } from '../prerender/routes';
import { ENGLISH_HOME, ENGLISH_ROUTE_PATHS } from '../reference-routes';
import { buildSeoMeta, canonicalUrl } from './meta';
import { writtenRouteSet } from './og';
import { OG_ROUTES } from './og-routes';
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
      expect(meta.title).toBe(`Printable ${page.title} – Free | ${EN.titleBrand}`);
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

describe('JSON-LD for the English surface', () => {
  it('marks a chart page as a LearningResource with its FAQ', () => {
    const meta = buildSeoMeta('/en/math/multiplication-chart');
    const types = meta.jsonLd.map((block) => block['@type']);

    expect(types).toEqual(['LearningResource', 'FAQPage', 'BreadcrumbList']);

    const faq = meta.jsonLd[1] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
    expect(faq.mainEntity[0].name).toBe('What is a multiplication chart?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain('every pair of numbers');
  });

  it('marks a hub page as a CollectionPage whose ItemList covers that category', () => {
    const meta = buildSeoMeta('/en/math');
    const types = meta.jsonLd.map((block) => block['@type']);

    expect(types).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);

    const list = meta.jsonLd[1] as { numberOfItems: number; itemListElement: { name: string; url: string }[] };
    expect(list.numberOfItems).toBe(4);
    expect(list.itemListElement[0].name).toBe('Multiplication Chart (1–12)');
    expect(list.itemListElement[0].url).toBe('https://syy.global/en/math/multiplication-chart/');
  });

  it('leaves the Chinese pages on their existing markup', () => {
    const point = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    expect(buildSeoMeta(`/knowledge/${point.id}`).jsonLd.map((b) => b['@type'])).toEqual([
      'LearningResource',
      'BreadcrumbList',
    ]);
    expect(buildSeoMeta('/tutorial').jsonLd.map((b) => b['@type'])).toEqual([
      'WebPage',
      'BreadcrumbList',
    ]);
  });
});

describe('English title template', () => {
  it('leads with Printable and puts the intent modifier before the brand', () => {
    expect(buildSeoMeta('/en/math/multiplication-chart').title).toBe(
      'Printable Multiplication Chart (1–12) – Free | Shiyiyuan',
    );
    expect(buildSeoMeta('/en/math').title).toBe('Printable Math Charts – Free | Shiyiyuan');
  });

  it('keeps every English title inside the ~60 character SERP budget', () => {
    for (const path of ENGLISH_ROUTE_PATHS) {
      // 首页走的是「品牌 + tagline」，刻意不走这个模板，因此不在预算内。
      if (path === ENGLISH_HOME) continue;
      const title = buildSeoMeta(path).title;
      expect(title.length, `${path} → ${title}`).toBeLessThanOrEqual(60);
    }
  });

  it('leaves Chinese titles alone', () => {
    expect(buildSeoMeta('/').title).toContain('拾艺院');
    expect(buildSeoMeta('/').title).not.toContain('Printable');
  });
});

// 十张图都写成功——正常构建下 buildSeoMeta 收到的集合。
// writtenRouteSet 会归一化，所以不能拿 OG_ROUTES.map(r => r.route) 顶替。
const ALL_WRITTEN = writtenRouteSet(OG_ROUTES);

describe('og:image', () => {
  it('points at the generated card for an English page', () => {
    expect(buildSeoMeta('/en/math/multiplication-chart', ALL_WRITTEN).ogImage).toEqual({
      url: 'https://syy.global/og/math/multiplication-chart.png',
      width: 1200,
      height: 630,
    });
  });

  it('is absent for pages with no generated image', () => {
    expect(buildSeoMeta('/', ALL_WRITTEN).ogImage).toBeUndefined();
    expect(buildSeoMeta('/tutorial', ALL_WRITTEN).ogImage).toBeUndefined();
  });

  it('is absent when the card was not written, even though the page has one', () => {
    // spec:220 —— 单张渲染失败的那页要省略标签，而不是指向一个不存在的文件。
    const partial = writtenRouteSet(OG_ROUTES.filter((entry) => entry.path !== 'og/math.png'));
    expect(buildSeoMeta('/en/math', partial).ogImage).toBeUndefined();
    expect(buildSeoMeta('/en/math', partial).twitter.card).toBe('summary');
  });

  it('is absent when nothing was written at all', () => {
    // 字体缺失 / wasm 起不来时 writeOgImages 返回空数组，构建照常成功。
    expect(buildSeoMeta('/en/math', new Set()).ogImage).toBeUndefined();
    expect(buildSeoMeta('/en/math').ogImage).toBeUndefined();
  });

  it('uses a large twitter card only when there is an image', () => {
    expect(buildSeoMeta('/en/math', ALL_WRITTEN).twitter.card).toBe('summary_large_image');
    expect(buildSeoMeta('/', ALL_WRITTEN).twitter.card).toBe('summary');
  });
});
