// scripts/extract-data/core/runner.ts
import { join } from 'node:path';
import type { Adapter } from './adapter.js';
import type { CliFlags } from '../cli/args.js';
import { fetchWithRetry } from './http.js';
import { readCache, writeCache } from './cache.js';
import { writeEnvelope } from '../cli/output.js';
import { shijiKbAdapter } from '../adapters/shiji-kb.js';
import { dutongjianAdapter } from '../adapters/dutongjian.js';
import { hunterhugAdapter } from '../adapters/hunterhug.js';

const DEFAULT_MIN_INTERVAL_MS = Number(process.env.EXTRACT_MIN_INTERVAL_MS ?? 500);
const DEFAULT_CACHE_DIR = '.cache';

const REGISTRY: Adapter[] = [shijiKbAdapter, dutongjianAdapter, hunterhugAdapter];

export function listAdapters(): Adapter[] {
  return REGISTRY.slice();
}

export function getAdapter(kind: string): Adapter | undefined {
  return REGISTRY.find(a => a.kind === kind);
}

export interface RunResult {
  adapter: string;
  pagesFetched: number;
  pagesFailed: number;
  envelopePath?: string;
  dryRun: boolean;
}

export async function runAdapter(
  adapter: Adapter,
  flags: CliFlags,
  ctx: { root: string }
): Promise<RunResult> {
  const cacheDir = join(ctx.root, 'scripts', 'extract-data', DEFAULT_CACHE_DIR);
  const cacheTtlMs = (flags.cacheTtlDays ?? 7) * 24 * 60 * 60 * 1000;

  let urls: string[];
  if (flags.url) {
    urls = [flags.url];
  } else {
    urls = await adapter.listUrls();
  }
  console.error(`[extract-data] ${adapter.kind}: ${urls.length} URLs planned`);

  const pages: unknown[] = [];
  let failed = 0;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!;
    const label = `[${i + 1}/${urls.length}]`;

    let html: string | null = null;
    if (!flags.noCache) {
      html = readCache(cacheDir, adapter.kind, url, cacheTtlMs);
      if (html !== null) console.error(`[extract-data] ${url} ${label} cached`);
    }

    if (html === null) {
      try {
        console.error(`[extract-data] ${url} ${label} fetching`);
        const res = await fetchWithRetry(url);
        html = await res.text();
        writeCache(cacheDir, adapter.kind, url, html);
      } catch (err) {
        console.error(`[extract-data] ${url} ${label} FAILED: ${(err as Error).message}`);
        failed++;
        if (!flags.partialOk) throw err;
        html = null;
      }
    }

    if (html !== null) {
      try {
        const parsed = await adapter.parseHtml(url, html);
        pages.push(parsed);
      } catch (err) {
        console.error(`[extract-data] ${url} ${label} PARSE FAILED: ${(err as Error).message}`);
        failed++;
        if (!flags.partialOk) throw err;
      }
    }

    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, DEFAULT_MIN_INTERVAL_MS));
    }
  }

  const envelope = adapter.normalize(pages);
  const out = writeEnvelope(envelope, {
    root: ctx.root,
    kind: adapter.kind,
    dryRun: flags.dryRun,
  });

  console.error(`[extract-data] ${adapter.kind}: ${pages.length} pages, ${failed} failed, ${out.dryRun ? 'dry-run' : 'written'} ${out.path}`);

  return {
    adapter: adapter.kind,
    pagesFetched: pages.length,
    pagesFailed: failed,
    envelopePath: out.dryRun ? undefined : out.path,
    dryRun: out.dryRun,
  };
}
