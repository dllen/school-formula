// adapters/prompt.ts
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds } from '../validate';

interface PromptLike { id: string; scenario: string }

/** 原始 scenario（如 `error-analysis`）→ 数组名（如 `ERROR_ANALYSIS_PROMPTS`）。 */
function scenarioArray(scenario: string): string {
  return `${scenario.toUpperCase().replace(/-/g, '_')}_PROMPTS`;
}

function existingIdsForScenario(scenario: string, ctx: IngestContext): Set<string> {
  const dir = join(ctx.root, 'src', 'data', 'prompts', scenario);
  if (!existsSync(dir)) return new Set();
  const ids = new Set<string>();
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.ts')) {
      for (const id of extractIds(readFileSync(join(dir, f), 'utf-8'))) ids.add(id);
    }
  }
  return ids;
}

export const promptAdapter: Adapter = {
  kind: 'prompts',
  typeRef: { path: join(getRoot(), 'src/data/prompts/types.ts'), name: 'PromptTemplate', expr: 'PromptTemplate[]' },
  extract(raw) {
    const prompts = (raw as { prompts: Record<string, unknown>[] }).prompts;
    return prompts.map((p) => ({ ...p, usageCount: 0, rating: 0, author: 'pi-agent-edu' }));
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as PromptLike[];
    const errs: string[] = [];
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    const scenarioIds = new Map<string, Set<string>>();
    for (const it of items) {
      if (!scenarioIds.has(it.scenario)) {
        scenarioIds.set(it.scenario, existingIdsForScenario(it.scenario, ctx));
      }
      if (scenarioIds.get(it.scenario)!.has(it.id)) errs.push(`id 已存在: ${it.id}`);
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const items = value as PromptLike[];
    const groups = new Map<string, PromptLike[]>();
    for (const it of items) {
      const scenario = it.scenario; // 原始 scenario（如 'explain'），作文件名 + 分组键
      if (!groups.has(scenario)) groups.set(scenario, []);
      groups.get(scenario)!.push(it);
    }
    const files: string[] = [];
    for (const [scenario, group] of groups) {
      const abs = join(ctx.root, 'src', 'data', 'prompts', scenario, 'index.ts');
      const arrayName = scenarioArray(scenario);
      if (!existsSync(abs)) {
        writeFileSync(abs, `import type { PromptTemplate } from '../types';\n\nexport const ${arrayName}: PromptTemplate[] = [\n];\n`, 'utf-8');
      }
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), arrayName, group), 'utf-8');
      files.push(abs);
    }
    return { files, inserted: items.length };
  },
  wire() {
    return { files: [] }; // 所有 scenario 已在 prompts/index.ts 中
  },
};
