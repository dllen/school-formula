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
- Consumes: `Block`、`ReferencePage`（Task 1）；`multiplicationRows`、`squaresCubesRootsRows`（Task 1）；`metricConversionGroups`、`ConversionGroupKey`、`physicalConstants`（Task 1）；`range`（Task 1）
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

`summary` 与 `description` 以**旧文案为种子**，但必须**落在长度目标内**（`summary` 60–90 字符、`description` 150–160 字符）：旧文案是 47–56 / 117–142，普遍填不满搜索结果摘要。扩写只准补充真实存在的价值点（可自由打印、无需注册、可单页打印等），不得夸大或承诺不提供的功能（例如不得写 PDF 下载）。`intro` / `howToUse` / `faq` / `related` 为新增，不受此影响。

**下面代码块里的字符串是种子，不是最终稿。** 长度以 Step 7 的测试为准——边界就是目标本身、不留余量。跑测试，把报错的那几条改到区间内，直到全绿。**别靠目测数数**：这份计划在长度上已经错过两次，测试才是裁判。

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

  // 边界就是目标本身（summary 60–90、description 150–160），一点余量都不留。
  // 前两版都死在「留点余量」上：40/100 盖住了 47–56 / 117–142 的缺口，
  // 148/165 又放过了 161 的超长值。有余量就等于没有约束。
  it('holds summary and description inside the SEO length targets', () => {
    for (const page of REFERENCE_PAGES_EN) {
      expect(page.summary.length).toBeGreaterThanOrEqual(60);
      expect(page.summary.length).toBeLessThanOrEqual(90);
      expect(page.description.length).toBeGreaterThanOrEqual(150);
      expect(page.description.length).toBeLessThanOrEqual(160);
    }
  });

  it('holds intro inside the target length', () => {
    for (const page of REFERENCE_PAGES_EN) {
      const words = page.intro.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(80);
      expect(words).toBeLessThanOrEqual(120);
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

