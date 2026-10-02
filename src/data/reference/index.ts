import { REFERENCE_PAGES_EN } from './en';
import type { ReferenceCategory, ReferencePage } from './types';

/**
 * 当前已撰写的全部图表页。加一门语言时在数组里补一个展开项即可——
 * 语言维度靠目录划分，不靠参数。
 */
export const REFERENCE_PAGES: readonly ReferencePage[] = [...REFERENCE_PAGES_EN];

const BY_SLUG = new Map(REFERENCE_PAGES.map((page) => [page.slug, page]));

/** slug 目前全局唯一（只有一门语言）。加第二门语言时改成 (lang, slug) 复合键。 */
export function getReferencePage(slug: string): ReferencePage | undefined {
  return BY_SLUG.get(slug);
}

export function pagesInCategory(category: ReferenceCategory): ReferencePage[] {
  return REFERENCE_PAGES.filter((page) => page.category === category);
}

export type { Block, ReferenceCategory, ReferencePage } from './types';
