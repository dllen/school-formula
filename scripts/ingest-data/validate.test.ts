// validate.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { typeCheck, duplicateIds, collidingIds } from './validate';
import { getRoot } from './paths';

test('typeCheck 合法值通过', () => {
  const errs = typeCheck(
    [{ id: 'q-x-1', name: 'x', expression: 'a', grade: 'primary', subject: '数学', condition: 'c' }],
    { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
    getRoot(),
  );
  assert.deepEqual(errs, []);
});

test('typeCheck 缺必填字段报错', () => {
  const errs = typeCheck(
    [{ id: 'q-x-2' }],
    { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
    getRoot(),
  );
  assert.ok(errs.length > 0);
});

test('duplicateIds / collidingIds', () => {
  assert.deepEqual(duplicateIds([{ id: 'a' }, { id: 'a' }]), ['a']);
  assert.deepEqual(collidingIds([{ id: 'a' }, { id: 'b' }], new Set(['b'])), ['b']);
});
