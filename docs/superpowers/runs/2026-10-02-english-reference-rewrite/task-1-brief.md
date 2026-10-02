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
  - `metricConversionGroups(): ConversionGroup[]`，其中 `ConversionGroupKey = 'length' | 'mass' | 'time'`、`ConversionGroup = { key: ConversionGroupKey; entries: string[] }`
  - `physicalConstants(): PhysicalConstant[]`，其中 `PhysicalConstant = { symbol: string; value: string; alternate?: string }`

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
      // row 形状是 [n, n², n³, √n]，所以「平方回 n」要拿 row[0] 比，不是 row[1]。
      if (Number.isInteger(root)) expect(root * root).toBe(Number(row[0]));
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

