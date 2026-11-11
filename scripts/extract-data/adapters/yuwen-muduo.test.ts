// scripts/extract-data/adapters/yuwen-muduo.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createYuwenMuduoAdapter,
  normalizeYuwen,
  parseBookPage,
  parseCharPage,
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

describe('页面解析器：单字页', () => {
  it('解析读音、学于哪课、部件与组词', () => {
    const raw = parseCharPage('地', fixture('char-di'));

    expect(raw.ch).toBe('地');
    expect(raw.heroReadings).toEqual(['dì', 'de']);
    expect(raw.readings[0]).toEqual({
      py: 'dì',
      words: ['地方', '地上', '地球', '地区', '地面', '地点'],
      lessonId: 'G1A01',
    });
    expect(raw.readings[1]).toEqual({ py: 'de', words: [], lessonId: 'G1A22' });

    expect(raw.radicals[0].name).toBe('土');
    expect(raw.radicals[0].label).toBe('提土旁');
    expect(raw.radicals[0].chars).toContain('地');
    expect(raw.radicals[0].chars.length).toBeGreaterThan(50);

    // 只取默认展示的 10 个，不取 details 里的扩展词
    expect(raw.words).toHaveLength(10);
    expect(raw.words).toContain('地方');
    expect(raw.words).toContain('草地');
  });
});

function syntheticPages() {
  return [
    { kind: 'index', data: [{ id: '1a', title: '一年级上册', lessonCount: 2, charCount: 3 }] },
    {
      kind: 'book',
      data: {
        id: '1a',
        units: [{ no: 1, lessonIds: ['G1A01', 'G1A02'] }],
        lessons: [
          { id: 'G1A01', unitNo: 1, title: '识字1：天地人', preview: '天地人' },
          { id: 'G1A02', unitNo: 1, title: '识字2：金木水火土', preview: '一二三' },
        ],
      },
    },
    {
      kind: 'lesson',
      data: {
        id: 'G1A01',
        title: '识字1：天地人',
        chars: ['天', '地'],
        readings: [
          { ch: '天', py: 'tiān' },
          { ch: '地', py: 'dì' },
        ],
        words: [{ ch: '天', words: ['天天'] }],
      },
    },
    {
      kind: 'lesson',
      data: {
        id: 'G1A02',
        title: '识字2：金木水火土',
        chars: ['一'],
        readings: [{ ch: '一', py: 'yī' }],
        words: [],
      },
    },
    {
      kind: 'pinyin',
      data: {
        stems: [
          { stem: 'a', rows: [{ py: 'ā', chars: ['阿'] }, { py: 'a', chars: ['啊'] }] },
          { stem: 'di', rows: [{ py: 'dì', chars: ['地'] }] },
          { stem: 'tian', rows: [{ py: 'tiān', chars: ['天'] }] },
          { stem: 'yi', rows: [{ py: 'yī', chars: ['一'] }] },
        ],
      },
    },
    {
      kind: 'char',
      data: {
        ch: '地',
        heroReadings: ['dì'],
        readings: [{ py: 'dì', words: ['地方'], lessonId: 'G1A01' }],
        radicals: [{ name: '土', label: '提土旁', chars: ['地', '天', '不存在的字'] }],
        words: ['地方', '土地'],
      },
    },
    { kind: 'duoyin', data: { entries: [{ ch: '地', readings: [{ py: 'dì', words: ['地方'] }] }] } },
  ];
}

describe('normalizeYuwen', () => {
  it('合并成信封，并按字全集过滤部件', () => {
    const env = normalizeYuwen(syntheticPages());

    expect(env.source).toBe('yuwen-muduo');
    expect(env.books).toHaveLength(1);
    expect(env.books[0].id).toBe('1a');
    expect(env.books[0].grade).toBe(1);
    expect(env.books[0].term).toBe('a');
    expect(env.books[0].units[0].lessonIds).toEqual(['G1A01', 'G1A02']);
    expect(env.lessons.map((l) => l.id)).toEqual(['G1A01', 'G1A02']);
    expect(env.stems).toHaveLength(4);
    expect(env.chars.map((c) => c.ch).sort()).toEqual(['一', '天', '阿', '啊', '地'].sort());
    const di = env.chars.find((c) => c.ch === '地')!;
    expect(di.readings).toEqual([{ py: 'dì', stem: 'di', lessonId: 'G1A01', words: ['地方'] }]);
    expect(di.radicals).toEqual(['土']);
    expect(di.words).toEqual(['地方', '土地']);
    expect(env.radicals).toEqual([{ name: '土', label: '提土旁', chars: ['地', '天'] }]);
    expect(env.duoyin).toHaveLength(1);
  });

  it('课的字不在拼音表里时报错', () => {
    const pages = syntheticPages();
    (pages[3] as { data: { chars: string[] } }).data.chars = ['一', '乙'];
    expect(() => normalizeYuwen(pages)).toThrow(/乙/);
  });

  it('过滤后不足 2 个字的部件被丢弃', () => {
    const pages = syntheticPages();
    (pages[5] as { data: { radicals: { name: string; chars: string[] }[] } }).data.radicals[0].chars = ['地'];
    expect(normalizeYuwen(pages).radicals).toEqual([]);
  });

  it('读音排序把课文页教的读音放最前', () => {
    const pages = syntheticPages();
    // 拼音表里给「地」先加入一个 de 读音（stem de 排在 di 之前）
    (pages[4] as { data: { stems: { stem: string; rows: { py: string; chars: string[] }[] }[] } }).data.stems.unshift({
      stem: 'de',
      rows: [{ py: 'de', chars: ['地'] }],
    });
    const env = normalizeYuwen(pages);
    const di = env.chars.find((c) => c.ch === '地')!;
    expect(di.readings.map((r) => r.py)).toEqual(['dì', 'de']);
    // 没在课文页出现过的字保持拼音表顺序
    const a = env.chars.find((c) => c.ch === '阿')!;
    expect(a.readings.map((r) => r.py)).toEqual(['ā']);
  });
});
