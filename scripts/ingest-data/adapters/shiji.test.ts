import { describe, it, expect } from 'vitest';
import { shijiAdapter } from './shiji.js';
import { getAdapter } from '../registry.js';
import { getRoot } from '../paths';

describe('shijiAdapter', () => {
  it('is registered under kind "shiji"', () => {
    expect(getAdapter('shiji')).toBe(shijiAdapter);
  });

  it('extracts volumes from envelope', () => {
    const env = {
      source: 'shiji-kb',
      extractedAt: '2026-09-29T00:00:00.000Z',
      volumes: [
        { id: 'v5', title: '周本纪', chapter: '卷四', content: ['a'], interpretation: '' },
      ],
    };
    const value = shijiAdapter.extract(env);
    expect(value).toEqual(env.volumes);
  });

  it('validates missing id', () => {
    const items = [{ title: 'x', chapter: '卷一', content: ['a'] }];
    const errs = shijiAdapter.validate(items, { root: getRoot(), dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('id 缺失'))).toBe(true);
  });

  it('validates empty content', () => {
    const items = [{ id: 'v5', title: 'x', chapter: '卷一', content: [] }];
    const errs = shijiAdapter.validate(items, { root: getRoot(), dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('content 缺失'))).toBe(true);
  });
});
