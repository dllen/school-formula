// simple-array.test.ts
import { test, describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import assert from 'node:assert/strict';
import { simpleArrayAdapter } from './simple-array';
import type { IngestContext } from '../types';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cfg = {
  kind: 'test',
  envelopeKey: 'items',
  typeRef: { path: '/nope/types.ts', name: 'T', expr: 'T[]' },
  file: 'data.ts',
  arrayName: () => 'ALL',
};

test('extract + validate + merge 全链路', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ingest-'));
  writeFileSync(join(dir, 'data.ts'), "export const ALL: T[] = [\n  { id: 'a' },\n];\n", 'utf-8');
  const adapter = simpleArrayAdapter(cfg);
  const value = adapter.extract({ items: [{ id: 'b' }] });
  assert.deepEqual(value, [{ id: 'b' }]);
  const ctx = { root: dir, dryRun: false, knowledgePointIds: new Set<string>() };
  assert.deepEqual(adapter.validate([{ id: 'a' }], ctx), ['id 已存在: a']);
  const merged = adapter.merge([{ id: 'b' }], { items: [{ id: 'b' }] }, ctx);
  assert.equal(merged.inserted, 1);
  assert.ok(readFileSync(join(dir, 'data.ts'), 'utf-8').includes('"id": "b"'));
  rmSync(dir, { recursive: true, force: true });
});


describe('simpleArrayAdapter dedup', () => {
  let tmpDir: string;
  let ctx: IngestContext;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dedup-test-'));
    ctx = { root: tmpDir, dryRun: false, knowledgePointIds: new Set() };
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('skips incoming items whose dedupBy key matches existing data', () => {
    const file = join(tmpDir, 'data.ts');
    writeFileSync(
      file,
      `export const DATA = [
        { id: 'v1', title: '周本纪', chapter: '卷一', content: ['a'] },
      ];`,
      'utf-8'
    );
    const adapter = simpleArrayAdapter({
      kind: 'test',
      envelopeKey: 'items',
      typeRef: { path: '/x.ts', name: 'Item', expr: 'Item[]' },
      file: 'data.ts',
      arrayName: () => 'DATA',
      dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
      dedupFields: ['title', 'chapter'],
    });

    const stderrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const incoming = [
      { id: 'v2', title: '周本纪', chapter: '卷一', content: ['dup'] },
      { id: 'v3', title: '夏本纪', chapter: '卷二', content: ['b'] },
    ];
    const result = adapter.merge(incoming, { items: incoming }, ctx);

    expect(result.inserted).toBe(1);
    const updated = readFileSync(file, 'utf-8');
    expect(updated).toContain('夏本纪');
    expect(updated).toContain('v3');
    expect(updated).not.toContain('"id": "v2"'); // duplicate not added
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining('skip "周本纪|卷一"')
    );

    stderrSpy.mockRestore();
  });
});
