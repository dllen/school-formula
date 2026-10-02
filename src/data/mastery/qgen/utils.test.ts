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

  // 回归护栏：曾经干扰项的接受条件是 `d >= 0`，而 offset 只在 1..3 之间，
  // 于是答案 <= -4 时一个干扰项也凑不出来，generateNumOptions 会**静默**只返回
  // 1 个选项。qFunc1（y = kx + b，b 可取负）是唯一能产出负答案的生成器，
  // 表现为 generators.test.ts 偶发断言失败（约 1/30 轮）。
  it('returns a full set of options even when the answer is negative', () => {
    for (const answer of [-1, -2, -3, -4, -5, -50, -1000]) {
      const { opts, ans } = generateNumOptions(answer);
      expect(opts, `answer=${answer}`).toHaveLength(4);
      expect(new Set(opts).size, `answer=${answer} 选项出现重复`).toBe(4);
      expect(opts[ans]).toBe(String(answer));
    }
  });
});
