import { describe, expect, it } from 'vitest';
import { PRERENDER_PATHS, XML_SITEMAP_PATHS } from './prerender/routes';
import {
  buildHtmlSitemap,
  flattenSitemap,
  HTML_SITEMAP_PATH,
} from './sitemap';

describe('HTML sitemap', () => {
  it('exposes every prerender path except itself with no duplicates', () => {
    const groups = buildHtmlSitemap();
    const allPaths = flattenSitemap(groups);

    expect(new Set(allPaths).size).toBe(allPaths.length);
    expect(allPaths).toHaveLength(PRERENDER_PATHS.length - 1);
    expect(allPaths).not.toContain(HTML_SITEMAP_PATH);

    const expected = new Set(PRERENDER_PATHS);
    expected.delete(HTML_SITEMAP_PATH);
    for (const path of expected) {
      expect(allPaths).toContain(path);
    }
  });
});

describe('XML sitemap paths', () => {
  it('excludes /sitemap and keeps it in PRERENDER_PATHS', () => {
    expect(XML_SITEMAP_PATHS).not.toContain(HTML_SITEMAP_PATH);
    expect(PRERENDER_PATHS).toContain(HTML_SITEMAP_PATH);
  });
});
