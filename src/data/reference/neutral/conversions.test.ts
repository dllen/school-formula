import { describe, expect, it } from 'vitest';
import { metricConversionGroups } from './conversions';

describe('metricConversionGroups', () => {
  it('covers length, mass and time in that order', () => {
    expect(metricConversionGroups().map((group) => group.key)).toEqual(['length', 'mass', 'time']);
  });

  it('carries no display copy — entries are digits, operators and unit symbols only', () => {
    for (const group of metricConversionGroups()) {
      for (const entry of group.entries) {
        expect(entry).toContain('=');
        // 单位符号最长三个字母（km / min / day）。更长的字母串就意味着混进了文案。
        for (const token of entry.split(/[^A-Za-z]+/).filter(Boolean)) {
          expect(token.length).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  it('states the metric powers-of-ten relations exactly', () => {
    const entries = metricConversionGroups().flatMap((group) => group.entries);
    expect(entries).toContain('1 km = 1000 m');
    expect(entries).toContain('1 kg = 1000 g');
    expect(entries).toContain('1 h = 60 min = 3600 s');
  });

  it('keeps every group non-empty', () => {
    for (const group of metricConversionGroups()) {
      expect(group.entries.length).toBeGreaterThan(0);
    }
  });
});
