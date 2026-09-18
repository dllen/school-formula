// index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kindFromPath, listStaged } from './index';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('kindFromPath 从 staging 路径推断 kind', () => {
  assert.equal(kindFromPath('/repo/staging/formulas/x.json'), 'formulas');
  assert.equal(kindFromPath('/repo/staging/tutorials/a.json'), 'tutorials');
  assert.throws(() => kindFromPath('/repo/foo/x.json'));
});

test('listStaged 只收集 staging/<kind>/*.json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ingest-'));
  mkdirSync(join(dir, 'staging', 'formulas'), { recursive: true });
  mkdirSync(join(dir, 'staging', 'tutorials'), { recursive: true });
  writeFileSync(join(dir, 'staging', 'formulas', 'a.json'), '{}');
  writeFileSync(join(dir, 'staging', 'tutorials', 'b.json'), '{}');
  writeFileSync(join(dir, 'staging', 'tutorials', 'skip.txt'), '{}');
  const files = listStaged(dir);
  assert.deepEqual(files.sort(), [
    join(dir, 'staging', 'formulas', 'a.json'),
    join(dir, 'staging', 'tutorials', 'b.json'),
  ]);
  rmSync(dir, { recursive: true, force: true });
});
