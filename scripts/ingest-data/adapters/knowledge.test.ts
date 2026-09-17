import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeAdapter } from './knowledge';
import { getRoot } from '../paths';

const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
const kp = (id: string) => ({ id, title: 't', description: 'd' });

test('validate 拒绝重复 id', () => {
  const errs = knowledgeAdapter.validate([kp('p-math-001'), kp('p-math-001')], ctx);
  assert.ok(errs.some((e) => e.includes('重复')));
});
