import { describe, it, expect } from 'vitest';
import type { Adapter } from './adapter.js';

describe('Adapter interface contract', () => {
  it('requires kind/name/description + 3 methods', async () => {
    // 编译期契约检查：Adapter 必须有 6 个成员
    const a: Adapter = {
      kind: 'shiji',
      name: 'test',
      description: 'test adapter',
      listUrls: async () => [],
      fetchPage: async () => ({}),
      normalize: () => ({ source: 'test', extractedAt: '2026-01-01T00:00:00.000Z' }),
    };
    expect(a.kind).toBe('shiji');
    expect(await a.listUrls()).toEqual([]);
  });
});
