// scripts/extract-data/adapters/dutongjian.ts
import { load } from 'cheerio';
import type { Adapter, BaseEnvelope } from '../core/adapter.js';

const BASE_URL = 'https://www.dutongjian.com/';

/** 兜底：资治通鉴各纪路径，本地 fetch 后回填真实 URL。 */
const FALLBACK_URLS: string[] = [
  '/zhou-ji/yi',
  '/zhou-ji/er',
  '/zhou-ji/san',
  '/han-ji/yi',
  '/han-ji/er',
  '/han-ji/san',
  '/tang-ji/yi',
  '/tang-ji/er',
  '/song-ji/yi',
  '/song-ji/er',
  '/yuan-ji/yi',
  '/ming-ji/yi',
];

export interface RawChapter {
  url: string;
  title: string;
  period: string;
  paragraphs: string[];
  interpretation: string;
}

export interface DutongjianVolume extends RawChapter {
  id: string;
}

export interface DutongjianEnvelope extends BaseEnvelope {
  volumes: DutongjianVolume[];
  url: string;
}

export const dutongjianAdapter: Adapter = {
  kind: 'zizhi',
  name: '读通鉴',
  description: '抽取 dutongjian.com 的资治通鉴篇章',

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
      .map(href => new URL(href, BASE_URL).href);
    if (links.length >= 1) return links;
    return FALLBACK_URLS.map(u => new URL(u, BASE_URL).href);
  },

  async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.text();
  },

  async parseHtml(url: string, html: string): Promise<RawChapter> {
    const $ = load(html);
    const title = $('.chapter-title, h1').first().text().trim() || '未知';
    const period = $('.period, .time').first().text().trim();
    const paragraphs = $('article p, main p, .content p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    return { url, title, period, paragraphs, interpretation: '' };
  },

  normalize(pages: unknown[]): DutongjianEnvelope {
    let counter = 18; // 现有 src/data/zizhi.ts v1-v17 已用
    const volumes = (pages as RawChapter[]).map(p => ({
      ...p,
      id: `v${counter++}`,
    }));
    return {
      source: 'dutongjian',
      extractedAt: new Date().toISOString(),
      url: BASE_URL,
      volumes,
    };
  },
};
