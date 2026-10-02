// src/seo/og.ts
import { OG_ROUTES } from './og-routes';
import { SITE } from './site';

/** 去掉尾斜杠，并把 `/en` 归一成 `/en/`。 */
function normalize(path: string): string {
  const withoutQuery = path.split('#')[0].split('?')[0];
  if (withoutQuery === '/' || withoutQuery === '') return '/';
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed === '/en' ? '/en/' : trimmed;
}

/**
 * 路由 → 相对 dist/ 的 OG 图路径。没有图的页面返回 undefined。
 *
 * **两侧都归一化后再建表**：OG_ROUTES 的 route 来自 categoryPath / referencePath，
 * 是带尾斜杠的（`/en/math/`），而查表传进来的是不带尾斜杠的形式（`/en/math`）。
 * 不归一化的话永远查不中。
 */
const BY_ROUTE = new Map<string, string>(
  OG_ROUTES.map((entry) => [normalize(entry.route), entry.path]),
);

export function ogImagePath(path: string): string | undefined {
  return BY_ROUTE.get(normalize(path));
}

/** 绝对的 og:image URL；没有图时 undefined。 */
export function ogImageUrl(path: string): string | undefined {
  const relative = ogImagePath(path);
  return relative ? `${SITE.origin}/${relative}` : undefined;
}
