import { describe, test, expect } from 'vitest';
import { matchBracket } from './export-seed.mjs';

describe('matchBracket', () => {
  test('配平方括号：简单数组', () => {
    // [1,2,3] → ] 在索引 6，返回 6+1=7
    expect(matchBracket('[1,2,3]', 0)).toBe(7);
    // [1,2,[3]] → ] 在索引 8，返回 9
    expect(matchBracket('[1,2,[3]]', 0)).toBe(9);
    // [{"id":"a"},{"id":"b"}] → ] 在索引 22，返回 23
    expect(matchBracket('[{"id":"a"},{"id":"b"}]', 0)).toBe(23);
  });

  test('配平花括号：对象', () => {
    // {"a":1} → } 在索引 6，返回 7
    expect(matchBracket('{"a":1}', 0)).toBe(7);
    // {"}":"v"} → } 在索引 8，返回 9
    expect(matchBracket('{"}":"v"}', 0)).toBe(9);
    // a{b{c}d}e：从索引 1 的 { 开始，最外层 } 在索引 7，返回 8
    expect(matchBracket('a{b{c}d}e', 1)).toBe(8);
  });

  test('配平圆括号', () => {
    // (1+2) → ) 在索引 4，返回 5
    expect(matchBracket('(1+2)', 0)).toBe(5);
    // ((a)) → ) 在索引 4，返回 5
    expect(matchBracket('((a))', 0)).toBe(5);
  });

  test('字符串内容不参与配平', () => {
    // ["]"] → 字符串内的 ] 被忽略，] 在索引 4，返回 5
    expect(matchBracket('["]"]', 0)).toBe(5);
    // {"}":"{"} → 字符串内的 { 和 } 被忽略，} 在索引 8，返回 9
    expect(matchBracket('{"}":"{"}', 0)).toBe(9);
  });

  test('非起始括号时正确位置', () => {
    // a{b{c}d}e：从索引 1 的 { 开始，最外层 } 在索引 7，返回 8
    expect(matchBracket('a{b{c}d}e', 1)).toBe(8);
    // 从索引 3 的 {（即内层 {c}）开始，} 在索引 5，返回 6
    expect(matchBracket('a{b{c}d}e', 3)).toBe(6);
  });

  test('未闭合时抛错（含 not matched）', () => {
    expect(() => matchBracket('[1,2', 0)).toThrow(/not matched/);
    expect(() => matchBracket('{a: [1,2', 0)).toThrow(/not matched/);
    expect(() => matchBracket('[', 0)).toThrow(/not matched/);
  });

  test('非开括号时抛错', () => {
    expect(() => matchBracket('abc', 0)).toThrow(/not an opening bracket/);
  });
});
