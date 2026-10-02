import type { SeoMeta } from './meta';
import { buildAnalyticsTags } from './analytics';

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
 *
 * `analyticsId` 是**受控入参**，不是模块级读的环境变量：读环境变量的话，测试的
 * 结果就取决于跑测试的人家目录里有没有 `.env`——没设时那条「不注入」的用例恒真，
 * 设了就必红，而「设上它」恰恰是启用 GA4 所必需的动作。由调用方
 * （`entry-prerender.ts`）把 `GA4_MEASUREMENT_ID` 递进来，测试就能完全掌握这个值。
 */
export function renderHead(meta: SeoMeta, analyticsId?: string): string {
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
  );

  if (meta.ogImage) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(meta.ogImage.url)}" />`,
      `<meta property="og:image:width" content="${meta.ogImage.width}" />`,
      `<meta property="og:image:height" content="${meta.ogImage.height}" />`,
    );
  }

  tags.push(
    `<meta name="twitter:card" content="${escapeHtml(meta.twitter.card)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.twitter.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.twitter.description)}" />`,
  );

  tags.push(...buildAnalyticsTags(analyticsId));

  for (const block of meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${serializeJsonLd(block)}</script>`);
  }

  return tags.join('\n    ');
}
