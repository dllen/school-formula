import { describe, expect, it } from 'vitest';
import { physicsConstantRows } from './constants';

describe('physicsConstantRows', () => {
  it('returns quantity / symbol / value triples', () => {
    const rows = physicsConstantRows();
    expect(rows).toHaveLength(8);
    for (const row of rows) {
      expect(row).toHaveLength(3);
      expect(row[0].length).toBeGreaterThan(0);
      expect(row[1].length).toBeGreaterThan(0);
      expect(row[2].length).toBeGreaterThan(0);
    }
  });

  it('gives every row a distinct symbol', () => {
    const symbols = physicsConstantRows().map((row) => row[1]);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it('states the two accepted values of gravitational acceleration', () => {
    const gravity = physicsConstantRows().find((row) => row[1] === 'g');
    expect(gravity?.[2]).toBe('9.8 m/s² (or 10 m/s²)');
  });
});
