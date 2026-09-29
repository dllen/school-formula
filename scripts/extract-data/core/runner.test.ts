import { describe, it, expect } from 'vitest';
import { listAdapters, getAdapter } from './runner.js';

describe('adapter registry', () => {
  it('lists registered adapters', () => {
    const adapters = listAdapters();
    expect(adapters.length).toBeGreaterThanOrEqual(1);
    expect(adapters.some(a => a.kind === 'shiji')).toBe(true);
  });

  it('getAdapter returns adapter by kind', () => {
    expect(getAdapter('shiji')?.kind).toBe('shiji');
    expect(getAdapter('unknown')).toBeUndefined();
  });
});
