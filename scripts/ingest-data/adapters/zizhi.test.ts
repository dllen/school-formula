import { describe, it, expect } from 'vitest';
import { zizhiAdapter } from './zizhi.js';
import { getAdapter } from '../registry.js';
import { getRoot } from '../paths';

describe('zizhiAdapter', () => {
  it('is registered under kind "zizhi"', () => {
    expect(getAdapter('zizhi')).toBe(zizhiAdapter);
  });

  it('extracts volumes from envelope', () => {
    const env = {
      source: 'dutongjian',
      extractedAt: '2026-09-30T00:00:00.000Z',
      volumes: [
        { id: 'v18', title: '周纪三', period: '威烈王二十三年', content: ['a'], interpretation: '' },
      ],
    };
    const value = zizhiAdapter.extract(env);
    expect(value).toEqual(env.volumes);
  });

  it('validates missing period', () => {
    const items = [{ id: 'v18', title: 'x', content: ['a'] }];
    const errs = zizhiAdapter.validate(items, { root: getRoot(), dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('period 缺失'))).toBe(true);
  });

  it('validates empty content', () => {
    const items = [{ id: 'v18', title: 'x', period: 'y', content: [] }];
    const errs = zizhiAdapter.validate(items, { root: getRoot(), dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('content 缺失'))).toBe(true);
  });
});
