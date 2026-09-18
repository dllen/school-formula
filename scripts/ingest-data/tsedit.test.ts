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

test('appendToConstArray 匹配非导出 const 数组', () => {
  const src = `const X: T[] = [\n  { id: 'a' },\n];\n`;
  const out = appendToConstArray(src, 'X', [{ id: 'b' }]);
  assert.ok(out.includes(`"id": "b"`));
  assert.ok(out.indexOf('a') < out.indexOf('b'));
});

test('appendToConstArray 跳过字符串字面量内的 [ 与 ]', () => {
  const src = `const X: T[] = [\n  { text: 'a]b', range: '[0,1)' },\n];\n`;
  const out = appendToConstArray(src, 'X', [{ text: 'c' }]);
  // 既有元素保持完整（字符串内的 ] 与 [ 未被当作数组边界）
  assert.ok(out.includes(`{ text: 'a]b', range: '[0,1)' }`));
  // 新条目插入在既有元素之后、数组闭合之前
  assert.ok(out.includes(`"text": "c"`));
  assert.ok(out.indexOf(`'[0,1)'`) < out.indexOf(`"text": "c"`));
});

test('insertLineAfter 在锚点后插入一行', () => {
  const out = insertLineAfter("line1\nline2\n", 'line1', 'INSERTED');
  assert.equal(out, "line1\nINSERTED\nline2\n");
});

test('extractIds 提取单双引号 id', () => {
  const ids = extractIds(`{ id: 'a' }, { "id": "b" }, { id: "a" }`);
  assert.deepEqual([...ids].sort(), ['a', 'b']);
});
