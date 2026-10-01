import { canonicalUrl } from './meta';
import { SITE } from './site';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** robots.txt allowing the whole site, blocking the API, and pointing at the sitemap. */
export function buildRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE.origin}/sitemap.xml`,
    '',
  ].join('\n');
}

/** sitemap.xml listing every canonical URL, generated from the prerendered route list. */
export function buildSitemap(paths: readonly string[]): string {
  const urls = [...new Set(paths)]
    .map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}
