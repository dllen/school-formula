// tutorial.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tutorialAdapter, arrayNameFor } from './tutorial';
import { getRoot } from '../paths';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('validate 拒绝 id 冲突与题量非 10', () => {
  const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
  // 用已存在的 id（middle-math-7 已在库中）制造冲突
  const dup = { id: 'middle-math-7', grade: '7', gradeName: '七年级', subject: '数学', subjectIcon: '📐', title: 'x', description: 'x', units: [] };
  assert.ok(tutorialAdapter.validate(dup, ctx).some((e) => e.includes('已存在')));
  const bad = { id: 'middle-math-9', grade: '7', gradeName: '七年级', subject: '数学', subjectIcon: '📐', title: 'x', description: 'x', units: [{ id: 'm-math-9-u1', title: 'x', order: 1, duration: 'x', objectives: [], teach: { hook: '', summary: '' }, learn: { sections: [], tips: [] }, practice: [], aiContext: '' }] };
  assert.ok(tutorialAdapter.validate(bad, ctx).some((e) => e.includes('10')));
});

test('arrayNameFor 推导正确数组名', () => {
  const tutorial = { id: 'middle-math-9', grade: '7', subject: '数学' } as any;
  assert.equal(arrayNameFor(tutorial), 'MIDDLE_MATH_TUTORIALS');
});
