// simple-array.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simpleArrayAdapter } from './simple-array';
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
