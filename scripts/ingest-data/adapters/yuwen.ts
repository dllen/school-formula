// scripts/ingest-data/adapters/yuwen.ts
//
// 注意：这是唯一一个整树重写（而非「只追加不覆盖」）的 adapter。
// 它独占 src/data/yuwen/ 整棵子树，参考站更新后必须整体替换；
// 若按追加语义合并，重跑会留下新旧混杂的数据。
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext, MergeResult, WireResult } from '../types';
import { getRoot } from '../paths';
import type {
  YuwenBook,
  YuwenChar,
  YuwenDuoyin,
  YuwenEnvelope,
  YuwenLesson,
  YuwenRadical,
  YuwenStem,
} from '../../../src/data/yuwen/types';

const DATA_DIR = 'src/data/yuwen';
const HEADER = '// 由 scripts/ingest-data 生成，请勿手改。来源：yuwen.muduo.org\n\n';

function emitArray<T>(constName: string, typeName: string, items: T[]): string {
  const body = items.map((item) => '  ' + JSON.stringify(item)).join(',\n');
  return (
    HEADER +
    "import type { " + typeName + " } from './types';\n\n" +
    'export const ' + constName + ': ' + typeName + '[] = [\n' + body + ',\n];\n'
  );
}

// 用 satisfies 而非 `: Adapter` 注解：既按 Adapter 契约校验，又保留字面量方法签名
// （wire() 无参、validate(value, ctx) 两参），与调用点一致。
export const yuwenAdapter = {
  kind: 'yuwen',
  typeRef: {
    path: join(getRoot(), 'src/data/yuwen/types.ts'),
    name: 'YuwenEnvelope',
    expr: 'YuwenEnvelope',
  },

  extract(raw: unknown): unknown {
    return raw;
  },

  validate(value: unknown, _ctx: IngestContext): string[] {
    const errs: string[] = [];
    const env = value as YuwenEnvelope;
    if (!env || typeof env !== 'object') return ['信封不是对象'];
    const books = env.books ?? [];
    const lessons = env.lessons ?? [];
    const chars = env.chars ?? [];
    const stems = env.stems ?? [];
    const radicals = env.radicals ?? [];
    const duoyin = env.duoyin ?? [];

    if (!books.length) errs.push('books 为空');
    if (!lessons.length) errs.push('lessons 为空');
    if (!chars.length) errs.push('chars 为空');
    if (!stems.length) errs.push('stems 为空');

    const charSet = new Set(chars.map((c) => c.ch));
    if (charSet.size !== chars.length) errs.push('chars 有重复字');

    const bookIds = new Set(books.map((b) => b.id));
    const lessonIds = new Set(lessons.map((l) => l.id));
    if (lessonIds.size !== lessons.length) errs.push('lessons 有重复 id');

    for (const book of books) {
      if (!/^[1-5][ab]$/.test(book.id)) errs.push('册 id 形态错误: ' + book.id);
      for (const unit of book.units) {
        for (const id of unit.lessonIds) {
          if (!lessonIds.has(id)) errs.push('册 ' + book.id + ' 引用了不存在的课: ' + id);
        }
      }
    }

    for (const lesson of lessons) {
      if (!/^G[1-5][AB]\d{2}$/.test(lesson.id)) errs.push('课 id 形态错误: ' + lesson.id);
      if (!bookIds.has(lesson.bookId)) errs.push('课 ' + lesson.id + ' 的册不存在: ' + lesson.bookId);
      if (!lesson.chars.length) errs.push('课没有生字: ' + lesson.id);
      for (const ch of lesson.chars) {
        if (!charSet.has(ch)) errs.push('课 ' + lesson.id + ' 的字不在字表: ' + ch);
      }
    }

    const lessonCharUnion = new Set(lessons.flatMap((l) => l.chars));
    for (const ch of lessonCharUnion) {
      if (!charSet.has(ch)) errs.push('课的生字并集不在字表: ' + ch);
    }
    for (const ch of charSet) {
      if (!lessonCharUnion.has(ch)) errs.push('字表里的字没有任何课引用: ' + ch);
    }

    for (const stem of stems) {
      for (const row of stem.rows) {
        for (const ch of row.chars) {
          if (!charSet.has(ch)) errs.push('拼音表引用了字表外的字: ' + ch);
        }
      }
    }

    for (const entry of duoyin) {
      if (!charSet.has(entry.ch)) errs.push('多音字不在字表: ' + entry.ch);
    }

    for (const radical of radicals) {
      if (radical.chars.length < 2) errs.push('部件字不足 2 个: ' + radical.name);
      for (const ch of radical.chars) {
        if (!charSet.has(ch)) errs.push('部件 ' + radical.name + ' 引用了字表外的字: ' + ch);
      }
    }

    return errs;
  },

  merge(value: unknown, _raw: unknown, ctx: IngestContext): MergeResult {
    const env = value as YuwenEnvelope;
    const dir = join(ctx.root, DATA_DIR);
    mkdirSync(dir, { recursive: true });
    const files: Record<string, string> = {
      'books.ts': emitArray<YuwenBook>('YUWEN_BOOKS', 'YuwenBook', env.books),
      'lessons.ts': emitArray<YuwenLesson>('YUWEN_LESSONS', 'YuwenLesson', env.lessons),
      'chars.ts': emitArray<YuwenChar>('YUWEN_CHARS', 'YuwenChar', env.chars),
      'pinyin.ts': emitArray<YuwenStem>('YUWEN_STEMS', 'YuwenStem', env.stems),
      'duoyin.ts': emitArray<YuwenDuoyin>('YUWEN_DUOYIN', 'YuwenDuoyin', env.duoyin),
      'radicals.ts': emitArray<YuwenRadical>('YUWEN_RADICALS', 'YuwenRadical', env.radicals),
    };
    const written: string[] = [];
    for (const [name, content] of Object.entries(files)) {
      const path = join(dir, name);
      writeFileSync(path, content, 'utf-8');
      written.push(path);
    }
    return { files: written, inserted: env.chars.length + env.lessons.length };
  },

  wire(): WireResult {
    // 查询层 src/data/yuwen/index.ts 是手写代码，不由脚本生成。
    return { files: [] };
  },
} satisfies Adapter;
