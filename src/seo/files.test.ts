import { describe, expect, it } from 'vitest';
import { PRERENDER_PATHS } from '../prerender/routes';
import { buildRobotsTxt, buildSitemap } from './files';

describe('buildRobotsTxt', () => {
  it('allows the site and points at the sitemap', () => {
    const robots = buildRobotsTxt();
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://syy.global/sitemap.xml');
  });
});

describe('buildSitemap', () => {
  it('lists every route as an absolute canonical URL', () => {
    const xml = buildSitemap(['/', '/tutorial', '/knowledge/p-math-1']);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<loc>https://syy.global/</loc>');
    expect(xml).toContain('<loc>https://syy.global/tutorial/</loc>');
    expect(xml).toContain('<loc>https://syy.global/knowledge/p-math-1/</loc>');
    expect(xml.match(/<url>/g)).toHaveLength(3);
  });

  it('covers the full prerender route list without duplicates', () => {
    const xml = buildSitemap(PRERENDER_PATHS);
    expect(xml.match(/<url>/g)).toHaveLength(PRERENDER_PATHS.length);
    expect(xml).toContain('<loc>https://syy.global/knowledge/p-eng-001/</loc>');
  });
});
