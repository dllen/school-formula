import { describe, test, expect } from 'vitest';
import { matchBracket } from './export-seed.mjs';

describe('matchBracket', () => {
  test('配平方括号：[1,2,[3]] → 9', () => {
    // [1,2,[3]] 长度 9，] 在索引 8，matchBracket 返回 9
    expect(matchBracket('[1,2,[3]]', 0)).toBe(9);
    // [{"id":"a"},{"id":"b"}] 长度 23，] 在索引 22，返回 23
    expect(matchBracket('[{"id":"a"},{"id":"b"}]', 0)).toBe(23);
  });

  test('配平花括号：{"}":"v"} → 9', () => {
    // 长度 9，} 在索引 8，返回 9
    expect(matchBracket('{"}":"v"}', 0)).toBe(9);
    // a{b{c}d}e：从索引 1 的 { 开始，配平嵌套 {c}，最外层 } 在索引 7，返回 8
    expect(matchBracket('a{b{c}d}e', 1)).toBe(8);
  });

  test('未闭合时抛错（含 not matched）', () => {
    expect(() => matchBracket('[1,2', 0)).toThrow(/not matched/);
    expect(() => matchBracket('{a: [1,2', 0)).toThrow(/not matched/);
  });
});
