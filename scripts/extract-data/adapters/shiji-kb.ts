// scripts/extract-data/adapters/shiji-kb.ts
import { load } from 'cheerio';
import type { Adapter } from '../core/adapter.js';

const BASE_URL = 'https://baojie.github.io/shiji-kb/';

/** 兜底：12 本纪相对路径，本地 fetch 一次后回填。 */
const FALLBACK_URLS: string[] = [
  '/benji/wudi',
  '/benji/xia',
  '/benji/yin',
  '/benji/zhou',
  '/benji/qin',
  '/benji/xiangyu',
  '/benji/hanxin',
  '/benji/liubang',
  '/benji/jiawu',
  '/benji/wang-mang',
  '/benji/guangwu',
  '/benji/caowei',
];

export interface RawChapter {
  url: string;
  title: string;
  chapter: string;
  paragraphs: string[];
  interpretation: string;
}

export interface ShijiEnvelope {
  source: string;
  extractedAt: string;
  url: string;
  volumes: RawChapter[];
}

export const shijiKbAdapter: Adapter = {
  kind: 'shiji',
  name: '史记知识库',
  description: '抽取 baojie.github.io/shiji-kb/ 的 12 本纪',

  async listUrls(): Promise<string[]> {
    const res = await fetch(BASE_URL);
    const html = await res.text();
    const $ = load(html);
    const links = $('a[href]')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter((href): href is string => Boolean(href))
      .filter(href => href.startsWith(BASE_URL) || href.startsWith('/'))
      .filter(href => !href.includes('#'))
      .slice(0, 12)
      .map(href => new URL(href, BASE_URL).href);
    if (links.length >= 12) return links;
    return FALLBACK_URLS.map(u => new URL(u, BASE_URL).href);
  },

  async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.text();
  },

  async parseHtml(url: string, html: string): Promise<RawChapter> {
    const $ = load(html);
    const title = $('h1').first().text().trim() || '未知';
    const chapter = $('h1').first().text().match(/卷[一二三四五六七八九十]+/)?.[0] ?? '';
    const paragraphs = $('article p, main p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    return { url, title, chapter, paragraphs, interpretation: '' };
  },

  normalize(pages: unknown[]): ShijiEnvelope {
    let counter = 5; // 现有 v1-v4 已用
    const volumes = (pages as RawChapter[]).map(p => ({
      ...p,
      id: `v${counter++}`,
    }));
    return {
      source: 'shiji-kb',
      extractedAt: new Date().toISOString(),
      url: BASE_URL,
      volumes,
    };
  },
};
