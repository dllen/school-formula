import { describe, expect, it } from 'vitest';
import { physicalConstants } from './constants';

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
      // 单位符号最长三个字母（kg / mol）。更长的字母串就意味着混进了文案。
      for (const token of constant.value.split(/[^A-Za-z]+/).filter(Boolean)) {
        expect(token.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('keeps the two accepted values of gravitational acceleration', () => {
    const gravity = physicalConstants().find((constant) => constant.symbol === 'g');
    expect(gravity?.value).toBe('9.8 m/s²');
    expect(gravity?.alternate).toBe('10 m/s²');
  });
});
