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
