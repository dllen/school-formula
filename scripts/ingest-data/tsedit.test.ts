// tsedit.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendToConstArray, insertLineAfter, extractIds } from './tsedit';

const SRC = `export const X: T[] = [\n  { id: 'a' },\n];\n`;

test('appendToConstArray 在数组尾部插入', () => {
  const out = appendToConstArray(SRC, 'X', [{ id: 'b' }]);
  assert.ok(out.includes(`{ id: 'a' }`));
  assert.ok(out.includes(`"id": "b"`));
  assert.ok(out.indexOf('a') < out.indexOf('b'));
});

test('insertLineAfter 在锚点后插入一行', () => {
  const out = insertLineAfter("line1\nline2\n", 'line1', 'INSERTED');
  assert.equal(out, "line1\nINSERTED\nline2\n");
});

test('extractIds 提取单双引号 id', () => {
  const ids = extractIds(`{ id: 'a' }, { "id": "b" }, { id: "a" }`);
  assert.deepEqual([...ids].sort(), ['a', 'b']);
});
