// scripts/extract-data/adapters/yuwen-muduo.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createYuwenMuduoAdapter,
  parseBookPage,
  parseDuoyinPage,
  parseIndexPage,
  parseLessonPage,
  parsePinyinPage,
} from './yuwen-muduo.js';

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

describe('页面解析器：首页/册/课', () => {
  it('首页解析出 10 册与课数字数', () => {
    const books = parseIndexPage(fixture('index'));
    expect(books).toHaveLength(10);
    expect(books[0]).toEqual({ id: '1a', title: '一年级上册', lessonCount: 41, charCount: 300 });
    expect(books[9]).toEqual({ id: '5b', title: '五年级下册', lessonCount: 23, charCount: 197 });
  });

  it('册页解析出单元划分与课文', () => {
    const book = parseBookPage('1a', fixture('book-1a'));
    expect(book.units).toHaveLength(8);
    expect(book.units[0].lessonIds).toEqual([
      'G1A01', 'G1A02', 'G1A03', 'G1A04', 'G1A05', 'G1A06',
    ]);
    const first = book.lessons[0];
    expect(first.id).toBe('G1A01');
    expect(first.title).toBe('识字1：天地人');
    expect(first.preview).toBe('天地人你我他');
    expect(first.unitNo).toBe(1);
  });

  it('课页解析出有序生字与组词', () => {
    const lesson = parseLessonPage('G1A01', fixture('lesson-G1A01'));
    expect(lesson.title).toBe('识字1：天地人');
    expect(lesson.chars).toEqual(['天', '地', '人', '你', '我', '他']);
    expect(lesson.readings).toEqual([
      { ch: '天', py: 'tiān' },
      { ch: '地', py: 'dì' },
      { ch: '人', py: 'rén' },
      { ch: '你', py: 'nǐ' },
      { ch: '我', py: 'wǒ' },
      { ch: '他', py: 'tā' },
    ]);
    expect(lesson.words).toEqual([
      { ch: '天', words: ['天天'] },
      { ch: '地', words: ['天地'] },
      { ch: '人', words: ['人人'] },
      { ch: '你', words: [] },
      { ch: '我', words: ['你我'] },
      { ch: '他', words: ['他人'] },
    ]);
  });
});

describe('页面解析器：拼音表 / 多音字', () => {
  it('拼音表按韵母与声调分组', () => {
    const { stems } = parsePinyinPage(fixture('pinyin'));
    expect(stems[0]).toEqual({
      stem: 'a',
      rows: [
        { py: 'ā', chars: ['阿', '啊', '呵'] },
        { py: 'à', chars: ['啊'] },
        { py: 'a', chars: ['啊', '呵'] },
      ],
    });
    expect(stems.length).toBeGreaterThan(50);
    expect(stems[1].stem).toBe('ai');
  });

  it('多音字按读音分组，带词与首次出现课', () => {
    const { entries } = parseDuoyinPage(fixture('duoyin'));
    expect(entries[0]).toEqual({
      ch: '地',
      readings: [
        { py: 'dì', words: ['地方', '地上', '地球', '地区'] },
        { py: 'de', words: [], lessonId: 'G1A22' },
      ],
    });
    expect(entries.length).toBeGreaterThan(10);
  });
});
