import { describe, expect, it } from 'vitest';
import { metricConversionRows } from './conversions';

describe('metricConversionRows', () => {
  it('covers length, mass and time in that order', () => {
    const groups = metricConversionRows()
      .map((row) => row[0])
      .filter(Boolean);
    expect(groups).toEqual(['Length', 'Mass', 'Time']);
  });

  it('keeps every row a two-cell pair with a non-empty conversion', () => {
    for (const row of metricConversionRows()) {
      expect(row).toHaveLength(2);
      expect(row[1].length).toBeGreaterThan(0);
    }
  });

  it('states the metric powers-of-ten relations exactly', () => {
    const rows = metricConversionRows();
    expect(rows).toContainEqual(['Length', '1 km = 1000 m']);
    expect(rows).toContainEqual(['Mass', '1 t = 1000 kg']);
    expect(rows).toContainEqual(['Time', '1 h = 60 min = 3600 s']);
  });
});
