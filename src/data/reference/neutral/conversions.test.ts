import { describe, expect, it } from 'vitest';
import { metricConversionGroups } from './conversions';

// 允许出现的单位符号白名单。刻意做成显式列表而非「字母数不超过 N」这类启发式——
// 后者是照着数据里的常量校准的（day 恰好三个字母就蒙混过关）。任何白名单外的
// 单词都意味着混进了文案，未来加 es/ 时就得改写。
const UNIT_TOKENS = new Set(['km', 'm', 'cm', 'mm', 't', 'kg', 'g', 'mg', 'h', 'min', 's', 'd']);

describe('metricConversionGroups', () => {
  it('covers length, mass and time in that order', () => {
    expect(metricConversionGroups().map((group) => group.key)).toEqual(['length', 'mass', 'time']);
  });

  it('carries no display copy — entries are digits, operators and unit symbols only', () => {
    for (const group of metricConversionGroups()) {
      for (const entry of group.entries) {
        expect(entry).toContain('=');
        for (const token of entry.split(/[^A-Za-z]+/).filter(Boolean)) {
          expect(UNIT_TOKENS.has(token), `unexpected token "${token}" in "${entry}"`).toBe(true);
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
