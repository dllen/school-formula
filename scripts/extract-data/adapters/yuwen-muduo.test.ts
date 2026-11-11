// scripts/extract-data/adapters/yuwen-muduo.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createYuwenMuduoAdapter } from './yuwen-muduo.js';

const fixture = (name: string): string =>
  readFileSync(new URL('../__fixtures__/yuwen/' + name + '.html', import.meta.url), 'utf8');

/**
 * fake fetch：把几个真实 URL 映射到 fixtures，其余册页以 book-1a 为模板按册号合成。
 * 真实站点每册课 id 前缀不同（G1A/G1B/…），复用同一册 fixture 时必须改写前缀，
 * 否则 10 册会去重成同一批课 id。
 */
function fakeFetch(map: Record<string, string>) {
  return async (url: string): Promise<string> => {
    const hit = map[url];
    if (hit !== undefined) return hit;
    if (url.includes('/book/')) {
      const id = url.slice(url.indexOf('/book/') + '/book/'.length);
      const grade = 'G' + id[0] + id[1].toUpperCase();
      return fixture('book-1a').replace(/G1A/g, grade);
    }
    throw new Error('unexpected fetch: ' + url);
  };
}

describe('yuwenMuduoAdapter.listUrls', () => {
  it('列出 10 册、每册课页、拼音表、多音字与全部单字页', async () => {
    const adapter = createYuwenMuduoAdapter(
      fakeFetch({
        'http://yuwen.muduo.org/': fixture('index'),
        'http://yuwen.muduo.org/pinyin': fixture('pinyin'),
        'http://yuwen.muduo.org/duoyin': fixture('duoyin'),
      }),
    );
    const urls = await adapter.listUrls();

    expect(urls[0]).toBe('http://yuwen.muduo.org/');
    expect(urls).toContain('http://yuwen.muduo.org/pinyin');
    expect(urls).toContain('http://yuwen.muduo.org/duoyin');
    for (const book of ['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b']) {
      expect(urls).toContain('http://yuwen.muduo.org/book/' + book);
    }
    // 10 次 book-1a（41 课）→ 410 个课页
    expect(urls.filter((u) => u.includes('/lesson/'))).toHaveLength(410);
    // 单字页来自拼音表前 60KB 的去重字
    expect(urls.filter((u) => u.includes('/char/')).length).toBeGreaterThan(100);
    expect(urls).toContain('http://yuwen.muduo.org/char/' + encodeURIComponent('阿'));
    expect(new Set(urls).size).toBe(urls.length);
  });
});
