// src/yuwen/paths.ts
//
// /yuwen 路由的唯一事实来源。两种形态必须分清：
//   - *Path()  给 <Link> 用，中文按 encodeURIComponent 编码；
//   - allYuwenRoutePaths() 给预渲染用，返回未编码原始路径（落成中文目录，canonical 侧统一编码）。
import { YUWEN_CHARS, YUWEN_LESSONS, YUWEN_STEMS } from '../data/yuwen';

export const YUWEN_BASE = '/yuwen';
export const YUWEN_HOME = '/yuwen';

export function bookPath(id: string): string {
  return YUWEN_BASE + '/book/' + id;
}

export function lessonPath(id: string): string {
  return YUWEN_BASE + '/lesson/' + id;
}

/** 给链接用的编码形态。 */
export function charPath(ch: string): string {
  return YUWEN_BASE + '/char/' + encodeURIComponent(ch);
}

export function reviewPath(bookId: string, unitNo: number): string {
  return YUWEN_BASE + '/review/' + bookId + '/' + unitNo;
}

export interface TingxieOptions {
  shuffle?: boolean;
  hint?: boolean;
  answers?: boolean;
}

export function tingxiePath(bookId: string, unitNo: number, opts: TingxieOptions = {}): string {
  const base = YUWEN_BASE + '/tingxie/' + bookId + '/' + unitNo;
  const query = new URLSearchParams();
  if (opts.shuffle) query.set('shuffle', '1');
  if (opts.hint) query.set('hint', '1');
  if (opts.answers === false) query.set('answers', '0');
  const qs = query.toString();
  return qs ? base + '?' + qs : base;
}

export function pinyinPath(stem?: string): string {
  return stem ? YUWEN_BASE + '/pinyin/' + stem : YUWEN_BASE + '/pinyin';
}

export function duoyinPath(): string {
  return YUWEN_BASE + '/duoyin';
}

export function isYuwenPath(pathname: string): boolean {
  return pathname === YUWEN_BASE || pathname.startsWith(YUWEN_BASE + '/');
}

/** 预渲染清单：未编码原始路径。 */
export function allYuwenRoutePaths(): string[] {
  const paths: string[] = [YUWEN_HOME, pinyinPath(), duoyinPath()];
  for (const [bookId, units] of booksWithUnits()) {
    paths.push(bookPath(bookId));
    for (const unitNo of units) {
      paths.push(reviewPath(bookId, unitNo));
      paths.push(tingxiePath(bookId, unitNo));
    }
  }
  for (const lesson of YUWEN_LESSONS) paths.push(lessonPath(lesson.id));
  for (const item of YUWEN_CHARS) paths.push(YUWEN_BASE + '/char/' + item.ch);
  for (const stem of YUWEN_STEMS) paths.push(pinyinPath(stem.stem));
  return paths;
}

/** 册 → 单元号列表（从课文数据推导，不另存副本）。 */
function booksWithUnits(): [string, number[]][] {
  const map = new Map<string, number[]>();
  for (const lesson of YUWEN_LESSONS) {
    const units = map.get(lesson.bookId) ?? [];
    if (!units.includes(lesson.unitNo)) units.push(lesson.unitNo);
    map.set(lesson.bookId, units);
  }
  return [...map.entries()].map(([id, units]) => [id, [...units].sort((a, b) => a - b)]);
}
