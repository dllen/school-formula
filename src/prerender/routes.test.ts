import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { ALL_POEMS } from '../data/poems';
import { ENGLISH_ROUTE_PATHS } from '../reference-routes';
import { HTML_SITEMAP_PATH } from '../sitemap';
import { VIEW_PATHS } from '../view-routes';
import { PRERENDER_PATHS, XML_SITEMAP_PATHS } from './routes';

describe('PRERENDER_PATHS', () => {
  it('includes root, all view paths, every knowledge point and the English surface', () => {
    const kpCount = KNOWLEDGE_DATA.reduce(
      (sum, grade) => sum + grade.subjects.reduce((s, sub) => s + sub.knowledgePoints.length, 0),
      0,
    );
    expect(PRERENDER_PATHS).toContain('/');
    expect(PRERENDER_PATHS).toContain('/tutorial');
    expect(PRERENDER_PATHS).toContain('/ai-chat');
    expect(PRERENDER_PATHS).toContain('/poetry');
    expect(PRERENDER_PATHS).toContain('/poetry/primary-tang-jing-ye-si');
    expect(PRERENDER_PATHS).toContain('/en/');
    expect(PRERENDER_PATHS).toContain('/en/math/');
    expect(PRERENDER_PATHS).toContain('/en/science/');
    expect(PRERENDER_PATHS).toContain('/en/english/');
    expect(PRERENDER_PATHS).toContain('/en/math/multiplication-chart/');
    expect(PRERENDER_PATHS.filter((p) => p.startsWith('/knowledge/'))).toHaveLength(kpCount);
    expect(PRERENDER_PATHS).toHaveLength(
      1 +
        Object.keys(VIEW_PATHS).length +
        kpCount +
        ENGLISH_ROUTE_PATHS.length +
        ALL_POEMS.length +
        1,
    );
    expect(PRERENDER_PATHS).toContain(HTML_SITEMAP_PATH);
  });

  it('has no duplicates', () => {
    expect(new Set(PRERENDER_PATHS).size).toBe(PRERENDER_PATHS.length);
  });
});

describe('XML_SITEMAP_PATHS', () => {
  it('excludes the HTML sitemap while keeping it in PRERENDER_PATHS', () => {
    expect(XML_SITEMAP_PATHS).not.toContain(HTML_SITEMAP_PATH);
    expect(PRERENDER_PATHS).toContain(HTML_SITEMAP_PATH);
  });
});
