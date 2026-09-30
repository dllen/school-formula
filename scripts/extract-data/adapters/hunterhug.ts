// scripts/extract-data/adapters/hunterhug.ts
import { load } from 'cheerio';
import type { Adapter, BaseEnvelope } from '../core/adapter.js';

const BASE_URL = 'https://hunterhug.github.io/';

/** 兜底：hunterhug 史记相关路径，本地 fetch 后回填。 */
const FALLBACK_URLS: string[] = [
  '/shiji/benji/wudi',
  '/shiji/benji/xia',
  '/shiji/benji/yin',
  '/shiji/benji/zhou',
  '/shiji/benji/qin',
  '/shiji/benji/han',
  '/shiji/shijia/jiang',
  '/shiji/shijia/chu',
  '/shiji/liezhu/liubang',
  '/shiji/liezhu/hanxin',
  '/shiji/biao/han',
  '/shiji/biao/qin',
];

export interface RawChapter {
  url: string;
  title: string;
  chapter: string;
  paragraphs: string[];
  interpretation: string;
}

export interface HunterhugVolume extends RawChapter {
  id: string;
}

export interface HunterhugEnvelope extends BaseEnvelope {
  volumes: HunterhugVolume[];
  url: string;
}

export const hunterhugAdapter: Adapter = {
  kind: 'shiji',
  name: 'Hunterhug 经典',
  description: '抽取 hunterhug.github.io 的史记数据（counter 100+）',

  async listUrls(): Promise<string[]> {
    const res = await fetch(BASE_URL);
    const html = await res.text();
    const $ = load(html);
    const links = $('a[href*="shiji"], a[href*="benji"], a[href*="shijia"], a[href*="liezhu"], nav a')
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
    const title = $('h1').first().text().trim() || '未知';
    const chapter = $('h1').first().text().match(/卷[一二三四五六七八九十百零]+/)?.[0] ?? '';
    const paragraphs = $('article p, main p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    return { url, title, chapter, paragraphs, interpretation: '' };
  },

  normalize(pages: unknown[]): HunterhugEnvelope {
    let counter = 100; // 与 shiji-kb v5+ 明确区分（hunterhug 是补充源）
    const volumes = (pages as RawChapter[]).map(p => ({
      ...p,
      id: `v${counter++}`,
    }));
    return {
      source: 'hunterhug',
      extractedAt: new Date().toISOString(),
      url: BASE_URL,
      volumes,
    };
  },
};
