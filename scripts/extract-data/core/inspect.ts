// scripts/extract-data/core/inspect.ts
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';

export interface InspectOptions {
  url: string;
  adapterKind?: string;
  save: boolean;
  maxHeadings: number;
}

export interface InspectReport {
  url: string;
  fetchedBytes: number;
  fetchedMs: number;
  cached: boolean;
  headings: Array<{ level: number; text: string }>;
  topClasses: Array<{ cls: string; count: number }>;
  candidates: Array<{ selector: string; paragraphs: number; avgChars: number }>;
  ids: Array<{ id: string; count: number }>;
  fixturePath?: string;
}

const CANDIDATE_SELECTORS = [
  'article p',
  'main p',
  '.content p',
  '.article-body p',
  'body > div p',
  '.entry p',
  '.post p',
  '#content p',
  '#main p',
];

const MIN_CLASS_FREQ = 2;

function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

function tsFilenameSafe(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export async function inspectHtml(
  opts: InspectOptions,
  ctx: { root: string; fetchImpl?: typeof fetch }
): Promise<InspectReport> {
  const fetchImpl = ctx.fetchImpl ?? fetch;
  const t0 = Date.now();
  const res = await fetchImpl(opts.url);
  if (!res.ok) throw new Error(`${opts.url} → ${res.status}`);
  const html = await res.text();
  const fetchedMs = Date.now() - t0;

  let savedPath: string | undefined;
  if (opts.save) {
    const adapter = opts.adapterKind ?? 'unknown';
    const dir = join(ctx.root, 'scripts', 'extract-data', '.fixtures', adapter);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${hashUrl(opts.url)}-${tsFilenameSafe()}.html`);
    writeFileSync(file, html, 'utf-8');
    savedPath = file;
  }

  const $ = load(html);

  const headings: InspectReport['headings'] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    if (headings.length >= opts.maxHeadings) return;
    const tag = el.tagName.toLowerCase();
    const level = Number(tag.slice(1));
    const text = $(el).text().trim().slice(0, 80);
    if (text) headings.push({ level, text });
  });

  const classCounts = new Map<string, number>();
  $('[class]').each((_, el) => {
    const cls = ($(el).attr('class') ?? '').trim().split(/\s+/);
    for (const c of cls) {
      if (!c) continue;
      classCounts.set(c, (classCounts.get(c) ?? 0) + 1);
    }
  });
  const topClasses = [...classCounts.entries()]
    .filter(([, n]) => n >= MIN_CLASS_FREQ)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cls, count]) => ({ cls, count }));

  const candidates = CANDIDATE_SELECTORS.map((selector) => {
    const ps = $(selector).toArray();
    const paragraphs = ps.length;
    const totalChars = ps.reduce((sum, p) => sum + $(p).text().trim().length, 0);
    const avgChars = paragraphs > 0 ? Math.round(totalChars / paragraphs) : 0;
    return { selector, paragraphs, avgChars };
  }).filter((c) => c.paragraphs > 0)
    .sort((a, b) => b.paragraphs - a.paragraphs);

  const idCounts = new Map<string, number>();
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (!id) return;
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  });
  const ids = [...idCounts.entries()].map(([id, count]) => ({ id, count }));

  return {
    url: opts.url,
    fetchedBytes: html.length,
    fetchedMs,
    cached: false,
    headings,
    topClasses,
    candidates,
    ids,
    fixturePath: savedPath,
  };
}

export function formatReport(report: InspectReport): string {
  const lines: string[] = [];
  lines.push(`=== URL: ${report.url}`);
  lines.push(`=== Fetched: ${(report.fetchedBytes / 1024).toFixed(1)} KB in ${report.fetchedMs}ms (cache: ${report.cached ? 'hit' : 'miss'})`);
  lines.push('');
  lines.push('# Heading hierarchy');
  if (report.headings.length === 0) {
    lines.push('  (none)');
  } else {
    for (const h of report.headings) {
      const indent = '  '.repeat(h.level - 1);
      lines.push(`${indent}h${h.level}: ${h.text}`);
    }
  }
  lines.push('');
  lines.push(`# Top class names (freq >= ${MIN_CLASS_FREQ})`);
  if (report.topClasses.length === 0) {
    lines.push('  (none)');
  } else {
    for (const c of report.topClasses) {
      lines.push(`  ${c.cls} ×${c.count}`);
    }
  }
  lines.push('');
  lines.push('# Container candidates (paragraph yield)');
  if (report.candidates.length === 0) {
    lines.push('  (no paragraphs found)');
  } else {
    const maxP = Math.max(...report.candidates.map((c) => c.paragraphs));
    for (const c of report.candidates) {
      const star = c.paragraphs === maxP ? ' ★' : '';
      lines.push(`  ${c.selector.padEnd(18)} → ${String(c.paragraphs).padStart(3)} paragraphs (avg ${c.avgChars} chars)${star}`);
    }
  }
  lines.push('');
  lines.push('# IDs / landmarks');
  if (report.ids.length === 0) {
    lines.push('  (none)');
  } else {
    const idStrs = report.ids.slice(0, 10).map((i) => `#${i.id} ×${i.count}`);
    lines.push('  ' + idStrs.join(', '));
  }
  lines.push('');
  if (report.candidates[0]) {
    const top = report.candidates[0];
    const second = report.candidates[1];
    const suggest = second && second.paragraphs >= top.paragraphs * 0.5 ? `'${top.selector}' or '${second.selector}'` : `'${top.selector}'`;
    lines.push(`# Suggested selector (highest yield)`);
    lines.push(`  → ${suggest}`);
  }
  if (report.fixturePath) {
    lines.push('');
    const relFixture = report.fixturePath.split('/').slice(-2).join('/');
    lines.push(`# Saved fixture: ${relFixture} (${(report.fetchedBytes / 1024).toFixed(1)} KB)`);
  }
  return lines.join('\n');
}
