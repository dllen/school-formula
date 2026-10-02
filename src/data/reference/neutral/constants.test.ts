import { describe, expect, it } from 'vitest';
import { physicalConstants } from './constants';

// value 与 alternate 里允许出现的 SI 符号 / 单位。显式白名单而非长度启发式：
// alternate 正是作者最想写成文案的字段（"10 m/s² for school work"），任何白名单外
// 的单词都意味着语言泄漏。
const CONSTANT_UNIT_TOKENS = new Set(['m', 's', 'J', 'C', 'kg', 'mol', 'N']);

describe('physicalConstants', () => {
  it('returns symbol / value pairs', () => {
    const constants = physicalConstants();
    expect(constants).toHaveLength(8);
    for (const constant of constants) {
      expect(constant.symbol.length).toBeGreaterThan(0);
      expect(constant.value.length).toBeGreaterThan(0);
    }
  });

  it('gives every constant a distinct symbol', () => {
    const symbols = physicalConstants().map((constant) => constant.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it('carries no display names — only standard symbols and SI units', () => {
    for (const constant of physicalConstants()) {
      expect(constant.symbol.length).toBeLessThanOrEqual(3);
      // alternate 也要查——它是作者最容易填进文案的字段。
      const fields = [constant.value, ...(constant.alternate ? [constant.alternate] : [])];
      for (const field of fields) {
        for (const token of field.split(/[^A-Za-z]+/).filter(Boolean)) {
          expect(CONSTANT_UNIT_TOKENS.has(token), `unexpected token "${token}" in "${field}"`).toBe(
            true,
          );
        }
      }
    }
  });

  it('keeps the two accepted values of gravitational acceleration', () => {
    const gravity = physicalConstants().find((constant) => constant.symbol === 'g');
    expect(gravity?.value).toBe('9.8 m/s²');
    expect(gravity?.alternate).toBe('10 m/s²');
  });
});
