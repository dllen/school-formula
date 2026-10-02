import { REFERENCE_PAGES } from './data/reference';
import type { ReferenceCategory } from './data/reference/types';
import { EN, homePath } from './i18n/languages';

/**
 * 英文面的路由表——路由、prerender 清单、sitemap 与链接助手都从这里读。
 * 与中文 app 的 `src/view-routes.ts` 对应。
 */

/** 英文面的规范首页；也是语言入口的跳转目标。 */
export const ENGLISH_HOME = homePath(EN);

/** 学科 hub 的展示顺序，同时也是 `/en/` 索引页上卡片的顺序。 */
export const REFERENCE_CATEGORIES: readonly ReferenceCategory[] = ['math', 'science', 'english'];

/** React Router 模式：单个学科 hub。 */
export const ENGLISH_CATEGORY_ROUTE = `${ENGLISH_HOME}:category`;

/** React Router 模式：单张图表页。 */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}:category/:slug`;

export function isReferenceCategory(value: string): value is ReferenceCategory {
  return (REFERENCE_CATEGORIES as readonly string[]).includes(value);
}

/** 学科 hub 的规范路径：`categoryPath('math')` → `/en/math/`。 */
export function categoryPath(category: ReferenceCategory): string {
  return `${ENGLISH_HOME}${category}/`;
}

/** 图表页的规范路径：`referencePath('math', 'x')` → `/en/math/x/`。 */
export function referencePath(category: ReferenceCategory, slug: string): string {
  return `${ENGLISH_HOME}${category}/${slug}/`;
}

/** 把去掉语言前缀的 app 路径（`/math/x`）拆成学科与 slug；层级不对返回 null。 */
export function referencePartsForAppPath(
  appPath: string,
): { category: string; slug: string } | null {
  const match = /^\/([^/]+)\/([^/]+)\/?$/.exec(appPath);
  return match ? { category: match[1], slug: match[2] } : null;
}

/** 英文面的全部路由路径，供 prerender 清单与 sitemap 使用。 */
export const ENGLISH_ROUTE_PATHS: string[] = [
  ENGLISH_HOME,
  ...REFERENCE_CATEGORIES.map(categoryPath),
  ...REFERENCE_PAGES.map((page) => referencePath(page.category, page.slug)),
];
