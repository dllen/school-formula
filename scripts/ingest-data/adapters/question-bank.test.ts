// question-bank.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionBankAdapter } from './question-bank';
import { getRoot } from '../paths';

const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
const q = (id: string, kp: string[]) => ({
  id, type: 'choice', difficulty: 'basic', stem: 's', options: ['A', 'B'], answer: 'A',
  explanation: 'e', tags: ['t'], knowledgePointIds: kp, subject: '数学', grade: 'middle',
});

test('校验 knowledgePointIds 必须存在', () => {
  const errs = questionBankAdapter.validate([q('q-x-1', ['不存在的kp'])], ctx);
  assert.ok(errs.some((e) => e.includes('knowledgePointId')));
});

test('校验同 payload subject/grade 不一致', () => {
  const errs = questionBankAdapter.validate([q('q-x-1', []), { ...q('q-x-2', []), subject: '物理' }], ctx);
  assert.ok(errs.some((e) => e.includes('一致')));
});
