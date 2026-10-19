import { describe, expect, it } from 'vitest';
import { cacheControlFor } from './cache';

describe('cacheControlFor', () => {
  it('gives hashed assets a long immutable cache', () => {
    expect(cacheControlFor('/assets/index-abc123.js', 'application/javascript')).toContain('immutable');
  });

  it('gives html a short shared cache', () => {
    const value = cacheControlFor('/en/math/multiplication-chart/', 'text/html; charset=utf-8');
    expect(value).toContain('s-maxage=3600');
    expect(value).toContain('stale-while-revalidate');
  });

  it('does not cache api responses', () => {
    expect(cacheControlFor('/api/health', 'application/json')).toBe('no-store');
  });
});
