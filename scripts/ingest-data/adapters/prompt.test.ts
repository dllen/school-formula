import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promptAdapter } from './prompt';

test('extract 注入运行时默认字段', () => {
  const v = promptAdapter.extract({
    prompts: [{ id: 'p1', title: 't', scenario: 'explain', icon: '💡', description: 'd', tags: [], template: 'x', variables: [], grades: ['primary'], subjects: ['all'] }],
  });
  const item = (v as { usageCount: number; rating: number; author: string }[])[0];
  assert.equal(item.usageCount, 0);
  assert.equal(item.rating, 0);
  assert.equal(item.author, 'pi-agent-edu');
});
