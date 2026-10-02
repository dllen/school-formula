// src/seo/og.ts
import { OG_ROUTES, type OgRoute } from './og-routes';
import { SITE } from './site';

/**
 * OG 卡片的画布尺寸。**唯一来源**：satori 的渲染尺寸（src/prerender/og.ts）、
 * 卡片布局（src/prerender/og-card.ts）与 `og:image:width/height` 元数据
 * （src/seo/meta.ts）都从这里取——三处各写一遍的话，改了其中一处不同步就是错图或裁切。
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** 去掉尾斜杠、查询串与片段，并把 `/en` 归一成 `/en/`。 */
export function normalizeOgRoute(path: string): string {  const withoutQuery = path.split('#')[0].split('?')[0];
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
  OG_ROUTES.map((entry) => [normalizeOgRoute(entry.route), entry.path]),
);

/**
 * 静态映射：这张表说「哪一页**应该**有图」，不代表图真的写出来了。
 * 要输出到页面上的 URL 用 ogImageUrl，它还会要求路由在「确实写成功」的集合里。
 */
export function ogImagePath(path: string): string | undefined {
  return BY_ROUTE.get(normalizeOgRoute(path));
}

/** 把 writeOgImages 的返回值转成 ogImageUrl 要的集合。 */
export function writtenRouteSet(routes: readonly OgRoute[]): Set<string> {
  return new Set(routes.map((entry) => normalizeOgRoute(entry.route)));
}

/**
 * 绝对的 og:image URL；没有图、**或那张图没写成功**时 undefined。
 *
 * `writtenRoutes` 默认空集，方向是刻意选的：忘了传只会少一个标签（spec:220 要的
 * 「省略该页的 og:image」），不会指向一个不存在的文件。反向的默认值会重现那个 bug。
 */
export function ogImageUrl(
  path: string,
  writtenRoutes: ReadonlySet<string> = new Set<string>(),
): string | undefined {
  const relative = ogImagePath(path);
  if (!relative || !writtenRoutes.has(normalizeOgRoute(path))) return undefined;
  return `${SITE.origin}/${relative}`;
}
