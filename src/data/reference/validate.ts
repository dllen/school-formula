import type { ReferencePage } from './types';

/**
 * 构建期防呆：半成品页面必须在构建时炸掉，而不是带着空 intro 或断掉的内链
 * 混进 dist/ 被爬虫抓走。由 entry-prerender 在写盘前调用一次。
 *
 * 一次收集全部问题再抛，避免「修一个跑一次」的循环。
 */
export function validateReferencePages(pages: readonly ReferencePage[]): void {
  const slugs = new Set<string>();
  const problems: string[] = [];

  for (const page of pages) {
    if (slugs.has(page.slug)) problems.push(`duplicate slug: ${page.slug}`);
    slugs.add(page.slug);
  }

  for (const page of pages) {
    for (const field of ['title', 'summary', 'description', 'intro'] as const) {
      if (!page[field].trim()) problems.push(`${page.slug}: empty ${field}`);
    }
    if (page.blocks.length < 1) problems.push(`${page.slug}: needs at least one block`);
    if (page.howToUse.length < 2) problems.push(`${page.slug}: needs at least 2 howToUse steps`);
    if (page.faq.length < 3) problems.push(`${page.slug}: needs at least 3 FAQ entries`);
    for (const entry of page.faq) {
      if (!entry.q.trim() || !entry.a.trim()) {
        problems.push(`${page.slug}: empty FAQ question or answer`);
      }
    }
    for (const related of page.related) {
      if (!slugs.has(related)) problems.push(`${page.slug}: related slug not found: ${related}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`invalid reference pages:\n  ${problems.join('\n  ')}`);
  }
}
