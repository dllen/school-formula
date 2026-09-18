// index.ts
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parseArgs } from 'node:util';
import { getAdapter } from './registry';
import { typeCheck } from './validate';
import { getRoot } from './paths';
import type { IngestContext } from './types';

const STAGING_DIR = 'staging';

export function kindFromPath(path: string): string {
  const parts = path.split('/');
  const stagingIdx = parts.lastIndexOf(STAGING_DIR);
  if (stagingIdx === -1 || stagingIdx + 1 >= parts.length) throw new Error(`无法从路径推断 kind: ${path}`);
  return parts[stagingIdx + 1];
}

export function listStaged(root: string): string[] {
  const base = join(root, STAGING_DIR);
  if (!existsSync(base)) return [];
  const out: string[] = [];
  for (const kind of readdirSync(base)) {
    const dir = join(base, kind);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) {
      if (extname(f) === '.json') out.push(join(dir, f));
    }
  }
  return out.sort();
}

export async function runIngest(root: string, paths: string[], dryRun: boolean): Promise<string[]> {
  const ctx: IngestContext = { root, dryRun, knowledgePointIds: await loadKnowledgePointIds(root) };
  const reports: string[] = [];
  for (const p of paths) {
    try {
      const kind = kindFromPath(p);
      const adapter = getAdapter(kind);
      const raw = JSON.parse(readFileSync(p, 'utf-8'));
      const value = adapter.extract(raw);
      const typeErrs = typeCheck(value, adapter.typeRef, root);
      const bizErrs = adapter.validate(value, ctx);
      if (typeErrs.length || bizErrs.length) {
        reports.push(`✗ ${p}\n  ${[...typeErrs, ...bizErrs].join('\n  ')}`);
        continue;
      }
      if (dryRun) {
        reports.push(`✓ ${p}（dry-run，未写盘）`);
        continue;
      }
      const merged = adapter.merge(value, raw, ctx);
      const wired = adapter.wire(value, raw, ctx);
      reports.push(`✓ ${p} → 合并 ${merged.files.join(', ')}${wired.files.length ? ' / 接线 ' + wired.files.join(', ') : ''}`);
    } catch (err) {
      reports.push(`✗ ${p}\n  ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return reports;
}

async function loadKnowledgePointIds(root: string): Promise<Set<string>> {
  const mod = (await import(join(root, 'src', 'data', 'knowledge.ts'))) as {
    KNOWLEDGE_DATA: { subjects: { knowledgePoints: { id: string }[] }[] }[];
  };
  const ids = new Set<string>();
  for (const g of mod.KNOWLEDGE_DATA) for (const s of g.subjects) for (const kp of s.knowledgePoints) ids.add(kp.id);
  return ids;
}

async function main() {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', short: 'a' },
      list: { type: 'boolean', short: 'l' },
      'dry-run': { type: 'boolean', short: 'd' },
    },
    allowPositionals: true,
  });
  const root = getRoot();
  const dryRun = values['dry-run'] === true;

  if (values.list) {
    const files = listStaged(root);
    console.log(files.length ? files.join('\n') : '（staging 为空）');
    return;
  }

  const positional = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  let paths: string[];
  if (values.all) paths = listStaged(root);
  else if (positional.length) paths = positional.map((p) => join(root, p));
  else {
    console.log('用法: npx tsx index.ts --all | <file> [--dry-run] [--list]');
    return;
  }

  if (paths.length === 0) {
    console.log('没有待入库的 staging 文件');
    return;
  }

  const reports = await runIngest(root, paths, dryRun);
  for (const r of reports) console.log(r);
  if (!dryRun) {
    console.log('（完成。建议运行 npm run build 验证整库仍编译通过）');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(`Fatal: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  });
}
