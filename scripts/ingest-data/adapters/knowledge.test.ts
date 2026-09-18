import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeAdapter } from './knowledge';
import { getRoot } from '../paths';

const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
const kp = (id: string) => ({ id, title: 't', description: 'd' });
const env = (knowledgePoints: { id: string }[]) => ({ grade: 'primary', subject: '数学', knowledgePoints });

test('validate 拒绝重复 id', () => {
  const errs = knowledgeAdapter.validate(env([kp('p-math-new-1'), kp('p-math-new-1')]), ctx);
  assert.ok(errs.some((e) => e.includes('重复')));
});

test('validate 拒绝目标文件中已存在的 id', () => {
  // p-math-001 已存在于 src/data/knowledge/primary/math.ts
  const errs = knowledgeAdapter.validate(env([kp('p-math-001')]), ctx);
  assert.ok(errs.some((e) => e.includes('id 已存在: p-math-001')));
});
