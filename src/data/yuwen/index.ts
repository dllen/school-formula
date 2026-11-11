// src/data/yuwen/index.ts
//
// 手写查询层：把生成的数据文件建好 Map 索引，供组件与 SEO 使用。
// 数据文件由 scripts/ingest-data 生成，勿手改。
import { YUWEN_BOOKS } from './books';
import { YUWEN_CHARS } from './chars';
import { YUWEN_DUOYIN } from './duoyin';
import { YUWEN_LESSONS } from './lessons';
import { YUWEN_STEMS } from './pinyin';
import { YUWEN_RADICALS } from './radicals';
import type { YuwenBook, YuwenChar, YuwenDuoyin, YuwenLesson, YuwenRadical, YuwenStem } from './types';

export { YUWEN_BOOKS, YUWEN_CHARS, YUWEN_DUOYIN, YUWEN_LESSONS, YUWEN_RADICALS, YUWEN_STEMS };
export type { YuwenBook, YuwenChar, YuwenDuoyin, YuwenLesson, YuwenRadical, YuwenStem };

const BOOK_INDEX = new Map(YUWEN_BOOKS.map((b) => [b.id, b]));
const LESSON_INDEX = new Map(YUWEN_LESSONS.map((l) => [l.id, l]));
const CHAR_INDEX = new Map(YUWEN_CHARS.map((c) => [c.ch, c]));
const STEM_INDEX = new Map(YUWEN_STEMS.map((s) => [s.stem, s]));
const DUOYIN_INDEX = new Map(YUWEN_DUOYIN.map((d) => [d.ch, d]));
const RADICAL_INDEX = new Map(YUWEN_RADICALS.map((r) => [r.name, r]));

/** 读音（精确拼音）→ 字集合，用于同音字。 */
const HOMOPHONE_INDEX: Map<string, string[]> = (() => {
  const index = new Map<string, string[]>();
  for (const item of YUWEN_CHARS) {
    for (const reading of item.readings) {
      const list = index.get(reading.py);
      if (list) list.push(item.ch);
      else index.set(reading.py, [item.ch]);
    }
  }
  return index;
})();

export function bookById(id: string): YuwenBook | undefined {
  return BOOK_INDEX.get(id);
}

export function lessonById(id: string): YuwenLesson | undefined {
  return LESSON_INDEX.get(id);
}

export function charByChar(ch: string): YuwenChar | undefined {
  return CHAR_INDEX.get(ch);
}

export function stemByStem(stem: string): YuwenStem | undefined {
  return STEM_INDEX.get(stem);
}

export function duoyinByChar(ch: string): YuwenDuoyin | undefined {
  return DUOYIN_INDEX.get(ch);
}

/** 同音字（不含自身）。 */
export function homophonesOf(ch: string, py: string): string[] {
  return (HOMOPHONE_INDEX.get(py) ?? []).filter((c) => c !== ch);
}

export function charsOfRadical(name: string): string[] {
  return RADICAL_INDEX.get(name)?.chars ?? [];
}

export function charsOfLesson(lessonId: string): string[] {
  return LESSON_INDEX.get(lessonId)?.chars ?? [];
}

/** 某册某单元：课文（按顺序）与该单元去重后的生字（保持课文顺序）。 */
export function unitOf(
  bookId: string,
  unitNo: number,
): { lessons: YuwenLesson[]; chars: string[] } | undefined {
  const book = BOOK_INDEX.get(bookId);
  if (!book) return undefined;
  const unit = book.units.find((u) => u.no === unitNo);
  if (!unit) return undefined;
  const lessons = unit.lessonIds
    .map((id) => LESSON_INDEX.get(id))
    .filter((l): l is YuwenLesson => Boolean(l));
  const seen = new Set<string>();
  const chars: string[] = [];
  for (const lesson of lessons) {
    for (const ch of lesson.chars) {
      if (seen.has(ch)) continue;
      seen.add(ch);
      chars.push(ch);
    }
  }
  return { lessons, chars };
}
