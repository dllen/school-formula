import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractJson, inferKindFromEnvelope } from './staging.js';

test('extractJson 去掉围栏与尾部文字', () => {
  assert.deepEqual(extractJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(extractJson('{"a":1}\n\n以上是结果。'), { a: 1 });
});

test('extractJson 非法输入抛错', () => {
  assert.throws(() => extractJson('没有 JSON'));
});

test('inferKindFromEnvelope 按信封键推断', () => {
  assert.equal(inferKindFromEnvelope({ tutorial: {} }), 'tutorials');
  assert.equal(inferKindFromEnvelope({ questions: [] }), 'questions');
  assert.equal(inferKindFromEnvelope({ mnemonics: [] }), 'mental-math');
  assert.equal(inferKindFromEnvelope({ knowledgePoints: [] }), 'knowledge');
});
