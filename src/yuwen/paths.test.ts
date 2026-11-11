// src/yuwen/paths.test.ts
import { describe, expect, it } from 'vitest';
import { YUWEN_CHARS, YUWEN_LESSONS } from '../data/yuwen';
import {
  allYuwenRoutePaths,
  bookPath,
  charPath,
  duoyinPath,
  isYuwenPath,
  lessonPath,
  pinyinPath,
  reviewPath,
  tingxiePath,
} from './paths';

describe('yuwen paths', () => {
  it('构造 9 类 URL', () => {
    expect(bookPath('1a')).toBe('/yuwen/book/1a');
    expect(lessonPath('G1A01')).toBe('/yuwen/lesson/G1A01');
    expect(charPath('天')).toBe('/yuwen/char/%E5%A4%A9');
    expect(reviewPath('1a', 1)).toBe('/yuwen/review/1a/1');
    expect(tingxiePath('1a', 1)).toBe('/yuwen/tingxie/1a/1');
    expect(tingxiePath('1a', 1, { shuffle: true, hint: true, answers: false })).toBe(
      '/yuwen/tingxie/1a/1?shuffle=1&hint=1&answers=0',
    );
    expect(pinyinPath()).toBe('/yuwen/pinyin');
    expect(pinyinPath('zhang')).toBe('/yuwen/pinyin/zhang');
    expect(duoyinPath()).toBe('/yuwen/duoyin');
  });

  it('isYuwenPath 只认 /yuwen 与其子路径', () => {
    expect(isYuwenPath('/yuwen')).toBe(true);
    expect(isYuwenPath('/yuwen/')).toBe(true);
    expect(isYuwenPath('/yuwen/char/天')).toBe(true);
    expect(isYuwenPath('/yuwenx')).toBe(false);
    expect(isYuwenPath('/')).toBe(false);
  });

  it('预渲染清单是未编码的原始路径，且不重复', () => {
    const paths = allYuwenRoutePaths();
    expect(paths).toContain('/yuwen/char/天');
    expect(paths).not.toContain('/yuwen/char/%E5%A4%A9');
    expect(paths.length).toBeGreaterThan(3000);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain('/yuwen/lesson/' + YUWEN_LESSONS[0].id);
    expect(paths).toContain('/yuwen');
    expect(paths.filter((p) => p.startsWith('/yuwen/char/')).length).toBe(YUWEN_CHARS.length);
  });
});
