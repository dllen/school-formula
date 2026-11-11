// scripts/extract-data/adapters/yuwen-muduo.ts
import { load } from 'cheerio';
import type {
  YuwenBook,
  YuwenChar,
  YuwenDuoyin,
  YuwenEnvelope,
  YuwenLesson,
  YuwenRadical,
  YuwenStem,
} from '../../../src/data/yuwen/types';
import type { Adapter } from '../core/adapter.js';

const BASE_URL = 'http://yuwen.muduo.org';

export type FetchHtml = (url: string) => Promise<string>;

async function defaultFetchHtml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ' → ' + res.status);
  return res.text();
}

/** 从首页卡片取 10 册的 id（/book/1a → 1a）。 */
export function extractBookIds(html: string): string[] {
  const $ = load(html);
  const ids: string[] = [];
  $('.cards section.card h2 a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const m = href.match(/^\/book\/([1-5][ab])$/);
    if (m?.[1] && !ids.includes(m[1])) ids.push(m[1]);
  });
  return ids;
}

/** 从册页取课文 id，按页面顺序。 */
export function extractLessonIds(html: string): string[] {
  const $ = load(html);
  const ids: string[] = [];
  $('ul.lessons a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const m = href.match(/^\/lesson\/(G[1-5][AB]\d{2})$/);
    if (m?.[1] && !ids.includes(m[1])) ids.push(m[1]);
  });
  return ids;
}

/** 从拼音表取全部字（chips 里的单字）。 */
export function extractAllChars(html: string): string[] {
  const $ = load(html);
  const out: string[] = [];
  const seen = new Set<string>();
  $('div.chips a.chip').each((_, el) => {
    const ch = $(el).text().trim();
    if (ch.length === 1 && !seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  });
  return out;
}

export interface RawBookRef {
  id: string;
  title: string;
  lessonCount: number;
  charCount: number;
}

export interface RawReading {
  ch: string;
  py: string;
}

export interface RawBook {
  id: string;
  units: { no: number; lessonIds: string[] }[];
  lessons: { id: string; unitNo: number; title: string; preview: string }[];
}

export interface RawLesson {
  id: string;
  title: string;
  chars: string[];
  readings: RawReading[];
  words: { ch: string; words: string[] }[];
}

export function parseIndexPage(html: string): RawBookRef[] {
  const $ = load(html);
  const books: RawBookRef[] = [];
  $('.cards section.card').each((_, el) => {
    const href = $(el).find('h2 a').attr('href') ?? '';
    const m = href.match(/^\/book\/([1-5][ab])$/);
    if (!m) return;
    const title = $(el).find('h2').text().trim();
    const meta = $(el).find('p.muted').text().trim();
    const nums = meta.match(/(\d+)\s*课\s*·\s*(\d+)\s*个生字/);
    books.push({
      id: m[1]!,
      title,
      lessonCount: nums ? Number(nums[1]) : 0,
      charCount: nums ? Number(nums[2]) : 0,
    });
  });
  return books;
}

export function parseBookPage(bookId: string, html: string): RawBook {
  const $ = load(html);
  const units: RawBook['units'] = [];
  const lessons: RawBook['lessons'] = [];
  $('section.unit').each((unitIndex, el) => {
    const unitNo = unitIndex + 1;
    const lessonIds: string[] = [];
    $(el).find('ul.lessons a[href]').each((_, a) => {
      const m = ($(a).attr('href') ?? '').match(/^\/lesson\/(G[1-5][AB]\d{2})$/);
      if (!m?.[1]) return;
      const id = m[1];
      lessonIds.push(id);
      lessons.push({
        id,
        unitNo,
        title: $(a).find('span.title').text().trim(),
        preview: $(a).find('span.preview').text().trim(),
      });
    });
    units.push({ no: unitNo, lessonIds });
  });
  return { id: bookId, units, lessons };
}

export function parseLessonPage(lessonId: string, html: string): RawLesson {
  const $ = load(html);
  const title = $('h1').first().text().trim();

  const chars: string[] = [];
  const readings: RawReading[] = [];
  // 课页结构：第一个 section 的 .grid 是「本课生字」；组词区的 a.zi.small 不能算进来
  const mainGrid = $('section').first().find('.grid').first();
  mainGrid.find('a.zi').each((_, a) => {
    const ch = $(a).find('span.tzg').text().trim();
    const py = $(a).find('span.py').text().trim();
    if (!ch) return;
    chars.push(ch);
    readings.push({ ch, py });
  });

  const words: RawLesson['words'] = [];
  $('.word-row').each((_, row) => {
    const ch = $(row).find('a.zi.small span.tzg').first().text().trim();
    if (!ch) return;
    const list: string[] = [];
    $(row).find('ul.words .say').each((__, s) => {
      const w = ($(s).attr('data-say') ?? $(s).text()).trim();
      if (w) list.push(w);
    });
    words.push({ ch, words: list });
  });

  return { id: lessonId, title, chars, readings, words };
}

export interface RawPinyin {
  stems: { stem: string; rows: { py: string; chars: string[] }[] }[];
}

export interface RawDuoyin {
  entries: { ch: string; readings: { py: string; words: string[]; lessonId?: string }[] }[];
}

export function parsePinyinPage(html: string): RawPinyin {
  const $ = load(html);
  const stems: RawPinyin['stems'] = [];
  $('section.stem').each((_, el) => {
    const stem = $(el).find('h2 a').first().text().trim();
    if (!stem) return;
    const rows: { py: string; chars: string[] }[] = [];
    $(el).find('.tone-row').each((__, row) => {
      const py = $(row).find('.py-tag').first().text().trim();
      if (!py) return;
      const chars: string[] = [];
      $(row).find('div.chips a.chip').each((___, a) => {
        const ch = $(a).text().trim();
        if (ch.length === 1) chars.push(ch);
      });
      rows.push({ py, chars });
    });
    stems.push({ stem, rows });
  });
  return { stems };
}

export function parseDuoyinPage(html: string): RawDuoyin {
  const $ = load(html);
  const entries: RawDuoyin['entries'] = [];
  $('section.duoyin').each((_, el) => {
    const ch = $(el).find('a.tzg').first().text().trim();
    if (!ch) return;
    const readings: RawDuoyin['entries'][number]['readings'] = [];
    $(el).find('.duoyin-row').each((__, row) => {
      const py = $(row).find('.py-tag').first().text().trim();
      if (!py) return;
      const words: string[] = [];
      $(row).find('ul.words .say').each((___, s) => {
        const w = ($(s).attr('data-say') ?? $(s).text()).trim();
        if (w) words.push(w);
      });
      const href = $(row).find('a[href^="/lesson/"]').first().attr('href') ?? '';
      const m = href.match(/^\/lesson\/(G[1-5][AB]\d{2})$/);
      readings.push(m?.[1] ? { py, words, lessonId: m[1] } : { py, words });
    });
    entries.push({ ch, readings });
  });
  return { entries };
}

export interface RawChar {
  ch: string;
  heroReadings: string[];
  readings: { py: string; words: string[]; lessonId?: string }[];
  radicals: { name: string; label?: string; chars: string[] }[];
  words: string[];
}

export function parseCharPage(ch: string, html: string): RawChar {
  const $ = load(html);

  const heroReadings = $('.hero-py')
    .first()
    .text()
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  const readings: RawChar['readings'] = [];
  $('section').each((_, section) => {
    if ($(section).find('h2').first().text().trim() !== '读音') return;
    $(section).find('.reading').each((__, el) => {
      const py = $(el).find('a.py-tag').first().text().trim();
      if (!py) return;
      const words: string[] = [];
      $(el).find('ul.words .say').each((___, s) => {
        const w = ($(s).attr('data-say') ?? $(s).text()).trim();
        if (w) words.push(w);
      });
      const href = $(el).find('p.muted a[href^="/lesson/"]').first().attr('href') ?? '';
      const m = href.match(/^\/lesson\/(G[1-5][AB]\d{2})$/);
      readings.push(m?.[1] ? { py, words, lessonId: m[1] } : { py, words });
    });
  });

  const radicals: RawChar['radicals'] = [];
  $('section').each((_, section) => {
    if ($(section).find('h2').first().text().trim() !== '字形') return;
    $(section).find('.part').each((__, part) => {
      const name = $(part).find('a.part-name').first().text().trim();
      if (!name) return;
      const labelText = $(part).find('p.label').first().text().trim();
      const labelMatch = labelText.match(/（([^）]+)）/);
      const chars: string[] = [];
      $(part).find('.grid a.zi').each((___, a) => {
        const c = $(a).find('span.tzg').text().trim();
        if (c.length === 1) chars.push(c);
      });
      radicals.push(labelMatch?.[1] ? { name, label: labelMatch[1], chars } : { name, chars });
    });
  });

  const words: string[] = [];
  $('section').each((_, section) => {
    if ($(section).find('h2').first().text().trim() !== '组词') return;
    // 只取 .words-wrap 的直接子 ul（默认 10 个）；details.more-words 里的扩展词不要
    $(section).find('.words-wrap > ul.words li .say').each((__, s) => {
      const w = ($(s).attr('data-say') ?? $(s).text()).trim();
      if (w) words.push(w);
    });
  });

  return { ch, heroReadings, readings, radicals, words };
}

type TaggedPage =
  | { kind: 'index'; data: RawBookRef[] }
  | { kind: 'book'; data: RawBook }
  | { kind: 'lesson'; data: RawLesson }
  | { kind: 'pinyin'; data: RawPinyin }
  | { kind: 'duoyin'; data: RawDuoyin }
  | { kind: 'char'; data: RawChar };

export function normalizeYuwen(pages: unknown[]): YuwenEnvelope {
  const refs: RawBookRef[] = [];
  const bookPages: RawBook[] = [];
  const lessonPages: RawLesson[] = [];
  const charPages: RawChar[] = [];
  const pinyinPages: RawPinyin[] = [];
  const duoyinPages: RawDuoyin[] = [];

  for (const page of pages as TaggedPage[]) {
    switch (page.kind) {
      case 'index': refs.push(...page.data); break;
      case 'book': bookPages.push(page.data); break;
      case 'lesson': lessonPages.push(page.data); break;
      case 'pinyin': pinyinPages.push(page.data); break;
      case 'duoyin': duoyinPages.push(page.data); break;
      case 'char': charPages.push(page.data); break;
    }
  }

  // 字全集与读音：以拼音表为准
  const pinyinPage = pinyinPages[0];
  if (!pinyinPage) throw new Error('缺少拼音表页，无法确定字全集');
  const stems: YuwenStem[] = pinyinPage.stems;

  const readingsByChar = new Map<string, { py: string; stem: string }[]>();
  const charOrder: string[] = [];
  for (const stem of stems) {
    for (const row of stem.rows) {
      for (const ch of row.chars) {
        let list = readingsByChar.get(ch);
        if (!list) {
          list = [];
          readingsByChar.set(ch, list);
          charOrder.push(ch);
        }
        if (!list.some((r) => r.py === row.py)) list.push({ py: row.py, stem: stem.stem });
      }
    }
  }
  const charSet = new Set(charOrder);

  // 课与册：课页必须存在、生字必须在拼音表字全集里，课数要与首页一致
  const errs: string[] = [];
  const lessons: YuwenLesson[] = [];
  const books: YuwenBook[] = [];

  for (const ref of refs) {
    const page = bookPages.find((b) => b.id === ref.id);
    if (!page) {
      errs.push('缺少册页: ' + ref.id);
      continue;
    }
    const bookLessons: YuwenLesson[] = [];
    for (const raw of page.lessons) {
      const parsed = lessonPages.find((l) => l.id === raw.id);
      if (!parsed) {
        errs.push('缺少课页: ' + raw.id);
        continue;
      }
      if (!parsed.chars.length) errs.push('课没有生字: ' + raw.id);
      for (const ch of parsed.chars) {
        if (!charSet.has(ch)) errs.push('课 ' + raw.id + ' 的字不在拼音表中: ' + ch);
      }
      bookLessons.push({
        id: raw.id,
        bookId: ref.id,
        unitNo: raw.unitNo,
        title: raw.title,
        preview: raw.preview,
        chars: parsed.chars,
      });
    }
    const uniqueChars = new Set(bookLessons.flatMap((l) => l.chars));
    if (ref.lessonCount !== bookLessons.length) {
      errs.push('册 ' + ref.id + ' 课数不一致：首页 ' + ref.lessonCount + ' / 明细 ' + bookLessons.length);
    }
    books.push({
      id: ref.id,
      title: ref.title,
      grade: Number(ref.id[0]) as 1 | 2 | 3 | 4 | 5,
      term: ref.id[1] as 'a' | 'b',
      lessonCount: bookLessons.length,
      charCount: uniqueChars.size,
      units: page.units,
    });
    lessons.push(...bookLessons);
  }

  // 字 → 首次出现的课
  const firstLessonOf = new Map<string, string>();
  for (const lesson of lessons) {
    for (const ch of lesson.chars) {
      if (!firstLessonOf.has(ch)) firstLessonOf.set(ch, lesson.id);
    }
  }

  // 单字
  const charPageByChar = new Map<string, RawChar>();
  for (const page of charPages) charPageByChar.set(page.ch, page);

  const chars: YuwenChar[] = charOrder.map((ch) => {
    const raw = charPageByChar.get(ch);
    const readings = (readingsByChar.get(ch) ?? []).map((r) => {
      const rawReading = raw?.readings.find((rr) => rr.py === r.py);
      const out: YuwenChar['readings'][number] = {
        py: r.py,
        stem: r.stem,
        words: rawReading?.words ?? [],
      };
      const lessonId = rawReading?.lessonId ?? firstLessonOf.get(ch);
      if (lessonId) out.lessonId = lessonId;
      return out;
    });
    const radicalNames = (raw?.radicals ?? []).map((r) => r.name);
    return {
      ch,
      readings,
      radicals: [...new Set(radicalNames)],
      words: raw?.words ?? [],
    };
  });

  // 部件：跨字页面合并，只保留字全集内的字，丢弃不足 2 个字的部件
  const radicalMap = new Map<string, YuwenRadical>();
  for (const page of charPages) {
    for (const part of page.radicals) {
      const kept = part.chars.filter((c) => charSet.has(c));
      if (!kept.length) continue;
      const prev = radicalMap.get(part.name);
      if (prev) {
        prev.chars = [...new Set([...prev.chars, ...kept])];
        if (!prev.label && part.label) prev.label = part.label;
      } else {
        radicalMap.set(part.name, {
          name: part.name,
          chars: [...new Set(kept)],
          ...(part.label ? { label: part.label } : {}),
        });
      }
    }
  }
  const radicals = [...radicalMap.values()]
    .filter((r) => r.chars.length >= 2)
    .sort((a, b) => b.chars.length - a.chars.length);

  // 多音字：只保留字全集内的
  const duoyin: YuwenDuoyin[] = [];
  for (const page of duoyinPages) {
    for (const entry of page.entries) {
      if (!charSet.has(entry.ch)) continue;
      duoyin.push({ ch: entry.ch, readings: entry.readings });
    }
  }

  if (errs.length) throw new Error('归一化校验失败:\n' + errs.join('\n'));

  return {
    source: 'yuwen-muduo',
    extractedAt: new Date().toISOString(),
    books,
    lessons,
    chars,
    stems,
    duoyin,
    radicals,
  };
}

export function createYuwenMuduoAdapter(fetchHtml: FetchHtml = defaultFetchHtml): Adapter {
  return {
    kind: 'yuwen',
    name: '小学语文（人教版生字）',
    description: '抽取 yuwen.muduo.org 的 10 册课本、326 课、2988 个生字、拼音表与多音字',

    async listUrls(): Promise<string[]> {
      const urls: string[] = [BASE_URL + '/', BASE_URL + '/pinyin', BASE_URL + '/duoyin'];
      const bookIds = extractBookIds(await fetchHtml(BASE_URL + '/'));
      const lessonIds: string[] = [];
      for (const id of bookIds) {
        const bookUrl = BASE_URL + '/book/' + id;
        urls.push(bookUrl);
        for (const lessonId of extractLessonIds(await fetchHtml(bookUrl))) {
          if (!lessonIds.includes(lessonId)) lessonIds.push(lessonId);
        }
      }
      for (const id of lessonIds) urls.push(BASE_URL + '/lesson/' + id);
      for (const ch of extractAllChars(await fetchHtml(BASE_URL + '/pinyin'))) {
        urls.push(BASE_URL + '/char/' + encodeURIComponent(ch));
      }
      return urls;
    },

    async fetchHtml(url: string): Promise<string> {
      return fetchHtml(url);
    },

    async parseHtml(url: string, html: string): Promise<unknown> {
      const pathname = decodeURIComponent(new URL(url).pathname);
      if (pathname === '/') return { kind: 'index', data: parseIndexPage(html) };
      if (pathname.startsWith('/book/')) return { kind: 'book', data: parseBookPage(pathname.slice('/book/'.length), html) };
      if (pathname.startsWith('/lesson/')) return { kind: 'lesson', data: parseLessonPage(pathname.slice('/lesson/'.length), html) };
      if (pathname === '/pinyin') return { kind: 'pinyin', data: parsePinyinPage(html) };
      if (pathname === '/duoyin') return { kind: 'duoyin', data: parseDuoyinPage(html) };
      if (pathname.startsWith('/char/')) return { kind: 'char', data: parseCharPage(pathname.slice('/char/'.length), html) };
      throw new Error('未知页面类型: ' + url);
    },

    normalize(pages: unknown[]): YuwenEnvelope {
      return normalizeYuwen(pages);
    },
  };
}

export const yuwenMuduoAdapter = createYuwenMuduoAdapter();
