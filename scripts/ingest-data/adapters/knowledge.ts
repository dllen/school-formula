// adapters/knowledge.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, insertLineAfter, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface KnowledgeEnvelope {
  grade: string;
  subject: string;
  knowledgePoints: { id: string }[];
}

function targetFile(env: KnowledgeEnvelope, ctx: IngestContext): string {
  const stage = gradeToStage(env.grade);
  const key = SUBJECT_KEYS[env.subject];
  return join(ctx.root, 'src', 'data', 'knowledge', stage, `${key}.ts`);
}

export const knowledgeAdapter: Adapter = {
  kind: 'knowledge',
  typeRef: { path: join(getRoot(), 'src/data/types.ts'), name: 'KnowledgePoint', expr: 'KnowledgePoint[]' },
  extract(raw) {
    return (raw as KnowledgeEnvelope).knowledgePoints;
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as { id: string }[];
    const errs: string[] = [];
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    return errs;
  },
  merge(value, raw, ctx) {
    const env = raw as KnowledgeEnvelope;
    const abs = targetFile(env, ctx);
    const key = SUBJECT_KEYS[env.subject];
    const items = value as { id: string }[];
    if (!existsSync(abs)) {
      writeFileSync(abs, `import type { KnowledgePoint } from '../../types';\n\nexport const ${key}: KnowledgePoint[] = [\n];\n`, 'utf-8');
    }
    writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), key, items), 'utf-8');
    return { files: [abs], inserted: items.length };
  },
  wire(value, raw, ctx) {
    const env = raw as KnowledgeEnvelope;
    const stage = gradeToStage(env.grade);
    const key = SUBJECT_KEYS[env.subject];
    const agg = join(ctx.root, 'src', 'data', 'knowledge', `${stage}.ts`);
    let content = readFileSync(agg, 'utf-8');
    if (content.includes(`./${stage}/${key}`)) return { files: [] };
    content = insertLineAfter(content, `import type { GradeData } from '../types';`, `import { ${key} } from './${stage}/${key}';`);
    content = insertSubject(content, key, stage, env.subject);
    writeFileSync(agg, content, 'utf-8');
    return { files: [agg] };
  },
};

/** 在 `subjects: [...]` 数组末尾插入一个新学科对象（括号匹配，确定性）。 */
function insertSubject(content: string, key: string, stage: string, name: string): string {
  const anchor = content.indexOf('subjects: [');
  if (anchor === -1) throw new Error('未找到 subjects 数组');
  const open = content.indexOf('[', anchor);
  let depth = 0;
  let close = open;
  for (let i = open; i < content.length; i++) {
    const c = content[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { close = i; break; }
    }
  }
  const item =
    `    {\n      id: '${key}-${stage}',\n      name: '${name}',\n      icon: '📚',\n      knowledgePoints: ${key},\n    },`;
  return content.slice(0, close) + '\n' + item + '\n  ' + content.slice(close);
}
