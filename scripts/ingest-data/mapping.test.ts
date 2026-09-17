// mapping.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECT_KEYS, gradeToStage } from './mapping';

test('SUBJECT_KEYS 覆盖全部学科', () => {
  assert.equal(SUBJECT_KEYS['数学'], 'math');
  assert.equal(SUBJECT_KEYS['道德与法治'], 'moral');
  assert.equal(SUBJECT_KEYS['政治'], 'politics');
});

test('gradeToStage 兼容数值与单词', () => {
  assert.equal(gradeToStage('7'), 'middle');
  assert.equal(gradeToStage('12'), 'high');
  assert.equal(gradeToStage('middle'), 'middle');
  assert.equal(gradeToStage('primary'), 'primary');
});

test('gradeToStage 未知值抛错', () => {
  assert.throws(() => gradeToStage('99'));
});
