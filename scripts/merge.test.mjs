import { describe, test, expect } from 'vitest';
import { matchBracketForward } from './merge-tutorials.mjs';

describe('matchBracketForward', () => {
  test('简单对象', () => {
    const t = '{ id: "p-math-001", title: "x" }';
    expect(matchBracketForward(t, 0)).toBe(t.length);
  });

  test('嵌套对象', () => {
    const t = '{ a: { b: 1 }, c: [2, 3] }';
    expect(matchBracketForward(t, 0)).toBe(t.length);
  });

  test('带字符串的对象', () => {
    const t = '{ id: "x", text: "hello {world}" }';
    expect(matchBracketForward(t, 0)).toBe(t.length);
  });

  test('数组', () => {
    const t = '[1, 2, [3]]';
    expect(matchBracketForward(t, 0)).toBe(t.length);
  });
});
