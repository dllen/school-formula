// src/data/yuwen/index.test.ts
import { describe, expect, it } from 'vitest';
import {
  YUWEN_BOOKS,
  YUWEN_CHARS,
  YUWEN_LESSONS,
  YUWEN_STEMS,
  bookById,
  charByChar,
  charsOfLesson,
  charsOfRadical,
  homophonesOf,
  lessonById,
  stemByStem,
  unitOf,
} from './index';

describe('yuwen 运行时查询层', () => {
  it('数据规模与 spec 一致', () => {
    expect(YUWEN_BOOKS).toHaveLength(10);
    expect(YUWEN_LESSONS).toHaveLength(326);
    expect(YUWEN_CHARS).toHaveLength(2988);
    expect(YUWEN_STEMS.length).toBeGreaterThan(300);
  });

  it('按 id 查册与课', () => {
    expect(bookById('1a')?.title).toBe('一年级上册');
    const lesson = lessonById('G1A01');
    expect(lesson?.title).toBe('识字1：天地人');
    expect(lesson?.bookId).toBe('1a');
    expect(bookById('nope')).toBeUndefined();
    expect(lessonById('nope')).toBeUndefined();
  });

  it('按字查详情，含读音与组词', () => {
    const di = charByChar('地');
    expect(di).toBeDefined();
    expect(di!.readings.some((r) => r.py === 'dì')).toBe(true);
    expect(di!.readings[0].py).toBe('dì');
    expect(di!.radicals).toContain('土');
    expect(charByChar('不存在的字')).toBeUndefined();
  });

  it('同音字按精确读音分组且不含自身', () => {
    const list = homophonesOf('地', 'dì');
    expect(list).not.toContain('地');
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('第');
  });

  it('部件反查与单元区间', () => {
    expect(charsOfRadical('土')).toContain('地');
    const unit = unitOf('1a', 1);
    expect(unit?.lessons.map((l) => l.id)).toEqual([
      'G1A01', 'G1A02', 'G1A03', 'G1A04', 'G1A05', 'G1A06',
    ]);
    expect(unit?.chars).toContain('天');
    expect(unitOf('1a', 99)).toBeUndefined();
    expect(unitOf('nope', 1)).toBeUndefined();
  });

  it('课的字表与 stem 查询', () => {
    expect(charsOfLesson('G1A01')).toEqual(['天', '地', '人', '你', '我', '他']);
    expect(stemByStem('a')?.rows.length).toBeGreaterThan(0);
    expect(charsOfLesson('nope')).toEqual([]);
  });
});
