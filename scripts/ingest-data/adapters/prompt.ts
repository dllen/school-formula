// adapters/prompt.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface PromptLike { id: string; scenario: string }

/** 原始 scenario（如 `error-analysis`）→ 数组名（如 `ERROR_ANALYSIS_PROMPTS`）。 */
function scenarioArray(scenario: string): string {
  return `${scenario.toUpperCase().replace(/-/g, '_')}_PROMPTS`;
}

export const promptAdapter: Adapter = {
  kind: 'prompts',
  typeRef: { path: join(getRoot(), 'src/data/prompts/types.ts'), name: 'PromptTemplate', expr: 'PromptTemplate[]' },
  extract(raw) {
    const prompts = (raw as { prompts: any[] }).prompts;
    return prompts.map((p) => ({ ...p, usageCount: 0, rating: 0, author: 'pi-agent-edu' }));
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as PromptLike[];
    const errs: string[] = [];
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    for (const it of items) {
      const abs = join(ctx.root, 'src', 'data', 'prompts', `${it.scenario}.ts`);
      const existing = existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set<string>();
      for (const id of collidingIds([it], existing)) errs.push(`id 已存在: ${id}`);
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const items = value as PromptLike[];
    const groups = new Map<string, any[]>();
    for (const it of items as any[]) {
      const scenario = it.scenario; // 原始 scenario（如 'explain'），作文件名 + 分组键
      if (!groups.has(scenario)) groups.set(scenario, []);
      groups.get(scenario)!.push(it);
    }
    const files: string[] = [];
    for (const [scenario, group] of groups) {
      const abs = join(ctx.root, 'src', 'data', 'prompts', `${scenario}.ts`);
      const arrayName = scenarioArray(scenario);
      if (!existsSync(abs)) {
        writeFileSync(abs, `import type { PromptTemplate } from './types';\n\nexport const ${arrayName}: PromptTemplate[] = [\n];\n`, 'utf-8');
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
