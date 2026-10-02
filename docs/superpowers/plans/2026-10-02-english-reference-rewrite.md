# 英文打印图表面重写 Implementation Plan（阶段 A+B）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/en/` 英文打印图表面从「一个 160 行文件 + 单一 `{headers, rows}` 结构 + 扁平 URL」重写成「语言中立生成器 + 分节式页面模型 + 学科分层 URL」，为后续扩到 100 页和接 SEO/广告打好地基。

**Architecture:** 数据层分两半——`neutral/` 放能算的生成器（乘法表、平方根、单位换算、物理常数），保证数值正确性由代码而非人工保证；`en/` 放语言文件，负责组装 block、写文案、指定本地化的 slug 与 `related` 内链。渲染层用三种 block（table / formulas / diagram）加一个纯 switch 分发，页面的散文部分（intro / howToUse / faq / related）在类型上与数据块分开，打印样式只针对数据块。

**Tech Stack:** React 19、TypeScript（strict + `verbatimModuleSyntax`）、React Router 7、Tailwind CSS 4、Vitest（happy-dom）

**Spec:** `docs/superpowers/specs/2026-10-02-english-seo-ads-design.md`（Section 1、Section 2 为本计划范围；Section 3、4 属后续计划）

## Global Constraints

- **类型规则**：`strict: true`、`verbatimModuleSyntax: true`（类型导入一律 `import type { X }`）、`noUnusedLocals`、`noUnusedParameters`。CI 的 `npm run build` 会跑 `tsc -b`。
- **导出风格**：命名导出，不用 default export（`export const ReferencePage = () => …`）。现有 `App.tsx` 的 default export 是唯一例外，不动它。
- **本计划不新增任何运行时依赖**，也不改 `package.json`。
- **渲染顺序固定**：面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related。`blocks` 只放数据块，散文部分不进 `blocks`。
- **文案长度目标**：`summary` 60–90 字符；`description` 150–160 字符（校验断言放宽到 100–200，见 Task 2）；`intro` 80–120 词（校验断言放宽到 60–150）；`howToUse` 2–4 条；`faq` 3–5 条；`related` 可空但列出的 slug 必须存在。
- **Block 联合类型只有三种**：`table` | `formulas` | `diagram`。没有 `notes`（散文走 `howToUse` / `table.caption`）。
- **图表页保持恰好 1 个 AdUnit**（`placement="referenceBottom"`）。广告位调整属后续计划的 Section 4。
- **中文站（`src/data/knowledge`、`src/components/Home.tsx` 等）本计划完全不动。**
- **提交信息**：Conventional Commits，结尾空一行加 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`。
- **测试命令**：`npx vitest run <path>`（vitest.config.ts 的 `app` project 覆盖 `src/**`，`scripts` project 覆盖 `worker/**`）。

## 任务切分的关键约束（写这份计划时踩过的坑）

`src/data/reference.ts` 是一个**文件**，新的 `src/data/reference/` 是一个**目录**。两者在磁盘上可以共存，但 `import … from '../data/reference'` 的模块解析会优先命中 `reference.ts`，新目录永远加载不到。因此：

1. **删除 `src/data/reference.ts` 是一个原子事件**，必须与 `src/data/reference/index.ts` 的创建同时发生。
2. 该文件的全部消费者必须在**同一个提交**里改完，否则 `tsc -b` 直接失败。消费者共 6 处：`src/reference-routes.ts`、`src/seo/content-en.ts`、`src/components/reference/ReferenceIndex.tsx`、`src/components/reference/ReferencePage.tsx`、`src/seo/meta.test.ts`、`src/reference-routes.test.ts`。
3. **URL 分层（`/en/reference/:slug` → `/en/:category/:slug`）刻意不放在这个原子提交里。** 因为改 URL 会连带 `App.test.tsx`、`entry-server.test.tsx`、`adPlacements.test.tsx`、`src/prerender/routes.test.ts`、`src/seo/meta.test.ts` 一起动，原子提交会膨胀到不可 review。拆开之后，Task 4 保持扁平 URL（只换数据源），Task 5 专做 URL 分层。

代价是 `src/reference-routes.ts` 被改两次（Task 4 换 import 源、Task 5 换 URL 形状）。这是刻意的：换来的是每一提交都可通过 `tsc -b` 与 `npm test`。

## 文件结构

**新建**

| 文件 | 职责 | 任务 |
|---|---|---|
| `src/data/reference/types.ts` | `ReferenceCategory` / `Block` / `ReferencePage` | T1 |
| `src/data/reference/neutral/numeric.ts` | `range()` / `squareRoot()` | T1 |
| `src/data/reference/neutral/tables.ts` | `multiplicationRows()` / `squaresCubesRootsRows()` | T1 |
| `src/data/reference/neutral/conversions.ts` | `metricConversionRows()` | T1 |
| `src/data/reference/neutral/constants.ts` | `physicsConstantRows()` | T1 |
| `src/data/reference/en/data/trigIdentities.ts` | 三角恒等式分组（英文专属数据） | T2 |
| `src/data/reference/en/data/irregularVerbs.ts` | 不规则动词三态（英文专属数据） | T2 |
| `src/data/reference/en/{math,science,english,index}.ts` | 英文页面数据与合并 | T2 |
| `src/components/reference/blocks/{TableBlock,FormulasBlock,DiagramBlock,BlockRenderer}.tsx` | 三种 block 与穷尽分发 | T3 |
| `src/data/reference/validate.ts` | `validateReferencePages()` 构建期校验 | T4 |
| `src/data/reference/index.ts` | 聚合、按 slug 查、按学科过滤 | T4 |
| `src/components/reference/{ReferenceNotFound,FaqSection,RelatedCharts}.tsx` | 未找到态 / FAQ / 内链 | T4 |
| `src/data/reference/en/categories.ts` | 三个学科的 hub 文案 | T5 |
| `src/components/reference/ReferenceCategory.tsx` | 学科 hub 页 | T5 |

**修改**

| 文件 | 改动 | 任务 |
|---|---|---|
| `src/reference-routes.ts` | 换 import 源（仍扁平） → 再换 URL 形状 | T4, T5 |
| `src/reference-routes.test.ts` | 跟随两次改动 | T4, T5 |
| `src/seo/content-en.ts` | 换 `getReferencePage` → 再加 hub 分支 | T4, T5 |
| `src/components/reference/ReferenceIndex.tsx` | 字段改名 → 再改成学科卡 | T4, T5 |
| `src/components/reference/ReferencePage.tsx` | 重写为新模型（仍扁平） → 加学科面包屑 | T4, T5 |
| `src/components/reference/RelatedCharts.tsx` | 链接改双参 | T5 |
| `src/components/reference/ReferenceLayout.tsx` | header/footer 加 `print:hidden` | T4 |
| `src/entry-prerender.ts` | 调一次 `validateReferencePages()` | T4 |
| `src/seo/meta.test.ts` | 换 `REFERENCE_PAGES` 与路径 | T4, T5 |
| `src/prerender/routes.test.ts` | 新路径断言 | T5 |
| `src/App.test.tsx` | 三条英文路由断言 | T5, T6 |
| `src/entry-server.test.tsx` | 图表页路径 | T5 |
| `src/ads/adPlacements.test.tsx` | 图表页路由路径 | T5 |
| `src/App.tsx` | 加学科 hub 路由 | T6 |
| `worker/lib/{redirect,static-paths}.ts` + 测试 | 301 映射、`/en/` 关闭兜底 | T7 |
| `worker/index.ts` | 接线 | T7 |

**删除**

| 文件 | 任务 |
|---|---|
| `src/data/reference.ts` | T4 |

---

## Task 1: 类型定义与中立生成器

**Files:**
- Create: `src/data/reference/types.ts`
- Create: `src/data/reference/neutral/numeric.ts`
- Create: `src/data/reference/neutral/tables.ts`
- Create: `src/data/reference/neutral/conversions.ts`
- Create: `src/data/reference/neutral/constants.ts`
- Test: `src/data/reference/neutral/tables.test.ts`
- Test: `src/data/reference/neutral/conversions.test.ts`
- Test: `src/data/reference/neutral/constants.test.ts`

**Interfaces:**
- Consumes: 无（本任务是第一块）
- Produces:
  - `type ReferenceCategory = 'math' | 'science' | 'english'`
  - `type Block = { kind: 'table'; headers?: string[]; rows: string[][]; caption?: string } | { kind: 'formulas'; groups: { label?: string; items: string[] }[] } | { kind: 'diagram'; svg: string; caption?: string }`
  - `interface ReferencePage { slug: string; category: ReferenceCategory; title: string; summary: string; description: string; intro: string; blocks: Block[]; howToUse: string[]; faq: { q: string; a: string }[]; related: string[] }`
  - `range(from: number, to: number): number[]`
  - `squareRoot(n: number): string`
  - `multiplicationRows(max?: number): string[][]`
  - `squaresCubesRootsRows(max?: number): string[][]`
  - `metricConversionRows(): string[][]`
  - `physicsConstantRows(): string[][]`

**设计要点：生成器只产出 rows，不产出 headers。** 乘法表的表头里 `×` 是符号、数字是中立；但物理常数的表头 `['Quantity','Symbol','Value']` 和三角恒等式分组标签 `'Double angle'` 是**英文**。让生成器统一只拥有「算术」，让语言文件拥有「标签」，`es/` 落地时才不必改写生成器。

**本任务不碰 `src/data/reference.ts`，也不创建 `src/data/reference/index.ts`。** 只写 `types.ts` 和 `neutral/*`，这两个路径都不与旧文件冲突。

- [ ] **Step 1: 写 types.ts**

```ts
/** 学科分类。决定 `/en/<category>/` hub 路由与 slug 的取值域。 */
export type ReferenceCategory = 'math' | 'science' | 'english';

/**
 * 一个内容块。rows / items 里放数字与符号；headers、caption、group.label 可能是英文
 * （例如物理常数的表头），由语言文件负责——生成器只保证算术正确。
 */
export type Block =
  | { kind: 'table'; headers?: string[]; rows: string[][]; caption?: string }
  | { kind: 'formulas'; groups: { label?: string; items: string[] }[] }
  | { kind: 'diagram'; svg: string; caption?: string };

/**
 * 一张完整的打印图表页。文案与 block 放在同一个对象里，而不是拆成并列的 copy 文件——
 * 因为真正语言中立的是生成器函数，不是这些字段；加一门语言等于加一份页表，
 * 而不是去 copy 文件里对 blockId。
 */
export interface ReferencePage {
  /** 本地化的 URL 末段，全站唯一。 */
  slug: string;
  category: ReferenceCategory;
  /** H1 文本。`<title>` 在 seo/content-en.ts 里基于它拼装。 */
  title: string;
  /** 索引卡一行话，约 60–90 字符。 */
  summary: string;
  /** meta description，约 150–160 字符。 */
  description: string;
  /** 正文导语，80–120 词。 */
  intro: string;
  /** 页面主体。 */
  blocks: Block[];
  /** "How to use it" 列表，2–4 条。 */
  howToUse: string[];
  /** 3–5 条，同时产出 FAQPage 结构化数据。 */
  faq: { q: string; a: string }[];
  /** 3–5 个 slug 的显式内链；没有合适兄弟页时允许为空数组。 */
  related: string[];
}
```

- [ ] **Step 2: 写 numeric.ts**

```ts
/** 闭区间整数列表。供生成器与语言文件拼表头共用。 */
export function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

/** 平方根，保留三位小数并去掉尾随零（`√2` → `'1.414'`，`√4` → `'2'`）。 */
export function squareRoot(n: number): string {
  return String(Number(Math.sqrt(n).toFixed(3)));
}
```

- [ ] **Step 3: 写失败测试 `neutral/tables.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { multiplicationRows, squaresCubesRootsRows } from './tables';

describe('multiplicationRows', () => {
  it('returns a square grid of products with no header row', () => {
    const rows = multiplicationRows(12);
    expect(rows).toHaveLength(12);
    expect(rows[0]).toHaveLength(12);
    expect(rows[0][0]).toBe('1');
    expect(rows[11][11]).toBe('144');
  });

  it('satisfies the product invariant at every cell', () => {
    const rows = multiplicationRows(12);
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 12; col++) {
        expect(Number(rows[row][col])).toBe((row + 1) * (col + 1));
      }
    }
  });

  it('honours a custom maximum', () => {
    expect(multiplicationRows(3)).toEqual([
      ['1', '2', '3'],
      ['2', '4', '6'],
      ['3', '6', '9'],
    ]);
  });
});

describe('squaresCubesRootsRows', () => {
  it('returns n, n², n³, √n for n from 1 to 20', () => {
    const rows = squaresCubesRootsRows(20);
    expect(rows).toHaveLength(20);
    expect(rows[0]).toEqual(['1', '1', '1', '1']);
    expect(rows[19][0]).toBe('20');
  });

  it('satisfies the square and cube invariants', () => {
    for (const [index, row] of squaresCubesRootsRows(20).entries()) {
      const n = index + 1;
      expect(Number(row[1])).toBe(n * n);
      expect(Number(row[2])).toBe(n ** 3);
    }
  });

  it('rounds roots to three decimals and leaves perfect squares exact', () => {
    const rows = squaresCubesRootsRows(20);
    expect(rows[1][3]).toBe('1.414');
    expect(rows[3][3]).toBe('2');
  });

  it('squares back to n for every perfect square in range', () => {
    for (const row of squaresCubesRootsRows(20)) {
      const root = Number(row[3]);
      if (Number.isInteger(root)) expect(root * root).toBe(Number(row[1]));
    }
  });
});
```

- [ ] **Step 4: 跑测试确认失败**

Run: `npx vitest run src/data/reference/neutral/tables.test.ts`
Expected: FAIL — `Failed to resolve import "./tables"`

- [ ] **Step 5: 写 tables.ts**

```ts
import { range, squareRoot } from './numeric';

/** 乘法表数据行（1..max × 1..max 的乘积），不含表头行。表头由语言文件拼。 */
export function multiplicationRows(max = 12): string[][] {
  const numbers = range(1, max);
  return numbers.map((row) => numbers.map((col) => String(row * col)));
}

/** n / n² / n³ / √n 四列，n 从 1 到 max。 */
export function squaresCubesRootsRows(max = 20): string[][] {
  return range(1, max).map((n) => [String(n), String(n * n), String(n ** 3), squareRoot(n)]);
}
```

- [ ] **Step 6: 跑测试确认通过**

Run: `npx vitest run src/data/reference/neutral/tables.test.ts`
Expected: PASS（7 个用例）

- [ ] **Step 7: 写失败测试 `neutral/conversions.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { metricConversionGroups } from './conversions';

describe('metricConversionGroups', () => {
  it('covers length, mass and time in that order', () => {
    expect(metricConversionGroups().map((group) => group.key)).toEqual(['length', 'mass', 'time']);
  });

  it('carries no display copy — entries are digits, operators and unit symbols only', () => {
    for (const group of metricConversionGroups()) {
      for (const entry of group.entries) {
        expect(entry).toContain('=');
        // 单位符号最长三个字母（km / min / day）。更长的字母串就意味着混进了文案。
        for (const token of entry.split(/[^A-Za-z]+/).filter(Boolean)) {
          expect(token.length).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  it('states the metric powers-of-ten relations exactly', () => {
    const entries = metricConversionGroups().flatMap((group) => group.entries);
    expect(entries).toContain('1 km = 1000 m');
    expect(entries).toContain('1 kg = 1000 g');
    expect(entries).toContain('1 h = 60 min = 3600 s');
  });

  it('keeps every group non-empty', () => {
    for (const group of metricConversionGroups()) {
      expect(group.entries.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 8: 跑测试确认失败**

Run: `npx vitest run src/data/reference/neutral/conversions.test.ts`
Expected: FAIL — `Failed to resolve import "./conversions"`

- [ ] **Step 9: 写 conversions.ts**

```ts
/**
 * 公制换算的数据。分组只带一个稳定的键，显示名（Length / Mass / Time）由语言文件提供——
 * neutral 层不含任何文案。等式本身只由数字与国际单位符号组成，语言无关。
 */
export type ConversionGroupKey = 'length' | 'mass' | 'time';

export interface ConversionGroup {
  key: ConversionGroupKey;
  /** 每条是一个换算等式，例如 `1 km = 1000 m`。 */
  entries: string[];
}

export function metricConversionGroups(): ConversionGroup[] {
  return [
    { key: 'length', entries: ['1 km = 1000 m', '1 m = 100 cm = 1000 mm', '1 cm = 10 mm'] },
    { key: 'mass', entries: ['1 t = 1000 kg', '1 kg = 1000 g', '1 g = 1000 mg'] },
    { key: 'time', entries: ['1 h = 60 min = 3600 s', '1 min = 60 s', '1 day = 24 h'] },
  ];
}
```

- [ ] **Step 10: 跑测试确认通过**

Run: `npx vitest run src/data/reference/neutral/conversions.test.ts`
Expected: PASS（4 个用例）

- [ ] **Step 11: 写失败测试 `neutral/constants.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { physicalConstants } from './constants';

describe('physicalConstants', () => {
  it('returns symbol / value pairs', () => {
    const constants = physicalConstants();
    expect(constants).toHaveLength(8);
    for (const constant of constants) {
      expect(constant.symbol.length).toBeGreaterThan(0);
      expect(constant.value.length).toBeGreaterThan(0);
    }
  });

  it('gives every constant a distinct symbol', () => {
    const symbols = physicalConstants().map((constant) => constant.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it('carries no display names — only standard symbols and SI units', () => {
    for (const constant of physicalConstants()) {
      expect(constant.symbol.length).toBeLessThanOrEqual(3);
      // 单位符号最长三个字母（kg / mol）。更长的字母串就意味着混进了文案。
      for (const token of constant.value.split(/[^A-Za-z]+/).filter(Boolean)) {
        expect(token.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('keeps the two accepted values of gravitational acceleration', () => {
    const gravity = physicalConstants().find((constant) => constant.symbol === 'g');
    expect(gravity?.value).toBe('9.8 m/s²');
    expect(gravity?.alternate).toBe('10 m/s²');
  });
});
```

- [ ] **Step 12: 跑测试确认失败**

Run: `npx vitest run src/data/reference/neutral/constants.test.ts`
Expected: FAIL — `Failed to resolve import "./constants"`

- [ ] **Step 13: 写 constants.ts**

```ts
/**
 * 常用物理常数。neutral 层只保留国际通用符号与数值、单位——数量名
 * （"Gravitational acceleration"）与连接词 "or" 是文案，属于语言文件。
 * `alternate` 用于同一个常数的第二常用取值（例如 g 的 9.8 与 10）。
 */
export interface PhysicalConstant {
  /** 国际通用符号，语言中立。 */
  symbol: string;
  /** 数值与国际单位符号，例如 `9.8 m/s²`。 */
  value: string;
  /** 第二常用取值，语言无关。 */
  alternate?: string;
}

export function physicalConstants(): PhysicalConstant[] {
  return [
    { symbol: 'g', value: '9.8 m/s²', alternate: '10 m/s²' },
    { symbol: 'c', value: '3.00 × 10⁸ m/s' },
    { symbol: 'h', value: '6.63 × 10⁻³⁴ J·s' },
    { symbol: 'e', value: '1.60 × 10⁻¹⁹ C' },
    { symbol: 'mₑ', value: '9.11 × 10⁻³¹ kg' },
    { symbol: 'mₚ', value: '1.67 × 10⁻²⁷ kg' },
    { symbol: 'Nₐ', value: '6.02 × 10²³ mol⁻¹' },
    { symbol: 'k', value: '9.0 × 10⁹ N·m²/C²' },
  ];
}
```

- [ ] **Step 14: 跑全部生成器测试**

Run: `npx vitest run src/data/reference/neutral/`
Expected: PASS（15 个用例：tables 7 + conversions 4 + constants 4）

- [ ] **Step 15: 类型检查**

Run: `npx tsc -b`
Expected: 无输出（成功）—— 本任务只新增文件，不触碰既有消费者。

- [ ] **Step 16: 提交**

```bash
git add src/data/reference/types.ts src/data/reference/neutral/
git commit -m "$(cat <<'EOF'
feat(reference): 中立生成器与分节式页面类型

生成器只产出 rows，标签留给语言文件——物理常数的表头是英文而乘法表
不是，统一让生成器只管算术。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 英文页面数据（6 页迁移）

**Files:**
- Create: `src/data/reference/en/data/trigIdentities.ts`
- Create: `src/data/reference/en/data/irregularVerbs.ts`
- Create: `src/data/reference/en/math.ts`
- Create: `src/data/reference/en/science.ts`
- Create: `src/data/reference/en/english.ts`
- Create: `src/data/reference/en/index.ts`
- Test: `src/data/reference/en/pages.test.ts`

**Interfaces:**
- Consumes: `Block`、`ReferencePage`（Task 1）；`multiplicationRows`、`squaresCubesRootsRows`（Task 1）；`metricConversionRows`、`physicsConstantRows`（Task 1）；`range`（Task 1）
- Produces:
  - `TRIG_IDENTITY_GROUPS: { label?: string; items: string[] }[]`
  - `IRREGULAR_VERB_ROWS: string[][]`
  - `MATH_PAGES: ReferencePage[]`
  - `SCIENCE_PAGES: ReferencePage[]`
  - `ENGLISH_PAGES: ReferencePage[]`
  - `REFERENCE_PAGES_EN: readonly ReferencePage[]`

**本任务仍不碰 `src/data/reference.ts`。** `en/index.ts` 只被同目录的测试导入，没有跨目录的裸路径引用。

- [ ] **Step 1: 写 `en/data/trigIdentities.ts`**

```ts
/** 三角恒等式的分组。标签是英文，无法中立化——`es/` 需另行撰写这一份。 */
export const TRIG_IDENTITY_GROUPS: { label?: string; items: string[] }[] = [
  {
    label: 'Pythagorean',
    items: ['sin²θ + cos²θ = 1', 'tanθ = sinθ / cosθ', '1 + tan²θ = sec²θ', '1 + cot²θ = csc²θ'],
  },
  {
    label: 'Sum / difference',
    items: [
      'sin(α ± β) = sinα cosβ ± cosα sinβ',
      'cos(α ± β) = cosα cosβ ∓ sinα sinβ',
      'tan(α ± β) = (tanα ± tanβ) / (1 ∓ tanα tanβ)',
    ],
  },
  {
    label: 'Double angle',
    items: [
      'sin2α = 2 sinα cosα',
      'cos2α = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α',
      'tan2α = 2tanα / (1 − tan²α)',
    ],
  },
  {
    label: 'Half angle',
    items: ['sin²(α/2) = (1 − cosα) / 2', 'cos²(α/2) = (1 + cosα) / 2'],
  },
];
```

- [ ] **Step 2: 写 `en/data/irregularVerbs.ts`**

```ts
/** 不规则动词三态。这份数据本身就是英文，没有可中立化的部分。 */
export const IRREGULAR_VERB_ROWS: string[][] = [
  ['be', 'was / were', 'been'],
  ['begin', 'began', 'begun'],
  ['break', 'broke', 'broken'],
  ['bring', 'brought', 'brought'],
  ['buy', 'bought', 'bought'],
  ['come', 'came', 'come'],
  ['do', 'did', 'done'],
  ['drink', 'drank', 'drunk'],
  ['eat', 'ate', 'eaten'],
  ['find', 'found', 'found'],
  ['get', 'got', 'got / gotten'],
  ['give', 'gave', 'given'],
  ['go', 'went', 'gone'],
  ['have', 'had', 'had'],
  ['know', 'knew', 'known'],
  ['make', 'made', 'made'],
  ['read', 'read', 'read'],
  ['run', 'ran', 'run'],
  ['say', 'said', 'said'],
  ['see', 'saw', 'seen'],
  ['speak', 'spoke', 'spoken'],
  ['take', 'took', 'taken'],
  ['think', 'thought', 'thought'],
  ['write', 'wrote', 'written'],
];
```

- [ ] **Step 3: 写 `en/math.ts`**

`summary` 与 `description` 沿用旧文案，`intro` / `howToUse` / `faq` / `related` 为新增。

```ts
import { metricConversionGroups, type ConversionGroupKey } from '../neutral/conversions';
import { range } from '../neutral/numeric';
import { multiplicationRows, squaresCubesRootsRows } from '../neutral/tables';
import type { ReferencePage } from '../types';
import { TRIG_IDENTITY_GROUPS } from './data/trigIdentities';

/** 分组显示名。英文文案就住在这里——neutral 层只给 key。 */
const METRIC_GROUP_LABELS: Record<ConversionGroupKey, string> = {
  length: 'Length',
  mass: 'Mass',
  time: 'Time',
};

/** 把 neutral 的分组键渲染成表格行：每组首行带分组名，其余留空表示延续上一组。 */
function metricConversionRows(): string[][] {
  return metricConversionGroups().flatMap((group) =>
    group.entries.map((entry, index) => [index === 0 ? METRIC_GROUP_LABELS[group.key] : '', entry]),
  );
}

export const MATH_PAGES: ReferencePage[] = [
  {
    slug: 'multiplication-chart',
    category: 'math',
    title: 'Multiplication Chart (1–12)',
    summary: 'Every times table from 1 to 12 on one printable grid.',
    description:
      'A printable 1–12 multiplication chart showing every times table, handy for homework, home practice and classroom use.',
    intro:
      'This 1–12 multiplication chart puts every times table on a single grid. Find the row for one number and the column for the other, and the cell where they meet is the product — so 7 × 8 is the number where row 7 meets column 8. Printing it and keeping it on a desk or in a homework folder gives children a fast way to check their own work instead of reaching for a calculator. It is also a compact way to notice the patterns that make times tables easier to remember: the diagonal of square numbers, the symmetry either side of it, and the easy 10s column.',
    blocks: [
      {
        kind: 'table',
        headers: ['×', ...range(1, 12).map(String)],
        rows: multiplicationRows(12),
      },
    ],
    howToUse: [
      'Put one finger on the row for the first number and one on the column for the second, then read the cell where they meet.',
      'Read down the 10s column first — it is the quickest win, and it makes the rest of the grid less intimidating.',
      'Print at 100% rather than "fit to page" so the grid stays square and easy to scan.',
    ],
    faq: [
      {
        q: 'What is a multiplication chart?',
        a: 'A grid that lists the product of every pair of numbers from 1 to 12. The row and the column each stand for one factor, and the cell where they meet is the answer.',
      },
      {
        q: 'Is this the same as a times table?',
        a: 'Yes. A chart shows all the times tables at once; a times table usually means one of the individual lines, such as the 7 times table.',
      },
      {
        q: 'Why does this chart stop at 12?',
        a: 'Twelve is the range most schools expect children to know by heart. Charts that go higher are useful for spotting larger patterns, but 12 covers the facts that come up in everyday arithmetic.',
      },
      {
        q: 'Can I print it in black and white?',
        a: 'Yes. The grid uses borders rather than shading, so it stays readable on a mono printer.',
      },
    ],
    related: ['squares-cubes-roots', 'metric-conversions', 'trigonometric-identities'],
  },
  {
    slug: 'squares-cubes-roots',
    category: 'math',
    title: 'Squares, Cubes & Square Roots',
    summary: 'n², n³ and √n for n from 1 to 20, rounded to 3 decimals.',
    description:
      'Printable table of squares, cubes and square roots for numbers 1 to 20, with irrational square roots rounded to three decimals.',
    intro:
      'This table gives the square, the cube and the square root of every whole number from 1 to 20. Squares and cubes appear constantly in algebra, area and volume problems, and square roots come up whenever a question asks for a side length or a standard deviation. Keeping the first twenty values in view turns them from something to work out into something to recognise, which is most of what makes these questions quick when they appear in a test.',
    blocks: [
      {
        kind: 'table',
        headers: ['n', 'n²', 'n³', '√n'],
        rows: squaresCubesRootsRows(20),
      },
    ],
    howToUse: [
      'Learn the squares of 1 to 12 first — they come up most often, and they are the ones tests expect you to know without working them out.',
      'Use the square root column as a sanity check: if an answer must lie between two whole numbers, the roots bracket it.',
      'Treat the rounded roots as a reading aid, not an exact value — most of them are irrational and go on forever.',
    ],
    faq: [
      {
        q: 'What is the difference between a square and a square root?',
        a: 'Squaring multiplies a number by itself and gives n². Finding the square root goes the other way: it asks which number, multiplied by itself, gives the number you started with.',
      },
      {
        q: 'Why is a cube called a cube?',
        a: 'Because a cube with edges of length n has a volume of n × n × n. The name comes from the shape, not from the algebra.',
      },
      {
        q: 'Why are the square roots rounded to three decimals?',
        a: 'Most square roots are irrational — they go on forever without repeating. Three decimals is enough to compare values or check an answer, but it is not an exact value, so avoid it in a calculation that needs precision.',
      },
      {
        q: 'What is a perfect square?',
        a: 'A number whose square root is a whole number, such as 1, 4, 9, 16, 25 and 36.',
      },
    ],
    related: ['multiplication-chart', 'trigonometric-identities', 'physics-constants'],
  },
  {
    slug: 'trigonometric-identities',
    category: 'math',
    title: 'Trigonometric Identities',
    summary: 'Pythagorean, sum/difference, double-angle and half-angle identities.',
    description:
      'A printable summary of the trigonometric identities students need most: Pythagorean, sum and difference, double-angle and half-angle formulas.',
    intro:
      'This sheet collects the trigonometric identities that come up most often in algebra, geometry and physics, grouped by the kind of problem they solve rather than by difficulty. Angles are written as α, β and θ, and every line holds for any angle. Use it as a lookup while working: start from the group that matches the shape of the problem in front of you, then work back towards the Pythagorean identities if you need something simpler to substitute in.',
    blocks: [{ kind: 'formulas', groups: TRIG_IDENTITY_GROUPS }],
    howToUse: [
      'Start from the Pythagorean identities — most of the others can be derived from them if you forget one.',
      'When a problem mixes two different angles, reach for the sum and difference group; when it doubles or halves one angle, use the double-angle and half-angle groups.',
      'Watch the ∓ and ± signs: they flip between the top and bottom lines of a sum or difference formula.',
    ],
    faq: [
      {
        q: 'What is a trigonometric identity?',
        a: 'An equation involving trigonometric functions that is true for every angle. Unlike an equation you solve, an identity is a fact you can substitute into a problem to make it simpler.',
      },
      {
        q: 'Which identities do I actually need to memorise?',
        a: 'In practice, sin²θ + cos²θ = 1 and the sum and difference formulas cover most exam questions. The double-angle and half-angle formulas can be derived from those.',
      },
      {
        q: 'What do the letters α, β and θ mean?',
        a: 'They are conventional names for angles, exactly like using x for an unknown. Which letter is used makes no difference to the formula.',
      },
      {
        q: 'Why do some formulas use both ± and ∓?',
        a: 'The two signs move together but in opposite directions. When the left side uses +, the matching term on the right uses −, and the other way round.',
      },
    ],
    related: ['squares-cubes-roots', 'physics-constants', 'metric-conversions'],
  },
  {
    slug: 'metric-conversions',
    category: 'math',
    title: 'Metric Unit Conversions',
    summary: 'Length, mass and time conversions in one table.',
    description:
      'Printable metric conversion table covering length, mass and time: kilometres to metres, kilograms to grams, hours to minutes and seconds.',
    intro:
      'This table covers the metric conversions that come up in science and maths homework: length from kilometres down to millimetres, mass from tonnes down to milligrams, and time from days down to seconds. Each row is a single equality you can read in either direction. The metric system is built on powers of ten, so most of these conversions are a matter of moving a decimal point rather than remembering an unrelated number, and a printed copy next to a homework book removes the need to look anything up.',
    blocks: [
      {
        kind: 'table',
        headers: ['Quantity', 'Conversion'],
        rows: metricConversionRows(),
      },
    ],
    howToUse: [
      'Move the decimal point instead of multiplying: one step down the prefixes is one place to the right.',
      'Write the unit next to every number while converting. Most mistakes here are unit mistakes, not arithmetic ones.',
      'Treat the time rows separately — unlike length and mass, time is not decimal, so the powers-of-ten shortcut does not apply.',
    ],
    faq: [
      {
        q: 'How do I convert between metric units?',
        a: 'Count the steps between the two prefixes and move the decimal point that many places in the matching direction. Kilo- to the base unit is three steps, so 2.5 km is 2500 m.',
      },
      {
        q: 'Why is time different from the other rows?',
        a: 'The metric prefixes work in powers of ten, but an hour has 60 minutes and a minute has 60 seconds. Time does not follow that pattern, so it needs its own rows.',
      },
      {
        q: 'What is a tonne?',
        a: 'A metric tonne is 1000 kilograms. It is sometimes written "metric ton" to distinguish it from the US short ton, which is about 907 kilograms.',
      },
      {
        q: 'Is a millilitre the same as a cubic centimetre?',
        a: 'Yes, exactly — 1 mL = 1 cm³. That is why volume and capacity convert so cleanly in the metric system.',
      },
    ],
    related: ['physics-constants', 'multiplication-chart', 'squares-cubes-roots'],
  },
];
```

- [ ] **Step 4: 写 `en/science.ts`**

```ts
import { physicalConstants } from '../neutral/constants';
import type { ReferencePage } from '../types';

/** 数量名。英文文案就住在这里——neutral 层只给符号与数值。 */
const CONSTANT_NAMES: Record<string, string> = {
  g: 'Gravitational acceleration',
  c: 'Speed of light in vacuum',
  h: 'Planck constant',
  e: 'Elementary charge',
  mₑ: 'Electron mass',
  mₚ: 'Proton mass',
  Nₐ: 'Avogadro constant',
  k: 'Coulomb constant',
};

/** 渲染成表格行：数量名 + 符号 + 取值；有第二取值时按英文习惯用 "or" 连接。 */
function physicsConstantRows(): string[][] {
  return physicalConstants().map((constant) => [
    CONSTANT_NAMES[constant.symbol],
    constant.symbol,
    constant.alternate ? `${constant.value} (or ${constant.alternate})` : constant.value,
  ]);
}

export const SCIENCE_PAGES: ReferencePage[] = [
  {
    slug: 'physics-constants',
    category: 'science',
    title: 'Physical Constants',
    summary: 'Common physical constants with symbols and values.',
    description:
      'Printable table of common physical constants — gravitational acceleration, speed of light, Planck constant, Avogadro constant and more.',
    intro:
      'This table lists the physical constants that appear in school and first-year physics: gravitational acceleration, the speed of light, the Planck constant, the elementary charge, the masses of the electron and proton, the Avogadro constant and the Coulomb constant. Each row gives the quantity, the symbol it is normally written with, and its value in SI units, to three significant figures — the precision most school problems expect. Printing it gives a single sheet to check a formula against while working.',
    blocks: [
      {
        kind: 'table',
        headers: ['Quantity', 'Symbol', 'Value'],
        rows: physicsConstantRows(),
      },
    ],
    howToUse: [
      'Check which value of g your course uses. Many courses use 10 m/s² to keep calculations simple, while the measured value is 9.8 m/s² — the table gives both.',
      'Keep the symbol column in view while reading a formula: mₑ and mₚ are easy to mix up.',
      'Copy the units along with the number. Dropping them is the most common source of wrong answers in these problems.',
    ],
    faq: [
      {
        q: 'What is a physical constant?',
        a: 'A quantity whose value does not change, whatever the situation. The speed of light in a vacuum is the same everywhere, so it is a constant rather than a variable.',
      },
      {
        q: 'Why does the table give two values for gravitational acceleration?',
        a: 'Both are in common use. 9.8 m/s² is the measured value, and 10 m/s² is a rounded version many courses use. Use whichever your course specifies.',
      },
      {
        q: 'How many significant figures should I use?',
        a: 'Match the precision of the question. These values are given to three significant figures, which is enough for most school work — carrying more digits does not make an answer more correct if the input was already rounded.',
      },
      {
        q: 'Are these values in SI units?',
        a: 'Yes. Masses are in kilograms, speeds in metres per second, the Planck constant in joule-seconds, and charge in coulombs.',
      },
    ],
    related: ['metric-conversions', 'trigonometric-identities', 'squares-cubes-roots'],
  },
];
```

- [ ] **Step 5: 写 `en/english.ts`**

`related` 为空数组：英文面目前只有这一页英语图表，跨学科硬凑内链（英语语法 → 乘法表）是噪声。等内容扩充阶段铺出更多英语页后再补。

```ts
import type { ReferencePage } from '../types';
import { IRREGULAR_VERB_ROWS } from './data/irregularVerbs';

export const ENGLISH_PAGES: ReferencePage[] = [
  {
    slug: 'irregular-verbs',
    category: 'english',
    title: 'Irregular Verbs',
    summary: 'Base form, past simple and past participle for common verbs.',
    description:
      'Printable list of common English irregular verbs with their past simple and past participle forms, for grammar practice and revision.',
    intro:
      'This list gives the base form, the past simple and the past participle of 24 common English irregular verbs. Irregular verbs do not take -ed, so their past forms have to be learned rather than worked out. The three columns line up with the three places these forms are needed: the base form after "to", the past simple for finished actions, and the past participle after "have" or "has". Printing it keeps the three forms side by side, which makes the pattern behind each verb easier to see than a dictionary entry does.',
    blocks: [
      {
        kind: 'table',
        headers: ['Base form', 'Past simple', 'Past participle'],
        rows: IRREGULAR_VERB_ROWS,
      },
    ],
    howToUse: [
      'Cover the last two columns and test yourself from the base form — recognition is much easier than recall, and recall is what exams ask for.',
      'Read the past participle aloud with "have" in front of it, because that is how it appears in a sentence.',
      'Group the verbs by pattern as you learn them: "break, broke, broken" and "speak, spoke, spoken" change in the same way.',
    ],
    faq: [
      {
        q: 'What makes a verb irregular?',
        a: 'Its past simple and past participle are not formed by adding -ed. "Walk" becomes "walked", which is regular; "go" becomes "went", which is not.',
      },
      {
        q: 'What is the difference between past simple and past participle?',
        a: 'The past simple stands on its own for a finished action: "I wrote a letter." The past participle needs an auxiliary verb: "I have written a letter."',
      },
      {
        q: 'Why does "read" look the same in all three columns?',
        a: 'The spelling is identical, but the pronunciation changes. The base form and the past participle rhyme with "feed"; the past simple rhymes with "red".',
      },
      {
        q: 'Why does "get" have two past participles?',
        a: '"Got" is standard in British English and "gotten" in American English. Both are correct — pick one and stay consistent.',
      },
    ],
    related: [],
  },
];
```

- [ ] **Step 6: 写 `en/index.ts`**

```ts
import type { ReferencePage } from '../types';
import { ENGLISH_PAGES } from './english';
import { MATH_PAGES } from './math';
import { SCIENCE_PAGES } from './science';

/** 英文面的全部图表页。顺序即 `/en/` 索引页与各学科 hub 上的展示顺序。 */
export const REFERENCE_PAGES_EN: readonly ReferencePage[] = [
  ...MATH_PAGES,
  ...SCIENCE_PAGES,
  ...ENGLISH_PAGES,
];
```

- [ ] **Step 7: 写 `en/pages.test.ts`**

长度断言刻意比目标宽（目标 60–90 / 150–160 / 80–120 词），因为这里要挡的是「留了个空壳」，不是逐字校对。真正的文案质量靠 review。

```ts
import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES_EN } from './index';

/** 只允许小写字母、数字与连字符——即可以直接进 URL 路径段的 slug。 */
const slugIsServiceable = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

describe('English reference pages', () => {
  it('carries the six charts that existed before the rewrite', () => {
    expect(REFERENCE_PAGES_EN.map((page) => page.slug).sort()).toEqual([
      'irregular-verbs',
      'metric-conversions',
      'multiplication-chart',
      'physics-constants',
      'squares-cubes-roots',
      'trigonometric-identities',
    ]);
  });

  it('maps every page to one of the three categories', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(['math', 'science', 'english']).toContain(page.category);
    }
  });

  it('uses URL-safe slugs', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(slugIsServiceable(page.slug)).toBe(true);
    }
  });

  it('keeps every related slug pointing at a real page', () => {
    const slugs = new Set(REFERENCE_PAGES_EN.map((page) => page.slug));
    for (const page of REFERENCE_PAGES_EN) {
      for (const related of page.related) {
        expect(slugs).toContain(related);
      }
    }
  });

  it('holds summary and description inside stub-guard bounds', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(page.summary.length).toBeGreaterThanOrEqual(40);
      expect(page.summary.length).toBeLessThanOrEqual(100);
      expect(page.description.length).toBeGreaterThanOrEqual(100);
      expect(page.description.length).toBeLessThanOrEqual(200);
    }
  });

  it('holds intro inside stub-guard bounds', () => {
    for (const page of REFERENCE_PAGES_EN) {
      const words = page.intro.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(60);
      expect(words).toBeLessThanOrEqual(150);
    }
  });

  it('gives every page at least three FAQ entries and two how-to-use steps', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(page.faq.length).toBeGreaterThanOrEqual(3);
      expect(page.howToUse.length).toBeGreaterThanOrEqual(2);
      expect(page.blocks.length).toBeGreaterThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 8: 跑测试**

Run: `npx vitest run src/data/reference/en/`
Expected: PASS（7 个用例）。若长度断言失败，**改文案而不是改断言值**。

- [ ] **Step 9: 提交**

```bash
git add src/data/reference/en/
git commit -m "$(cat <<'EOF'
feat(reference): 英文图表面六页迁移到分节式模型

每页补上 intro / howToUse / faq / related。不规则动词的 related 留空——
英文面目前只有这一页英语图表，跨学科硬凑内链是噪声。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Block 渲染组件

**Files:**
- Create: `src/components/reference/blocks/TableBlock.tsx`
- Create: `src/components/reference/blocks/FormulasBlock.tsx`
- Create: `src/components/reference/blocks/DiagramBlock.tsx`
- Create: `src/components/reference/blocks/BlockRenderer.tsx`
- Test: `src/components/reference/blocks/BlockRenderer.test.tsx`

**Interfaces:**
- Consumes: `Block`（Task 1，通过显式路径 `'../../../data/reference/types'` 导入——该路径不与旧文件冲突）
- Produces:
  - `TableBlock({ block }: { block: Extract<Block, { kind: 'table' }> }): ReactElement`
  - `FormulasBlock({ block }: { block: Extract<Block, { kind: 'formulas' }> }): ReactElement`
  - `DiagramBlock({ block }: { block: Extract<Block, { kind: 'diagram' }> }): ReactElement`
  - `BlockRenderer({ blocks }: { blocks: readonly Block[] }): ReactElement`

**本任务刻意排在数据替换之前**，因为 `BlockRenderer` 只依赖 `Block` 类型（显式路径导入），而 Task 4 重写图表页时需要它。放在这里让 Task 4 不必再临时拼一个表格渲染。

- [ ] **Step 1: 写失败测试 `BlockRenderer.test.tsx`**

注意表格用例的单元格值刻意与表头值不同名——testing-library 的 `getByRole` 在多个同名元素上会抛错。

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Block } from '../../../data/reference/types';
import { BlockRenderer } from './BlockRenderer';

describe('BlockRenderer', () => {
  it('renders a table block with headers and rows', () => {
    const block: Block = { kind: 'table', headers: ['×', '1'], rows: [['7', '8']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '7' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '8' })).toBeTruthy();
  });

  it('renders a table block without headers', () => {
    const block: Block = { kind: 'table', rows: [['only-cell']] };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.queryByRole('columnheader')).toBeNull();
    expect(screen.getByRole('cell', { name: 'only-cell' })).toBeTruthy();
  });

  it('renders a table caption when present', () => {
    const block: Block = { kind: 'table', rows: [['1']], caption: 'Rounded to 3 decimals' };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Rounded to 3 decimals')).toBeTruthy();
  });

  it('renders formula groups with and without a label', () => {
    const block: Block = {
      kind: 'formulas',
      groups: [{ label: 'Pythagorean', items: ['sin²θ + cos²θ = 1'] }, { items: ['bare-item'] }],
    };
    render(<BlockRenderer blocks={[block]} />);
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
    expect(screen.getByText('bare-item')).toBeTruthy();
  });

  it('renders a diagram block by injecting its svg', () => {
    const block: Block = {
      kind: 'diagram',
      svg: '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>',
      caption: 'Unit circle',
    };
    const { container } = render(<BlockRenderer blocks={[block]} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.innerHTML).toContain('<circle');
    expect(screen.getByText('Unit circle')).toBeTruthy();
  });

  it('renders multiple blocks in order', () => {
    const blocks: Block[] = [
      { kind: 'table', rows: [['first-table']] },
      { kind: 'formulas', groups: [{ items: ['second-formulas'] }] },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const text = container.textContent ?? '';
    expect(text.indexOf('first-table')).toBeLessThan(text.indexOf('second-formulas'));
  });

  it('renders nothing for an empty block list', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container.textContent).toBe('');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/components/reference/blocks/BlockRenderer.test.tsx`
Expected: FAIL — `Failed to resolve import "./BlockRenderer"`

- [ ] **Step 3: 写 `TableBlock.tsx`**

表格类名沿用重写前 `ReferencePage.tsx` 里的值，不改视觉。

```tsx
import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 表格 block：可选表头、可横向滚动、可选脚注。 */
export function TableBlock({
  block,
}: {
  block: Extract<Block, { kind: 'table' }>;
}): ReactElement {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {block.headers && (
            <thead>
              <tr className="bg-[#F5F6F7]">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-[#E5E6EB] px-3 py-2 text-left font-semibold text-[#1F2329]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#E1EAFF]/30 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#E5E6EB] px-3 py-2 text-[#1F2329]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-xs text-[#8F959E]">{block.caption}</figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 4: 写 `FormulasBlock.tsx`**

```tsx
import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/** 公式 block：按用途分组，每组可选一个标题。 */
export function FormulasBlock({
  block,
}: {
  block: Extract<Block, { kind: 'formulas' }>;
}): ReactElement {
  return (
    <div className="mt-6 space-y-6">
      {block.groups.map((group, index) => (
        <section key={index}>
          {group.label && (
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#8F959E]">
              {group.label}
            </h3>
          )}
          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-lg bg-white border border-[#F0F1F2] px-4 py-2 font-mono text-sm text-[#1F2329]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: 写 `DiagramBlock.tsx`**

```tsx
import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';

/**
 * 图形 block。SVG 直接以 `dangerouslySetInnerHTML` 注入——这是本仓库内撰写的静态
 * 数据（`src/data/reference/**`），不是用户输入，没有注入面；写成组件会迫使数据文件
 * 变成 .tsx 并失去「数据即常量」的简单性。新增 SVG 时必须在 review 时看过内容。
 */
export function DiagramBlock({
  block,
}: {
  block: Extract<Block, { kind: 'diagram' }>;
}): ReactElement {
  return (
    <figure className="mt-6">
      <div
        className="mx-auto max-w-md [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: block.svg }}
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-xs text-[#8F959E]">{block.caption}</figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 6: 写 `BlockRenderer.tsx`**

```tsx
import type { ReactElement } from 'react';
import type { Block } from '../../../data/reference/types';
import { DiagramBlock } from './DiagramBlock';
import { FormulasBlock } from './FormulasBlock';
import { TableBlock } from './TableBlock';

function renderBlock(block: Block, key: number): ReactElement {
  switch (block.kind) {
    case 'table':
      return <TableBlock key={key} block={block} />;
    case 'formulas':
      return <FormulasBlock key={key} block={block} />;
    case 'diagram':
      return <DiagramBlock key={key} block={block} />;
  }
}

/**
 * 按顺序渲染页面的数据块。switch 对 `Block` 联合类型穷尽——加一种 block 类型时
 * TypeScript 会在 `renderBlock` 上报「函数缺少返回语句」，这就是发现遗漏的地方。
 */
export function BlockRenderer({ blocks }: { blocks: readonly Block[] }): ReactElement {
  return <>{blocks.map((block, index) => renderBlock(block, index))}</>;
}
```

- [ ] **Step 7: 跑测试确认通过**

Run: `npx vitest run src/components/reference/blocks/BlockRenderer.test.tsx`
Expected: PASS（7 个用例）

- [ ] **Step 8: 类型检查与 lint**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npx eslint src/components/reference/blocks/`
Expected: 无错误。本仓库的 ESLint 配置是 `@eslint/js` + typescript-eslint + react-hooks + react-refresh，**没有装 `eslint-plugin-react`**，所以 `dangerouslySetInnerHTML` 不会触发规则。若确实报错，补一行 `// eslint-disable-next-line <rule>` 并注明原因。

- [ ] **Step 9: 提交**

```bash
git add src/components/reference/blocks/
git commit -m "$(cat <<'EOF'
feat(reference): 三种 block 的渲染组件与穷尽分发

加第四种 block 类型时 TS 会在 renderBlock 上报缺少返回语句，
漏改不会静默通过。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 数据模块原子替换 + 图表页重写（URL 保持扁平）

本任务是本计划里最大的一个，因为**它必须是原子的**：删掉 `src/data/reference.ts` 会让 6 个消费者同时编译失败，必须在同一个提交里全部改完。为了让这个提交可以 review，**URL 形状刻意保持不变**（仍是 `/en/reference/:slug`）——URL 分层推到 Task 5。

**Files:**
- Create: `src/data/reference/validate.ts`
- Create: `src/data/reference/index.ts`
- Create: `src/components/reference/ReferenceNotFound.tsx`
- Create: `src/components/reference/FaqSection.tsx`
- Create: `src/components/reference/RelatedCharts.tsx`
- Modify: `src/reference-routes.ts`
- Modify: `src/reference-routes.test.ts`
- Modify: `src/seo/content-en.ts`
- Modify: `src/seo/meta.test.ts`
- Modify: `src/components/reference/ReferenceIndex.tsx`
- Modify: `src/components/reference/ReferencePage.tsx`
- Modify: `src/components/reference/ReferenceLayout.tsx`
- Modify: `src/entry-prerender.ts`
- Test: `src/data/reference/validate.test.ts`
- Test: `src/data/reference/index.test.ts`
- Test: `src/components/reference/ReferencePage.test.tsx`
- Delete: `src/data/reference.ts`

**Interfaces:**
- Consumes: `REFERENCE_PAGES_EN`（Task 2）、`ReferencePage` / `ReferenceCategory`（Task 1）、`BlockRenderer`（Task 3）
- Produces:
  - `validateReferencePages(pages: readonly ReferencePage[]): void`（不合法则 throw）
  - `REFERENCE_PAGES: readonly ReferencePage[]`
  - `getReferencePage(slug: string): ReferencePage | undefined`
  - `pagesInCategory(category: ReferenceCategory): ReferencePage[]`
  - `ReferenceNotFound(): ReactElement`
  - `FaqSection({ faq }: { faq: readonly { q: string; a: string }[] }): ReactElement | null`
  - `RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null`
  - `ReferencePage(): ReactElement`
  - `ReferenceIndex(): ReactElement`
  - `referencePath(slug: string): string`（**仍是一参**）
  - `referenceSlugForAppPath(appPath: string): string | null`（不变）
  - `ENGLISH_REFERENCE_ROUTE = '/en/reference/:slug'`（不变）

- [ ] **Step 1: 写失败测试 `validate.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import type { ReferencePage } from './types';
import { validateReferencePages } from './validate';

function page(overrides: Partial<ReferencePage> = {}): ReferencePage {
  return {
    slug: 'a-page',
    category: 'math',
    title: 'A Page',
    summary: 'A summary.',
    description: 'A description.',
    intro: 'An intro.',
    blocks: [{ kind: 'table', rows: [['1']] }],
    howToUse: ['Do this.', 'Then that.'],
    faq: [
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
      { q: 'Q3', a: 'A3' },
    ],
    related: [],
    ...overrides,
  };
}

describe('validateReferencePages', () => {
  it('accepts a well-formed page set', () => {
    expect(() => validateReferencePages([page()])).not.toThrow();
  });

  it('rejects duplicate slugs', () => {
    expect(() => validateReferencePages([page(), page()])).toThrow(/duplicate slug: a-page/);
  });

  it('rejects empty required copy', () => {
    expect(() => validateReferencePages([page({ intro: '   ' })])).toThrow(/empty intro/);
    expect(() => validateReferencePages([page({ title: '' })])).toThrow(/empty title/);
    expect(() => validateReferencePages([page({ summary: '' })])).toThrow(/empty summary/);
    expect(() => validateReferencePages([page({ description: ' ' })])).toThrow(/empty description/);
  });

  it('rejects a page with too few FAQ entries or how-to-use steps', () => {
    expect(() => validateReferencePages([page({ faq: [{ q: 'Q', a: 'A' }] })])).toThrow(
      /at least 3 FAQ/,
    );
    expect(() => validateReferencePages([page({ howToUse: ['one'] })])).toThrow(
      /at least 2 howToUse/,
    );
  });

  it('rejects a page with no blocks', () => {
    expect(() => validateReferencePages([page({ blocks: [] })])).toThrow(/at least one block/);
  });

  it('rejects an empty FAQ question or answer', () => {
    const faq = [
      { q: '', a: 'A' },
      { q: 'Q', a: 'A' },
      { q: 'Q', a: 'A' },
    ];
    expect(() => validateReferencePages([page({ faq })])).toThrow(/empty FAQ/);
  });

  it('rejects a related slug that no page declares', () => {
    expect(() => validateReferencePages([page({ related: ['ghost'] })])).toThrow(
      /related slug not found: ghost/,
    );
  });

  it('accepts a related slug that a sibling page declares', () => {
    const other = page({ slug: 'other-page' });
    expect(() => validateReferencePages([page({ related: ['other-page'] }), other])).not.toThrow();
  });

  it('allows an empty related list', () => {
    expect(() => validateReferencePages([page({ related: [] })])).not.toThrow();
  });

  it('reports every problem at once rather than the first', () => {
    const broken = page({ slug: 'broken', title: '', intro: '', blocks: [] });
    expect(() => validateReferencePages([broken])).toThrow(
      /empty title[\s\S]*empty intro[\s\S]*at least one block/,
    );
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/data/reference/validate.test.ts`
Expected: FAIL — `Failed to resolve import "./validate"`

- [ ] **Step 3: 写 validate.ts**

```ts
import type { ReferencePage } from './types';

/**
 * 构建期防呆：半成品页面必须在构建时炸掉，而不是带着空 intro 或断掉的内链
 * 混进 dist/ 被爬虫抓走。由 entry-prerender 在写盘前调用一次。
 *
 * 一次收集全部问题再抛，避免「修一个跑一次」的循环。
 */
export function validateReferencePages(pages: readonly ReferencePage[]): void {
  const slugs = new Set<string>();
  const problems: string[] = [];

  for (const page of pages) {
    if (slugs.has(page.slug)) problems.push(`duplicate slug: ${page.slug}`);
    slugs.add(page.slug);
  }

  for (const page of pages) {
    for (const field of ['title', 'summary', 'description', 'intro'] as const) {
      if (!page[field].trim()) problems.push(`${page.slug}: empty ${field}`);
    }
    if (page.blocks.length < 1) problems.push(`${page.slug}: needs at least one block`);
    if (page.howToUse.length < 2) problems.push(`${page.slug}: needs at least 2 howToUse steps`);
    if (page.faq.length < 3) problems.push(`${page.slug}: needs at least 3 FAQ entries`);
    for (const entry of page.faq) {
      if (!entry.q.trim() || !entry.a.trim()) {
        problems.push(`${page.slug}: empty FAQ question or answer`);
      }
    }
    for (const related of page.related) {
      if (!slugs.has(related)) problems.push(`${page.slug}: related slug not found: ${related}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`invalid reference pages:\n  ${problems.join('\n  ')}`);
  }
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run src/data/reference/validate.test.ts`
Expected: PASS（10 个用例）

- [ ] **Step 5: 写 `index.ts`**

```ts
import { REFERENCE_PAGES_EN } from './en';
import type { ReferenceCategory, ReferencePage } from './types';

/**
 * 当前已撰写的全部图表页。加一门语言时在数组里补一个展开项即可——
 * 语言维度靠目录划分，不靠参数。
 */
export const REFERENCE_PAGES: readonly ReferencePage[] = [...REFERENCE_PAGES_EN];

const BY_SLUG = new Map(REFERENCE_PAGES.map((page) => [page.slug, page]));

/** slug 目前全局唯一（只有一门语言）。加第二门语言时改成 (lang, slug) 复合键。 */
export function getReferencePage(slug: string): ReferencePage | undefined {
  return BY_SLUG.get(slug);
}

export function pagesInCategory(category: ReferenceCategory): ReferencePage[] {
  return REFERENCE_PAGES.filter((page) => page.category === category);
}

export type { Block, ReferenceCategory, ReferencePage } from './types';
```

- [ ] **Step 6: 写 `index.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { getReferencePage, pagesInCategory, REFERENCE_PAGES } from './index';

describe('reference page index', () => {
  it('exposes every authored page', () => {
    expect(REFERENCE_PAGES).toHaveLength(6);
  });

  it('looks a page up by slug', () => {
    expect(getReferencePage('multiplication-chart')?.title).toBe('Multiplication Chart (1–12)');
    expect(getReferencePage('no-such-chart')).toBeUndefined();
  });

  it('filters by category, preserving authoring order', () => {
    expect(pagesInCategory('math').map((page) => page.slug)).toEqual([
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
    ]);
    expect(pagesInCategory('science').map((page) => page.slug)).toEqual(['physics-constants']);
    expect(pagesInCategory('english').map((page) => page.slug)).toEqual(['irregular-verbs']);
  });
});
```

- [ ] **Step 7: 写 `ReferenceNotFound.tsx`**

标题用中性的 "Page not found"——它同时服务图表页与（Task 5 之后的）学科 hub 两个场景。

```tsx
import type { ReactElement } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** 未知 slug / 未知学科的兜底页。 */
export function ReferenceNotFound(): ReactElement {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1F2329]">Page not found</h1>
      <p className="mt-2 text-[#646A73]">
        This chart does not exist, or it has moved to a different category.
      </p>
      <a href={ENGLISH_HOME} className="mt-4 inline-block text-[#3370FF] hover:underline">
        ← All reference charts
      </a>
    </>
  );
}
```

- [ ] **Step 8: 写 `FaqSection.tsx`**

```tsx
import type { ReactElement } from 'react';

/** 图表页的 FAQ。同时是 FAQPage 结构化数据的数据源。 */
export function FaqSection({
  faq,
}: {
  faq: readonly { q: string; a: string }[];
}): ReactElement | null {
  if (faq.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-[#1F2329]">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-3">
        {faq.map((entry) => (
          <div key={entry.q} className="bg-white rounded-xl border border-[#F0F1F2] p-5">
            <dt className="font-semibold text-[#1F2329]">{entry.q}</dt>
            <dd className="mt-1 text-sm text-[#646A73]">{entry.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 9: 写 `RelatedCharts.tsx`**

Task 4 里 `referencePath` 仍是一参（扁平 URL）。

```tsx
import type { ReactElement } from 'react';
import type { ReferencePage } from '../../data/reference/types';
import { referencePath } from '../../reference-routes';

/** 相关图表内链。空列表时整段不渲染，而不是留一个空标题。 */
export function RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null {
  if (pages.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-[#1F2329]">
        Related charts
      </h2>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.slug)}
              className="block h-full bg-white rounded-xl border border-[#F0F1F2] p-5 hover:shadow-md transition-shadow"
            >
              <span className="block font-semibold text-[#1F2329]">{page.title}</span>
              <span className="mt-1 block text-sm text-[#646A73]">{page.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 10: 改 `ReferenceLayout.tsx` 的打印行为**

在 `<header>` 的 className 末尾加 ` print:hidden`，在 `<footer>` 的 className 末尾加 ` print:hidden`。改后两行分别是：

```tsx
      <header className="bg-white border-b border-[#E5E6EB] sticky top-0 z-40 print:hidden">
```

```tsx
      <footer className="py-8 text-center text-sm text-[#8F959E] bg-white border-t border-[#F0F1F2] print:hidden">
```

- [ ] **Step 11: 写失败测试 `ReferencePage.test.tsx`**

Task 4 里路由仍是 `/en/reference/:slug`。

```tsx
import { render, screen } from '@testing-library/react';
import type { ContextType } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/auth-context';
import { ReferencePage } from './ReferencePage';

// happy-dom 拒绝加载外部 AdSense 脚本，这里把加载器打桩。
vi.mock('../../ads/adsense', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../ads/adsense')>();
  return { ...actual, ensureAdSenseScript: vi.fn() };
});

const auth: NonNullable<ContextType<typeof AuthContext>> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

function renderChart(url: string) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/en/reference/:slug" element={<ReferencePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ReferencePage', () => {
  it('renders the chart title, intro and table', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Multiplication Chart (1–12)',
    );
    expect(screen.getByText(/puts every times table on a single grid/)).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
  });

  it('renders the how-to-use steps and the FAQ', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByText(/Put one finger on the row/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeTruthy();
    expect(screen.getByText('What is a multiplication chart?')).toBeTruthy();
  });

  it('links to the related charts', () => {
    renderChart('/en/reference/multiplication-chart');
    const heading = screen.getByRole('heading', { name: 'Related charts' });
    const section = heading.closest('section');
    expect(section?.querySelector('a[href="/en/reference/squares-cubes-roots/"]')).toBeTruthy();
  });

  it('renders formula groups for the identities chart', () => {
    renderChart('/en/reference/trigonometric-identities');
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
  });

  it('omits the related section when a chart has no siblings', () => {
    renderChart('/en/reference/irregular-verbs');
    expect(screen.queryByRole('heading', { name: 'Related charts' })).toBeNull();
  });

  it('404s on an unknown slug', () => {
    renderChart('/en/reference/no-such-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
```

- [ ] **Step 12: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferencePage.test.tsx`
Expected: FAIL — 缺少 FaqSection

- [ ] **Step 13: 重写 `ReferencePage.tsx`**

```tsx
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { getReferencePage } from '../../data/reference';
import { ENGLISH_HOME } from '../../reference-routes';
import { BlockRenderer } from './blocks/BlockRenderer';
import { FaqSection } from './FaqSection';
import { PrintButton } from './PrintButton';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';
import { RelatedCharts } from './RelatedCharts';

/**
 * 一张可打印的参考图表。
 *
 * 渲染顺序固定：面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related。
 * 广告落在数据块之后、FAQ 之前，是为了让打印输出与正文阅读都不被广告打断。
 */
export function ReferencePage(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getReferencePage(slug) : undefined;

  if (!page) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const related = page.related
    .map((relatedSlug) => getReferencePage(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="text-sm text-[#646A73] print:hidden">
        <a href={ENGLISH_HOME} className="hover:text-[#1F2329] transition-colors">
          All charts
        </a>
      </nav>

      <article className="mt-4 bg-white rounded-2xl border border-[#F0F1F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2329]">{page.title}</h1>
            <p className="mt-1 text-sm text-[#646A73]">{page.description}</p>
          </div>
          <span className="shrink-0 px-3 py-1 bg-blue-100 text-[#3370FF] text-xs font-medium rounded-full capitalize print:hidden">
            {page.category}
          </span>
        </div>

        <div className="p-6">
          <p className="text-[#1F2329] leading-relaxed">{page.intro}</p>

          <BlockRenderer blocks={page.blocks} />

          <section className="mt-10 print:hidden" aria-labelledby="how-to-use-heading">
            <h2 id="how-to-use-heading" className="text-xl font-bold text-[#1F2329]">
              How to use it
            </h2>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-[#1F2329]">
              {page.howToUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="mt-6 flex justify-end print:hidden">
            <PrintButton />
          </div>
        </div>
      </article>

      <AdUnit placement="referenceBottom" />

      <FaqSection faq={page.faq} />

      <RelatedCharts pages={related} />
    </ReferenceLayout>
  );
}
```

- [ ] **Step 14: 改 `ReferenceIndex.tsx` 到新 API（字段改名，仍扁平链接）**

Task 5 会把它改成三张学科卡；这里只做让编译通过、链接仍指向扁平 URL 的最小改动。`category` 值现在是小写，用 `capitalize` 类保持显示效果。

```tsx
import type { ReactElement } from 'react';
import { REFERENCE_PAGES } from '../../data/reference';
import { referencePath } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页，列出全部打印参考图表。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers — multiplication
          tables, roots, trigonometric identities, physics constants, metric conversions and
          irregular verbs. Open a chart and print it in one click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_PAGES.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.slug)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <span className="inline-block self-start px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3 capitalize">
                {page.category}
              </span>
              <h2 className="text-lg font-bold text-[#1F2329]">{page.title}</h2>
              <p className="mt-2 text-sm text-[#646A73]">{page.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
```

- [ ] **Step 15: 改 `src/reference-routes.ts` 只换 import 源**

URL 形状不变。只改 import 与 `ENGLISH_ROUTE_PATHS` 的数据来源。

```ts
import { REFERENCE_PAGES } from './data/reference';
import { EN, homePath } from './i18n/languages';

/**
 * The English surface's route table — the single place the router, the prerender/sitemap
 * route list and the link helpers all read. Mirrors `src/view-routes.ts` for the Chinese app.
 */

/** Canonical home of the English surface; also the language entry point's target. */
export const ENGLISH_HOME = homePath(EN);

/** React Router pattern for a single reference chart. */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}reference/:slug`;

/** Canonical path of a reference chart. */
export function referencePath(slug: string): string {
  return `${ENGLISH_HOME}reference/${slug}/`;
}

/** Slug of a chart from its language-stripped path (`/reference/x`), or null. */
export function referenceSlugForAppPath(appPath: string): string | null {
  const match = /^\/reference\/([^/]+)\/?$/.exec(appPath);
  return match ? match[1] : null;
}

/** Every English route path, in the shape the prerender list and sitemap use. */
export const ENGLISH_ROUTE_PATHS: string[] = [
  ENGLISH_HOME,
  ...REFERENCE_PAGES.map((page) => referencePath(page.slug)),
];
```

- [ ] **Step 16: 改 `src/seo/content-en.ts` 到新 API**

只把 `getReferenceTable` 换成 `getReferencePage`，字段名从 `table.*` 换成 `page.*`。其余不变。

```ts
import { getReferencePage } from '../data/reference';
import type { Language } from '../i18n/languages';
import { ENGLISH_HOME, referenceSlugForAppPath } from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * The English surface's page copy: a small set of printable reference charts
 * (`/en/` and `/en/reference/:slug`). Deliberately scoped — not a translation of the app.
 *
 * 注意：本阶段仍是 `kind: 'view'` 与 `{title} - {brand}` 标题格式。换成
 * `LearningResource` / `FAQPage` 与 "Printable …" 标题模板属于 SEO 阶段。
 */
export function resolveEnglishContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);
  const home: Breadcrumb = { name: 'Home', path: ENGLISH_HOME };

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [home],
    };
  }

  const slug = referenceSlugForAppPath(appPath);
  const page = slug ? getReferencePage(slug) : undefined;
  if (page) {
    return {
      kind: 'view',
      title: `${page.title} - ${brand.name}`,
      description: page.description,
      breadcrumbs: [home, { name: page.title, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
```

- [ ] **Step 17: 改 `src/reference-routes.test.ts`**

只把 `REFERENCE_SLUGS` 换成 `REFERENCE_PAGES`，断言值不变。

```ts
import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  referencePath,
  referenceSlugForAppPath,
} from './reference-routes';

describe('English route table', () => {
  it('has a canonical home plus one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/reference/:slug');
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(1 + REFERENCE_PAGES.length);
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain(referencePath('multiplication-chart'));
  });

  it('builds chart paths and resolves them back to a slug', () => {
    expect(referencePath('irregular-verbs')).toBe('/en/reference/irregular-verbs/');
    expect(referenceSlugForAppPath('/reference/irregular-verbs')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/reference/irregular-verbs/')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/tutorial')).toBeNull();
  });
});
```

- [ ] **Step 18: 改 `src/seo/meta.test.ts` 的英文图表用例**

两处改动：import 换成 `REFERENCE_PAGES`；`canonicalUrl` 的样例路径与图表循环改用 `page.*`。**其余断言不变。**

把文件顶部的

```ts
import { REFERENCE_TABLES } from '../data/reference';
```

换成

```ts
import { REFERENCE_PAGES } from '../data/reference';
```

把 `canonicalUrl` 用例里的

```ts
    expect(canonicalUrl('/en/reference/multiplication-chart')).toBe(
      'https://syy.global/en/reference/multiplication-chart/',
    );
```

**保持不变**（Task 4 仍是扁平 URL）。

把图表循环用例整体换成：

```ts
  it('gives every English reference chart its own English metadata', () => {
    for (const page of REFERENCE_PAGES) {
      const path = `/en/reference/${page.slug}`;
      const meta = buildSeoMeta(path);
      expect(meta.title).toBe(`${page.title} - ${EN.name}`);
      expect(meta.description).toBe(page.description);
      expect(meta.canonical).toBe(`https://syy.global/en/reference/${page.slug}/`);
      expect(meta.htmlLang).toBe('en');
      expect(meta.alternates[0]).toEqual({
        hreflang: 'en',
        href: `https://syy.global/en/reference/${page.slug}/`,
      });
    }
  });
```

- [ ] **Step 19: 删除旧模块并在构建期接线校验**

`src/entry-prerender.ts` 里加两行 import：

```ts
import { REFERENCE_PAGES } from './data/reference';
import { validateReferencePages } from './data/reference/validate';
```

在 `const distDir = …` 之前插入：

```ts
validateReferencePages(REFERENCE_PAGES);
```

然后：

```bash
git rm src/data/reference.ts
```

- [ ] **Step 20: 确认没有旧符号残留**

Run: `grep -rn "getReferenceTable\|REFERENCE_TABLES\|REFERENCE_SLUGS" src/ worker/`
Expected: 无输出。

- [ ] **Step 21: 类型检查与全量测试**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npm test`
Expected: 全绿。本任务刻意保持扁平 URL，所以 `App.test.tsx`、`entry-server.test.tsx`、`adPlacements.test.tsx`、`src/prerender/routes.test.ts`、`src/i18n/languages.test.ts`、`src/prerender/inject.test.ts` **都不需要改**——如果其中任何一个失败了，说明改动超出了本任务范围，先修改动而不是改断言。

- [ ] **Step 22: 提交**

```bash
git add -A src/data/reference src/reference-routes.ts src/reference-routes.test.ts src/seo/content-en.ts src/seo/meta.test.ts src/components/reference src/entry-prerender.ts
git commit -m "$(cat <<'EOF'
feat(reference): 数据模块原子替换，图表页改为分节式渲染

删 src/data/reference.ts 会让 6 个消费者同时编译失败，所以建目录、
删旧文件、改完所有消费者必须一个提交。URL 形状刻意保持不变，把
分层 URL 的连带影响推到下一个提交。

图表页渲染顺序固定为 面包屑 → H1 → intro → blocks → howToUse →
广告 → FAQ → related；打印时隐藏导航、广告、FAQ、相关图表与按钮。

校验在 entry-prerender 里调用并直接 throw，一次收集全部问题再抛。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: URL 分层与 hub 页

**Files:**
- Create: `src/data/reference/en/categories.ts`
- Create: `src/components/reference/ReferenceCategory.tsx`
- Modify: `src/reference-routes.ts`
- Modify: `src/reference-routes.test.ts`
- Modify: `src/seo/content-en.ts`
- Modify: `src/seo/meta.test.ts`
- Modify: `src/prerender/routes.test.ts`
- Modify: `src/components/reference/ReferencePage.tsx`
- Modify: `src/components/reference/ReferenceIndex.tsx`
- Modify: `src/components/reference/RelatedCharts.tsx`
- Modify: `src/entry-server.test.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/ads/adPlacements.test.tsx`
- Test: `src/components/reference/ReferenceCategory.test.tsx`
- Test: `src/components/reference/ReferenceIndex.test.tsx`

**Interfaces:**
- Consumes: `REFERENCE_PAGES`、`getReferencePage`、`pagesInCategory`（Task 4）；`ReferencePage` / `ReferenceCategory`（Task 1）；`ReferenceNotFound`（Task 4）
- Produces:
  - `CATEGORY_COPY: Record<ReferenceCategory, CategoryCopy>`，`CategoryCopy = { name: string; summary: string; intro: string }`
  - `ENGLISH_CATEGORY_ROUTE = '/en/:category'`
  - `ENGLISH_REFERENCE_ROUTE = '/en/:category/:slug'`
  - `REFERENCE_CATEGORIES: readonly ReferenceCategory[]`（`['math','science','english']`）
  - `isReferenceCategory(value: string): value is ReferenceCategory`
  - `categoryPath(category: ReferenceCategory): string`
  - `referencePath(category: ReferenceCategory, slug: string): string`（**签名由一参变为两参**）
  - `referencePartsForAppPath(appPath: string): { category: string; slug: string } | null`
  - `ReferenceCategory(): ReactElement`

- [ ] **Step 1: 写 `src/data/reference/en/categories.ts`**

```ts
import type { ReferenceCategory } from '../types';

export interface CategoryCopy {
  /** hub H1 与 `/en/` 索引卡上的学科名。 */
  name: string;
  /** `/en/` 索引卡上的一句话，约 50–80 字符。 */
  summary: string;
  /** hub 页导语，同时用作该 hub 的 meta description。 */
  intro: string;
}

/** 英文面的学科文案。修改学科措辞的唯一位置。 */
export const CATEGORY_COPY: Record<ReferenceCategory, CategoryCopy> = {
  math: {
    name: 'Math',
    summary: 'Times tables, roots, conversions and formula sheets.',
    intro:
      'Printable maths reference charts for arithmetic, algebra and geometry — times tables, squares and roots, unit conversions and formula sheets. Every chart is laid out to be printed at full size and kept on a desk or in a homework folder.',
  },
  science: {
    name: 'Science',
    summary: 'Constants, units and reference data for physics and chemistry.',
    intro:
      'Printable science reference charts: the constants and reference tables that come up in physics and chemistry homework. Each row gives the quantity, the symbol it is written with, and its value in SI units.',
  },
  english: {
    name: 'English',
    summary: 'Grammar, spelling and vocabulary reference lists.',
    intro:
      'Printable English reference charts covering grammar, spelling and vocabulary — word forms and the lists that are quicker to check than to recall. Each chart is laid out to be read at a glance and printed on a single page.',
  },
};
```

- [ ] **Step 2: 重写 `src/reference-routes.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  categoryPath,
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  isReferenceCategory,
  REFERENCE_CATEGORIES,
  referencePartsForAppPath,
  referencePath,
} from './reference-routes';

describe('English route table', () => {
  it('has a home, three category hubs and one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(REFERENCE_CATEGORIES).toEqual(['math', 'science', 'english']);
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(
      1 + REFERENCE_CATEGORIES.length + REFERENCE_PAGES.length,
    );
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/');
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/multiplication-chart/');
  });

  it('exposes React Router patterns with a :category segment', () => {
    expect(ENGLISH_CATEGORY_ROUTE).toBe('/en/:category');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/:category/:slug');
  });

  it('builds category and chart paths', () => {
    expect(categoryPath('math')).toBe('/en/math/');
    expect(referencePath('math', 'multiplication-chart')).toBe('/en/math/multiplication-chart/');
    expect(referencePath('english', 'irregular-verbs')).toBe('/en/english/irregular-verbs/');
  });

  it('routes every authored page to a path under its own category', () => {
    for (const page of REFERENCE_PAGES) {
      expect(ENGLISH_ROUTE_PATHS).toContain(referencePath(page.category, page.slug));
    }
  });

  it('splits an app path into category and slug', () => {
    expect(referencePartsForAppPath('/math/multiplication-chart')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math/multiplication-chart/')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math')).toBeNull();
    expect(referencePartsForAppPath('/math/a/b')).toBeNull();
    expect(referencePartsForAppPath('/tutorial')).toBeNull();
  });

  it('recognises only the three known categories', () => {
    expect(isReferenceCategory('science')).toBe(true);
    expect(isReferenceCategory('reference')).toBe(false);
    expect(isReferenceCategory('')).toBe(false);
  });
});
```

- [ ] **Step 3: 跑测试确认失败**

Run: `npx vitest run src/reference-routes.test.ts`
Expected: FAIL — `categoryPath is not a function`

- [ ] **Step 4: 重写 `src/reference-routes.ts`**

```ts
import { REFERENCE_PAGES } from './data/reference';
import type { ReferenceCategory } from './data/reference/types';
import { EN, homePath } from './i18n/languages';

/**
 * 英文面的路由表——路由、prerender 清单、sitemap 与链接助手都从这里读。
 * 与中文 app 的 `src/view-routes.ts` 对应。
 */

/** 英文面的规范首页；也是语言入口的跳转目标。 */
export const ENGLISH_HOME = homePath(EN);

/** 学科 hub 的展示顺序，同时也是 `/en/` 索引页上卡片的顺序。 */
export const REFERENCE_CATEGORIES: readonly ReferenceCategory[] = ['math', 'science', 'english'];

/** React Router 模式：单个学科 hub。 */
export const ENGLISH_CATEGORY_ROUTE = `${ENGLISH_HOME}:category`;

/** React Router 模式：单张图表页。 */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}:category/:slug`;

export function isReferenceCategory(value: string): value is ReferenceCategory {
  return (REFERENCE_CATEGORIES as readonly string[]).includes(value);
}

/** 学科 hub 的规范路径：`categoryPath('math')` → `/en/math/`。 */
export function categoryPath(category: ReferenceCategory): string {
  return `${ENGLISH_HOME}${category}/`;
}

/** 图表页的规范路径：`referencePath('math', 'x')` → `/en/math/x/`。 */
export function referencePath(category: ReferenceCategory, slug: string): string {
  return `${ENGLISH_HOME}${category}/${slug}/`;
}

/** 把去掉语言前缀的 app 路径（`/math/x`）拆成学科与 slug；层级不对返回 null。 */
export function referencePartsForAppPath(
  appPath: string,
): { category: string; slug: string } | null {
  const match = /^\/([^/]+)\/([^/]+)\/?$/.exec(appPath);
  return match ? { category: match[1], slug: match[2] } : null;
}

/** 英文面的全部路由路径，供 prerender 清单与 sitemap 使用。 */
export const ENGLISH_ROUTE_PATHS: string[] = [
  ENGLISH_HOME,
  ...REFERENCE_CATEGORIES.map(categoryPath),
  ...REFERENCE_PAGES.map((page) => referencePath(page.category, page.slug)),
];
```

- [ ] **Step 5: 跑测试确认通过**

Run: `npx vitest run src/reference-routes.test.ts`
Expected: PASS（6 个用例）

- [ ] **Step 6: 重写 `src/seo/content-en.ts`**

```ts
import { getReferencePage } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { Language } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  isReferenceCategory,
  referencePartsForAppPath,
} from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * 英文面的页面文案：`/en/`、三个学科 hub 与各张图表页。
 * 有意保持狭窄——这不是中文 app 的翻译。
 *
 * 注意：本阶段图表页与 hub 页都仍是 `kind: 'view'`，`<title>` 也仍是
 * `{title} - {brand}` 旧格式。换成 `LearningResource` / `FAQPage` 与
 * "Printable …" 标题模板属于 SEO 阶段。
 */
export function resolveEnglishContent(
  appPath: string,
  path: string,
  language: Language,
): PageContent {
  const brand = brandFor(language);
  const home: Breadcrumb = { name: 'Home', path: ENGLISH_HOME };

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [home],
    };
  }

  const parts = referencePartsForAppPath(appPath);
  if (parts && isReferenceCategory(parts.category)) {
    const page = getReferencePage(parts.slug);
    if (page && page.category === parts.category) {
      return {
        kind: 'view',
        title: `${page.title} - ${brand.name}`,
        description: page.description,
        breadcrumbs: [
          home,
          { name: CATEGORY_COPY[page.category].name, path: categoryPath(page.category) },
          { name: page.title, path },
        ],
      };
    }
  }

  const hub = /^\/([^/]+)\/?$/.exec(appPath);
  if (hub && isReferenceCategory(hub[1])) {
    const copy = CATEGORY_COPY[hub[1]];
    return {
      kind: 'view',
      title: `${copy.name} Reference Charts - ${brand.name}`,
      description: copy.intro,
      breadcrumbs: [home, { name: copy.name, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
```

- [ ] **Step 7: 更新 `src/seo/meta.test.ts` 的两处路径**

`canonicalUrl` 用例里的样例路径换成新结构：

```ts
    expect(canonicalUrl('/en/math/multiplication-chart')).toBe(
      'https://syy.global/en/math/multiplication-chart/',
    );
```

图表循环用例改成用学科分层路径：

```ts
  it('gives every English reference chart its own English metadata', () => {
    for (const page of REFERENCE_PAGES) {
      const path = `/en/${page.category}/${page.slug}`;
      const meta = buildSeoMeta(path);
      expect(meta.title).toBe(`${page.title} - ${EN.name}`);
      expect(meta.description).toBe(page.description);
      expect(meta.canonical).toBe(`https://syy.global/en/${page.category}/${page.slug}/`);
      expect(meta.htmlLang).toBe('en');
      expect(meta.alternates[0]).toEqual({
        hreflang: 'en',
        href: `https://syy.global/en/${page.category}/${page.slug}/`,
      });
    }
  });
```

其它用例（含「每条 prerendered 路由的 title/description/canonical 互不相同」那条）**保持不变**——新增的三个 hub 路径各有不同的标题与导语，该断言仍成立。

- [ ] **Step 8: 更新 `src/prerender/routes.test.ts`**

把 `expect(PRERENDER_PATHS).toContain('/en/reference/multiplication-chart/');` 换成一串新路径断言：

```ts
    expect(PRERENDER_PATHS).toContain('/en/');
    expect(PRERENDER_PATHS).toContain('/en/math/');
    expect(PRERENDER_PATHS).toContain('/en/science/');
    expect(PRERENDER_PATHS).toContain('/en/english/');
    expect(PRERENDER_PATHS).toContain('/en/math/multiplication-chart/');
```

（原文件已有一行 `expect(PRERENDER_PATHS).toContain('/en/');`，替换时不要重复。）长度断言 `expect(PRERENDER_PATHS).toHaveLength(1 + 10 + kpCount + ENGLISH_ROUTE_PATHS.length)` 与新「无重复」断言**保持不变**。

- [ ] **Step 9: 改 `src/components/reference/RelatedCharts.tsx` 的链接**

把 `href={referencePath(page.slug)}` 改成：

```tsx
              href={referencePath(page.category, page.slug)}
```

- [ ] **Step 10: 改 `ReferencePage.tsx` 的面包屑与 404 判据**

把 `const { slug } = useParams<{ slug: string }>();` 与紧随的两行换成：

```tsx
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const candidate =
    category && slug && isReferenceCategory(category) ? getReferencePage(slug) : undefined;
  // 学科必须与 URL 一致，否则 /en/math/irregular-verbs/ 会产出同一份内容的第二个 URL。
  const page = candidate && candidate.category === category ? candidate : undefined;
```

把 import 行 `import { ENGLISH_HOME } from '../../reference-routes';` 换成：

```tsx
import { categoryPath, ENGLISH_HOME, isReferenceCategory } from '../../reference-routes';
```

把面包屑里 `<a …>{ENGLISH_HOME}</a>` 之后补上学科层（插在 `</nav>` 之前）：

```tsx
        <span className="mx-2">/</span>
        <a href={categoryPath(page.category)} className="hover:text-[#1F2329] transition-colors">
          {CATEGORY_COPY[page.category].name}
        </a>
```

并在 import 区加上：

```tsx
import { CATEGORY_COPY } from '../../data/reference/en/categories';
```

把右上角那个 `<span … capitalize print:hidden>{page.category}</span>` 的内容换成 `{CATEGORY_COPY[page.category].name}`，并去掉 `capitalize` 类（不再需要）。

文档注释里的「一张可打印的参考图表」之上补一行路径说明：

```tsx
/**
 * `/en/:category/:slug` —— 一张可打印的参考图表。
```

- [ ] **Step 11: 写失败测试 `ReferencePage.test.tsx`（改成新路由与 404 判据）**

把 `renderChart` 里的路由与用例路径换成新结构，并补三个 404 用例：

```tsx
function renderChart(url: string) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/en/:category/:slug" element={<ReferencePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
```

用例路径全部由 `/en/reference/<slug>` 改为 `/en/<category>/<slug>`：
`/en/math/multiplication-chart`、`/en/math/trigonometric-identities`、`/en/english/irregular-verbs`。

「links to the related charts」用例的选择器改为：

```tsx
    expect(section?.querySelector('a[href="/en/math/squares-cubes-roots/"]')).toBeTruthy();
```

「404s on an unknown slug」用例路径改为 `/en/math/no-such-chart`，并追加两条：

```tsx
  it('404s when the slug belongs to a different category', () => {
    renderChart('/en/math/irregular-verbs');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });

  it('404s on an unknown category', () => {
    renderChart('/en/legacy/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
```

- [ ] **Step 12: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferencePage.test.tsx`
Expected: PASS（8 个用例）

- [ ] **Step 13: 写失败测试 `ReferenceCategory.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceCategory } from './ReferenceCategory';

function renderHub(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/en/:category" element={<ReferenceCategory />} />
      </Routes>
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceCategory hub', () => {
  it('lists every chart in the category', () => {
    renderHub('/en/math');
    expect(links()).toContain('/en/math/multiplication-chart/');
    expect(links()).toContain('/en/math/metric-conversions/');
    expect(links()).not.toContain('/en/science/physics-constants/');
  });

  it('shows the category name as the page heading and its intro', () => {
    renderHub('/en/math');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
    expect(screen.getByText(/Printable maths reference charts/)).toBeTruthy();
  });

  it('lists the single chart in a sparse category', () => {
    renderHub('/en/english');
    expect(links()).toContain('/en/english/irregular-verbs/');
  });

  it('404s on an unknown category', () => {
    renderHub('/en/legacy');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
```

- [ ] **Step 14: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferenceCategory.test.tsx`
Expected: FAIL — `Failed to resolve import "./ReferenceCategory"`

- [ ] **Step 15: 写 `ReferenceCategory.tsx`**

```tsx
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { pagesInCategory } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { ENGLISH_HOME, isReferenceCategory, referencePath } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';

/** `/en/:category` —— 一个学科的图表 hub，同时是该科图表的内链枢纽。 */
export function ReferenceCategory(): ReactElement {
  const { category } = useParams<{ category: string }>();

  if (!category || !isReferenceCategory(category)) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const copy = CATEGORY_COPY[category];
  const pages = pagesInCategory(category);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="text-sm text-[#646A73]">
        <a href={ENGLISH_HOME} className="hover:text-[#1F2329] transition-colors">
          All charts
        </a>
      </nav>

      <section className="mt-4">
        <h1 className="text-3xl font-bold text-[#1F2329]">{copy.name}</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">{copy.intro}</p>
      </section>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.category, page.slug)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-lg font-bold text-[#1F2329]">{page.title}</h2>
              <p className="mt-2 text-sm text-[#646A73]">{page.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
```

- [ ] **Step 16: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferenceCategory.test.tsx`
Expected: PASS（4 个用例）

- [ ] **Step 17: 写失败测试 `ReferenceIndex.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceIndex } from './ReferenceIndex';

function renderIndex() {
  return render(
    <MemoryRouter>
      <ReferenceIndex />
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceIndex', () => {
  it('links to each of the three category hubs', () => {
    renderIndex();
    expect(links()).toContain('/en/math/');
    expect(links()).toContain('/en/science/');
    expect(links()).toContain('/en/english/');
  });

  it('does not list individual charts', () => {
    renderIndex();
    expect(links()).not.toContain('/en/math/multiplication-chart/');
  });

  it('keeps a landing heading and intro', () => {
    renderIndex();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Printable Study Reference');
    expect(screen.getByText(/Free, printable reference charts for students/)).toBeTruthy();
  });
});
```

- [ ] **Step 18: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferenceIndex.test.tsx`
Expected: FAIL — 仍在链接单张图表，且没有 `/en/science/`

- [ ] **Step 19: 重写 `ReferenceIndex.tsx`**

```tsx
import type { ReactElement } from 'react';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { categoryPath, REFERENCE_CATEGORIES } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页：站点简介 + 三个学科入口。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers. Pick a subject to see
          every chart — open one and print it in a single click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_CATEGORIES.map((category) => {
          const copy = CATEGORY_COPY[category];
          return (
            <li key={category}>
              <a
                href={categoryPath(category)}
                className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-lg font-bold text-[#1F2329]">{copy.name}</h2>
                <p className="mt-2 text-sm text-[#646A73]">{copy.summary}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </ReferenceLayout>
  );
}
```

- [ ] **Step 20: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferenceIndex.test.tsx`
Expected: PASS（3 个用例）

- [ ] **Step 21: 更新三处受 URL 变更影响的既有测试**

`src/entry-server.test.tsx` 的最后一条用例：

```tsx
  it('renders the English surface with real English content', () => {
    expect(render('/en')).toContain('Printable Study Reference');
    expect(render('/en/math/multiplication-chart')).toContain('Multiplication Chart');
  });
```

`src/App.test.tsx` 里那条旧路径用例：

```tsx
  it('serves an English reference chart at /en/:category/:slug', () => {
    renderApp('/en/math/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Multiplication Chart (1–12)');
  });
```

`src/ads/adPlacements.test.tsx` 的图表页用例：

```tsx
  it('shows one ad on an English reference chart', () => {
    const { container } = renderAt(
      '/en/math/multiplication-chart',
      '/en/:category/:slug',
      <ReferencePage />,
    );
    expect(adCount(container)).toBe(1);
  });
```

- [ ] **Step 22: 类型检查与全量测试**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npm test`
Expected: 全绿。`src/i18n/languages.test.ts` 与 `src/prerender/inject.test.ts` 用 `/en/reference/...` 只是**字面量样例**（前者测语言前缀剥离、后者测路径转文件名），对新结构同样成立，**不需要改**。

- [ ] **Step 23: 提交**

```bash
git add -A src/data/reference/en/categories.ts src/reference-routes.ts src/reference-routes.test.ts src/seo/content-en.ts src/seo/meta.test.ts src/prerender/routes.test.ts src/components/reference src/entry-server.test.tsx src/App.test.tsx src/ads/adPlacements.test.tsx
git commit -m "$(cat <<'EOF'
feat(reference): URL 分层到学科，新增学科 hub 页

/en/math/multiplication-chart/ 取代 /en/reference/multiplication-chart/，
新增 /en/{math,science,english}/ 三个学科 hub 作为该科图表的内链枢纽。
/en/ 从「列全量图表」收敛为「三张学科卡」——100 页铺开后前者会变成噪声墙。

学科与 URL 不一致时（如 /en/math/irregular-verbs/）返回未找到态，
避免同一页在多个路径下产出重复内容。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: 路由接线

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `ENGLISH_HOME`（Task 4）、`ENGLISH_CATEGORY_ROUTE`（Task 5）、`ENGLISH_REFERENCE_ROUTE`（Task 5）；`ReferenceIndex`（Task 5）、`ReferenceCategory`（Task 5）、`ReferencePage`（Task 5）
- Produces: 无（应用级接线）

`App.tsx` 里 `ENGLISH_REFERENCE_ROUTE` 是直接从路由表读的，所以 Task 5 已经把图表页路由切到新形状并生效。本任务只补学科 hub 那一条。

- [ ] **Step 1: 加 `App.test.tsx` 的 hub 用例**

在已有的英文用例之间插入：

```tsx
  it('serves an English category hub at /en/:category', () => {
    renderApp('/en/math');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
  });
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — `/en/math` 无匹配路由

- [ ] **Step 3: 改 `App.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';
import { ReferenceCategory } from './components/reference/ReferenceCategory';
import { ReferenceIndex } from './components/reference/ReferenceIndex';
import { ReferencePage } from './components/reference/ReferencePage';
import {
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
} from './reference-routes';
import { VIEW_PATHS } from './view-routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {Object.values(VIEW_PATHS).map((path) => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path={ENGLISH_HOME} element={<ReferenceIndex />} />
      <Route path={ENGLISH_CATEGORY_ROUTE} element={<ReferenceCategory />} />
      <Route path={ENGLISH_REFERENCE_ROUTE} element={<ReferencePage />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS（7 个用例）

- [ ] **Step 5: 全量测试、lint 与构建**

Run: `npm test`
Expected: 全绿

Run: `npm run lint`
Expected: 无错误

Run: `npm run build`
Expected: 结束于 `prerendered N pages (+ robots.txt, sitemap.xml)`

Run: `ls dist/en/ && ls dist/en/math/`
Expected: 第一行有 `index.html`、`math/`、`science/`、`english/`；第二行有 `index.html` 与 `multiplication-chart/`

Run: `grep -c "en/math/multiplication-chart" dist/sitemap.xml`
Expected: ≥ 1

Run: `grep -c "en/reference" dist/sitemap.xml`
Expected: 0

- [ ] **Step 6: 确认构建产物不进 git**

Run: `git status --short`
Expected: 只有源码改动与 `.gitignore`（`dist/`、`dist-ssr/`、`.superpowers/` 均已忽略）

- [ ] **Step 7: 提交**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "$(cat <<'EOF'
feat(reference): 学科 hub 路由接线到 App

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Worker 旧 URL 301 与 `/en/` 真 404

本任务做两件事，都属 Section 2「迁移」与「`:category` 校验收敛成真 404」的落地：

1. 旧 `/en/reference/*` 301 到新路径。
2. `/en/` 前缀下关闭 SPA 兜底——英文面每一条合法路径都有预渲染产物，因此缺产物就是真的不存在。**不改这一条的话，`/en/typo/` 会命中兜底返回 200 + 应用外壳，等于给 Google 一张软 404 空页。** 中文站行为不变。

**Files:**
- Modify: `worker/lib/redirect.ts`
- Modify: `worker/lib/redirect.test.ts`
- Modify: `worker/lib/static-paths.ts`
- Modify: `worker/lib/static-paths.test.ts`
- Modify: `worker/index.ts`

**Interfaces:**
- Consumes: 无（worker 是独立编译边界，不 import `src/`）
- Produces:
  - `legacyReferenceRedirect(url: URL): string | null`
  - `assetCandidates(pathname: string): string[]`（行为变更：`/en/` 前缀下不再回退 `/index.html`）

- [ ] **Step 1: 写失败测试（redirect）**

把 `worker/lib/redirect.test.ts` 的 import 行改成：

```ts
import { hostRedirect, legacyReferenceRedirect, legacyViewRedirect } from './redirect';
```

在文件末尾追加：

```ts
describe('legacyReferenceRedirect', () => {
  it('moves a flat chart URL under its category', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/multiplication-chart/')),
    ).toBe('https://syy.global/en/math/multiplication-chart/');
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/physics-constants')),
    ).toBe('https://syy.global/en/science/physics-constants/');
  });

  it('covers every chart that existed before the move', () => {
    const slugs = [
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
      'physics-constants',
      'irregular-verbs',
    ];
    for (const slug of slugs) {
      const target = legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`));
      expect(target).toMatch(/^https:\/\/syy\.global\/en\/(math|science|english)\//);
    }
  });

  it('ignores paths outside the legacy prefix', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/math/multiplication-chart/')),
    ).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/nope/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/tutorial'))).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run worker/lib/redirect.test.ts`
Expected: FAIL — `legacyReferenceRedirect is not a function`

- [ ] **Step 3: 在 `worker/lib/redirect.ts` 里实现**

追加：

```ts
/**
 * 图表迁到学科分层 URL 之前的历史 slug→学科映射。
 *
 * 这是一份**冻结的历史记录**：这六个 URL 在 2026-10 之前对外发布过，写完就再也不会
 * 增长。所以它是字面量，且刻意不从 `src/data/reference` 导入——worker 不在任何
 * tsconfig 的 include 里（`tsconfig.app.json` 只含 `src`），为六个常量把它绑到 src
 * 的整个模块图上不划算。
 */
const LEGACY_REFERENCE_CATEGORY: Record<string, string> = {
  'multiplication-chart': 'math',
  'squares-cubes-roots': 'math',
  'trigonometric-identities': 'math',
  'metric-conversions': 'math',
  'physics-constants': 'science',
  'irregular-verbs': 'english',
};

export function legacyReferenceRedirect(url: URL): string | null {
  const match = /^\/en\/reference\/([^/]+)\/?$/.exec(url.pathname);
  if (!match) return null;
  const category = LEGACY_REFERENCE_CATEGORY[match[1]];
  if (!category) return null;
  return `${url.origin}/en/${category}/${match[1]}/`;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run worker/lib/redirect.test.ts`
Expected: PASS（**8 个用例**：原有 5 个 + 新增 3 个）

- [ ] **Step 5: 写失败测试（static-paths）**

在 `worker/lib/static-paths.test.ts` 的 `describe('assetCandidates')` 里追加两条：

```ts
  it('does not fall back to the app shell under the prerendered /en/ surface', () => {
    expect(assetCandidates('/en/math/multiplication-chart')).toEqual([
      '/en/math/multiplication-chart/index.html',
    ]);
    expect(assetCandidates('/en/typo')).toEqual(['/en/typo/index.html']);
    expect(assetCandidates('/en')).toEqual(['/en/index.html']);
  });

  it('keeps the app-shell fallback for the Chinese app', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/unknown')).toEqual(['/unknown/index.html', '/index.html']);
  });
```

- [ ] **Step 6: 跑测试确认失败**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: FAIL — `/en/typo` 仍返回两个候选

- [ ] **Step 7: 改 `worker/lib/static-paths.ts`**

```ts
const SEO_FILES = new Set(['/robots.txt', '/sitemap.xml']);

/**
 * 全量预渲染的语言面。这些前缀下每一条合法路径都有自己的目录索引，所以不需要
 * 回退到应用外壳——回退会把一个 URL 拼写错误变成 200 + 空壳，即软 404。
 * 与 `KNOWN_VIEWS`（redirect.ts）一样是字面量：新增语言面时两处都要改。
 */
const PRERENDERED_SURFACES = ['/en'];

/** Site files that must be served verbatim, never masked by the SPA fallback. */
export function isSeoFile(pathname: string): boolean {
  return SEO_FILES.has(pathname);
}

function isPrerenderedSurface(dir: string): boolean {
  return PRERENDERED_SURFACES.some((surface) => dir === surface || dir.startsWith(`${surface}/`));
}

export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  if (isPrerenderedSurface(dir)) return [`${dir}/index.html`];
  return [`${dir}/index.html`, '/index.html'];
}
```

- [ ] **Step 8: 跑测试确认通过**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: PASS

- [ ] **Step 9: 接进 `worker/index.ts`**

import 行改为：

```ts
import { hostRedirect, legacyReferenceRedirect, legacyViewRedirect } from './lib/redirect';
```

fetch 里的重定向两行：

```ts
    const redirect = hostRedirect(url) ?? (request.method === 'GET' ? legacyViewRedirect(url) : null);
```

改为：

```ts
    const legacyRedirect =
      request.method === 'GET' ? (legacyReferenceRedirect(url) ?? legacyViewRedirect(url)) : null;
    const redirect = hostRedirect(url) ?? legacyRedirect;
```

- [ ] **Step 10: 把 `serveStatic` 的兜底响应换成可看的 404 页**

在文件里 `normalizeOrigin` 之前加：

```ts
/** 404 响应体。刻意不用应用外壳——软 404 会被爬虫当作可索引的薄页面。 */
function notFoundBody(): string {
  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Page not found</title>',
    '</head><body><h1>Page not found</h1>',
    '<p>This page does not exist. <a href="/en/">Browse the reference charts</a>.</p>',
    '</body></html>',
  ].join('');
}
```

把 `serveStatic` 最后一行

```ts
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
```

换成

```ts
  return new Response(notFoundBody(), {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
```

- [ ] **Step 11: 跑 worker 测试**

Run: `npx vitest run worker/`
Expected: PASS

- [ ] **Step 12: 端到端验证**

Run: `npm run build && npx wrangler dev worker/index.ts`（另开一个终端）

```bash
curl -sI  http://localhost:8787/en/reference/multiplication-chart/ | head -2
# 期望：HTTP/1.1 301 + location: http://localhost:8787/en/math/multiplication-chart/

curl -sI  http://localhost:8787/en/math/multiplication-chart/ | head -1
# 期望：HTTP/1.1 200

curl -s   http://localhost:8787/en/math/multiplication-chart/ | grep -c "Multiplication Chart (1–12)"
# 期望：≥ 1

curl -sI  http://localhost:8787/en/typo/ | head -1
# 期望：HTTP/1.1 404

curl -sI  http://localhost:8787/en/ | head -1
# 期望：HTTP/1.1 200

curl -sI  http://localhost:8787/tutorial/ | head -1
# 期望：HTTP/1.1 200（中文站兜底行为不变）
```

- [ ] **Step 13: 提交**

```bash
git add worker/ .gitignore
git commit -m "$(cat <<'EOF'
feat(worker): 旧 /en/reference/* 301 到学科分层路径，/en/ 下关闭 SPA 兜底

英文面每条合法路径都有预渲染产物，回退到应用外壳会把 URL 拼写错误
变成 200 + 空壳的软 404。中文站兜底行为不变。

六个历史 slug→学科是冻结的字面量，刻意不从 src 导入——worker 是
独立编译边界。

顺手把 .superpowers/ 加进 .gitignore：SDD 工作区是 git-ignored scratch，
本仓库先前没忽略它。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## 完成标准

全部任务完成后应当满足：

- `npm test` 全绿
- `npm run lint` 无错误
- `npm run build` 成功，输出包含 `/en/`、`/en/{math,science,english}/`、六张图表页
- `dist/sitemap.xml` 含全部英文面 URL，且**不含**任何 `en/reference`
- `curl` 验证：旧 `/en/reference/*` → 301，新路径 → 200 且 HTML 内含 H1，`/en/typo/` → 404，中文站路径行为不变
- `src/data/reference.ts` 已删除，全仓库无 `getReferenceTable` / `REFERENCE_TABLES` / `REFERENCE_SLUGS` 残留
- 图表页渲染顺序为 面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related，且恰好 1 个 AdUnit

## 已知限制（本计划不处理，需在后续计划中收口）

- **客户端未找到态仍是 200。** Worker 层已经把 `/en/` 下的缺产物变成真 404，但如果用户从已加载的页面里做客户端跳转到 `/en/typo/`，React Router 会渲染未找到组件而不改 HTTP 状态。这不会产生可索引的 URL（该 URL 直连时返回 404），但严格来说仍是软 404。彻底修需要客户端路由拦截。
- **`ReferenceNotFound` 没有 `noindex`。** 该组件所在页面直连时已经是 404，无需额外标记；若将来出现 200 态的未找到页面再补。
- **`src/i18n/languages.test.ts` 与 `src/prerender/inject.test.ts` 仍以 `/en/reference/...` 作为样例字符串。** 两者测的都是路径的通用变换（语言前缀剥离 / 路径转文件名），对新结构同样成立，所以刻意不改——改了只是噪声。

## 不在本计划范围内

- **阶段 C（SEO 补完）**：`PageContent.kind` 扩展、`LearningResource` / `FAQPage` / `CollectionPage` JSON-LD、标题模板加 "Printable"、og:image 管线、GA4 与同意模式。本计划里 hub 页与图表页仍然走 `kind: 'view'`，`<title>` 仍是 `{title} - {brand}` 旧格式——这是刻意的中间状态。
- **阶段 D（合规与变现）**：合规八页、`AD_SLOTS` 占位槽位改 `null`、图表页第二个广告位。
- **阶段 E（内容扩充）**：6 页 → 100 页。`en/english.ts` 的 `related: []` 与 science/english 两个 hub 各只有 1 张卡，都是当前内容量的反映，靠扩充内容自然解决。
