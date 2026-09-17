// adapters/tutorial.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, insertLineAfter, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface TutorialLike {
  id: string;
  grade: string;
  subject: string;
  units: { id: string; practice: unknown[] }[];
}

export function arrayNameFor(tutorial: TutorialLike): string {
  const stage = gradeToStage(tutorial.grade);
  const key = SUBJECT_KEYS[tutorial.subject];
  if (!key) throw new Error(`未知学科: ${tutorial.subject}`);
  return `${stage.toUpperCase()}_${key.toUpperCase()}_TUTORIALS`;
}

function targetFile(t: TutorialLike, ctx: IngestContext): string {
  const stage = gradeToStage(t.grade);
  const key = SUBJECT_KEYS[t.subject];
  return join(ctx.root, 'src', 'data', 'tutorials', `${stage}-${key}.ts`);
}

function existingIdsFor(t: TutorialLike, ctx: IngestContext): Set<string> {
  const abs = targetFile(t, ctx);
  return existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set();
}

export const tutorialAdapter: Adapter = {
  kind: 'tutorials',
  typeRef: { path: join(getRoot(), 'src/data/tutorials/types.ts'), name: 'Tutorial', expr: 'Tutorial' },
  extract(raw) {
    return (raw as { tutorial: unknown }).tutorial;
  },
  validate(value, ctx) {
    const t = value as TutorialLike;
    if (!t || typeof t.id !== 'string') return ['payload 需包含 tutorial 对象'];
    const errs: string[] = [];
    const existing = existingIdsFor(t, ctx);
    if (existing.has(t.id)) errs.push(`id 已存在: ${t.id}`);
    for (const id of duplicateIds(t.units)) errs.push(`重复单元 id: ${id}`);
    for (const id of collidingIds(t.units, existing)) errs.push(`单元 id 已存在: ${id}`);
    for (const u of t.units) {
      if (u.practice.length !== 10) errs.push(`单元 ${u.id} 练习题数量为 ${u.practice.length}，应为 10`);
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const t = value as TutorialLike;
    const abs = targetFile(t, ctx);
    const name = arrayNameFor(t);
    if (existsSync(abs)) {
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, [value]), 'utf-8');
    } else {
      const header = `import type { Tutorial } from './types';\n\nexport const ${name}: Tutorial[] = [\n];\n`;
      writeFileSync(abs, header, 'utf-8');
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, [value]), 'utf-8');
    }
    return { files: [abs], inserted: 1 };
  },
  wire(value, _raw, ctx) {
    const t = value as TutorialLike;
    const stage = gradeToStage(t.grade);
    const key = SUBJECT_KEYS[t.subject];
    const name = arrayNameFor(t);
    const indexPath = join(ctx.root, 'src', 'data', 'tutorials', 'index.ts');
    let content = readFileSync(indexPath, 'utf-8');
    if (content.includes(`export { ${name} }`)) return { files: [] };
    content = insertLineAfter(content, `export * from './types';`, `export { ${name} } from './${stage}-${key}';`);
    content = insertLineAfter(content, `import type { Tutorial, TutorialUnit } from './types';`, `import { ${name} } from './${stage}-${key}';`);
    content = content.replace('export const ALL_TUTORIALS: Tutorial[] = [', `export const ALL_TUTORIALS: Tutorial[] = [\n  ...${name},`);
    writeFileSync(indexPath, content, 'utf-8');
    return { files: [indexPath] };
  },
};
