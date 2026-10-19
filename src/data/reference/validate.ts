import type { ReferencePage } from './types';

/**
 * 计算页面的「可索引正文」词数：summary、description、intro、howToUse、faq 的问答，
 * 以及每个 block 的 caption/formula 分组名。这是 SEO 校验「正文总长」的单一来源。
 */
function proseWords(page: ReferencePage): number {
  const parts: string[] = [
    page.summary,
    page.description,
    page.intro,
    ...page.howToUse,
    ...page.faq.flatMap((entry) => [entry.q, entry.a]),
  ];
  for (const block of page.blocks) {
    if (block.kind === 'table') parts.push(block.caption ?? '');
    else if (block.kind === 'formulas') parts.push(block.groups.map((group) => group.label ?? '').join(' '));
    else parts.push(block.caption ?? '');
  }
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

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
    if (page.related.length < 2) problems.push(`${page.slug}: needs at least 2 related links`);
    if (proseWords(page) < 400) problems.push(`${page.slug}: needs at least 400 prose words`);
    for (const related of page.related) {
      if (!slugs.has(related)) problems.push(`${page.slug}: related slug not found: ${related}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`invalid reference pages:\n  ${problems.join('\n  ')}`);
  }
}
