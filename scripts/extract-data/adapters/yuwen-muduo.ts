// scripts/extract-data/adapters/yuwen-muduo.ts
import { load } from 'cheerio';
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

    async parseHtml(): Promise<unknown> {
      throw new Error('parsers not implemented yet');
    },

    normalize(): never {
      throw new Error('normalize not implemented yet');
    },
  };
}

export const yuwenMuduoAdapter = createYuwenMuduoAdapter();
