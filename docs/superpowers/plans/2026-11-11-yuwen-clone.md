# 小学语文模块（yuwen.muduo.org 克隆）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 yuwen.muduo.org 的人教版小学语文生字内容全量克隆进本项目，作为「工具速查 → 小学语文」下的独立模块（/yuwen），并接入现有抽取→入库→预渲染→SEO 链路。

**Architecture:** 新增 1 个抽取适配器（抓 3380 个页面）+ 1 个入库适配器（生成 src/data/yuwen/ 下 6 个数据文件）+ 手写查询层与 9 个页面组件；路由走独立 /yuwen/* 树，全量预渲染；中文路径编码在 canonical 与 Worker 静态候选两处收口。

**Tech Stack:** TypeScript 5.9 / React 19 / React Router 7 / Vite 7 / Tailwind v4 / Vitest / cheerio（scripts 侧）/ hanzi-writer（新增）/ Cloudflare Workers。

**参考文档（执行前必读）:** `docs/superpowers/specs/2026-11-11-yuwen-clone-design.md`、`docs/ui-system.md`、`design.md`、`AGENTS.md`。

---

## 文件结构

### 数据生产（scripts/）

| 文件 | 职责 |
|---|---|
| `scripts/extract-data/adapters/yuwen-muduo.ts` | 列出 3380 个 URL、按页型分派 6 个解析器、归一为单一信封并交叉校验 |
| `scripts/extract-data/adapters/yuwen-muduo.test.ts` | 解析器与 listUrls 单测（fake fetch + fixtures） |
| `scripts/extract-data/__fixtures__/yuwen/*.html` | 6 份真实页面样本 |
| `scripts/ingest-data/adapters/yuwen.ts` | 校验信封、整树重写 6 个数据文件 |
| `scripts/ingest-data/adapters/yuwen.test.ts` | 校验规则与写盘幂等 |

### 数据与查询

| 文件 | 职责 |
|---|---|
| `src/data/yuwen/types.ts` | 数据模型（手写） |
| `src/data/yuwen/{books,lessons,chars,pinyin,duoyin,radicals}.ts` | 生成的数据文件（勿手改） |
| `src/data/yuwen/index.ts` | 手写：导出数组 + Map 索引 + 查询函数 |
| `src/yuwen/paths.ts` | 路由常量、URL 构造、`allYuwenRoutePaths()` |

### 展示层（src/components/yuwen/）

| 文件 | 职责 |
|---|---|
| `YuwenPageShell.tsx` | Header + container + Footer 骨架 |
| `YuwenIndexPage / YuwenBookPage / YuwenLessonPage / YuwenReviewPage / YuwenTingxiePage / YuwenCharPage / YuwenPinyinIndexPage / YuwenPinyinStemPage / YuwenDuoyinPage` | 9 个页面 |
| `ZiGrid / PinyinToggle / SpeakButton / WordList / CharChips / BishunSection` | 6 个原语 |
| `hooks/useSpeech.ts` | speechSynthesis 封装（SSR 安全） |

### 接线（改）

`src/App.tsx`、`src/routing/route-modules.ts`、`src/prerender/routes.ts`、`src/seo/content-zh.ts`、`src/seo/meta.ts`、`src/components/Header/*`、`src/components/HtmlSitemap.tsx`、`src/styles/ui.css`、`worker/lib/static-paths.ts`、`package.json`（hanzi-writer）。

---

## Task 1: 数据模型

**Files:**
- Create: `src/data/yuwen/types.ts`

- [ ] **Step 1: 写数据模型**

~~~ts
// src/data/yuwen/types.ts
//
// 小学语文（人教版生字）数据模型。数据文件由 scripts/ingest-data 生成，
// 本文件与 index.ts 是手写代码。

/** 一册课本。units 保留原站单元划分，供复习/听写页使用。 */
export interface YuwenBook {
  id: string;
  title: string;
  grade: 1 | 2 | 3 | 4 | 5;
  term: 'a' | 'b';
  lessonCount: number;
  charCount: number;
  units: YuwenUnit[];
}

export interface YuwenUnit {
  no: number;
  lessonIds: string[];
}

/** 一课。chars 按课文顺序排列（去重）。 */
export interface YuwenLesson {
  id: string;
  bookId: string;
  unitNo: number;
  title: string;
  preview: string;
  chars: string[];
}

/** 单字。readings 来自拼音表与单字页；radicals 是所属部件名。 */
export interface YuwenChar {
  ch: string;
  readings: YuwenReading[];
  radicals: string[];
  /** 组词：只取单字页默认展示的前 10 个（不取 details 里的扩展词）。 */
  words: string[];
}

export interface YuwenReading {
  py: string;
  stem: string;
  lessonId?: string;
  words: string[];
}

/** 拼音表条目。rows 按声调分组，chars 保持原站顺序。 */
export interface YuwenStem {
  stem: string;
  rows: { py: string; chars: string[] }[];
}

export interface YuwenDuoyin {
  ch: string;
  readings: { py: string; words: string[]; lessonId?: string }[];
}

/** 部件 → 含该部件的字。label 如「提土旁」，仅用于展示。 */
export interface YuwenRadical {
  name: string;
  label?: string;
  chars: string[];
}

/** 抽取端写入 staging 的信封。 */
export interface YuwenEnvelope {
  source: string;
  extractedAt: string;
  books: YuwenBook[];
  lessons: YuwenLesson[];
  chars: YuwenChar[];
  stems: YuwenStem[];
  duoyin: YuwenDuoyin[];
  radicals: YuwenRadical[];
}
~~~

- [ ] **Step 2: 类型检查**

Run: `npx tsc -b --pretty false`
Expected: 退出码 0，无输出。

- [ ] **Step 3: 提交**

~~~bash
git add src/data/yuwen/types.ts
git commit -m "feat(yuwen): 数据模型"
~~~

---

## Task 2: 抓取测试 fixtures

**Files:**
- Create: `scripts/extract-data/__fixtures__/yuwen/{index,book-1a,lesson-G1A01,pinyin,duoyin,char-di}.html`

- [ ] **Step 1: 下载 6 份真实页面样本**

~~~bash
mkdir -p scripts/extract-data/__fixtures__/yuwen
cd scripts/extract-data/__fixtures__/yuwen
curl -sS 'http://yuwen.muduo.org/' -o index.html
curl -sS 'http://yuwen.muduo.org/book/1a' -o book-1a.html
curl -sS 'http://yuwen.muduo.org/lesson/G1A01' -o lesson-G1A01.html
curl -sS 'http://yuwen.muduo.org/pinyin' | head -c 60000 > pinyin.html
curl -sS 'http://yuwen.muduo.org/duoyin' | head -c 60000 > duoyin.html
curl -sS 'http://yuwen.muduo.org/char/%E5%9C%B0' -o char-di.html
ls -l
~~~

Expected: 6 个文件；`index.html` 约 9KB、`book-1a.html` 约 11KB、`lesson-G1A01.html` 约 5KB、`pinyin.html` / `duoyin.html` 各 60000 字节、`char-di.html` 约 17KB。

注意：`pinyin.html` 与 `duoyin.html` 是截断的 HTML（cheerio 会自动闭合），测试只断言**开头段落**的内容（韵母 a/ai/an，多音字 地/乐/数/了）。

- [ ] **Step 2: 提交**

~~~bash
git add scripts/extract-data/__fixtures__/yuwen
git commit -m "test(yuwen): 抓取站点 fixtures"
~~~

---

## Task 3: 抽取适配器骨架与 listUrls

**Files:**
- Create: `scripts/extract-data/adapters/yuwen-muduo.ts`
- Create: `scripts/extract-data/adapters/yuwen-muduo.test.ts`

- [ ] **Step 1: 写失败测试**

~~~ts
// scripts/extract-data/adapters/yuwen-muduo.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createYuwenMuduoAdapter } from './yuwen-muduo.js';

const fixture = (name: string): string =>
  readFileSync(new URL('../__fixtures__/yuwen/' + name + '.html', import.meta.url), 'utf8');

/** fake fetch：把几个真实 URL 映射到 fixtures，其余册页复用 book-1a。 */
function fakeFetch(map: Record<string, string>) {
  return async (url: string): Promise<string> => {
    const hit = map[url];
    if (hit !== undefined) return hit;
    if (url.includes('/book/')) return fixture('book-1a');
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
~~~

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: FAIL，报 `Cannot find module './yuwen-muduo.js'`。

- [ ] **Step 3: 写适配器骨架与 listUrls**

~~~ts
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
~~~

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: PASS（1 个测试）。若课页数为 0，先确认 fixture 里是 `ul.lessons`。

- [ ] **Step 5: 提交**

~~~bash
git add scripts/extract-data/adapters/yuwen-muduo.ts scripts/extract-data/adapters/yuwen-muduo.test.ts
git commit -m "feat(yuwen): 抽取适配器骨架与 listUrls"
~~~

---

## Task 4: 首页 / 册页 / 课页解析器

**Files:**
- Modify: `scripts/extract-data/adapters/yuwen-muduo.ts`
- Modify: `scripts/extract-data/adapters/yuwen-muduo.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
import { parseBookPage, parseIndexPage, parseLessonPage } from './yuwen-muduo.js';

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
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: FAIL，`parseIndexPage is not a function`。

- [ ] **Step 3: 实现三个解析器**

在 `yuwen-muduo.ts` 追加（并加类型）：

~~~ts
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

export interface RawChar {
  ch: string;
  heroReadings: string[];
  readings: { py: string; words: string[]; lessonId?: string }[];
  radicals: { name: string; label?: string; chars: string[] }[];
  words: string[];
}

export interface RawPinyin {
  stems: { stem: string; rows: { py: string; chars: string[] }[] }[];
}

export interface RawDuoyin {
  entries: { ch: string; readings: { py: string; words: string[]; lessonId?: string }[] }[];
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
  // bookId 只用于调用方组装，解析器不依赖它
  void bookId;
  return { id: bookId, units, lessons };
}

export function parseLessonPage(lessonId: string, html: string): RawLesson {
  const $ = load(html);
  const title = $('h1').first().text().trim();
  const chars: string[] = [];
  const readings: RawReading[] = [];
  $('section .grid a.zi').first().each((_, grid) => {
    $(grid).find('a.zi').each((__, a) => {
      const ch = $(a).find('span.tzg').text().trim();
      const py = $(a).find('span.py').text().trim();
      if (!ch) return;
      chars.push(ch);
      readings.push({ ch, py });
    });
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
~~~

第一段 `$('section .grid a.zi').first()` 的写法有坑：课页结构是 `section > .grid > a.zi`，直接写 `$('.grid a.zi')` 会把组词区的 `a.zi.small` 也算进去。用下面的写法更稳，替换上面那段：

~~~ts
  const mainGrid = $('section').first().find('.grid').first();
  mainGrid.find('a.zi').each((_, a) => {
    const ch = $(a).find('span.tzg').text().trim();
    const py = $(a).find('span.py').text().trim();
    if (!ch) return;
    chars.push(ch);
    readings.push({ ch, py });
  });
~~~

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: PASS（4 个测试）。若 `preview` 为空，检查选择器 `span.preview`。

- [ ] **Step 5: 提交**

~~~bash
git add scripts/extract-data/adapters/yuwen-muduo.ts scripts/extract-data/adapters/yuwen-muduo.test.ts
git commit -m "feat(yuwen): 首页/册/课解析器"
~~~

---

## Task 5: 拼音表与多音字解析器

**Files:**
- Modify: `scripts/extract-data/adapters/yuwen-muduo.ts`
- Modify: `scripts/extract-data/adapters/yuwen-muduo.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
import { parseDuoyinPage, parsePinyinPage } from './yuwen-muduo.js';

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
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: FAIL，`parsePinyinPage is not a function`。

- [ ] **Step 3: 实现两个解析器**

~~~ts
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
~~~

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: PASS（6 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add scripts/extract-data/adapters/yuwen-muduo.ts scripts/extract-data/adapters/yuwen-muduo.test.ts
git commit -m "feat(yuwen): 拼音表与多音字解析器"
~~~

---

## Task 6: 单字页解析器

**Files:**
- Modify: `scripts/extract-data/adapters/yuwen-muduo.ts`
- Modify: `scripts/extract-data/adapters/yuwen-muduo.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
import { parseCharPage } from './yuwen-muduo.js';

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
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: FAIL，`parseCharPage is not a function`。

- [ ] **Step 3: 实现单字页解析**

~~~ts
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
~~~

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: PASS（7 个测试）。若 `raw.words` 是 0 个，检查选择器是否命中了 `details.more-words` 里的 ul。

- [ ] **Step 5: 提交**

~~~bash
git add scripts/extract-data/adapters/yuwen-muduo.ts scripts/extract-data/adapters/yuwen-muduo.test.ts
git commit -m "feat(yuwen): 单字页解析器"
~~~

---

## Task 7: 归一化与交叉校验

**Files:**
- Modify: `scripts/extract-data/adapters/yuwen-muduo.ts`
- Modify: `scripts/extract-data/adapters/yuwen-muduo.test.ts`

- [ ] **Step 1: 追加失败测试（合成小样本，不依赖 fixtures）**

~~~ts
import { normalizeYuwen } from './yuwen-muduo.js';

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
          {
            stem: 'a',
            rows: [
              { py: 'ā', chars: ['阿'] },
              { py: 'a', chars: ['啊'] },
            ],
          },
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
    // 字全集来自拼音表：阿、啊、地、天、一
    expect(env.chars.map((c) => c.ch).sort()).toEqual(['一', '天', '阿', '啊', '地'].sort());
    const di = env.chars.find((c) => c.ch === '地')!;
    expect(di.readings).toEqual([{ py: 'dì', stem: 'di', lessonId: 'G1A01', words: ['地方'] }]);
    expect(di.radicals).toEqual(['土']);
    expect(di.words).toEqual(['地方', '土地']);
    // 部件里的「不存在的字」被过滤掉；剩 2 个 → 保留
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
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: FAIL，`normalizeYuwen is not a function`。

- [ ] **Step 3: 实现 parseHtml 分派与 normalizeYuwen**

~~~ts
import type {
  YuwenBook,
  YuwenChar,
  YuwenDuoyin,
  YuwenEnvelope,
  YuwenLesson,
  YuwenRadical,
  YuwenStem,
} from '../../../src/data/yuwen/types.js';

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

  const pinyinPage = pinyinPages[0];
  if (!pinyinPage) throw new Error('缺少拼音表页，无法确定字全集');
  const stems: YuwenStem[] = pinyinPage.stems;

  // 字全集与读音：以拼音表为准
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

  // 课与册
  const errs: string[] = [];
  const lessons: YuwenLesson[] = [];
  const books: YuwenBook[] = [];
  const lessonToBook = new Map<string, string>();
  const bookOrder = refs.map((r) => r.id);

  for (const ref of bookOrder) {
    const page = bookPages.find((b) => b.id === ref);
    if (!page) {
      errs.push('缺少册页: ' + ref);
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
        bookId: ref,
        unitNo: raw.unitNo,
        title: raw.title,
        preview: raw.preview,
        chars: parsed.chars,
      });
      lessonToBook.set(raw.id, ref);
    }
    const uniqueChars = new Set(bookLessons.flatMap((l) => l.chars));
    if (ref.lessonCount !== bookLessons.length) {
      errs.push('册 ' + ref + ' 课数不一致：首页 ' + ref.lessonCount + ' / 明细 ' + bookLessons.length);
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
      const out: YuwenChar['readings'][number] = { py: r.py, stem: r.stem, words: rawReading?.words ?? [] };
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

  // 部件：跨字页面合并，只保留字全集内的字，丢弃不足 2 个的部件
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
        radicalMap.set(part.name, { name: part.name, chars: [...new Set(kept)], ...(part.label ? { label: part.label } : {}) });
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
~~~

然后实现 `parseHtml`（替换 Task 3 的占位）：

~~~ts
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
~~~

并把 `normalize()` 占位替换为：

~~~ts
    normalize(pages: unknown[]): YuwenEnvelope {
      return normalizeYuwen(pages);
    },
~~~

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run scripts/extract-data/adapters/yuwen-muduo.test.ts`
Expected: PASS（10 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add scripts/extract-data/adapters/yuwen-muduo.ts scripts/extract-data/adapters/yuwen-muduo.test.ts
git commit -m "feat(yuwen): 归一化与交叉校验"
~~~

---

## Task 8: 注册适配器并实跑抓取

**Files:**
- Modify: `scripts/extract-data/core/runner.ts`

- [ ] **Step 1: 注册**

~~~ts
// scripts/extract-data/core/runner.ts（两处改动）
import { yuwenMuduoAdapter } from '../adapters/yuwen-muduo.js';
// ...
const REGISTRY: Adapter[] = [shijiKbAdapter, dutongjianAdapter, hunterhugAdapter, yuwenMuduoAdapter];
~~~

- [ ] **Step 2: 确认适配器被列出**

Run: `bash scripts/extract-data/extract.sh --list`
Expected: 输出里出现 `yuwen`。

- [ ] **Step 3: 实跑抓取（约 10–15 分钟）**

~~~bash
EXTRACT_MIN_INTERVAL_MS=150 bash scripts/extract-data/extract.sh yuwen
~~~

Expected: 结尾打印 `[extract-data] yuwen: 3380 pages, 0 failed, written staging/yuwen/extracted-<ts>.json`（页数 3380±5）。
中断也没关系：HTTPS 响应已写缓存，重跑命中缓存。

- [ ] **Step 4: 校验信封**

~~~bash
node -e "
const fs=require('fs');
const p=fs.readdirSync('staging/yuwen').filter(f=>f.endsWith('.json')).sort().pop();
const env=JSON.parse(fs.readFileSync('staging/yuwen/'+p,'utf8'));
console.log('file',p,'MB',(fs.statSync('staging/yuwen/'+p).size/1e6).toFixed(2));
console.log('books',env.books.length,'lessons',env.lessons.length,'chars',env.chars.length,'stems',env.stems.length,'duoyin',env.duoyin.length,'radicals',env.radicals.length);
console.log('1a',env.books[0].title,env.books[0].lessonCount,env.books[0].charCount);
console.log('di',JSON.stringify(env.chars.find(c=>c.ch==='地')));
"
~~~

Expected: `books 10 lessons 326 chars 2988 stems 393 duoyin 158`，`radicals` 大于 80；`di` 有 2 个读音、radicals 含「土」、words 10 个。

- [ ] **Step 5: 提交（不含 staging）**

~~~bash
git add scripts/extract-data/core/runner.ts
git commit -m "feat(yuwen): 注册小学语文抽取适配器"
~~~

---

## Task 9: 入库适配器

**Files:**
- Create: `scripts/ingest-data/adapters/yuwen.ts`
- Create: `scripts/ingest-data/adapters/yuwen.test.ts`
- Modify: `scripts/ingest-data/registry.ts`

- [ ] **Step 1: 写失败测试**

~~~ts
// scripts/ingest-data/adapters/yuwen.test.ts
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { yuwenAdapter } from './yuwen';
import type { IngestContext } from '../types';

const ctx = (root: string): IngestContext => ({ root, dryRun: false, knowledgePointIds: new Set() });

function envelope() {
  return {
    source: 'yuwen-muduo',
    extractedAt: '2026-11-11T00:00:00.000Z',
    books: [
      {
        id: '1a', title: '一年级上册', grade: 1, term: 'a', lessonCount: 1, charCount: 1,
        units: [{ no: 1, lessonIds: ['G1A01'] }],
      },
    ],
    lessons: [
      { id: 'G1A01', bookId: '1a', unitNo: 1, title: '识字1：天地人', preview: '天', chars: ['天'] },
    ],
    chars: [
      { ch: '天', readings: [{ py: 'tiān', stem: 'tian', lessonId: 'G1A01', words: ['天天'] }], radicals: ['大'], words: ['天天'] },
    ],
    stems: [{ stem: 'tian', rows: [{ py: 'tiān', chars: ['天'] }] }],
    duoyin: [],
    radicals: [{ name: '大', chars: ['天', '大'] }],
  };
}

describe('yuwenAdapter', () => {
  it('kind 与类型引用指向 yuwen', () => {
    expect(yuwenAdapter.kind).toBe('yuwen');
    expect(yuwenAdapter.typeRef.name).toBe('YuwenEnvelope');
  });

  it('合法信封校验通过', () => {
    expect(yuwenAdapter.validate(envelope(), ctx('/tmp'))).toEqual([]);
  });

  it('引用不完整时报错', () => {
    const bad = envelope();
    bad.lessons[0].chars = ['天', '地'];
    const errs = yuwenAdapter.validate(bad, ctx('/tmp'));
    expect(errs.join('\n')).toMatch(/地/);
  });

  it('merge 整树重写 6 个数据文件', () => {
    const root = mkdtempSync(join(tmpdir(), 'yuwen-ingest-'));
    const result = yuwenAdapter.merge(envelope(), envelope(), ctx(root));

    expect(result.files).toHaveLength(6);
    for (const name of ['books', 'lessons', 'chars', 'pinyin', 'duoyin', 'radicals']) {
      expect(existsSync(join(root, 'src/data/yuwen', name + '.ts'))).toBe(true);
    }
    const books = readFileSync(join(root, 'src/data/yuwen/books.ts'), 'utf8');
    expect(books).toContain('由 scripts/ingest-data 生成');
    expect(books).toContain('export const YUWEN_BOOKS');
    expect(books).toContain('一年级上册');
    expect(yuwenAdapter.wire()).toEqual({ files: [] });
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run scripts/ingest-data/adapters/yuwen.test.ts`
Expected: FAIL，`Cannot find module './yuwen'`。

- [ ] **Step 3: 实现入库适配器**

~~~ts
// scripts/ingest-data/adapters/yuwen.ts
//
// 注意：这是唯一一个整树重写（而非「只追加不覆盖」）的 adapter。
// 它独占 src/data/yuwen/ 整棵子树，参考站更新后必须整体替换；
// 若按追加语义合并，重跑会留下新旧混杂的数据。
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext, MergeResult, WireResult } from '../types';
import { getRoot } from '../paths';
import type {
  YuwenBook,
  YuwenChar,
  YuwenDuoyin,
  YuwenEnvelope,
  YuwenLesson,
  YuwenRadical,
  YuwenStem,
} from '../../../src/data/yuwen/types';

const DATA_DIR = 'src/data/yuwen';
const HEADER = '// 由 scripts/ingest-data 生成，请勿手改。来源：yuwen.muduo.org\n\n';

function emitArray<T>(constName: string, typeName: string, items: T[]): string {
  const body = items.map((item) => '  ' + JSON.stringify(item)).join(',\n');
  return HEADER + "import type { " + typeName + " } from './types';\n\n" +
    'export const ' + constName + ': ' + typeName + '[] = [\n' + body + ',\n];\n';
}

export const yuwenAdapter: Adapter = {
  kind: 'yuwen',
  typeRef: {
    path: join(getRoot(), 'src/data/yuwen/types.ts'),
    name: 'YuwenEnvelope',
    expr: 'YuwenEnvelope',
  },

  extract(raw: unknown): unknown {
    return raw;
  },

  validate(value: unknown): string[] {
    const errs: string[] = [];
    const env = value as YuwenEnvelope;
    if (!env || typeof env !== 'object') return ['信封不是对象'];
    const books = env.books ?? [];
    const lessons = env.lessons ?? [];
    const chars = env.chars ?? [];
    const stems = env.stems ?? [];
    const radicals = env.radicals ?? [];
    const duoyin = env.duoyin ?? [];

    if (!books.length) errs.push('books 为空');
    if (!lessons.length) errs.push('lessons 为空');
    if (!chars.length) errs.push('chars 为空');
    if (!stems.length) errs.push('stems 为空');

    const charSet = new Set(chars.map((c) => c.ch));
    if (charSet.size !== chars.length) errs.push('chars 有重复字');

    const bookIds = new Set(books.map((b) => b.id));
    const lessonIds = new Set(lessons.map((l) => l.id));
    if (lessonIds.size !== lessons.length) errs.push('lessons 有重复 id');

    for (const book of books) {
      if (!/^[1-5][ab]$/.test(book.id)) errs.push('册 id 形态错误: ' + book.id);
      for (const unit of book.units) {
        for (const id of unit.lessonIds) {
          if (!lessonIds.has(id)) errs.push('册 ' + book.id + ' 引用了不存在的课: ' + id);
        }
      }
    }

    for (const lesson of lessons) {
      if (!/^G[1-5][AB]\d{2}$/.test(lesson.id)) errs.push('课 id 形态错误: ' + lesson.id);
      if (!bookIds.has(lesson.bookId)) errs.push('课 ' + lesson.id + ' 的册不存在: ' + lesson.bookId);
      if (!lesson.chars.length) errs.push('课没有生字: ' + lesson.id);
      for (const ch of lesson.chars) {
        if (!charSet.has(ch)) errs.push('课 ' + lesson.id + ' 的字不在字表: ' + ch);
      }
    }

    const lessonCharUnion = new Set(lessons.flatMap((l) => l.chars));
    for (const ch of lessonCharUnion) {
      if (!charSet.has(ch)) errs.push('课的生字并集不在字表: ' + ch);
    }
    for (const ch of charSet) {
      if (!lessonCharUnion.has(ch)) errs.push('字表里的字没有任何课引用: ' + ch);
    }

    for (const stem of stems) {
      for (const row of stem.rows) {
        for (const ch of row.chars) {
          if (!charSet.has(ch)) errs.push('拼音表引用了字表外的字: ' + ch);
        }
      }
    }

    for (const entry of duoyin) {
      if (!charSet.has(entry.ch)) errs.push('多音字不在字表: ' + entry.ch);
    }

    for (const radical of radicals) {
      if (radical.chars.length < 2) errs.push('部件字不足 2 个: ' + radical.name);
      for (const ch of radical.chars) {
        if (!charSet.has(ch)) errs.push('部件 ' + radical.name + ' 引用了字表外的字: ' + ch);
      }
    }

    return errs;
  },

  merge(value: unknown, _raw: unknown, ctx: IngestContext): MergeResult {
    const env = value as YuwenEnvelope;
    const dir = join(ctx.root, DATA_DIR);
    mkdirSync(dir, { recursive: true });
    const files: Record<string, string> = {
      'books.ts': emitArray<YuwenBook>('YUWEN_BOOKS', 'YuwenBook', env.books),
      'lessons.ts': emitArray<YuwenLesson>('YUWEN_LESSONS', 'YuwenLesson', env.lessons),
      'chars.ts': emitArray<YuwenChar>('YUWEN_CHARS', 'YuwenChar', env.chars),
      'pinyin.ts': emitArray<YuwenStem>('YUWEN_STEMS', 'YuwenStem', env.stems),
      'duoyin.ts': emitArray<YuwenDuoyin>('YUWEN_DUOYIN', 'YuwenDuoyin', env.duoyin),
      'radicals.ts': emitArray<YuwenRadical>('YUWEN_RADICALS', 'YuwenRadical', env.radicals),
    };
    const written: string[] = [];
    for (const [name, content] of Object.entries(files)) {
      const path = join(dir, name);
      writeFileSync(path, content, 'utf-8');
      written.push(path);
    }
    return { files: written, inserted: env.chars.length + env.lessons.length };
  },

  wire(): WireResult {
    // 查询层 src/data/yuwen/index.ts 是手写代码，不由脚本生成。
    return { files: [] };
  },
};
~~~

- [ ] **Step 4: 注册**

~~~ts
// scripts/ingest-data/registry.ts
import { yuwenAdapter } from './adapters/yuwen';
// ...
const adapters: Adapter[] = [..., yuwenAdapter];
~~~

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run scripts/ingest-data/adapters/yuwen.test.ts`
Expected: PASS（4 个测试）。

- [ ] **Step 6: 提交**

~~~bash
git add scripts/ingest-data/adapters/yuwen.ts scripts/ingest-data/adapters/yuwen.test.ts scripts/ingest-data/registry.ts
git commit -m "feat(yuwen): 入库适配器（整树重写）"
~~~

---

## Task 10: 实跑入库 + 运行时查询层

**Files:**
- Create: `src/data/yuwen/index.ts`
- Create: `src/data/yuwen/index.test.ts`
- Create（生成）: `src/data/yuwen/{books,lessons,chars,pinyin,duoyin,radicals}.ts`

- [ ] **Step 1: 实跑入库**

~~~bash
STAGED=$(ls -t staging/yuwen/*.json | head -1)
bash scripts/ingest-data/ingest.sh "$STAGED"
~~~

Expected: `✓ staging/yuwen/extracted-*.json → 合并 src/data/yuwen/books.ts, …`，6 个文件出现。

~~~bash
wc -c src/data/yuwen/*.ts
~~~

Expected: `chars.ts` 约 1–3MB，其余显著更小。

- [ ] **Step 2: 写失败测试**

~~~ts
// src/data/yuwen/index.test.ts
import { describe, expect, it } from 'vitest';
import {
  YUWEN_BOOKS,
  YUWEN_CHARS,
  YUWEN_LESSONS,
  YUWEN_STEMS,
  bookById,
  charByChar,
  charsOfLesson,
  charsOfRadical,
  homophonesOf,
  lessonById,
  stemByStem,
  unitOf,
} from './index';

describe('yuwen 运行时查询层', () => {
  it('数据规模与 spec 一致', () => {
    expect(YUWEN_BOOKS).toHaveLength(10);
    expect(YUWEN_LESSONS).toHaveLength(326);
    expect(YUWEN_CHARS).toHaveLength(2988);
    expect(YUWEN_STEMS.length).toBeGreaterThan(300);
  });

  it('按 id 查册与课', () => {
    expect(bookById('1a')?.title).toBe('一年级上册');
    const lesson = lessonById('G1A01');
    expect(lesson?.title).toBe('识字1：天地人');
    expect(lesson?.bookId).toBe('1a');
    expect(bookById('nope')).toBeUndefined();
    expect(lessonById('nope')).toBeUndefined();
  });

  it('按字查详情，含读音与组词', () => {
    const di = charByChar('地');
    expect(di).toBeDefined();
    expect(di!.readings.some((r) => r.py === 'dì')).toBe(true);
    expect(di!.radicals).toContain('土');
    expect(charByChar('不存在的字')).toBeUndefined();
  });

  it('同音字按精确读音分组且不含自身', () => {
    const list = homophonesOf('地', 'dì');
    expect(list).not.toContain('地');
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('第');
  });

  it('部件反查与单元区间', () => {
    expect(charsOfRadical('土')).toContain('地');
    const unit = unitOf('1a', 1);
    expect(unit?.lessons.map((l) => l.id)).toEqual([
      'G1A01', 'G1A02', 'G1A03', 'G1A04', 'G1A05', 'G1A06',
    ]);
    expect(unit?.chars).toContain('天');
    expect(unitOf('1a', 99)).toBeUndefined();
    expect(unitOf('nope', 1)).toBeUndefined();
  });

  it('课的字表与 stem 查询', () => {
    expect(charsOfLesson('G1A01')).toEqual(['天', '地', '人', '你', '我', '他']);
    expect(stemByStem('a')?.rows.length).toBeGreaterThan(0);
    expect(charsOfLesson('nope')).toEqual([]);
  });
});
~~~

- [ ] **Step 3: 运行确认失败**

Run: `npx vitest run src/data/yuwen/index.test.ts`
Expected: FAIL，`Cannot find module './index'`。

- [ ] **Step 4: 写查询层**

~~~ts
// src/data/yuwen/index.ts
//
// 手写查询层：把生成的数据文件建好 Map 索引，供组件与 SEO 使用。
// 数据文件由 scripts/ingest-data 生成，勿手改。
import { YUWEN_BOOKS } from './books';
import { YUWEN_CHARS } from './chars';
import { YUWEN_DUOYIN } from './duoyin';
import { YUWEN_LESSONS } from './lessons';
import { YUWEN_STEMS } from './pinyin';
import { YUWEN_RADICALS } from './radicals';
import type { YuwenBook, YuwenChar, YuwenDuoyin, YuwenLesson, YuwenRadical, YuwenStem } from './types';

export { YUWEN_BOOKS, YUWEN_CHARS, YUWEN_DUOYIN, YUWEN_LESSONS, YUWEN_RADICALS, YUWEN_STEMS };
export type { YuwenBook, YuwenChar, YuwenDuoyin, YuwenLesson, YuwenRadical, YuwenStem };

const BOOK_INDEX = new Map(YUWEN_BOOKS.map((b) => [b.id, b]));
const LESSON_INDEX = new Map(YUWEN_LESSONS.map((l) => [l.id, l]));
const CHAR_INDEX = new Map(YUWEN_CHARS.map((c) => [c.ch, c]));
const STEM_INDEX = new Map(YUWEN_STEMS.map((s) => [s.stem, s]));
const DUOYIN_INDEX = new Map(YUWEN_DUOYIN.map((d) => [d.ch, d]));
const RADICAL_INDEX = new Map(YUWEN_RADICALS.map((r) => [r.name, r]));

/** 读音（精确拼音）→ 字集合，用于同音字。 */
const HOMOPHONE_INDEX: Map<string, string[]> = (() => {
  const index = new Map<string, string[]>();
  for (const item of YUWEN_CHARS) {
    for (const reading of item.readings) {
      const list = index.get(reading.py);
      if (list) list.push(item.ch);
      else index.set(reading.py, [item.ch]);
    }
  }
  return index;
})();

export function bookById(id: string): YuwenBook | undefined {
  return BOOK_INDEX.get(id);
}

export function lessonById(id: string): YuwenLesson | undefined {
  return LESSON_INDEX.get(id);
}

export function charByChar(ch: string): YuwenChar | undefined {
  return CHAR_INDEX.get(ch);
}

export function stemByStem(stem: string): YuwenStem | undefined {
  return STEM_INDEX.get(stem);
}

export function duoyinByChar(ch: string): YuwenDuoyin | undefined {
  return DUOYIN_INDEX.get(ch);
}

/** 同音字（不含自身）。 */
export function homophonesOf(ch: string, py: string): string[] {
  return (HOMOPHONE_INDEX.get(py) ?? []).filter((c) => c !== ch);
}

export function charsOfRadical(name: string): string[] {
  return RADICAL_INDEX.get(name)?.chars ?? [];
}

export function charsOfLesson(lessonId: string): string[] {
  return LESSON_INDEX.get(lessonId)?.chars ?? [];
}

/** 某册某单元：课文（按顺序）与该单元去重后的生字（保持课文顺序）。 */
export function unitOf(
  bookId: string,
  unitNo: number,
): { lessons: YuwenLesson[]; chars: string[] } | undefined {
  const book = BOOK_INDEX.get(bookId);
  if (!book) return undefined;
  const unit = book.units.find((u) => u.no === unitNo);
  if (!unit) return undefined;
  const lessons = unit.lessonIds
    .map((id) => LESSON_INDEX.get(id))
    .filter((l): l is YuwenLesson => Boolean(l));
  const seen = new Set<string>();
  const chars: string[] = [];
  for (const lesson of lessons) {
    for (const ch of lesson.chars) {
      if (seen.has(ch)) continue;
      seen.add(ch);
      chars.push(ch);
    }
  }
  return { lessons, chars };
}
~~~

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src/data/yuwen/index.test.ts`
Expected: PASS（6 个测试）。若规模断言失败，回到 Step 1 检查 staging 信封里的数量。

- [ ] **Step 6: 全量测试与提交**

~~~bash
npx vitest run src/data/yuwen/index.test.ts scripts/extract-data/adapters/yuwen-muduo.test.ts scripts/ingest-data/adapters/yuwen.test.ts
npx tsc -b --pretty false
git add src/data/yuwen
git commit -m "feat(yuwen): 生成数据文件与运行时查询层"
~~~

Expected: 三份测试全绿，tsc 退出码 0。

---

## Task 11: 路由常量与 URL 构造

**Files:**
- Create: `src/yuwen/paths.ts`
- Create: `src/yuwen/paths.test.ts`

- [ ] **Step 1: 写失败测试**

~~~ts
// src/yuwen/paths.test.ts
import { describe, expect, it } from 'vitest';
import { YUWEN_CHARS, YUWEN_LESSONS } from '../data/yuwen';
import {
  allYuwenRoutePaths,
  bookPath,
  charPath,
  duoyinPath,
  isYuwenPath,
  lessonPath,
  pinyinPath,
  reviewPath,
  tingxiePath,
} from './paths';

describe('yuwen paths', () => {
  it('构造 9 类 URL', () => {
    expect(bookPath('1a')).toBe('/yuwen/book/1a');
    expect(lessonPath('G1A01')).toBe('/yuwen/lesson/G1A01');
    expect(charPath('天')).toBe('/yuwen/char/%E5%A4%A9');
    expect(reviewPath('1a', 1)).toBe('/yuwen/review/1a/1');
    expect(tingxiePath('1a', 1)).toBe('/yuwen/tingxie/1a/1');
    expect(tingxiePath('1a', 1, { shuffle: true, hint: true, answers: false })).toBe(
      '/yuwen/tingxie/1a/1?shuffle=1&hint=1&answers=0',
    );
    expect(pinyinPath()).toBe('/yuwen/pinyin');
    expect(pinyinPath('zhang')).toBe('/yuwen/pinyin/zhang');
    expect(duoyinPath()).toBe('/yuwen/duoyin');
  });

  it('isYuwenPath 只认 /yuwen 与其子路径', () => {
    expect(isYuwenPath('/yuwen')).toBe(true);
    expect(isYuwenPath('/yuwen/')).toBe(true);
    expect(isYuwenPath('/yuwen/char/天')).toBe(true);
    expect(isYuwenPath('/yuwenx')).toBe(false);
    expect(isYuwenPath('/')).toBe(false);
  });

  it('预渲染清单是未编码的原始路径，且不重复', () => {
    const paths = allYuwenRoutePaths();
    expect(paths).toContain('/yuwen/char/天');
    expect(paths).not.toContain('/yuwen/char/%E5%A4%A9');
    expect(paths.length).toBeGreaterThan(3000);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain('/yuwen/lesson/' + YUWEN_LESSONS[0].id);
    expect(paths).toContain('/yuwen');
    expect(paths.filter((p) => p.startsWith('/yuwen/char/')).length).toBe(YUWEN_CHARS.length);
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/yuwen/paths.test.ts`
Expected: FAIL，报 Cannot find module './paths'。

- [ ] **Step 3: 实现 paths.ts**

~~~ts
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
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/yuwen/paths.test.ts`
Expected: PASS（3 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/yuwen/paths.ts src/yuwen/paths.test.ts
git commit -m "feat(yuwen): 路由常量与 URL 构造"
~~~

---

## Task 12: 导航改造（共享 NAV_GROUPS + 小学语文入口）

**Files:**
- Create: `src/components/Header/nav-items.ts`
- Modify: `src/components/Header/NavMenu.tsx`
- Modify: `src/components/Header/MobileNav.tsx`
- Modify: `src/components/Header/index.tsx`
- Create: `src/components/Header/NavMenu.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/Header/NavMenu.test.tsx
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavMenu } from './NavMenu';

function renderMenu(path: string, activeView: 'knowledge' | null) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavMenu activeView={activeView} />
    </MemoryRouter>,
  );
}

describe('NavMenu', () => {
  it('工具速查分组里有小学语文入口，指向 /yuwen', () => {
    renderMenu('/', 'knowledge');
    fireEvent.click(screen.getByRole('button', { name: /工具速查/ }));
    const link = screen.getByRole('menuitem', { name: '小学语文' });
    expect(link.getAttribute('href')).toBe('/yuwen');
  });

  it('在 /yuwen 上该分组高亮', () => {
    renderMenu('/yuwen/char/天', null);
    expect(screen.getByRole('button', { name: /工具速查/ }).getAttribute('data-active')).toBe('true');
  });

  it('在 /yuwen 上小学语文条目自身高亮', () => {
    renderMenu('/yuwen', null);
    fireEvent.click(screen.getByRole('button', { name: /工具速查/ }));
    expect(screen.getByRole('menuitem', { name: '小学语文' }).getAttribute('data-active')).toBe('true');
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/Header/NavMenu.test.tsx`
Expected: FAIL，找不到「小学语文」。

- [ ] **Step 3: 抽出共享 nav-items.ts**

~~~ts
// src/components/Header/nav-items.ts
import type { ViewType } from './types';

export interface NavItem {
  label: string;
  /** 走 Home 的视图切换（pathForView）。 */
  view?: ViewType;
  /** 独立页面路由，如 /yuwen。 */
  to?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: '学科学习',
    items: [
      { label: '知识点', view: 'knowledge' },
      { label: '公式宝典', view: 'formula' },
      { label: '速算口诀', view: 'mental-math' },
      { label: '教程', view: 'tutorial' },
    ],
  },
  {
    label: '工具速查',
    items: [
      { label: '小学语文', to: '/yuwen' },
      { label: '速查表', view: 'cheatsheet' },
      { label: '专题练习', view: 'practice' },
      { label: '融会贯通', view: 'mastery' },
      { label: '学习笔记', view: 'notes' },
    ],
  },
  {
    label: '经典阅读',
    items: [
      { label: '资治通鉴', view: 'zizhi' },
      { label: '史记', view: 'shiji' },
      { label: '古诗词', view: 'poetry' },
    ],
  },
  {
    label: 'AI 助手',
    items: [{ label: 'AI 助教', view: 'ai-chat' }],
  },
];
~~~

- [ ] **Step 4: 改 NavMenu**

~~~tsx
// src/components/Header/NavMenu.tsx
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ViewType } from './types';
import { pathForView } from '../../view-routes';
import { NAV_GROUPS, type NavItem } from './nav-items';
import { Icon } from '../icons/Icon';

interface NavMenuProps {
  activeView: ViewType | null;
}

export function NavMenu({ activeView }: NavMenuProps) {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = (label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenGroup(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 200);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const isItemActive = (item: NavItem): boolean => {
    if (item.view) return activeView === item.view;
    if (!item.to) return false;
    return pathname === item.to || pathname.startsWith(item.to + '/');
  };

  const hrefFor = (item: NavItem): string => {
    if (item.to) return item.to;
    if (item.view) return pathForView(item.view);
    return '/';
  };

  return (
    <nav aria-label="主导航" className="nav">
      {NAV_GROUPS.map((group) => {
        const isOpen = openGroup === group.label;
        const isActive = group.items.some(isItemActive);

        return (
          <div
            key={group.label}
            className="nav-wrap"
            onMouseEnter={() => open(group.label)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              data-active={isActive ? 'true' : undefined}
              onClick={() => (isOpen ? setOpenGroup(null) : open(group.label))}
              className="nav-link"
            >
              {group.label}
              <Icon name="chevron-down" className="w-3 h-3" />
            </button>

            {isOpen && (
              <div role="menu" aria-label={group.label} className="nav-panel">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    to={hrefFor(item)}
                    role="menuitem"
                    data-active={isItemActive(item) ? 'true' : undefined}
                    onClick={() => setOpenGroup(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
~~~

- [ ] **Step 5: 改 MobileNav 与 Header**

MobileNav 三处改动：

1. 顶部导入替换：删掉本地 NAV_GROUPS 常量，改为共享来源；加 Link 与 useLocation：

~~~tsx
import { Link, useLocation } from 'react-router-dom';
import { NAV_GROUPS } from './nav-items';
~~~

2. 组件签名与路由判断：

~~~tsx
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType | null;
  onViewChange: (view: ViewType) => void;
  onOpenSettings: () => void;
}

export function MobileNav({ isOpen, onClose, activeView, onViewChange, onOpenSettings }: MobileNavProps) {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathnameMatches = (target: string) => pathname === target || pathname.startsWith(target + '/');
  // ...
~~~

3. 分组渲染里的 `group.views.map((view) => ...)` 整段替换为：

~~~tsx
                    {group.items.map((item) =>
                      item.to ? (
                        <Link
                          key={item.label}
                          to={item.to}
                          role="menuitem"
                          className="drawer__item"
                          data-active={pathnameMatches(item.to) ? 'true' : undefined}
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          className="drawer__item"
                          data-active={activeView === item.view ? 'true' : undefined}
                          onClick={() => {
                            if (item.view) onViewChange(item.view);
                            onClose();
                          }}
                        >
                          {item.label}
                        </button>
                      ),
                    )}
~~~

Header（`src/components/Header/index.tsx`）只改一处类型：

~~~tsx
interface HeaderProps {
  activeView: ViewType | null;
  onViewChange: (view: ViewType) => void;
}
~~~

- [ ] **Step 6: 运行测试与类型检查**

Run: `npx vitest run src/components/Header/NavMenu.test.tsx`
Expected: PASS（3 个测试）。

Run: `npx tsc -b --pretty false`
Expected: 退出码 0。

- [ ] **Step 7: 提交**

~~~bash
git add src/components/Header
git commit -m "feat(nav): 工具速查加入小学语文入口，导航配置收口到 nav-items"
~~~

---

## Task 13: 原语 A（语音、拼音开关、田字格）

**Files:**
- Create: `src/components/yuwen/hooks/useSpeech.ts`
- Create: `src/components/yuwen/SpeakButton.tsx`
- Create: `src/components/yuwen/PinyinToggle.tsx`
- Create: `src/components/yuwen/ZiGrid.tsx`
- Create: `src/components/yuwen/ZiGrid.test.tsx`
- Create: `src/components/yuwen/PinyinToggle.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/ZiGrid.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ZiGrid } from './ZiGrid';

describe('ZiGrid', () => {
  it('渲染拼音与字，并链到字详情', () => {
    render(
      <MemoryRouter>
        <ZiGrid items={[{ ch: '天', py: 'tiān' }, { ch: '地', py: 'dì' }]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('tiān')).toBeTruthy();
    const link = screen.getByText('天').closest('a');
    expect(decodeURIComponent(link?.getAttribute('href') ?? '')).toBe('/yuwen/char/天');
  });

  it('current 高亮当前字', () => {
    render(
      <MemoryRouter>
        <ZiGrid items={[{ ch: '地' }]} current="地" />
      </MemoryRouter>,
    );
    expect(screen.getByText('地').closest('a')?.className).toContain('zi-cell--current');
  });
});
~~~

~~~tsx
// src/components/yuwen/PinyinToggle.test.tsx
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PinyinToggle } from './PinyinToggle';

describe('PinyinToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('hide-py');
  });

  it('切换时写 localStorage 并给 html 加类', () => {
    render(<PinyinToggle />);

    fireEvent.click(screen.getByRole('button', { name: '隐藏拼音' }));
    expect(window.localStorage.getItem('yuwen_hide_pinyin')).toBe('1');
    expect(document.documentElement.classList.contains('hide-py')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '显示拼音' }));
    expect(window.localStorage.getItem('yuwen_hide_pinyin')).toBe('0');
    expect(document.documentElement.classList.contains('hide-py')).toBe(false);
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现四个文件**

~~~ts
// src/components/yuwen/hooks/useSpeech.ts
import { useCallback } from 'react';

export interface SpeechApi {
  supported: boolean;
  speak: (text: string) => void;
}

/** 浏览器中文朗读。SSR 与非支持环境返回 supported=false，调用无副作用。 */
export function useSpeech(): SpeechApi {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { supported, speak };
}
~~~

~~~tsx
// src/components/yuwen/SpeakButton.tsx
import { Icon } from '../icons/Icon';
import { useSpeech } from './hooks/useSpeech';

interface SpeakButtonProps {
  text: string;
  label?: string;
}

/** 朗读按钮；浏览器不支持语音合成时整块不渲染。 */
export function SpeakButton({ text, label }: SpeakButtonProps) {
  const { supported, speak } = useSpeech();
  if (!supported || !text) return null;

  return (
    <button
      type="button"
      className="icon-btn"
      title={'朗读：' + text}
      aria-label={label ?? '朗读 ' + text}
      onClick={() => speak(text)}
    >
      <Icon name="mic" className="w-4 h-4" />
    </button>
  );
}
~~~

~~~tsx
// src/components/yuwen/PinyinToggle.tsx
import { useEffect, useState } from 'react';
import { storageGet, storageSet } from '../../utils/storage';

const STORAGE_KEY = 'yuwen_hide_pinyin';

/** 读持久化的隐藏状态（SSR 时恒为 false）。 */
export function readHidePinyin(): boolean {
  return storageGet(STORAGE_KEY) === '1';
}

/** 把 hide-py 类挂到 html 根元素，CSS 据此隐藏拼音。 */
export function applyHidePinyin(hide: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('hide-py', hide);
}

export function PinyinToggle() {
  const [hide, setHide] = useState<boolean>(() => readHidePinyin());

  useEffect(() => {
    applyHidePinyin(hide);
  }, [hide]);

  return (
    <button
      type="button"
      className="btn btn-secondary"
      aria-pressed={hide}
      onClick={() => {
        const next = !hide;
        setHide(next);
        storageSet(STORAGE_KEY, next ? '1' : '0');
        applyHidePinyin(next);
      }}
    >
      {hide ? '显示拼音' : '隐藏拼音'}
    </button>
  );
}
~~~

~~~tsx
// src/components/yuwen/ZiGrid.tsx
import { Link } from 'react-router-dom';
import { charPath } from '../../yuwen/paths';

export interface ZiItem {
  ch: string;
  py?: string;
}

interface ZiGridProps {
  items: ZiItem[];
  size?: 'sm' | 'md' | 'lg';
  current?: string;
}

/** 田字格生字网格：拼音在上、字在下，每格链到单字页。 */
export function ZiGrid({ items, size = 'md', current }: ZiGridProps) {
  return (
    <div className={'zi-grid' + (size === 'md' ? '' : ' zi-grid--' + size)}>
      {items.map((item) => (
        <Link
          key={item.ch + (item.py ?? '')}
          to={charPath(item.ch)}
          className={'zi-cell' + (item.ch === current ? ' zi-cell--current' : '')}
        >
          {item.py ? <span className="zi-cell__py">{item.py}</span> : null}
          <span className="zi-cell__ch">{item.ch}</span>
        </Link>
      ))}
    </div>
  );
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/components/yuwen`
Expected: PASS（3 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/components/yuwen
git commit -m "feat(yuwen): 语音/拼音开关/田字格原语"
~~~

---

## Task 14: 原语 B（组词、字 chips）

**Files:**
- Create: `src/components/yuwen/WordList.tsx`
- Create: `src/components/yuwen/CharChips.tsx`
- Create: `src/components/yuwen/WordList.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/WordList.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WordList } from './WordList';
import { CharChips } from './CharChips';

describe('WordList', () => {
  it('渲染词语；空数组显示占位文案', () => {
    const { rerender } = render(<WordList words={['天天', '天地']} />);
    expect(screen.getByText('天天')).toBeTruthy();
    expect(screen.getByText('天地')).toBeTruthy();

    rerender(<WordList words={[]} />);
    expect(screen.getByText('暂无组词')).toBeTruthy();
  });
});

describe('CharChips', () => {
  it('渲染同音字链接并高亮当前字', () => {
    render(
      <MemoryRouter>
        <CharChips chars={['弟', '第']} current="第" />
      </MemoryRouter>,
    );
    const current = screen.getByText('第').closest('a');
    expect(current?.className).toContain('chip--current');
    expect(decodeURIComponent(screen.getByText('弟').closest('a')?.getAttribute('href') ?? '')).toBe(
      '/yuwen/char/弟',
    );
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/WordList.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现两个原语**

~~~tsx
// src/components/yuwen/WordList.tsx
import { useSpeech } from './hooks/useSpeech';

interface WordListProps {
  words: string[];
  emptyLabel?: string;
}

/** 组词列表；有语音时点词即读。 */
export function WordList({ words, emptyLabel = '暂无组词' }: WordListProps) {
  const { supported, speak } = useSpeech();

  if (words.length === 0) {
    return <p className="text-ink-3 text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="words">
      {words.map((word) => (
        <li key={word}>
          {supported ? (
            <button type="button" className="word-chip" title={'朗读：' + word} onClick={() => speak(word)}>
              {word}
            </button>
          ) : (
            <span className="word-chip">{word}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
~~~

~~~tsx
// src/components/yuwen/CharChips.tsx
import { Link } from 'react-router-dom';
import { charPath } from '../../yuwen/paths';

interface CharChipsProps {
  chars: string[];
  current?: string;
}

/** 同音字 / 含某部件的字。 */
export function CharChips({ chars, current }: CharChipsProps) {
  if (chars.length === 0) return null;

  return (
    <div className="chips">
      {chars.map((ch) => (
        <Link key={ch} to={charPath(ch)} className={'chip' + (ch === current ? ' chip--current' : '')}>
          {ch}
        </Link>
      ))}
    </div>
  );
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/components/yuwen/WordList.test.tsx`
Expected: PASS（2 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/components/yuwen
git commit -m "feat(yuwen): 组词与字 chips 原语"
~~~

---

## Task 15: 模块样式（ui.css）

**Files:**
- Modify: `src/styles/ui.css`

- [ ] **Step 1: 在 ui.css 末尾追加一个 components 层**

~~~css
@layer components {
  /* ---- 小学语文（/yuwen） ---- */
  .zi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
    gap: var(--space-xs);
  }
  .zi-grid--lg {
    grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  }
  .zi-grid--sm {
    grid-template-columns: repeat(auto-fill, minmax(3.25rem, 1fr));
  }
  .zi-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 4px;
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-md);
    background: var(--color-card);
    color: var(--color-ink);
    text-decoration: none;
    transition: border-color var(--dur-micro), background-color var(--dur-micro);
  }
  .zi-cell:hover {
    border-color: var(--color-rule-strong);
    background: var(--color-accent-soft);
  }
  .zi-cell:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
  .zi-cell__py {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-ink-2);
    line-height: 1.4;
  }
  .zi-cell__ch {
    font-size: var(--text-2xl, 1.5rem);
    line-height: 1.2;
    font-family: var(--font-serif);
  }
  .zi-grid--lg .zi-cell__ch {
    font-size: var(--text-3xl, 1.875rem);
  }
  .zi-grid--sm .zi-cell__ch {
    font-size: var(--text-lg, 1.125rem);
  }
  .hide-py .zi-cell__py {
    visibility: hidden;
  }
  .zi-cell--current {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  .yuwen-book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: var(--space-md);
  }
  .yuwen-book-card {
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-card);
    padding: var(--space-md);
    background: var(--color-card);
  }
  .yuwen-units {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2xs);
  }
  .yuwen-label {
    margin: var(--space-xs) 0 var(--space-2xs);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-ink-3);
  }
  .yuwen-section {
    margin-top: var(--space-lg);
  }
  .yuwen-source {
    margin-top: var(--space-xl);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-ink-3);
  }

  .words {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2xs);
    margin: var(--space-2xs) 0 0;
    padding: 0;
    list-style: none;
  }
  .word-chip {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-pill);
    background: var(--color-card);
    color: var(--color-ink);
    font-size: var(--text-sm, 0.875rem);
    cursor: pointer;
  }
  .word-chip:hover {
    background: var(--color-accent-soft);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2xs);
    margin-top: var(--space-2xs);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 6px;
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-sm);
    background: var(--color-card);
    color: var(--color-ink);
    font-family: var(--font-serif);
    font-size: var(--text-lg, 1.125rem);
    text-decoration: none;
  }
  .chip:hover {
    background: var(--color-accent-soft);
  }
  .chip--current {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  .bishun {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-start;
  }
  .bishun__writer {
    width: 200px;
    height: 200px;
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-md);
    background: var(--color-card);
  }
  .bishun__steps {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2xs);
  }
  .bishun__step {
    display: inline-flex;
    width: 3rem;
    height: 3rem;
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-sm);
    background: var(--color-card);
  }
  .bishun__step svg {
    width: 100%;
    height: 100%;
    fill: var(--color-ink);
  }

  .tx-sheet {
    padding: var(--space-lg);
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-card);
    background: var(--color-card);
  }
  .tx-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
    margin-bottom: var(--space-md);
  }
  .tx-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    gap: var(--space-sm);
    margin: var(--space-md) 0 0;
    padding: 0;
    list-style: none;
  }
  .tx-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tx-py {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-ink-2);
  }
  .tx-box {
    display: block;
    height: 2.75rem;
    border-bottom: 1px solid var(--color-rule-strong);
  }
  .tx-key {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @media print {
    .site-header,
    .site-footer,
    .tx-controls,
    .yuwen-source {
      display: none !important;
    }
    .tx-sheet {
      padding: 0;
      border: none;
      background: transparent;
    }
    .tx-answers {
      break-before: page;
    }
  }
}
~~~

- [ ] **Step 2: 校验 CSS 能被 Tailwind/Vite 处理**

Run: `npx vite build --mode production 2>&1 | tail -6`
Expected: 构建成功，无 postcss 报错。

- [ ] **Step 3: 提交**

~~~bash
git add src/styles/ui.css
git commit -m "feat(yuwen): 田字格/卡片/听写单与打印样式"
~~~

---

## Task 16: 笔顺组件

**Files:**
- Modify: `package.json`（新增 hanzi-writer）
- Create: `src/components/yuwen/BishunSection.tsx`
- Create: `src/components/yuwen/BishunSection.test.tsx`

- [ ] **Step 1: 安装依赖**

~~~bash
npm install hanzi-writer@^3.7.3
~~~

Expected: `package.json` 的 dependencies 里出现 `hanzi-writer`（package-lock.json 不入库，属正常）。

- [ ] **Step 2: 写失败测试**

~~~tsx
// src/components/yuwen/BishunSection.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('hanzi-writer', () => ({
  default: {
    loadCharacterData: async () => ({ strokes: ['M0 0', 'M1 1'] }),
    create: () => ({}),
  },
}));

import { BishunSection } from './BishunSection';

describe('BishunSection', () => {
  it('数据到达后渲染画数与逐笔小格', async () => {
    render(<BishunSection ch="地" />);
    expect(await screen.findByText('共 2 画')).toBeTruthy();
    expect(screen.getAllByTitle(/第 \d 笔/)).toHaveLength(2);
  });
});
~~~

- [ ] **Step 3: 运行确认失败**

Run: `npx vitest run src/components/yuwen/BishunSection.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 4: 实现组件**

~~~tsx
// src/components/yuwen/BishunSection.tsx
import { useEffect, useState } from 'react';

interface HanziWriterData {
  strokes: string[];
}

interface HanziWriterApi {
  loadCharacterData(ch: string): Promise<HanziWriterData | undefined>;
  create(id: string, ch: string, options: Record<string, unknown>): unknown;
}

interface BishunSectionProps {
  ch: string;
}

/**
 * 笔顺演示：Hanzi Writer 播放笔顺，并画出每一步的小田字格。
 * 笔画数据由 hanzi-writer 从 CDN 取；取不到（离线 / 无该字数据）时整段不渲染。
 */
export function BishunSection({ ch }: BishunSectionProps) {
  const writerId = 'bishun-writer';
  const [strokes, setStrokes] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStrokes(null);

    (async () => {
      const mod = (await import('hanzi-writer')) as unknown as { default?: HanziWriterApi } & HanziWriterApi;
      const writer = mod.default ?? mod;
      const data = await writer.loadCharacterData(ch);
      if (cancelled || !data || !data.strokes.length) return;

      setStrokes(data.strokes);
      const css = getComputedStyle(document.documentElement);
      const color = (name: string) => css.getPropertyValue(name).trim();

      writer.create(writerId, ch, {
        width: 200,
        height: 200,
        padding: 10,
        charDataLoader: (_c: string, onLoad: (d: unknown) => void) => onLoad(data),
        strokeColor: color('--color-ink'),
        outlineColor: color('--color-rule'),
        drawingColor: color('--color-accent'),
        highlightColor: color('--color-accent'),
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 300,
        showHintAfterMisses: 2,
      });
    })().catch(() => {
      // 离线或数据缺失：保持隐藏
    });

    return () => {
      cancelled = true;
    };
  }, [ch]);

  if (!strokes) return null;

  return (
    <section className="yuwen-section" aria-label="笔顺">
      <h2 className="section-head">
        笔顺 <span className="text-ink-3 text-sm">共 {strokes.length} 画</span>
      </h2>
      <div className="bishun">
        <div className="bishun__writer" id={writerId} />
        <div className="bishun__steps">
          {strokes.map((path, index) => (
            <span key={index} className="bishun__step" title={'第 ' + (index + 1) + ' 笔'}>
              <svg viewBox="0 0 1024 1024" aria-hidden="true">
                <g transform="scale(1, -1) translate(0, -900)">
                  <path d={path} />
                </g>
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
~~~

- [ ] **Step 5: 运行确认通过**

Run: `npx vitest run src/components/yuwen/BishunSection.test.tsx`
Expected: PASS（1 个测试）。

- [ ] **Step 6: 提交**

~~~bash
git add package.json src/components/yuwen/BishunSection.tsx src/components/yuwen/BishunSection.test.tsx
git commit -m "feat(yuwen): 笔顺组件（hanzi-writer）"
~~~

---

## Task 17: 页面骨架 + 首页 + 册页

**Files:**
- Create: `src/components/yuwen/YuwenPageShell.tsx`
- Create: `src/components/yuwen/YuwenIndexPage.tsx`
- Create: `src/components/yuwen/YuwenBookPage.tsx`
- Create: `src/components/yuwen/YuwenIndexPage.test.tsx`
- Create: `src/components/yuwen/YuwenBookPage.test.tsx`
- Modify: `src/styles/ui.css`（补 .lesson-list 等）

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/YuwenIndexPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenIndexPage } from './YuwenIndexPage';

describe('YuwenIndexPage', () => {
  it('渲染 10 册卡片与工具入口', () => {
    render(
      <MemoryRouter>
        <YuwenIndexPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '一年级上册' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '五年级下册' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '拼音表' }).getAttribute('href')).toBe('/yuwen/pinyin');
    expect(screen.getByRole('link', { name: '多音字' }).getAttribute('href')).toBe('/yuwen/duoyin');
    expect(screen.getByRole('link', { name: '一年级上册' }).getAttribute('href')).toBe('/yuwen/book/1a');
  });
});
~~~

~~~tsx
// src/components/yuwen/YuwenBookPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenBookPage } from './YuwenBookPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/book/:bookId" element={<YuwenBookPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenBookPage', () => {
  it('渲染单元、课文与两个入口', () => {
    renderAt('/yuwen/book/1a');
    expect(screen.getByRole('heading', { name: '一年级上册' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '第 1 单元' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /识字1：天地人/ }).getAttribute('href')).toBe(
      '/yuwen/lesson/G1A01',
    );
    expect(screen.getByRole('link', { name: '生字复习' }).getAttribute('href')).toBe('/yuwen/review/1a/1');
    expect(screen.getByRole('link', { name: '听写单' }).getAttribute('href')).toBe('/yuwen/tingxie/1a/1');
  });

  it('未知册显示空状态', () => {
    renderAt('/yuwen/book/9z');
    expect(screen.getByText('没有这册课本。')).toBeTruthy();
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/YuwenIndexPage.test.tsx src/components/yuwen/YuwenBookPage.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现页面骨架与两个页面**

~~~tsx
// src/components/yuwen/YuwenPageShell.tsx
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { pathForView } from '../../view-routes';

interface YuwenPageShellProps {
  children: ReactNode;
}

/** /yuwen 各页共用的页面骨架；导航高亮由 NavMenu 按路径判断，这里 activeView 传 null。 */
export function YuwenPageShell({ children }: YuwenPageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Header activeView={null} onViewChange={(view) => navigate(pathForView(view))} />
      <main id="main" className="container-page pt-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
~~~

~~~tsx
// src/components/yuwen/YuwenIndexPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_BOOKS } from '../../data/yuwen';
import { bookPath, duoyinPath, pinyinPath, reviewPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenIndexPage() {
  return (
    <YuwenPageShell>
      <div className="page-head">
        <p className="breadcrumb">
          <Link to="/">首页</Link> › 小学语文
        </p>
        <h1 className="page-title">人教版小学语文 · 生字</h1>
        <p className="page-lead">按课文学生字：读音、同音字、形近字和组词，只用学过的字。</p>
      </div>

      <div className="yuwen-units yuwen-tools">
        <Link className="btn btn-secondary" to={pinyinPath()}>
          拼音表
        </Link>
        <Link className="btn btn-secondary" to={duoyinPath()}>
          多音字
        </Link>
      </div>

      <div className="yuwen-book-grid">
        {YUWEN_BOOKS.map((book) => (
          <section key={book.id} className="yuwen-book-card">
            <h2 className="section-head">
              <Link to={bookPath(book.id)}>{book.title}</Link>
            </h2>
            <p className="text-ink-3 text-sm">
              {book.lessonCount} 课 · {book.charCount} 个生字
            </p>
            <p className="yuwen-label">单元生字复习</p>
            <div className="yuwen-units">
              {book.units.map((unit) => (
                <Link key={unit.no} className="btn btn-secondary" to={reviewPath(book.id, unit.no)}>
                  {unit.no}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="yuwen-source">
        生字与课文数据来源：<a href="http://yuwen.muduo.org/">yuwen.muduo.org</a>（人教版小学语文）
      </p>
    </YuwenPageShell>
  );
}
~~~

~~~tsx
// src/components/yuwen/YuwenBookPage.tsx
import { Link, useParams } from 'react-router-dom';
import { bookById, lessonById } from '../../data/yuwen';
import type { YuwenLesson } from '../../data/yuwen';
import { lessonPath, reviewPath, tingxiePath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

function lessonsOf(ids: string[]): YuwenLesson[] {
  const out: YuwenLesson[] = [];
  for (const id of ids) {
    const lesson = lessonById(id);
    if (lesson) out.push(lesson);
  }
  return out;
}

export function YuwenBookPage() {
  const { bookId } = useParams();
  const book = bookId ? bookById(bookId) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › {book ? book.title : '未找到'}
      </p>

      {!book ? (
        <div className="empty-state">
          <p>没有这册课本。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{book.title}</h1>
            <p className="page-lead">
              {book.lessonCount} 课 · {book.charCount} 个生字
            </p>
          </div>

          {book.units.map((unit) => {
            const lessons = lessonsOf(unit.lessonIds);
            return (
              <section key={unit.no} className="section">
                <div className="section-head">
                  <h2>第 {unit.no} 单元</h2>
                  <div className="yuwen-units">
                    <Link className="btn btn-secondary" to={reviewPath(book.id, unit.no)}>
                      生字复习
                    </Link>
                    <Link className="btn btn-secondary" to={tingxiePath(book.id, unit.no)}>
                      听写单
                    </Link>
                  </div>
                </div>
                <ul className="lesson-list">
                  {lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link to={lessonPath(lesson.id)}>
                        <span className="lesson-list__title">{lesson.title}</span>
                        <span className="lesson-list__preview">{lesson.preview}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}
    </YuwenPageShell>
  );
}
~~~

- [ ] **Step 4: 补 .lesson-list 样式**

在 `src/styles/ui.css` 上一个 components 层内追加：

~~~css
  .lesson-list {
    display: grid;
    gap: var(--space-2xs);
    margin: var(--space-sm) 0 0;
    padding: 0;
    list-style: none;
  }
  .lesson-list a {
    display: flex;
    gap: var(--space-sm);
    align-items: baseline;
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-md);
    color: var(--color-ink);
    text-decoration: none;
  }
  .lesson-list a:hover {
    background: var(--color-accent-soft);
  }
  .lesson-list__title {
    font-weight: 600;
  }
  .lesson-list__preview {
    margin-left: auto;
    color: var(--color-ink-3);
    font-family: var(--font-serif);
  }
  .yuwen-tools {
    margin-bottom: var(--space-lg);
  }
~~~

- [ ] **Step 5: 运行确认通过**

Run: `npx vitest run src/components/yuwen`
Expected: PASS（全部 yuwen 组件测试）。

- [ ] **Step 6: 提交**

~~~bash
git add src/components/yuwen src/styles/ui.css
git commit -m "feat(yuwen): 页面骨架、首页与册页"
~~~

---

## Task 18: 课页与单元复习页

**Files:**
- Create: `src/components/yuwen/YuwenLessonPage.tsx`
- Create: `src/components/yuwen/YuwenReviewPage.tsx`
- Create: `src/components/yuwen/YuwenLessonPage.test.tsx`
- Create: `src/components/yuwen/YuwenReviewPage.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/YuwenLessonPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenLessonPage } from './YuwenLessonPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/lesson/:lessonId" element={<YuwenLessonPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenLessonPage', () => {
  it('渲染本课生字、听写单入口与上一课/下一课', () => {
    renderAt('/yuwen/lesson/G1A01');

    expect(screen.getByRole('heading', { name: '识字1：天地人' })).toBeTruthy();
    expect(screen.getByText('tiān')).toBeTruthy();
    expect(screen.getByText('天')).toBeTruthy();
    expect(screen.getByRole('link', { name: '听写单' }).getAttribute('href')).toBe(
      '/yuwen/tingxie/1a/1',
    );
    expect(screen.getByRole('link', { name: /下一课/ }).getAttribute('href')).toBe(
      '/yuwen/lesson/G1A02',
    );
  });

  it('未知课显示空状态', () => {
    renderAt('/yuwen/lesson/NOPE');
    expect(screen.getByText('没有这一课。')).toBeTruthy();
  });
});
~~~

~~~tsx
// src/components/yuwen/YuwenReviewPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenReviewPage } from './YuwenReviewPage';

describe('YuwenReviewPage', () => {
  it('按课分组渲染生字，并给出听写单入口', () => {
    render(
      <MemoryRouter initialEntries={['/yuwen/review/1a/1']}>
        <Routes>
          <Route path="/yuwen/review/:bookId/:unitNo" element={<YuwenReviewPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '生字复习' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '打印听写单' }).getAttribute('href')).toBe(
      '/yuwen/tingxie/1a/1',
    );
    expect(screen.getAllByRole('link', { name: '识字1：天地人' }).length).toBeGreaterThan(0);
  });

  it('未知单元显示空状态', () => {
    render(
      <MemoryRouter initialEntries={['/yuwen/review/1a/99']}>
        <Routes>
          <Route path="/yuwen/review/:bookId/:unitNo" element={<YuwenReviewPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('没有这个单元。')).toBeTruthy();
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/YuwenLessonPage.test.tsx src/components/yuwen/YuwenReviewPage.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现两个页面**

~~~tsx
// src/components/yuwen/YuwenLessonPage.tsx
import { Link, useParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, lessonById } from '../../data/yuwen';
import { lessonPath, reviewPath, tingxiePath } from '../../yuwen/paths';
import { PinyinToggle } from './PinyinToggle';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';
import { ZiGrid } from './ZiGrid';

export function YuwenLessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? lessonById(lessonId) : undefined;
  const book = lesson ? bookById(lesson.bookId) : undefined;

  const siblings = lesson ? YUWEN_LESSONS.filter((l) => l.bookId === lesson.bookId) : [];
  const index = lesson ? siblings.findIndex((l) => l.id === lesson.id) : -1;
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} ›{' '}
        {lesson ? lesson.title : '未找到'}
      </p>

      {!lesson || !book ? (
        <div className="empty-state">
          <p>没有这一课。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{lesson.title}</h1>
            <p className="page-lead">
              {book.title} · 第 {lesson.unitNo} 单元 · 本课 {lesson.chars.length} 个生字
            </p>
          </div>

          <div className="yuwen-units yuwen-tools">
            <Link className="btn btn-secondary" to={tingxiePath(book.id, lesson.unitNo)}>
              听写单
            </Link>
            <Link className="btn btn-secondary" to={reviewPath(book.id, lesson.unitNo)}>
              本单元生字复习
            </Link>
            <PinyinToggle />
          </div>

          <section className="yuwen-section">
            <h2 className="section-head">本课生字</h2>
            <ZiGrid
              size="lg"
              items={lesson.chars.map((ch) => ({
                ch,
                py: charByChar(ch)?.readings[0]?.py,
              }))}
            />
          </section>

          <section className="yuwen-section">
            <h2 className="section-head">组词</h2>
            {lesson.chars.map((ch) => (
              <div key={ch} className="word-row">
                <Link className="chip" to={charPathSafe(ch)}>
                  {ch}
                </Link>
                <WordList words={charByChar(ch)?.words ?? []} />
              </div>
            ))}
          </section>

          <nav className="pager" aria-label="课文翻页">
            {prev ? (
              <Link to={lessonPath(prev.id)}>‹ 上一课：{prev.title}</Link>
            ) : (
              <span />
            )}
            {next ? <Link to={lessonPath(next.id)}>下一课：{next.title} ›</Link> : <span />}
          </nav>
        </>
      )}
    </YuwenPageShell>
  );
}

/** 组词行里的字链接（复用 charPath，单独包一层是为了避免在 JSX 里重复 import）。 */
function charPathSafe(ch: string): string {
  return '/yuwen/char/' + encodeURIComponent(ch);
}
~~~

~~~tsx
// src/components/yuwen/YuwenReviewPage.tsx
import { Link, useParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, unitOf } from '../../data/yuwen';
import { lessonPath, tingxiePath } from '../../yuwen/paths';
import { PinyinToggle } from './PinyinToggle';
import { YuwenPageShell } from './YuwenPageShell';
import { ZiGrid } from './ZiGrid';

export function YuwenReviewPage() {
  const { bookId, unitNo } = useParams();
  const book = bookId ? bookById(bookId) : undefined;
  const no = Number(unitNo);
  const unit = book ? unitOf(book.id, no) : undefined;
  const lessons = unit
    ? YUWEN_LESSONS.filter((l) => l.bookId === book!.id && l.unitNo === no)
    : [];

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} › 第 {unitNo} 单元
      </p>

      {!book || !unit ? (
        <div className="empty-state">
          <p>没有这个单元。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">生字复习</h1>
            <p className="page-lead">{book.title} · 第 {no} 单元（共 {unit.chars.length} 个生字）</p>
          </div>

          <div className="yuwen-units yuwen-tools">
            <Link className="btn btn-primary" to={tingxiePath(book.id, no)}>
              打印听写单
            </Link>
            <PinyinToggle />
          </div>

          {lessons.map((lesson) => (
            <section key={lesson.id} className="yuwen-section">
              <h2 className="section-head">
                <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
              </h2>
              <ZiGrid
                size="lg"
                items={lesson.chars.map((ch) => ({
                  ch,
                  py: charByChar(ch)?.readings[0]?.py,
                }))}
              />
            </section>
          ))}
        </>
      )}
    </YuwenPageShell>
  );
}
~~~

- [ ] **Step 4: 补 .word-row / .pager 样式**

在 `src/styles/ui.css` 的 components 层追加：

~~~css
  .word-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--color-divider);
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    margin-top: var(--space-xl);
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-divider);
  }
~~~

- [ ] **Step 5: 运行确认通过**

Run: `npx vitest run src/components/yuwen`
Expected: PASS。

- [ ] **Step 6: 提交**

~~~bash
git add src/components/yuwen src/styles/ui.css
git commit -m "feat(yuwen): 课页与单元生字复习页"
~~~

---

## Task 19: 听写单（可打印）

**Files:**
- Create: `src/components/yuwen/YuwenTingxiePage.tsx`
- Create: `src/components/yuwen/YuwenTingxiePage.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/YuwenTingxiePage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenTingxiePage } from './YuwenTingxiePage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/tingxie/:bookId/:unitNo" element={<YuwenTingxiePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenTingxiePage', () => {
  it('默认渲染听写单、答案页与三个选项', () => {
    renderAt('/yuwen/tingxie/1a/1');

    expect(screen.getByRole('heading', { name: '听写单' })).toBeTruthy();
    expect(screen.getByText(/姓名/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: '答案' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '打印' })).toBeTruthy();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(10);
  });

  it('answers=0 时不渲染答案页', () => {
    renderAt('/yuwen/tingxie/1a/1?answers=0');
    expect(screen.queryByRole('heading', { name: '答案' })).toBeNull();
  });

  it('hint=1 时每题带词语提示', () => {
    renderAt('/yuwen/tingxie/1a/1?hint=1');
    expect(screen.getAllByTitle(/^提示：/).length).toBeGreaterThan(0);
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/YuwenTingxiePage.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现听写单**

~~~tsx
// src/components/yuwen/YuwenTingxiePage.tsx
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, unitOf } from '../../data/yuwen';
import { reviewPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

interface TingxieChar {
  ch: string;
  py: string;
  word?: string;
}

/** 固定种子的洗牌：预渲染与客户端必须得到同一顺序，不能用 Math.random。 */
export function deterministicShuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = (i * 7 + 3) % (i + 1);
    const tmp = out[i];
    out[i] = out[j] as T;
    out[j] = tmp as T;
  }
  return out;
}

export function YuwenTingxiePage() {
  const { bookId, unitNo } = useParams();
  const [params, setParams] = useSearchParams();
  const book = bookId ? bookById(bookId) : undefined;
  const no = Number(unitNo);
  const unit = book ? unitOf(book.id, no) : undefined;

  const shuffle = params.get('shuffle') === '1';
  const hint = params.get('hint') === '1';
  const withAnswers = params.get('answers') !== '0';

  const lessons = unit && book
    ? YUWEN_LESSONS.filter((l) => l.bookId === book.id && l.unitNo === no)
    : [];

  const items: TingxieChar[] = [];
  const seen = new Set<string>();
  for (const lesson of lessons) {
    for (const ch of lesson.chars) {
      if (seen.has(ch)) continue;
      seen.add(ch);
      const info = charByChar(ch);
      const word = info?.words[0];
      items.push(word ? { ch, py: info!.readings[0]?.py ?? '', word } : { ch, py: info?.readings[0]?.py ?? '' });
    }
  }
  const ordered = shuffle ? deterministicShuffle(items) : items;

  const setFlag = (key: string, value: boolean) => {
    const next = new URLSearchParams(params);
    if (key === 'answers') {
      if (value) next.delete('answers');
      else next.set('answers', '0');
    } else {
      if (value) next.set(key, '1');
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} ›{' '}
        {book && unit ? <Link to={reviewPath(book.id, no)}>第 {no} 单元复习</Link> : null} › 听写单
      </p>

      {!book || !unit ? (
        <div className="empty-state">
          <p>没有这个单元。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="tx-controls">
            <label>
              顺序{' '}
              <select
                value={shuffle ? '1' : '0'}
                onChange={(event) => setFlag('shuffle', event.target.value === '1')}
              >
                <option value="0">课本顺序</option>
                <option value="1">打乱</option>
              </select>
            </label>
            <label>
              提示{' '}
              <select value={hint ? '1' : '0'} onChange={(event) => setFlag('hint', event.target.value === '1')}>
                <option value="0">只给拼音</option>
                <option value="1">拼音和词语</option>
              </select>
            </label>
            <label>
              答案{' '}
              <select
                value={withAnswers ? '1' : '0'}
                onChange={(event) => setFlag('answers', event.target.value === '1')}
              >
                <option value="1">另页附答案</option>
                <option value="0">不附答案</option>
              </select>
            </label>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              打印
            </button>
          </div>

          <div className="tx-sheet">
            <h1 className="page-title">听写单</h1>
            <p className="text-ink-3 text-sm">
              {book.title} · 第 {no} 单元 · 共 {ordered.length} 个字
            </p>
            <p className="tx-py">姓名＿＿＿＿　日期＿＿＿＿　得分＿＿＿＿</p>
            <ol className="tx-grid">
              {ordered.map((item, index) => (
                <li key={item.ch} className="tx-item">
                  <span className="tx-py">
                    {index + 1}. {item.py}
                  </span>
                  {hint && item.word ? <span className="tx-py" title={'提示：' + item.word}>{item.word}</span> : null}
                  <span className="tx-box" />
                </li>
              ))}
            </ol>
          </div>

          {withAnswers ? (
            <section className="tx-answers yuwen-section">
              <h2 className="section-head">答案</h2>
              <ol className="tx-key">
                {ordered.map((item, index) => (
                  <li key={item.ch}>
                    {index + 1}. <strong>{item.ch}</strong> <span className="text-ink-3">{item.py}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </>
      )}
    </YuwenPageShell>
  );
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/components/yuwen/YuwenTingxiePage.test.tsx`
Expected: PASS（3 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/components/yuwen
git commit -m "feat(yuwen): 可打印听写单"
~~~

---

## Task 20: 单字详情页

**Files:**
- Create: `src/components/yuwen/YuwenCharPage.tsx`
- Create: `src/components/yuwen/YuwenCharPage.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/YuwenCharPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));
vi.mock('./BishunSection', () => ({ BishunSection: () => <div data-testid="bishun" /> }));

import { YuwenCharPage } from './YuwenCharPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/yuwen/char/:ch" element={<YuwenCharPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('YuwenCharPage', () => {
  it('渲染读音、同音字、字形与组词', () => {
    renderAt('/yuwen/char/地');

    expect(screen.getByTestId('bishun')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '读音' })).toBeTruthy();
    expect(screen.getByText('dì')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '字形' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '第' }).getAttribute('href')).toBe('/yuwen/char/%E7%AC%AC');
    expect(screen.getByRole('heading', { name: '组词' })).toBeTruthy();
  });

  it('未知字显示空状态', () => {
    renderAt('/yuwen/char/' + encodeURIComponent('齉'));
    expect(screen.getByText('没有这个字。')).toBeTruthy();
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/YuwenCharPage.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现单字页**

~~~tsx
// src/components/yuwen/YuwenCharPage.tsx
import { Link, useParams } from 'react-router-dom';
import type { YuwenRadical } from '../../data/yuwen';
import { YUWEN_RADICALS, charByChar, homophonesOf, lessonById } from '../../data/yuwen';
import { lessonPath } from '../../yuwen/paths';
import { BishunSection } from './BishunSection';
import { CharChips } from './CharChips';
import { SpeakButton } from './SpeakButton';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';

function radicalOf(name: string): YuwenRadical | undefined {
  return YUWEN_RADICALS.find((radical) => radical.name === name);
}

export function YuwenCharPage() {
  const { ch } = useParams();
  const item = ch ? charByChar(ch) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › {item ? item.ch : '未找到'}
      </p>

      {!item ? (
        <div className="empty-state">
          <p>没有这个字。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="yuwen-hero">
            <span className="yuwen-hero__ch">{item.ch}</span>
            <div>
              <p className="yuwen-hero__py">
                {item.readings.map((reading) => reading.py).join(' · ')}
              </p>
              {item.readings.length > 1 ? <p className="text-ink-3 text-sm">多音字</p> : null}
            </div>
          </div>

          <BishunSection ch={item.ch} />

          <section className="yuwen-section">
            <h2 className="section-head">读音</h2>
            {item.readings.map((reading) => {
              const lesson = reading.lessonId ? lessonById(reading.lessonId) : undefined;
              return (
                <div key={reading.py} className="yuwen-reading">
                  <p>
                    <Link className="chip" to={'/yuwen/pinyin/' + reading.stem}>
                      {reading.py}
                    </Link>
                    <SpeakButton text={reading.words[0] ?? item.ch} />
                    {lesson ? (
                      <span className="text-ink-3 text-sm">
                        {' '}
                        学于 <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
                      </span>
                    ) : null}
                  </p>
                  <WordList words={reading.words} emptyLabel="这一读音暂无词" />
                  {homophonesOf(item.ch, reading.py).length ? (
                    <>
                      <p className="yuwen-label">同音字</p>
                      <CharChips chars={homophonesOf(item.ch, reading.py)} current={item.ch} />
                    </>
                  ) : null}
                </div>
              );
            })}
          </section>

          {item.radicals.length ? (
            <section className="yuwen-section">
              <h2 className="section-head">字形</h2>
              {item.radicals.map((name) => {
                const radical = radicalOf(name);
                if (!radical) return null;
                return (
                  <div key={name} className="yuwen-reading">
                    <p className="yuwen-label">
                      含 <Link to={'/yuwen/char/' + encodeURIComponent(name)}>{name}</Link>
                      {radical.label ? '（' + radical.label + '）' : ''} 的字
                    </p>
                    <CharChips chars={radical.chars} current={item.ch} />
                  </div>
                );
              })}
            </section>
          ) : null}

          <section className="yuwen-section">
            <h2 className="section-head">组词</h2>
            <WordList words={item.words} />
          </section>
        </>
      )}
    </YuwenPageShell>
  );
}
~~~

- [ ] **Step 4: 补 .yuwen-hero / .yuwen-reading 样式**

在 `src/styles/ui.css` 的 components 层追加：

~~~css
  .yuwen-hero {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin-top: var(--space-md);
  }
  .yuwen-hero__ch {
    font-family: var(--font-serif);
    font-size: 5rem;
    line-height: 1;
    color: var(--color-ink);
  }
  .yuwen-hero__py {
    font-size: var(--text-xl, 1.25rem);
    color: var(--color-ink-2);
  }
  .yuwen-reading {
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--color-divider);
  }
~~~

- [ ] **Step 5: 运行确认通过**

Run: `npx vitest run src/components/yuwen/YuwenCharPage.test.tsx`
Expected: PASS（2 个测试）。

- [ ] **Step 6: 提交**

~~~bash
git add src/components/yuwen src/styles/ui.css
git commit -m "feat(yuwen): 单字详情页"
~~~

---

## Task 21: 拼音表、韵母页与多音字页

**Files:**
- Create: `src/components/yuwen/YuwenPinyinIndexPage.tsx`
- Create: `src/components/yuwen/YuwenPinyinStemPage.tsx`
- Create: `src/components/yuwen/YuwenDuoyinPage.tsx`
- Create: `src/components/yuwen/YuwenPinyin.page.test.tsx`
- Create: `src/components/yuwen/YuwenDuoyinPage.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/components/yuwen/YuwenPinyin.page.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenPinyinIndexPage } from './YuwenPinyinIndexPage';
import { YuwenPinyinStemPage } from './YuwenPinyinStemPage';

describe('拼音表', () => {
  it('索引页列出全部韵母入口', () => {
    render(
      <MemoryRouter>
        <YuwenPinyinIndexPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '拼音表' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'a' }).getAttribute('href')).toBe('/yuwen/pinyin/a');
    expect(screen.getAllByRole('link').length).toBeGreaterThan(300);
  });

  it('韵母页按声调分行并链到单字', () => {
    render(
      <MemoryRouter initialEntries={['/yuwen/pinyin/a']}>
        <Routes>
          <Route path="/yuwen/pinyin/:stem" element={<YuwenPinyinStemPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'a' })).toBeTruthy();
    expect(screen.getByText('ā')).toBeTruthy();
    expect(screen.getByRole('link', { name: '阿' }).getAttribute('href')).toBe('/yuwen/char/%E9%98%BF');
  });
});
~~~

~~~tsx
// src/components/yuwen/YuwenDuoyinPage.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../Header', () => ({ Header: () => <div /> }));
vi.mock('../Footer', () => ({ Footer: () => <div /> }));

import { YuwenDuoyinPage } from './YuwenDuoyinPage';

describe('YuwenDuoyinPage', () => {
  it('列出多音字与各读音的词', () => {
    render(
      <MemoryRouter>
        <YuwenDuoyinPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '多音字' })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(100);
    expect(screen.getAllByText('地方').length).toBeGreaterThan(0);
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/yuwen/YuwenPinyin.page.test.tsx`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现三个页面**

~~~tsx
// src/components/yuwen/YuwenPinyinIndexPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_STEMS } from '../../data/yuwen';
import { pinyinPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenPinyinIndexPage() {
  const charCount = YUWEN_STEMS.reduce(
    (sum, stem) => sum + stem.rows.reduce((s, row) => s + row.chars.length, 0),
    0,
  );

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › 拼音表
      </p>
      <div className="page-head">
        <h1 className="page-title">拼音表</h1>
        <p className="page-lead">
          按韵母与声调排列的全部生字，共 {YUWEN_STEMS.length} 个韵母条目、{charCount} 个字次。
        </p>
      </div>
      <div className="yuwen-units">
        {YUWEN_STEMS.map((stem) => (
          <Link key={stem.stem} className="chip" to={pinyinPath(stem.stem)}>
            {stem.stem}
          </Link>
        ))}
      </div>
    </YuwenPageShell>
  );
}
~~~

~~~tsx
// src/components/yuwen/YuwenPinyinStemPage.tsx
import { Link, useParams } from 'react-router-dom';
import { stemByStem } from '../../data/yuwen';
import { charPath, pinyinPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenPinyinStemPage() {
  const { stem: stemParam } = useParams();
  const stem = stemParam ? stemByStem(stemParam) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        <Link to={pinyinPath()}>拼音表</Link> › {stemParam}
      </p>

      {!stem ? (
        <div className="empty-state">
          <p>没有这个韵母。</p>
          <Link className="btn btn-primary" to={pinyinPath()}>
            回到拼音表
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{stem.stem}</h1>
          </div>
          {stem.rows.map((row) => (
            <section key={row.py} className="yuwen-section">
              <h2 className="section-head">{row.py}</h2>
              <div className="yuwen-units">
                {row.chars.map((ch) => (
                  <Link key={ch} className="chip" to={charPath(ch)}>
                    {ch}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </YuwenPageShell>
  );
}
~~~

~~~tsx
// src/components/yuwen/YuwenDuoyinPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_DUOYIN, lessonById } from '../../data/yuwen';
import { charPath, lessonPath } from '../../yuwen/paths';
import { SpeakButton } from './SpeakButton';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenDuoyinPage() {
  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › 多音字
      </p>
      <div className="page-head">
        <h1 className="page-title">多音字</h1>
        <p className="page-lead">共 {YUWEN_DUOYIN.length} 个多音字。每个读音后面是这个读音的词。</p>
      </div>

      {YUWEN_DUOYIN.map((entry) => (
        <section key={entry.ch} className="yuwen-section">
          <h2 className="section-head">
            <Link className="chip" to={charPath(entry.ch)}>
              {entry.ch}
            </Link>
          </h2>
          {entry.readings.map((reading) => {
            const lesson = reading.lessonId ? lessonById(reading.lessonId) : undefined;
            return (
              <div key={reading.py} className="yuwen-reading">
                <p>
                  <span className="chip">{reading.py}</span>
                  <SpeakButton text={reading.words[0] ?? entry.ch} />
                  {lesson ? (
                    <span className="text-ink-3 text-sm">
                      {' '}
                      学于 <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
                    </span>
                  ) : null}
                </p>
                <WordList words={reading.words} emptyLabel="这一读音暂无词" />
              </div>
            );
          })}
        </section>
      ))}
    </YuwenPageShell>
  );
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/components/yuwen`
Expected: PASS（全部 yuwen 组件测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/components/yuwen
git commit -m "feat(yuwen): 拼音表、韵母页与多音字页"
~~~

---

## Task 22: 路由接线

**Files:**
- Modify: `src/routing/route-modules.ts`
- Modify: `src/App.tsx`
- Create: `src/App.yuwen.test.tsx`

- [ ] **Step 1: 写失败测试**

~~~tsx
// src/App.yuwen.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./components/Header', () => ({ Header: () => <div /> }));
vi.mock('./components/Footer', () => ({ Footer: () => <div /> }));
vi.mock('hanzi-writer', () => ({
  default: { loadCharacterData: async () => ({ strokes: [] }), create: () => ({}) },
}));

import App from './App';

const YUWEN_ROUTES = [
  '/yuwen',
  '/yuwen/book/1a',
  '/yuwen/lesson/G1A01',
  '/yuwen/review/1a/1',
  '/yuwen/tingxie/1a/1',
  '/yuwen/char/' + encodeURIComponent('地'),
  '/yuwen/pinyin',
  '/yuwen/pinyin/a',
  '/yuwen/duoyin',
];

describe('App yuwen 路由', () => {
  it('9 类路径都能渲染出 main 区域', async () => {
    for (const path of YUWEN_ROUTES) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );
      expect(await screen.findByRole('main')).toBeTruthy();
      unmount();
    }
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/App.yuwen.test.tsx`
Expected: FAIL，/yuwen 走到 404 或空白（React Router 无匹配路由时渲染为空）。

- [ ] **Step 3: 扩展 route-modules.ts**

~~~ts
// src/routing/route-modules.ts
import type React from 'react';
import { lazyWithPreload } from './lazy-with-preload';

export type RouteKey =
  | 'home'
  | 'knowledgeDetail'
  | 'poemDetail'
  | 'referenceIndex'
  | 'referenceCategory'
  | 'referencePage'
  | 'yuwenIndex'
  | 'yuwenBook'
  | 'yuwenLesson'
  | 'yuwenReview'
  | 'yuwenTingxie'
  | 'yuwenChar'
  | 'yuwenPinyinIndex'
  | 'yuwenPinyinStem'
  | 'yuwenDuoyin';

export const ROUTE_COMPONENTS = {
  home: lazyWithPreload<object>(() => import('../components/Home').then((m) => ({ default: m.Home as unknown as React.ComponentType<object> }))),
  knowledgeDetail: lazyWithPreload<object>(() => import('../components/KnowledgeDetail').then((m) => ({ default: m.KnowledgeDetail as unknown as React.ComponentType<object> }))),
  poemDetail: lazyWithPreload<object>(() => import('../components/poetry/PoemDetail').then((m) => ({ default: m.PoemDetail as unknown as React.ComponentType<object> }))),
  referenceIndex: lazyWithPreload<object>(() => import('../components/reference/ReferenceIndex').then((m) => ({ default: m.ReferenceIndex as unknown as React.ComponentType<object> }))),
  referenceCategory: lazyWithPreload<object>(() => import('../components/reference/ReferenceCategory').then((m) => ({ default: m.ReferenceCategory as unknown as React.ComponentType<object> }))),
  referencePage: lazyWithPreload<object>(() => import('../components/reference/ReferencePage').then((m) => ({ default: m.ReferencePage as unknown as React.ComponentType<object> }))),
  yuwenIndex: lazyWithPreload<object>(() => import('../components/yuwen/YuwenIndexPage').then((m) => ({ default: m.YuwenIndexPage as unknown as React.ComponentType<object> }))),
  yuwenBook: lazyWithPreload<object>(() => import('../components/yuwen/YuwenBookPage').then((m) => ({ default: m.YuwenBookPage as unknown as React.ComponentType<object> }))),
  yuwenLesson: lazyWithPreload<object>(() => import('../components/yuwen/YuwenLessonPage').then((m) => ({ default: m.YuwenLessonPage as unknown as React.ComponentType<object> }))),
  yuwenReview: lazyWithPreload<object>(() => import('../components/yuwen/YuwenReviewPage').then((m) => ({ default: m.YuwenReviewPage as unknown as React.ComponentType<object> }))),
  yuwenTingxie: lazyWithPreload<object>(() => import('../components/yuwen/YuwenTingxiePage').then((m) => ({ default: m.YuwenTingxiePage as unknown as React.ComponentType<object> }))),
  yuwenChar: lazyWithPreload<object>(() => import('../components/yuwen/YuwenCharPage').then((m) => ({ default: m.YuwenCharPage as unknown as React.ComponentType<object> }))),
  yuwenPinyinIndex: lazyWithPreload<object>(() => import('../components/yuwen/YuwenPinyinIndexPage').then((m) => ({ default: m.YuwenPinyinIndexPage as unknown as React.ComponentType<object> }))),
  yuwenPinyinStem: lazyWithPreload<object>(() => import('../components/yuwen/YuwenPinyinStemPage').then((m) => ({ default: m.YuwenPinyinStemPage as unknown as React.ComponentType<object> }))),
  yuwenDuoyin: lazyWithPreload<object>(() => import('../components/yuwen/YuwenDuoyinPage').then((m) => ({ default: m.YuwenDuoyinPage as unknown as React.ComponentType<object> }))),
} satisfies Record<RouteKey, unknown>;
~~~

- [ ] **Step 4: 在 App.tsx 注册 9 条路由**

在 `ROUTE_COMPONENTS` 解构里补 9 项，并在 `<Route path="/poetry/:id" ... />` 之后插入：

~~~tsx
        <Route path="/yuwen" element={<YuwenIndex />} />
        <Route path="/yuwen/book/:bookId" element={<YuwenBook />} />
        <Route path="/yuwen/lesson/:lessonId" element={<YuwenLesson />} />
        <Route path="/yuwen/review/:bookId/:unitNo" element={<YuwenReview />} />
        <Route path="/yuwen/tingxie/:bookId/:unitNo" element={<YuwenTingxie />} />
        <Route path="/yuwen/char/:ch" element={<YuwenChar />} />
        <Route path="/yuwen/pinyin" element={<YuwenPinyinIndex />} />
        <Route path="/yuwen/pinyin/:stem" element={<YuwenPinyinStem />} />
        <Route path="/yuwen/duoyin" element={<YuwenDuoyin />} />
~~~

解构部分：

~~~tsx
const {
  home: Home,
  knowledgeDetail: KnowledgeDetail,
  poemDetail: PoemDetail,
  referenceIndex: ReferenceIndex,
  referenceCategory: ReferenceCategory,
  referencePage: ReferencePage,
  yuwenIndex: YuwenIndex,
  yuwenBook: YuwenBook,
  yuwenLesson: YuwenLesson,
  yuwenReview: YuwenReview,
  yuwenTingxie: YuwenTingxie,
  yuwenChar: YuwenChar,
  yuwenPinyinIndex: YuwenPinyinIndex,
  yuwenPinyinStem: YuwenPinyinStem,
  yuwenDuoyin: YuwenDuoyin,
} = ROUTE_COMPONENTS;
~~~

- [ ] **Step 5: 运行测试与类型检查**

Run: `npx vitest run src/App.yuwen.test.tsx`
Expected: PASS（1 个测试，9 条路由都渲染出 main）。

Run: `npx tsc -b --pretty false`
Expected: 退出码 0。

- [ ] **Step 6: 提交**

~~~bash
git add src/App.tsx src/routing/route-modules.ts src/App.yuwen.test.tsx
git commit -m "feat(yuwen): 注册 /yuwen 的 9 条路由"
~~~

---

## Task 23: SEO 标题/描述/面包屑

**Files:**
- Modify: `src/seo/content-zh.ts`
- Create: `src/seo/content-zh.test.ts`

- [ ] **Step 1: 写失败测试**

~~~ts
// src/seo/content-zh.test.ts
import { describe, expect, it } from 'vitest';
import { ZH } from '../i18n/languages';
import { resolvePageContent } from './content';

function contentFor(path: string) {
  return resolvePageContent(path);
}

describe('小学语文 SEO 内容', () => {
  it('首页', () => {
    const content = contentFor('/yuwen/');
    expect(content.title).toContain('小学语文');
    expect(content.breadcrumbs.map((b) => b.name)).toEqual(['首页', '小学语文']);
  });

  it('册页', () => {
    const content = contentFor('/yuwen/book/1a/');
    expect(content.title).toContain('一年级上册');
    expect(content.title).toContain('41 课');
    expect(content.breadcrumbs.at(-1)?.path).toBe('/yuwen/book/1a');
  });

  it('课页', () => {
    const content = contentFor('/yuwen/lesson/G1A01/');
    expect(content.title).toContain('识字1：天地人');
    expect(content.breadcrumbs.map((b) => b.name)).toEqual([
      '首页',
      '小学语文',
      '一年级上册',
      '识字1：天地人',
    ]);
  });

  it('单字页（中文路径）', () => {
    const content = contentFor('/yuwen/char/天/');
    expect(content.title).toContain('天');
    expect(content.title).toContain('tiān');
    expect(content.breadcrumbs.at(-1)?.name).toBe('天');
  });

  it('韵母页与多音字页', () => {
    expect(contentFor('/yuwen/pinyin/a/').title).toContain('拼音表');
    expect(contentFor('/yuwen/duoyin/').title).toContain('多音字');
  });

  it('中文语言下 brand 取自站点配置', () => {
    expect(contentFor('/yuwen/').title).toContain('拾艺院');
    expect(ZH.code).toBe('zh-CN');
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/seo/content-zh.test.ts`
Expected: FAIL（/yuwen 落到兜底标题）。

- [ ] **Step 3: 实现 resolveYuwenContent 并接入分派**

在 `src/seo/content-zh.ts` 顶部补导入：

~~~ts
import { YUWEN_BOOKS, YUWEN_CHARS, YUWEN_DUOYIN, YUWEN_LESSONS, charByChar, stemByStem } from '../data/yuwen';
import type { BrandCopy } from './site';
~~~

在 `resolveChineseContent` 的兜底 return 之前插入：

~~~ts
  const yuwen = resolveYuwenContent(appPath, brand);
  if (yuwen) return yuwen;
~~~

在同一文件里加：

~~~ts
const YUWEN_BASE_CRUMB: Breadcrumb = { name: '小学语文', path: '/yuwen' };

function notFoundYuwen(title: string, description: string): PageContent {
  return {
    kind: 'view',
    title,
    description,
    breadcrumbs: [HOME_BREADCRUMB, YUWEN_BASE_CRUMB],
  };
}

/** /yuwen 及子路由的 head 文案，全部按数据派生；未知子路径返回 null 走兜底。 */
function resolveYuwenContent(appPath: string, brand: BrandCopy): PageContent | null {
  if (appPath !== '/yuwen' && !appPath.startsWith('/yuwen/')) return null;
  const crumbBase = [HOME_BREADCRUMB, YUWEN_BASE_CRUMB];

  if (/^\/yuwen\/?$/.test(appPath)) {
    const lessonCount = YUWEN_LESSONS.length;
    const charCount = YUWEN_CHARS.length;
    return {
      kind: 'view',
      title: '小学语文生字表（人教版 1–5 年级） - ' + brand.name,
      description:
        '人教版小学语文 1–5 年级共 ' + YUWEN_BOOKS.length + ' 册、' + lessonCount + ' 课、' +
        charCount + ' 个生字：按课文查读音、同音字、形近字与组词，可按单元复习并打印听写单。',
      breadcrumbs: crumbBase,
    };
  }

  const bookMatch = /^\/yuwen\/book\/([^/]+)\/?$/.exec(appPath);
  if (bookMatch) {
    const book = YUWEN_BOOKS.find((b) => b.id === bookMatch[1]);
    if (!book) return notFoundYuwen('小学语文 - ' + brand.name, '没有这册课本。');
    return {
      kind: 'view',
      title: book.title + '生字表（' + book.lessonCount + ' 课 · ' + book.charCount + ' 字） - ' + brand.name,
      description:
        book.title + '按单元列出全部课文与生字，可进入单课看读音与组词，或按单元做生字复习、打印听写单。',
      breadcrumbs: [...crumbBase, { name: book.title, path: '/yuwen/book/' + book.id }],
    };
  }

  const lessonMatch = /^\/yuwen\/lesson\/([^/]+)\/?$/.exec(appPath);
  if (lessonMatch) {
    const lesson = YUWEN_LESSONS.find((l) => l.id === lessonMatch[1]);
    if (!lesson) return notFoundYuwen('小学语文 - ' + brand.name, '没有这一课。');
    const book = YUWEN_BOOKS.find((b) => b.id === lesson.bookId);
    return {
      kind: 'view',
      title: lesson.title + ' · 生字与组词 - ' + brand.name,
      description:
        (book ? book.title + ' · ' : '') + lesson.title + ' 的 ' + lesson.chars.length +
        ' 个生字：读音、同音字、形近字与组词，可一键生成听写单。',
      breadcrumbs: [
        ...crumbBase,
        ...(book ? [{ name: book.title, path: '/yuwen/book/' + book.id }] : []),
        { name: lesson.title, path: '/yuwen/lesson/' + lesson.id },
      ],
    };
  }

  const reviewMatch = /^\/yuwen\/(review|tingxie)\/([1-5][ab])\/(\d+)\/?$/.exec(appPath);
  if (reviewMatch) {
    const book = YUWEN_BOOKS.find((b) => b.id === reviewMatch[2]);
    if (!book) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个单元。');
    const isTingxie = reviewMatch[1] === 'tingxie';
    return {
      kind: 'view',
      title:
        book.title + '第 ' + reviewMatch[3] + ' 单元' + (isTingxie ? '听写单' : '生字复习') +
        ' - ' + brand.name,
      description:
        book.title + '第 ' + reviewMatch[3] + ' 单元的' +
        (isTingxie ? '可打印听写单：按课本顺序或打乱，可选是否给词语提示、是否附答案。' : '生字复习：按课文分组列出本单元全部生字。'),
      breadcrumbs: [
        ...crumbBase,
        { name: book.title, path: '/yuwen/book/' + book.id },
        {
          name: '第 ' + reviewMatch[3] + ' 单元',
          path: '/yuwen/review/' + book.id + '/' + reviewMatch[3],
        },
      ],
    };
  }

  const charMatch = /^\/yuwen\/char\/([^/]+)\/?$/.exec(appPath);
  if (charMatch) {
    const ch = decodeURIComponent(charMatch[1]);
    const item = charByChar(ch);
    if (!item) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个字。');
    const readings = item.readings.map((r) => r.py).join('、');
    return {
      kind: 'view',
      title: ch + '（' + readings + '）的读音、笔顺、组词与字形 - ' + brand.name,
      description:
        '「' + ch + '」的读音（' + readings + '）、笔顺动画、同音字、含该字的字形与组词，以及它出现在哪一课。',
      breadcrumbs: [...crumbBase, { name: ch, path: '/yuwen/char/' + ch }],
    };
  }

  if (/^\/yuwen\/pinyin\/?$/.test(appPath)) {
    return {
      kind: 'view',
      title: '拼音表 · 按韵母与声调查生字 - ' + brand.name,
      description: '按韵母与声调排列全部生字，点击任一字进入读音、组词与笔顺详情。',
      breadcrumbs: [...crumbBase, { name: '拼音表', path: '/yuwen/pinyin' }],
    };
  }

  const stemMatch = /^\/yuwen\/pinyin\/([^/]+)\/?$/.exec(appPath);
  if (stemMatch) {
    const stem = stemByStem(stemMatch[1]);
    if (!stem) return notFoundYuwen('小学语文 - ' + brand.name, '没有这个韵母。');
    return {
      kind: 'view',
      title: '拼音 ' + stem.stem + ' 的生字 - ' + brand.name,
      description: '韵母 ' + stem.stem + ' 下按声调排列的全部生字，可进入单字看读音与组词。',
      breadcrumbs: [
        ...crumbBase,
        { name: '拼音表', path: '/yuwen/pinyin' },
        { name: stem.stem, path: '/yuwen/pinyin/' + stem.stem },
      ],
    };
  }

  if (/^\/yuwen\/duoyin\/?$/.test(appPath)) {
    return {
      kind: 'view',
      title: '多音字（' + YUWEN_DUOYIN.length + ' 个） - ' + brand.name,
      description: '小学阶段常见的 ' + YUWEN_DUOYIN.length + ' 个多音字：每个读音列出常用词与它出现的课文。',
      breadcrumbs: [...crumbBase, { name: '多音字', path: '/yuwen/duoyin' }],
    };
  }

  return null;
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/seo/content-zh.test.ts`
Expected: PASS（6 个测试）。

- [ ] **Step 5: 提交**

~~~bash
git add src/seo/content-zh.ts src/seo/content-zh.test.ts
git commit -m "feat(yuwen): 小学语文路由的 SEO 文案"
~~~

---

## Task 24: canonical 中文路径编码

**Files:**
- Modify: `src/seo/meta.ts`
- Modify: `src/seo/meta.test.ts`
- Modify: `src/seo/files.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
// src/seo/meta.test.ts 末尾追加
import { canonicalUrl, encodePath } from './meta';

describe('encodePath / canonicalUrl 的中文路径', () => {
  it('把中文路径编码成百分号形式', () => {
    expect(encodePath('/yuwen/char/天')).toBe('/yuwen/char/%E5%A4%A9');
  });

  it('幂等：已编码的路径不会被二次编码', () => {
    expect(encodePath('/yuwen/char/%E5%A4%A9')).toBe('/yuwen/char/%E5%A4%A9');
  });

  it('canonical 采用目录式并编码', () => {
    expect(canonicalUrl('/yuwen/char/天')).toMatch(/\/yuwen\/char\/%E5%A4%A9\/$/);
    expect(canonicalUrl('/yuwen/char/%E5%A4%A9')).toBe(canonicalUrl('/yuwen/char/天'));
    expect(canonicalUrl('/tutorial')).toMatch(/\/tutorial\/$/);
  });
});
~~~

~~~ts
// src/seo/files.test.ts 末尾追加
import { buildSitemap } from './files';
import { canonicalUrl } from './meta';

describe('sitemap 中文 URL', () => {
  it('loc 使用百分号编码，且与 canonical 一致', () => {
    const xml = buildSitemap(['/yuwen/char/天']);
    expect(xml).toContain('<loc>' + canonicalUrl('/yuwen/char/天') + '</loc>');
    expect(xml).toContain('%E5%A4%A9');
    expect(xml).not.toContain('<loc>' + canonicalUrl('/yuwen/char/天') + '/</loc>');
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/seo/meta.test.ts src/seo/files.test.ts`
Expected: FAIL，`encodePath is not a function`。

- [ ] **Step 3: 实现 encodePath 并接入 canonicalUrl**

~~~ts
/**
 * 百分号编码一个站内路径，幂等：已编码的输入不会二次编码。
 * 只用于 canonical / og:url / sitemap 这类对外 URL，不用于 <Link>。
 */
export function encodePath(path: string): string {
  let decoded = path;
  try {
    decoded = decodeURI(path);
  } catch {
    decoded = path;
  }
  return encodeURI(decoded);
}
~~~

把 canonicalUrl 改成：

~~~ts
export function canonicalUrl(path: string): string {
  const withoutQuery = path.split('#')[0].split('?')[0];
  if (withoutQuery === '/' || withoutQuery === '') return SITE.origin + '/';
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return SITE.origin + encodePath(trimmed) + '/';
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/seo/meta.test.ts src/seo/files.test.ts src/seo/head.test.ts src/prerender/inject.test.ts`
Expected: PASS。若有旧断言写死了未编码行为，按新行为更新（这是有意的行为变更）。

- [ ] **Step 5: 提交**

~~~bash
git add src/seo/meta.ts src/seo/meta.test.ts src/seo/files.test.ts
git commit -m "feat(seo): canonical 与 sitemap 支持中文路径编码"
~~~

---

## Task 25: 预渲染清单与 HTML 站点地图

**Files:**
- Modify: `src/prerender/routes.ts`
- Modify: `src/prerender/routes.test.ts`
- Modify: `src/sitemap.ts`
- Modify: `src/sitemap.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
// src/prerender/routes.test.ts 末尾追加
import { PRERENDER_PATHS, XML_SITEMAP_PATHS } from './routes';

describe('小学语文预渲染路由', () => {
  it('9 类路由都在预渲染清单里', () => {
    for (const path of [
      '/yuwen',
      '/yuwen/book/1a',
      '/yuwen/lesson/G1A01',
      '/yuwen/review/1a/1',
      '/yuwen/tingxie/1a/1',
      '/yuwen/char/天',
      '/yuwen/pinyin',
      '/yuwen/pinyin/a',
      '/yuwen/duoyin',
    ]) {
      expect(PRERENDER_PATHS).toContain(path);
    }
  });

  it('总数超过 5000 且 sitemap 去掉 HTML 站点地图本身', () => {
    expect(PRERENDER_PATHS.length).toBeGreaterThan(5000);
    expect(XML_SITEMAP_PATHS).not.toContain('/sitemap');
  });
});
~~~

~~~ts
// src/sitemap.test.ts 末尾追加
import { buildHtmlSitemap } from './sitemap';

describe('HTML 站点地图的小学语文分组', () => {
  it('列出 10 册与两个工具页，不逐字展开', () => {
    const group = buildHtmlSitemap().find((g) => g.title === '小学语文');
    expect(group).toBeDefined();
    expect(group!.links).toHaveLength(13);
    expect(group!.links[0].path).toBe('/yuwen');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/book/1a');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/pinyin');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/duoyin');
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/prerender/routes.test.ts src/sitemap.test.ts`
Expected: FAIL（yuwen 路径不在清单里；没有「小学语文」分组）。

- [ ] **Step 3: 接入预渲染清单**

~~~ts
// src/prerender/routes.ts
import { allYuwenRoutePaths } from '../yuwen/paths';
// ...
export const PRERENDER_PATHS: string[] = [
  '/',
  ...Object.values(VIEW_PATHS),
  ...KNOWLEDGE_DATA.flatMap(/* 原样保留 */),
  ...ENGLISH_ROUTE_PATHS,
  ...ALL_POEMS.map((p) => '/poetry/' + p.id),
  ...LEGAL_PATHS,
  ...allYuwenRoutePaths(),
  HTML_SITEMAP_PATH,
];
~~~

- [ ] **Step 4: 加 HTML 站点地图分组**

~~~ts
// src/sitemap.ts
import { YUWEN_BOOKS } from './data/yuwen';
// ...在 buildHtmlSitemap() 内、englishReference 之前：
  const yuwenGroup: SitemapGroup = {
    title: '小学语文',
    links: [
      { label: '人教版小学语文（生字）', path: '/yuwen' },
      { label: '拼音表', path: '/yuwen/pinyin' },
      { label: '多音字', path: '/yuwen/duoyin' },
      ...YUWEN_BOOKS.map((book) => ({ label: book.title, path: '/yuwen/book/' + book.id })),
    ],
  };

  return [
    learningViews,
    yuwenGroup,
    ...knowledgeGroups,
    poetryGroup,
    englishReference,
    englishHubs,
    legalGroup,
  ];
~~~

- [ ] **Step 5: 运行确认通过（含既有 sitemap 断言修正）**

Run: `npx vitest run src/prerender/routes.test.ts src/sitemap.test.ts`
Expected: PASS。若 `src/sitemap.test.ts` 的旧断言（分组数、扁平列表长度）因新增分组失败，把期望值改成新结构并补一行说明「新增小学语文分组」。

- [ ] **Step 6: 提交**

~~~bash
git add src/prerender/routes.ts src/prerender/routes.test.ts src/sitemap.ts src/sitemap.test.ts
git commit -m "feat(yuwen): 全量预渲染与 HTML 站点地图分组"
~~~

---

## Task 26: Worker 静态路径（中文解码 + 预渲染面）

**Files:**
- Modify: `worker/lib/static-paths.ts`
- Modify: `worker/lib/static-paths.test.ts`

- [ ] **Step 1: 追加失败测试**

~~~ts
// worker/lib/static-paths.test.ts 末尾追加
describe('小学语文面（/yuwen）', () => {
  it('百分号编码的中文路径解码后命中磁盘目录', () => {
    expect(assetCandidates('/yuwen/char/' + encodeURIComponent('天'))).toEqual([
      '/yuwen/char/天/index.html',
    ]);
  });

  it('/yuwen 下不做 app shell 回退', () => {
    expect(assetCandidates('/yuwen')).toEqual(['/yuwen/index.html']);
    expect(assetCandidates('/yuwen/typo')).toEqual(['/yuwen/typo/index.html']);
  });

  it('/yuwenx 这类同前缀路径仍回退 app shell', () => {
    expect(assetCandidates('/yuwenx')).toEqual(['/yuwenx/index.html', '/index.html']);
  });
});
~~~

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: FAIL（编码路径未被解码；/yuwen/typo 回退到 /index.html）。

- [ ] **Step 3: 实现解码与预渲染面**

~~~ts
/** 全量预渲染的语言/模块面：目录下每一条合法路径都有自己的 index.html。 */
const PRERENDERED_SURFACES = ['/en', '/yuwen'];

/** 静态资源路径可能是百分号编码的中文（/yuwen/char/%E5%A4%A9），先解码再拼磁盘路径。 */
function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function assetCandidates(pathname: string): string[] {
  const decoded = decodePath(pathname);
  if (decoded.includes('.')) return [decoded];
  const dir = decoded.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  if (isPrerenderedSurface(dir)) return [dir + '/index.html'];
  return [dir + '/index.html', '/index.html'];
}
~~~

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: PASS（全部用例，含既有的 /en 用例）。

- [ ] **Step 5: 提交**

~~~bash
git add worker/lib/static-paths.ts worker/lib/static-paths.test.ts
git commit -m "feat(worker): 静态路径支持中文解码与 /yuwen 预渲染面"
~~~

---

## Task 27: 全量验收与文档同步

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: 全量测试**

Run: `npm test`
Expected: 全绿；测试文件数比改动前多约 14 个，且没有 "No test suite found"。

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 零错误、零警告。

- [ ] **Step 3: 生产构建（含预渲染）**

Run: `npm run build`
Expected: 结尾打印 `prerendered 5001 pages`（±10）、`+ robots.txt, sitemap.xml`；总耗时约 45–60 秒。

- [ ] **Step 4: 抽查预渲染产物**

~~~bash
ls dist/yuwen/index.html 'dist/yuwen/char/天/index.html' dist/yuwen/pinyin/a/index.html
grep -o '<link rel="canonical"[^>]*>' 'dist/yuwen/char/天/index.html'
grep -c '<url>' dist/sitemap.xml
grep -o 'yuwen/char/%E5%A4%A9' dist/sitemap.xml
~~~

Expected: 三个文件都存在；canonical 是 `https://syy.global/yuwen/char/%E5%A4%A9/`；sitemap 的 url 数约 5000；sitemap 里能搜到百分号编码的中文路径。

- [ ] **Step 5: 本地预览手点（人工）**

Run: `npm run preview`

逐项检查（验收标准里唯一不能自动化的部分）：

1. 首页顶栏「工具速查 → 小学语文」可进入 /yuwen，且该分组高亮
2. /yuwen → 一年级上册 → 识字1：天地人 → 点「天」进单字页 → 笔顺可播放、同音字/字形/组词都在
3. /yuwen → 一年级上册 → 第 1 单元「生字复习」→「打印听写单」→ 打印预览只有纸张内容、没有站点头尾
4. 听写单切换「打乱 / 提示 / 答案」三个下拉，URL 参数变化且内容跟着变
5. 「隐藏拼音」开关：切到别的页再回来仍保持
6. 手机宽度下抽屉菜单里有「小学语文」
7. /yuwen/pinyin、/yuwen/pinyin/a、/yuwen/duoyin 各点一遍，无控制台报错

- [ ] **Step 6: 更新两份仓库说明**

`AGENTS.md`：

- 「主要功能模块」加一条：**小学语文**：人教版 1–5 年级 10 册 / 326 课 / 2988 个生字的读音、同音字、字形与组词，含拼音表、多音字、单元复习与可打印听写单（入口 /yuwen）。
- 「项目结构」的 src 树补 components/yuwen/、data/yuwen/、yuwen/paths.ts。
- 「当前构建/检查状态」的预渲染页数与 sitemap 数量按实测更新。

`CLAUDE.md`：

- 「路由」表加 9 行 /yuwen 路由说明。
- 「数据层」补一段：src/data/yuwen/ 由 scripts/extract-data/adapters/yuwen-muduo.ts（抓 yuwen.muduo.org）+ scripts/ingest-data/adapters/yuwen.ts（整树重写）生成；src/data/yuwen/index.ts 是手写查询层。
- 「常用命令」补一条：`EXTRACT_MIN_INTERVAL_MS=150 bash scripts/extract-data/extract.sh yuwen` 重新抓取（约 10–15 分钟，有缓存）。

- [ ] **Step 7: 提交并收尾**

~~~bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: 记录小学语文模块的入口、数据管线与命令"
git status --short
git log --oneline -16
~~~

Expected: 工作区干净（staging 与 .cache 被 .gitignore 忽略）；本次实现约 16 个提交。

---

## 计划自审

### 1. Spec 覆盖对照

| spec 章节 | 落在哪些 Task |
|---|---|
| 1 概述 / 2 技术决策 | Task 1–3（数据管线）、Task 12（导航）、Task 22（路由） |
| 3 范围（做） | Task 3–27 |
| 5 站点结构与规模 | Task 11（路径与数量）、Task 25（预渲染计数） |
| 6 文件清单 | 各 Task 的 Files 段 |
| 7 数据模型与不变量 | Task 1（类型）、Task 7（归一化）、Task 9（校验）、Task 10（查询） |
| 8 抓取管线（6 个解析器 + 交叉校验） | Task 3–8 |
| 9 入库管线（整树重写、手写 index.ts） | Task 9–10 |
| 10 路由与 URL | Task 11、Task 22 |
| 11 组件与交互（9 页 + 6 原语 + 打印） | Task 13–21 |
| 12 导航（nav-items 收口、不动 ViewType） | Task 12 |
| 13 SEO 与预渲染、HTML 站点地图 | Task 23、Task 25 |
| 14 中文路径编码（三处收口） | Task 24（canonical/sitemap）、Task 26（Worker） |
| 15 Worker 预渲染面 | Task 26 |
| 16 样式与打印 | Task 15，以及 Task 17–20 里补的样式步骤 |
| 17 测试矩阵 | 每个 Task 的测试步骤 + Task 27 Step 1 |
| 18 验收标准 | Task 27 |
| 19 风险与降级 | Task 8 Step 3（缓存续跑）、Task 2（fixtures 锁结构） |

### 2. 占位符扫描

无 TBD / TODO / 「类似 Task N」/「自行补充」。每个代码步骤都给出可直接粘贴的完整实现，每个测试步骤都给出可运行的断言与期望输出。

### 3. 类型与命名一致性

- 数据模型统一在 Task 1：YuwenBook / YuwenUnit / YuwenLesson / YuwenChar / YuwenReading / YuwenStem / YuwenDuoyin / YuwenRadical / YuwenEnvelope；后续 Task 只引用这些名字。
- 查询层统一在 Task 10：bookById / lessonById / charByChar / stemByStem / duoyinByChar / homophonesOf / charsOfRadical / charsOfLesson / unitOf；Task 17–23 只调用这些。
- URL 构造统一在 Task 11：bookPath / lessonPath / charPath / reviewPath / tingxiePath / pinyinPath / duoyinPath / isYuwenPath / allYuwenRoutePaths。**只有 charPath 返回编码形态**；allYuwenRoutePaths 里的字路径保持未编码。
- 组件 props 与页面调用一一对应：ZiGrid 收 items/size/current；WordList 收 words/emptyLabel；CharChips 收 chars/current；SpeakButton 收 text/label；BishunSection 收 ch。

### 4. 与 spec 的两处有意偏差（实现时按本计划执行，并在提交信息里说明）

1. **课页「组词」来源**：数据里没有存课级词表，课页与复习页的组词取该字的 char.words（前 10 个），不区分是否已学。若要还原原站「只用学过的字」，需给 YuwenLesson 增加 words 字段并在 Task 7/9 同步改动——本次不做。
2. **测试文件里的追加导入**：Task 24 / Task 25 中「末尾追加测试」代码块里的 import 语句要并入对应测试文件顶部的 import 区；ES module 不允许把 import 放在文件末尾。

### 5. 执行顺序与并行建议

- Task 1–10（数据链路）必须串行，后一个依赖前一个的产物。
- Task 11 之后可并行：展示层（Task 13–21）与 SEO/Worker（Task 23–26）写的是不相交的文件；Task 22 依赖页面组件齐全，放在展示层之后。
- Task 12（导航）与 Task 11 无依赖，可提前做。
- Task 27 必须最后由一个人跑完整验收，避免并行构建互相覆盖 dist。













