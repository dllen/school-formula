// adapters/question-bank.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, insertLineAfter, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface QuestionLike {
  id: string;
  subject: string;
  grade: string;
  knowledgePointIds: string[];
}

function targetArray(stage: string, key: string): string {
  const cap = key.charAt(0).toUpperCase() + key.slice(1);
  return `${stage}${cap}Questions`;
}

export const questionBankAdapter: Adapter = {
  kind: 'questions',
  typeRef: { path: join(getRoot(), 'src/data/questions/types.ts'), name: 'Question', expr: 'Question[]' },
  extract(raw) {
    return (raw as { questions: unknown }).questions;
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as QuestionLike[];
    const errs: string[] = [];
    const subject = items[0]?.subject;
    const grade = items[0]?.grade;
    if (!subject || !grade) return ['题目需含 subject 与 grade 字段'];
    for (const it of items) {
      if (it.subject !== subject || it.grade !== grade) {
        errs.push(`题目 subject/grade 需一致: ${it.id}`);
      }
    }
    const stage = gradeToStage(grade);
    const key = SUBJECT_KEYS[subject];
    const abs = join(ctx.root, 'src', 'data', 'questions', `${stage}-${key}-questions.ts`);
    const existing = existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set<string>();
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    for (const id of collidingIds(items, existing)) errs.push(`id 已存在: ${id}`);
    for (const it of items) {
      for (const kp of it.knowledgePointIds) {
        if (!ctx.knowledgePointIds.has(kp)) errs.push(`knowledgePointId 不存在: ${kp}`);
      }
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const items = value as QuestionLike[];
    const stage = gradeToStage(items[0].grade);
    const key = SUBJECT_KEYS[items[0].subject];
    const abs = join(ctx.root, 'src', 'data', 'questions', `${stage}-${key}-questions.ts`);
    const name = targetArray(stage, key);
    if (!existsSync(abs)) {
      writeFileSync(abs, `import type { Question } from './types';\n\nexport const ${name}: Question[] = [\n];\n`, 'utf-8');
    }
    writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, items), 'utf-8');
    return { files: [abs], inserted: items.length };
  },
  wire(value, _raw, ctx) {
    const items = value as QuestionLike[];
    if (items.length === 0) return { files: [] };
    const stage = gradeToStage(items[0].grade);
    const key = SUBJECT_KEYS[items[0].subject];
    const name = targetArray(stage, key);
    const indexPath = join(ctx.root, 'src', 'data', 'questions', 'index.ts');
    let content = readFileSync(indexPath, 'utf-8');
    if (content.includes(`import { ${name} } from './${stage}-${key}-questions'`)) return { files: [] };
    content = insertLineAfter(
      content,
      `import type { Question, QuestionFilter, Difficulty, QuestionType } from './types';`,
      `import { ${name} } from './${stage}-${key}-questions';`,
    );
    content = content.replace(
      'export const ALL_QUESTIONS: Question[] = [',
      `export const ALL_QUESTIONS: Question[] = [\n  ...${name},`,
    );
    writeFileSync(indexPath, content, 'utf-8');
    return { files: [indexPath] };
  },
};
