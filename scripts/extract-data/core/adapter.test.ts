import { describe, it, expect } from 'vitest';
import type { Adapter } from './adapter.js';

describe('Adapter interface contract', () => {
  it('requires kind/name/description + 4 methods', () => {
    const a: Adapter = {
      kind: 'shiji',
      name: 'test',
      description: 'test adapter',
      listUrls: async () => [],
      fetchHtml: async () => '<html></html>',
      parseHtml: async () => ({}),
      normalize: () => ({ source: 'test', extractedAt: '2026-01-01T00:00:00.000Z' }),
    };
    expect(a.kind).toBe('shiji');
    expect(a.name).toBe('test');
    expect(a.description).toBe('test adapter');
  });
});
