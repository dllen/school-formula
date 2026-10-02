import type { SeoMeta } from './meta';
import { buildAnalyticsTags, GA4_MEASUREMENT_ID } from './analytics';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** JSON-LD is embedded raw; only `<` needs neutralizing so `</script>` can't break out. */
function serializeJsonLd(block: Record<string, unknown>): string {
  return JSON.stringify(block).replace(/</g, '\\u003c');
}

/**
 * Render the per-page head content (title + meta/link/script tags) that replaces the
 * template's `<title>` element. Presentation only; all derivation lives in `meta.ts`.
 */
export function renderHead(meta: SeoMeta): string {
  const tags: string[] = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
  ];

  for (const alternate of meta.alternates) {
    tags.push(
      `<link rel="alternate" hreflang="${escapeHtml(alternate.hreflang)}" href="${escapeHtml(alternate.href)}" />`,
    );
  }

  tags.push(
    `<meta property="og:type" content="${escapeHtml(meta.og.type)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(meta.og.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.og.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.og.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.og.url)}" />`,
    `<meta property="og:locale" content="${escapeHtml(meta.og.locale)}" />`,
    `<meta name="twitter:card" content="${escapeHtml(meta.twitter.card)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.twitter.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.twitter.description)}" />`,
  );

  tags.push(...buildAnalyticsTags(GA4_MEASUREMENT_ID));

  for (const block of meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${serializeJsonLd(block)}</script>`);
  }

  return tags.join('\n    ');
}
