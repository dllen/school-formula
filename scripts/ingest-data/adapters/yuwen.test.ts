import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { yuwenAdapter } from './yuwen';
import type { IngestContext } from '../types';

const ctx = (root: string): IngestContext => ({ root, dryRun: false, knowledgePointIds: new Set() });

function envelope() {
  return {
    source: 'yuwen-muduo',
    extractedAt: '2026-11-11T00:00:00.000Z',
    books: [
      {
        id: '1a',
        title: '一年级上册',
        grade: 1,
        term: 'a',
        lessonCount: 2,
        charCount: 2,
        units: [{ no: 1, lessonIds: ['G1A01', 'G1A02'] }],
      },
    ],
    lessons: [
      { id: 'G1A01', bookId: '1a', unitNo: 1, title: '识字1：天地人', preview: '天地', chars: ['天', '地'] },
      { id: 'G1A02', bookId: '1a', unitNo: 1, title: '识字2：金木水火土', preview: '一', chars: ['一'] },
    ],
    chars: [
      { ch: '天', readings: [{ py: 'tiān', stem: 'tian', lessonId: 'G1A01', words: ['天天'] }], radicals: ['大'], words: ['天天'] },
      { ch: '地', readings: [{ py: 'dì', stem: 'di', lessonId: 'G1A01', words: [] }], radicals: ['土'], words: [] },
      { ch: '一', readings: [{ py: 'yī', stem: 'yi', lessonId: 'G1A02', words: [] }], radicals: ['一'], words: [] },
    ],
    stems: [
      { stem: 'tian', rows: [{ py: 'tiān', chars: ['天'] }] },
      { stem: 'di', rows: [{ py: 'dì', chars: ['地'] }] },
      { stem: 'yi', rows: [{ py: 'yī', chars: ['一'] }] },
    ],
    duoyin: [],
    radicals: [{ name: '大', chars: ['天', '一'] }],
  };
}

describe('yuwenAdapter', () => {
  it('kind 与类型引用指向 yuwen', () => {
    expect(yuwenAdapter.kind).toBe('yuwen');
    expect(yuwenAdapter.typeRef.name).toBe('YuwenEnvelope');
  });

  it('合法信封校验通过', () => {
    expect(yuwenAdapter.validate(envelope(), ctx('/tmp'))).toEqual([]);
  });

  it('引用不完整时报错', () => {
    const bad = envelope();
    bad.lessons[0].chars = ['天', '乙'];
    const errs = yuwenAdapter.validate(bad, ctx('/tmp'));
    expect(errs.join('\n')).toMatch(/乙/);
  });

  it('merge 整树重写 6 个数据文件', () => {
    const root = mkdtempSync(join(tmpdir(), 'yuwen-ingest-'));
    const result = yuwenAdapter.merge(envelope(), envelope(), ctx(root));

    expect(result.files).toHaveLength(6);
    for (const name of ['books', 'lessons', 'chars', 'pinyin', 'duoyin', 'radicals']) {
      expect(existsSync(join(root, 'src/data/yuwen', name + '.ts'))).toBe(true);
    }
    const books = readFileSync(join(root, 'src/data/yuwen/books.ts'), 'utf8');
    expect(books).toContain('由 scripts/ingest-data 生成');
    expect(books).toContain('export const YUWEN_BOOKS');
    expect(books).toContain('一年级上册');
    expect(yuwenAdapter.wire()).toEqual({ files: [] });
  });
});
