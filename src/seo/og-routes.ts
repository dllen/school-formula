// src/seo/og-routes.ts
//
// OG 图的路由表。刻意与渲染器（src/prerender/og.ts）分开：这一半是纯数据，
// 只依赖 data/ 与 reference-routes，所以能被 src/seo/ 下的模块安全 import；
// 渲染器那一半用 node:fs 与 wasm，不属于 tsconfig.app.json 的 program。
import { pagesInCategory } from '../data/reference';
import type { ReferenceCategory, ReferencePage } from '../data/reference/types';
import {
  categoryPath,
  ENGLISH_HOME,
  REFERENCE_CATEGORIES,
  referencePath,
} from '../reference-routes';

/**
 * 一个待生成 OG 图的目标。刻意带上 kind，而不是从路径字符串反推是 hub 还是图表页——
 * 字符串反推很脆，判别联合也让 cardFor 成为一个干净的 switch。
 */
export type OgRoute =
  | { kind: 'home'; route: string; path: string }
  | { kind: 'hub'; route: string; path: string; category: ReferenceCategory }
  | { kind: 'chart'; route: string; path: string; page: ReferencePage };

/** `/en/`、三个学科 hub、六张图表页——只覆盖英文面 10 页。 */
export const OG_ROUTES: OgRoute[] = [
  { kind: 'home', route: ENGLISH_HOME, path: 'og/en.png' },
  ...REFERENCE_CATEGORIES.flatMap((category) => [
    { kind: 'hub' as const, route: categoryPath(category), path: `og/${category}.png`, category },
    ...pagesInCategory(category).map((page) => ({
      kind: 'chart' as const,
      route: referencePath(page.category, page.slug),
      path: `og/${page.category}/${page.slug}.png`,
      page,
    })),
  ]),
];
