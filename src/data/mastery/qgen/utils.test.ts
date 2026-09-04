import { describe, it, expect } from 'vitest';
import { rand, shuffle, generateOptions, generateNumOptions } from './utils';

describe('rand', () => {
  it('returns integer within range', () => {
    for (let i = 0; i < 100; i++) {
      const r = rand(1, 10);
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(10);
      expect(Number.isInteger(r)).toBe(true);
    }
  });

  it('handles single-value range', () => {
    expect(rand(5, 5)).toBe(5);
  });

  it('handles negative ranges', () => {
    for (let i = 0; i < 50; i++) {
      const r = rand(-10, -1);
      expect(r).toBeGreaterThanOrEqual(-10);
      expect(r).toBeLessThanOrEqual(-1);
    }
  });

  it('produces varied outputs (not stuck on one value)', () => {
    const results = new Set<number>();
    for (let i = 0; i < 50; i++) {
      results.add(rand(1, 10));
    }
    expect(results.size).toBeGreaterThan(3);
  });
});

describe('shuffle', () => {
  it('preserves all elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles single element', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces different orderings over multiple calls', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const orderings = new Set<string>();
    for (let i = 0; i < 20; i++) {
      orderings.add(shuffle(input).join(','));
    }
    // With 10 elements, 20 shuffles should produce at least 2 different orderings
    expect(orderings.size).toBeGreaterThan(1);
  });
});

describe('generateOptions', () => {
  it('returns correct answer index', () => {
    const correct = '42';
    const distractors = ['41', '43', '44'];
    const { opts, ans } = generateOptions(correct, distractors);
    expect(opts[ans]).toBe(correct);
  });

  it('includes all distractors', () => {
    const correct = 'A';
    const distractors = ['B', 'C', 'D'];
    const { opts } = generateOptions(correct, distractors);
    expect(opts).toContain('A');
    expect(opts).toContain('B');
    expect(opts).toContain('C');
    expect(opts).toContain('D');
    expect(opts.length).toBe(4);
  });

  it('shuffles answer position', () => {
    const correct = 'X';
    const positions = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const { ans } = generateOptions(correct, ['Y', 'Z', 'W']);
      positions.add(ans);
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});

describe('generateNumOptions', () => {
  it('returns correct numeric answer', () => {
    const { opts, ans } = generateNumOptions(42);
    expect(opts[ans]).toBe('42');
  });

  it('generates specified count of options', () => {
    const { opts } = generateNumOptions(10, 4);
    expect(opts.length).toBe(4);
  });

  it('all options are non-negative', () => {
    const { opts } = generateNumOptions(5, 4);
    opts.forEach(o => {
      expect(parseInt(o)).toBeGreaterThanOrEqual(0);
    });
  });

  it('distractors differ from answer', () => {
    const { opts, ans } = generateNumOptions(10);
    const answer = opts[ans];
    opts.forEach((o, i) => {
      if (i !== ans) expect(o).not.toBe(answer);
    });
  });

  it('handles answer = 0', () => {
    const { opts, ans } = generateNumOptions(0);
    expect(opts[ans]).toBe('0');
  });
});
