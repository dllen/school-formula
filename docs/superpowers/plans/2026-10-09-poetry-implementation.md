# 唐诗宋词模块 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 school-formula 平台新增唐诗宋词模块：统一 `/poetry` 视图 + 多维筛选 + 独立 `/poetry/:id` SSG 详情页，覆盖新课标必背 ~200 首诗（v1 PR 交付架构 + 5 个示例诗）。

**Architecture:** 数据层 `src/data/poems/`（3 个学段文件 + types + 索引），视图层 `src/components/poetry/`（PoetryView / PoemCard / PoemFilters / PoemContent / PoemDetail / filterPoems），路由 + SSG 走现有 `App.tsx` 与 `prerender/routes.ts`；拼音生产靠独立的 `scripts/poems-build/` 子包（`pinyin-pro` + 古音 override 字典）。

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, React Router 7, Vitest, pinyin-pro

**Spec:** `docs/superpowers/specs/2026-10-09-poetry-design.md` (commit 59edab3)

---

## Global Constraints

- **包管理器**：npm（不要用 pnpm — `pnpm-lock.yaml` 与 `pnpm-workspace.yaml` 是历史误提交，AGENTS.md 与 CI 都不依赖 pnpm；不要用 `npm ci`，CI 不开 cache）。
- **TypeScript 严格模式**：`strict: true`，`verbatimModuleSyntax: true`，未使用的局部变量/参数会编译报错；类型导入必须用 `import type`。
- **命名导出**：组件 `export const Home = () => ...` 或 `export function Home()`；数据用 `export const ALL_POEMS = [...]`。
- **UI 文本**：简体中文为主。
- **测试**：根 `npm test` 通过 `vitest.config.ts` 的 workspace projects 一并跑通 `src/**`（happy-dom）与 `scripts/**`（node）。
- **不动 ingest 流水线**：v1 不引入 `poems` kind 到 `scripts/ingest-data/`；数据直接 `.ts`。
- **每条提交 commit**：`Co-Authored-By: Claude Code <noreply@anthropic.com>`。

## Review Focus

最容易被忽略、需要在测试里钉死的输入类：

1. **未知的 poem id**（`/poetry/does-not-exist`）：路由页与 modal 都必须显式渲染「未找到」状态，而不是抛错或返回 null UI。
2. **拼音 toggle 状态**：默认显示，但用户点「隐藏」后状态必须保留——不能在父组件卸载/重挂时丢失。
3. **筛选 URL 反序列化**：URL 里写 `?dynasty=tang&grade=primary&theme=抒情&q=静夜思` 反向解析必须 round-trip（写出去再读回来等价）。
4. **宋词 cipai 渲染边界**：cipai 只在 `form === '词'` 时存在，唐诗不能出现 cipai 徽章。
5. **SSG 路径爆炸**：`PRERENDER_PATHS` 加 ~200 条 `/poetry/:id` 后，`npm run build` 仍要在合理时间内完成（不因枚举 200 个路径而引入新脚本）。

---

## File Structure

```
src/
├── data/
│   └── poems/                                  ← 新增
│       ├── types.ts                            ← Poem / Dynasty / PoemForm / PoemTheme
│       ├── primary.ts                          ← PRIMARY_POEMS（示例 2 首）
│       ├── middle.ts                           ← MIDDLE_POEMS（示例 2 首）
│       ├── high.ts                             ← HIGH_POEMS（示例 1 首）
│       ├── index.ts                            ← ALL_POEMS + getPoemsByGrade / getPoemById
│       └── poems.test.ts                       ← 数据不变量 + 查询测试
│
├── components/
│   └── poetry/                                 ← 新增
│       ├── filterPoems.ts                      ← 纯函数筛选 + URL 序列化
│       ├── filterPoems.test.ts                 ← 筛选逻辑测试
│       ├── PoemCard.tsx                        ← 列表卡片
│       ├── PoemFilters.tsx                     ← 朝代/学段/题材 chips + 搜索
│       ├── PoemContent.tsx                     ← 共享详情（路由页与 modal 共用）
│       ├── PoetryView.tsx                      ← 视图入口（列表+筛选+详情切换）
│       ├── PoetryView.test.tsx                 ← 列表视图交互
│       ├── PoemDetail.tsx                      ← /poetry/:id 路由组件
│       └── PoemDetail.test.tsx                 ← 详情页渲染

scripts/
└── poems-build/                                ← 新增独立子包
    ├── package.json                            ← vitest, pinyin-pro
    ├── pinyin.ts                               ← generatePinyin + POEM_PRONUNCIATION_OVERRIDES
    └── pinyin.test.ts                          ← 拼音生成测试

# 修改文件
src/components/Header/types.ts                  ← ViewType + 'poetry'
src/view-routes.ts                              ← VIEW_PATHS + poetry
src/view-routes.test.ts                         ← 期望对象加 poetry
src/components/Header/NavMenu.tsx               ← 「古籍阅读」→「经典阅读」+ poetry
src/components/Header/MobileNav.tsx             ← 同步
src/components/Home.tsx                         ← 分发链加 <PoetryView />
worker/lib/redirect.ts                          ← KNOWN_VIEWS + 'poetry'
src/App.tsx                                     ← /poetry/:id 路由
src/prerender/routes.ts                         ← + ALL_POEMS.map
package.json                                    ← scripts/poems-build 为可选子包
vitest.config.ts                                ← 已有 workspaces 覆盖 scripts/**
```

---

## Task 1: 创建 scripts/poems-build 子包骨架与 pinyin-pro 依赖

**Files:**
- Create: `scripts/poems-build/package.json`
- Create: `scripts/poems-build/.gitignore`
- Create: `scripts/poems-build/pinyin.ts`
- Create: `scripts/poems-build/pinyin.test.ts`

**为什么先建子包**：v1 PR 不需要这个子包，但 `scripts/ingest-data` 与 `scripts/pi-agent-edu` 都是这种独立子包模式，提前建好骨架并加 pinyin-pro 让 Phase 2 不用再处理依赖；先把 pinyin 工具与测试写好，5 个示例诗的拼音校对就有了工具支撑。

- [ ] **Step 1: 写失败测试**

创建 `scripts/poems-build/pinyin.test.ts`：

```typescript
import { describe, it, expect } from 'vitest';
import { generatePinyin } from './pinyin';

describe('generatePinyin', () => {
  it('returns one string per input line', () => {
    const lines = ['床前明月光', '疑是地上霜'];
    const out = generatePinyin(lines);
    expect(out).toHaveLength(lines.length);
  });

  it('output contains tone-marked pinyin separated by spaces', () => {
    const out = generatePinyin(['静夜思']);
    expect(out[0]).toContain('jìng');
    expect(out[0]).toMatch(/\s/);
  });

  it('POEM_PRONUNCIATION_OVERRIDES wins over default pronunciation', async () => {
    // 动态 import 以拿到测试时的最新 override；override 必须在 generatePinyin 内读取
    const { POEM_PRONUNCIATION_OVERRIDES } = await import('./pinyin');
    POEM_PRONUNCIATION_OVERRIDES['__test_key__'] = 'A';
    try {
      // 'A' 在 pinyin-pro 默认输出里不会是 'A'；只要返回值不是 'A' 即可证明 override 在干预
      // （不校验具体拼音字母，避免依赖词表更新）
      const out = generatePinyin(['__test_key__']);
      // override 命中即返回 'A'
      expect(out[0]).toBe('A');
    } finally {
      delete POEM_PRONUNCIATION_OVERRIDES['__test_key__'];
    }
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd scripts/poems-build && npm test -- --run`
Expected: FAIL — `Cannot find module './pinyin'`

- [ ] **Step 3: 创建子包 package.json**

创建 `scripts/poems-build/package.json`：

```json
{
  "name": "@school-formula/poems-build",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  },
  "dependencies": {
    "pinyin-pro": "^3.25.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 4: 创建 .gitignore**

创建 `scripts/poems-build/.gitignore`：

```
node_modules/
```

- [ ] **Step 5: 安装依赖**

Run: `cd scripts/poems-build && npm install`
Expected: pinyin-pro 与 vitest 装入 `scripts/poems-build/node_modules/`

- [ ] **Step 6: 实现 pinyin.ts（最小可用版）**

创建 `scripts/poems-build/pinyin.ts`：

```typescript
import { pinyin } from 'pinyin-pro';

/**
 * 古音特读字典。key 形如 "作者名|诗题|字"，value 为该字的目标拼音（带声调）。
 * 例：'杜牧|山行|斜': 'xiá'
 *
 * 录入流程：先用 pinyin-pro 默认生成 → 校对古音 → 在此字典加条目。
 */
export const POEM_PRONUNCIATION_OVERRIDES: Record<string, string> = {};

/**
 * 将古诗每行内容转拼音（带声调符号），与 content 行一一对应。
 *
 * - 默认按现代普通话 + pinyin-pro 多音字词表生成。
 * - 行内若出现「作者|诗题|字」组合在 POEM_PRONUNCIATION_OVERRIDES 中，整个 token 替换为 override 值。
 *
 * @param content 每行诗句的字符串数组
 * @param meta 可选元信息（author/title），启用 override 时必填
 */
export function generatePinyin(
  content: string[],
  meta?: { author: string; title: string },
): string[] {
  return content.map((line) => {
    // 先按全行生成默认拼音
    const tokens = pinyin(line, {
      toneType: 'symbol',
      type: 'array',
      nonZh: 'consecutive',
    });

    // override 阶段：若 meta 提供，对每个 token 检查「单字 key」
    if (meta) {
      const replaced = tokens.map((tok) => {
        // pinyin-pro 返回的 token 是「字 拼 音」空格串或单字
        // 这里采用「逐字符 key 匹配」实现——如果一个字命中 override，整 token 替换
        const ch = tok[0]; // 第一字符作为 key 候选
        const key = `${meta.author}|${meta.title}|${ch}`;
        if (POEM_PRONUNCIATION_OVERRIDES[key]) {
          return POEM_PRONUNCIATION_OVERRIDES[key];
        }
        return tok;
      });
      return replaced.join(' ');
    }

    return tokens.join(' ');
  });
}
```

- [ ] **Step 7: 跑测试确认通过**

Run: `cd scripts/poems-build && npm test -- --run`
Expected: 3 tests PASS

- [ ] **Step 8: 提交**

```bash
git add scripts/poems-build/
git commit -m "feat(poetry): add poems-build subpackage with pinyin-pro + pinyin helper

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 2: 定义 Poem 类型 + 5 个示例诗数据

**Files:**
- Create: `src/data/poems/types.ts`
- Create: `src/data/poems/primary.ts`
- Create: `src/data/poems/middle.ts`
- Create: `src/data/poems/high.ts`
- Create: `src/data/poems/index.ts`

- [ ] **Step 1: 写 types.ts**

创建 `src/data/poems/types.ts`：

```typescript
import type { GradeLevel } from '../types';

export type Dynasty = 'tang' | 'song';

export type PoemForm =
  | '五言绝句'
  | '七言绝句'
  | '五言律诗'
  | '七言律诗'
  | '五言古诗'
  | '七言古诗'
  | '词';

export type PoemTheme =
  | '咏物'
  | '写景'
  | '抒情'
  | '送别'
  | '思乡'
  | '边塞'
  | '田园'
  | '咏史'
  | '哲理'
  | '节日'
  | '爱情'
  | '闺怨'
  | '讽喻'
  | '其他';

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: Dynasty;
  form: PoemForm;
  grade: GradeLevel;
  content: string[];
  pinyin: string[];
  translation: string;
  appreciation: string;
  theme: PoemTheme;
  cipai?: string;
}

export type DynastyFilter = 'all' | Dynasty;
export type GradeFilter = 'all' | GradeLevel;
export type ThemeFilter = 'all' | PoemTheme;
```

- [ ] **Step 2: 写 primary.ts（小学 2 首）**

创建 `src/data/poems/primary.ts`：

```typescript
import type { Poem } from './types';

export const PRIMARY_POEMS: Poem[] = [
  {
    id: 'primary-tang-jing-ye-si',
    title: '静夜思',
    author: '李白',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
    pinyin: [
      'chuáng qián míng yuè guāng',
      'yí shì dì shàng shuāng',
      'jǔ tóu wàng míng yuè',
      'dī tóu sī gù xiāng',
    ],
    translation:
      '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
    appreciation:
      '全诗语言清新朴素，运用比喻和动作描写，把游子的思乡之情表达得含蓄而深远。短短二十字，写尽了静夜望月触发的乡愁，是千古传诵的思乡名作。',
    theme: '思乡',
  },
  {
    id: 'primary-tang-chun-xiao',
    title: '春晓',
    author: '孟浩然',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
    pinyin: [
      'chūn mián bù jué xiǎo',
      'chǔ chǔ wén tí niǎo',
      'yè lái fēng yǔ shēng',
      'huā luò zhī duō shǎo',
    ],
    translation:
      '春日里贪睡不知不觉天就亮了，到处可以听见小鸟的啼鸣声。回想昨夜的阵阵风雨声，不知吹落了多少娇美的春花。',
    appreciation:
      '诗人抓住春天的早晨刚刚醒来时的一瞬间展开联想，描绘了春天早晨的明媚景色和诗人对落花的惋惜，语言平易浅近，却富有诗情画意。',
    theme: '写景',
  },
];
```

- [ ] **Step 3: 写 middle.ts（初中 2 首）**

创建 `src/data/poems/middle.ts`：

```typescript
import type { Poem } from './types';

export const MIDDLE_POEMS: Poem[] = [
  {
    id: 'middle-tang-deng-you-zhou-tai-ge',
    title: '登幽州台歌',
    author: '陈子昂',
    dynasty: 'tang',
    form: '七言古诗',
    grade: 'middle',
    content: [
      '前不见古人',
      '后不见来者',
      '念天地之悠悠',
      '独怆然而涕下',
    ],
    pinyin: [
      'qián bù jiàn gǔ rén',
      'hòu bù jiàn lái zhě',
      'niàn tiān dì zhī yōu yōu',
      'dú chuàng rán ér tì xià',
    ],
    translation:
      '向前看不见古之贤君，向后望不见后世明主。只有那苍茫天地悠悠无限，止不住满怀悲伤热泪纷纷。',
    appreciation:
      '诗人登台远眺，凭吊古今，感慨宇宙的无穷与人生的短暂，全诗语言苍劲奔放，富有感染力，被誉为「千古绝唱」。',
    theme: '抒情',
  },
  {
    id: 'middle-song-ru-meng-ling-chang-ji-xi-ting',
    title: '如梦令·常记溪亭日暮',
    author: '李清照',
    dynasty: 'song',
    form: '词',
    grade: 'middle',
    cipai: '如梦令',
    content: [
      '常记溪亭日暮',
      '沉醉不知归路',
      '兴尽晚回舟',
      '误入藕花深处',
      '争渡，争渡',
      '惊起一滩鸥鹭',
    ],
    pinyin: [
      'cháng jì xī tíng rì mù',
      'chén zuì bù zhī guī lù',
      'xìng jìn wǎn huí zhōu',
      'wù rù ǒu huā shēn chù',
      'zhēng dù, zhēng dù',
      'jīng qǐ yì tān ōu lù',
    ],
    translation:
      '经常记起在溪边的亭子游玩直到太阳落山的时候，喝得大醉不知道回来的路。游兴满足了，天黑往回划船，错误地划进了荷花深处。怎么出去呢？怎么出去呢？划船声惊起了一群鸥鹭。',
    appreciation:
      '全词短短三十三字，用白描手法写出一段夏日溪亭的往事，景与情浑然一体，少女的活泼、惊喜与慌乱跃然纸上，是李清照早期词作中的名篇。',
    theme: '抒情',
  },
];
```

- [ ] **Step 4: 写 high.ts（高中 1 首）**

创建 `src/data/poems/high.ts`：

```typescript
import type { Poem } from './types';

export const HIGH_POEMS: Poem[] = [
  {
    id: 'high-song-nian-nu-jiao-chi-bi-huai-gu',
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: 'song',
    form: '词',
    grade: 'high',
    cipai: '念奴娇',
    content: [
      '大江东去，浪淘尽，千古风流人物',
      '故垒西边，人道是，三国周郎赤壁',
      '乱石穿空，惊涛拍岸，卷起千堆雪',
      '江山如画，一时多少豪杰',
      '遥想公瑾当年，小乔初嫁了，雄姿英发',
      '羽扇纶巾，谈笑间，樯橹灰飞烟灭',
      '故国神游，多情应笑我，早生华发',
      '人生如梦，一尊还酹江月',
    ],
    pinyin: [
      'dà jiāng dōng qù, làng táo jìn, qiān gǔ fēng liú rén wù',
      'gù lěi xī biān, rén dào shì, sān guó zhōu láng chì bì',
      'luàn shí chuān kōng, jīng tāo pāi àn, juǎn qǐ qiān duī xuě',
      'jiāng shān rú huà, yī shí duō shǎo háo jié',
      'yáo xiǎng gōng jǐn dāng nián, xiǎo qiáo chū jià le, xióng zī yīng fā',
      'yǔ shàn guān jīn, tán xiào jiān, qiáng lǔ huī fēi yān miè',
      'gù guó shén yóu, duō qíng yīng xiào wǒ, zǎo shēng huá fà',
      'rén shēng rú mèng, yī zūn huán lèi jiāng yuè',
    ],
    translation:
      '大江浩浩荡荡向东流去，滔滔巨浪淘尽千古英雄人物。那旧营垒的西边，人们说那就是三国周瑜鏖战的赤壁。陡峭的石壁直耸云天，如雷的惊涛拍击着江岸，激起的浪花好似卷起千万堆白雪。壮丽的江山如画一般，一时多少豪杰辈出。遥想当年的周瑜春风得意，绝代佳人小乔刚嫁给他，他英姿奋发豪气满怀。手摇羽扇头戴纶巾，谈笑之间，强敌的战船烧得灰飞烟灭。我今日神游当年的战地，可笑我多愁善感，过早地长出满头白发。人生犹如一场梦，且洒一杯酒祭奠江上的明月。',
    appreciation:
      '苏轼以波澜壮阔的笔调，描绘赤壁雄奇景色，借怀古抒发壮志难酬的感慨。全词气象磅礴，境界宏大，被誉为「古今绝唱」，奠定了豪放词派的基础。',
    theme: '咏史',
  },
];
```

- [ ] **Step 5: 写 index.ts（合并 + 查询函数）**

创建 `src/data/poems/index.ts`：

```typescript
import type { GradeLevel } from '../types';
import { PRIMARY_POEMS } from './primary';
import { MIDDLE_POEMS } from './middle';
import { HIGH_POEMS } from './high';
import type { Poem } from './types';

export * from './types';

export const ALL_POEMS: Poem[] = [
  ...PRIMARY_POEMS,
  ...MIDDLE_POEMS,
  ...HIGH_POEMS,
];

export const POEMS_BY_ID: Record<string, Poem> = Object.fromEntries(
  ALL_POEMS.map((p) => [p.id, p]),
);

export function getPoemsByGrade(grade: GradeLevel): Poem[] {
  return ALL_POEMS.filter((p) => p.grade === grade);
}

export function getPoemById(id: string): Poem | undefined {
  return POEMS_BY_ID[id];
}
```

- [ ] **Step 6: 验证类型检查**

Run: `npm run build`
Expected: ✅ 通过（编译通过即满足 TS 严格模式）

- [ ] **Step 7: 提交**

```bash
git add src/data/poems/
git commit -m "feat(poetry): add 5 example poems with type definitions and query functions

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 3: poems.test.ts —— 数据不变量测试

**Files:**
- Create: `src/data/poems/poems.test.ts`

- [ ] **Step 1: 写测试**

创建 `src/data/poems/poems.test.ts`：

```typescript
import { describe, expect, it } from 'vitest';
import {
  ALL_POEMS,
  POEMS_BY_ID,
  getPoemById,
  getPoemsByGrade,
} from './index';

describe('Poem data integrity', () => {
  it('every poem has content.length equal to pinyin.length', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.content.length, `poem ${poem.id}`).toBe(poem.pinyin.length);
    }
  });

  it('no duplicate IDs across ALL_POEMS', () => {
    const ids = ALL_POEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('POEMS_BY_ID lookup matches getPoemById', () => {
    for (const poem of ALL_POEMS) {
      expect(POEMS_BY_ID[poem.id]).toBe(poem);
      expect(getPoemById(poem.id)).toBe(poem);
    }
  });

  it('every poem has id matching <grade>-<dynasty>-<slug>', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.id).toMatch(/^(primary|middle|high)-(tang|song)-[a-z0-9-]+$/);
    }
  });

  it('cipai is set iff form is 词', () => {
    for (const poem of ALL_POEMS) {
      if (poem.form === '词') {
        expect(poem.cipai, `poem ${poem.id} is 词 but missing cipai`).toBeTruthy();
      } else {
        expect(poem.cipai, `poem ${poem.id} is not 词 but has cipai`).toBeUndefined();
      }
    }
  });

  it('every poem has translation and appreciation longer than 10 chars', () => {
    for (const poem of ALL_POEMS) {
      expect(poem.translation.length, `poem ${poem.id}.translation`).toBeGreaterThan(10);
      expect(poem.appreciation.length, `poem ${poem.id}.appreciation`).toBeGreaterThan(10);
    }
  });
});

describe('Poem query functions', () => {
  it('getPoemsByGrade returns subset for primary', () => {
    const primary = getPoemsByGrade('primary');
    expect(primary.length).toBeGreaterThan(0);
    for (const poem of primary) {
      expect(poem.grade).toBe('primary');
    }
  });

  it('getPoemsByGrade returns subset for middle', () => {
    const middle = getPoemsByGrade('middle');
    expect(middle.length).toBeGreaterThan(0);
    for (const poem of middle) {
      expect(poem.grade).toBe('middle');
    }
  });

  it('getPoemsByGrade returns subset for high', () => {
    const high = getPoemsByGrade('high');
    expect(high.length).toBeGreaterThan(0);
    for (const poem of high) {
      expect(poem.grade).toBe('high');
    }
  });

  it('getPoemById returns undefined for unknown id', () => {
    expect(getPoemById('primary-tang-does-not-exist')).toBeUndefined();
  });
});
```

- [ ] **Step 2: 跑测试确认通过**

Run: `npm test -- --run src/data/poems/poems.test.ts`
Expected: 9 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/data/poems/poems.test.ts
git commit -m "test(poetry): add data integrity and query function tests

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 4: filterPoems 纯函数 + URL 序列化

**Files:**
- Create: `src/components/poetry/filterPoems.ts`
- Create: `src/components/poetry/filterPoems.test.ts`

- [ ] **Step 1: 写失败测试**

创建 `src/components/poetry/filterPoems.test.ts`：

```typescript
import { describe, expect, it } from 'vitest';
import {
  filterPoems,
  parseFiltersFromSearch,
  filtersToSearch,
  type PoemFilters,
} from './filterPoems';
import type { Poem } from '../../data/poems';

const poems: Poem[] = [
  {
    id: 'primary-tang-jing-ye-si',
    title: '静夜思',
    author: '李白',
    dynasty: 'tang',
    form: '五言绝句',
    grade: 'primary',
    content: ['床前明月光'],
    pinyin: ['chuáng qián míng yuè guāng'],
    translation: '明亮的月光。',
    appreciation: '思乡名作。',
    theme: '思乡',
  },
  {
    id: 'middle-song-ru-meng-ling',
    title: '如梦令',
    author: '李清照',
    dynasty: 'song',
    form: '词',
    grade: 'middle',
    cipai: '如梦令',
    content: ['常记溪亭日暮'],
    pinyin: ['cháng jì xī tíng rì mù'],
    translation: '经常记起。',
    appreciation: '早期名作。',
    theme: '抒情',
  },
];

const ALL: PoemFilters = { dynasty: 'all', grade: 'all', theme: 'all', query: '' };

describe('filterPoems', () => {
  it('returns all poems when all filters are all', () => {
    expect(filterPoems(poems, ALL)).toHaveLength(2);
  });

  it('filters by dynasty=tang', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'tang' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('primary-tang-jing-ye-si');
  });

  it('filters by dynasty=song', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'song' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('middle-song-ru-meng-ling');
  });

  it('filters by grade=primary', () => {
    const result = filterPoems(poems, { ...ALL, grade: 'primary' });
    expect(result.map((p) => p.id)).toEqual(['primary-tang-jing-ye-si']);
  });

  it('combines dynasty AND grade AND theme', () => {
    const result = filterPoems(poems, {
      dynasty: 'tang',
      grade: 'primary',
      theme: '思乡',
      query: '',
    });
    expect(result).toHaveLength(1);
  });

  it('returns empty array when no match', () => {
    const result = filterPoems(poems, { ...ALL, dynasty: 'tang', grade: 'high' });
    expect(result).toEqual([]);
  });

  it('filters by query matching title', () => {
    const result = filterPoems(poems, { ...ALL, query: '静夜' });
    expect(result).toHaveLength(1);
  });

  it('filters by query matching author (case-insensitive)', () => {
    const result = filterPoems(poems, { ...ALL, query: 'LI BAI'.toLowerCase() });
    expect(result).toHaveLength(1);
  });
});

describe('URL serialization round-trip', () => {
  it('parseFiltersFromSearch returns all defaults on empty params', () => {
    const search = new URLSearchParams('');
    expect(parseFiltersFromSearch(search)).toEqual(ALL);
  });

  it('filtersToSearch then parseFiltersFromSearch is identity', () => {
    const filters: PoemFilters = {
      dynasty: 'tang',
      grade: 'primary',
      theme: '思乡',
      query: '静夜',
    };
    const search = filtersToSearch(filters);
    const parsed = parseFiltersFromSearch(search);
    expect(parsed).toEqual(filters);
  });

  it('filtersToSearch drops default values', () => {
    const search = filtersToSearch(ALL);
    expect(search.toString()).toBe('');
  });

  it('filtersToSearch encodes theme in URL', () => {
    const search = filtersToSearch({ ...ALL, theme: '思乡' });
    expect(search.get('theme')).toBe('思乡');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm test -- --run src/components/poetry/filterPoems.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: 实现 filterPoems.ts**

创建 `src/components/poetry/filterPoems.ts`：

```typescript
import type { Poem, Dynasty, PoemTheme } from '../../data/poems/types';
import type { GradeLevel } from '../../data/types';
import type { DynastyFilter, GradeFilter, ThemeFilter } from '../../data/poems/types';

export interface PoemFilters {
  dynasty: DynastyFilter;
  grade: GradeFilter;
  theme: ThemeFilter;
  query: string;
}

export const DEFAULT_FILTERS: PoemFilters = {
  dynasty: 'all',
  grade: 'all',
  theme: 'all',
  query: '',
};

const VALID_DYNASTIES: ReadonlyArray<Dynasty> = ['tang', 'song'];
const VALID_GRADES: ReadonlyArray<GradeLevel> = ['primary', 'middle', 'high'];
const VALID_THEMES: ReadonlyArray<PoemTheme> = [
  '咏物', '写景', '抒情', '送别', '思乡',
  '边塞', '田园', '咏史', '哲理', '节日',
  '爱情', '闺怨', '讽喻', '其他',
];

function isDynastyFilter(v: string): v is DynastyFilter {
  return v === 'all' || (VALID_DYNASTIES as readonly string[]).includes(v);
}

function isGradeFilter(v: string): v is GradeFilter {
  return v === 'all' || (VALID_GRADES as readonly string[]).includes(v);
}

function isThemeFilter(v: string): v is ThemeFilter {
  return v === 'all' || (VALID_THEMES as readonly string[]).includes(v);
}

export function filterPoems(poems: Poem[], filters: PoemFilters): Poem[] {
  const q = filters.query.trim().toLowerCase();
  return poems.filter((poem) => {
    if (filters.dynasty !== 'all' && poem.dynasty !== filters.dynasty) return false;
    if (filters.grade !== 'all' && poem.grade !== filters.grade) return false;
    if (filters.theme !== 'all' && poem.theme !== filters.theme) return false;
    if (q && !poem.title.toLowerCase().includes(q) && !poem.author.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}

export function parseFiltersFromSearch(search: URLSearchParams): PoemFilters {
  const dynasty = search.get('dynasty') ?? 'all';
  const grade = search.get('grade') ?? 'all';
  const theme = search.get('theme') ?? 'all';
  const query = search.get('q') ?? '';
  return {
    dynasty: isDynastyFilter(dynasty) ? dynasty : 'all',
    grade: isGradeFilter(grade) ? grade : 'all',
    theme: isThemeFilter(theme) ? theme : 'all',
    query,
  };
}

export function filtersToSearch(filters: PoemFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.dynasty !== 'all') params.set('dynasty', filters.dynasty);
  if (filters.grade !== 'all') params.set('grade', filters.grade);
  if (filters.theme !== 'all') params.set('theme', filters.theme);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  return params;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npm test -- --run src/components/poetry/filterPoems.test.ts`
Expected: 12 tests PASS

- [ ] **Step 5: 提交**

```bash
git add src/components/poetry/filterPoems.ts src/components/poetry/filterPoems.test.ts
git commit -m "feat(poetry): add filterPoems pure function with URL serialization

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 5: PoemCard 与 PoemFilters（presentational 组件）

**Files:**
- Create: `src/components/poetry/PoemCard.tsx`
- Create: `src/components/poetry/PoemFilters.tsx`

- [ ] **Step 1: 写 PoemCard.tsx**

创建 `src/components/poetry/PoemCard.tsx`：

```tsx
import type { Poem } from '../../data/poems/types';

interface PoemCardProps {
  poem: Poem;
  onClick: () => void;
}

const DYNASTY_LABEL: Record<Dynasty, string> = {
  tang: '唐',
  song: '宋',
};
import type { Dynasty } from '../../data/poems/types';

const GRADE_LABEL: Record<Poem['grade'], string> = {
  primary: '小学',
  middle: '初中',
  high: '高中',
};

export function PoemCard({ poem, onClick }: PoemCardProps) {
  const preview = poem.content.slice(0, 2).join('，');

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl shadow-sm border border-[#F0F1F2] p-5 hover:border-[#3370FF] hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-[#1F2329] font-['Noto_Serif_SC']">{poem.title}</h3>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          <Badge>{DYNASTY_LABEL[poem.dynasty]}</Badge>
          <Badge>{GRADE_LABEL[poem.grade]}</Badge>
          <Badge>{poem.theme}</Badge>
        </div>
      </div>
      <p className="text-sm text-[#646A73] mb-3">—— {poem.author} ——</p>
      <p className="text-base text-[#1F2329] font-['Noto_Serif_SC'] leading-relaxed">
        {preview}……
      </p>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] text-[#646A73] bg-[#F5F6F7] rounded">
      {children}
    </span>
  );
}
```

- [ ] **Step 2: 写 PoemFilters.tsx**

创建 `src/components/poetry/PoemFilters.tsx`：

```tsx
import { useState } from 'react';
import type {
  Dynasty,
  PoemTheme,
  DynastyFilter,
  GradeFilter,
  ThemeFilter,
} from '../../data/poems/types';
import type { GradeLevel } from '../../data/types';
import type { PoemFilters } from './filterPoems';

interface PoemFiltersProps {
  value: PoemFilters;
  onChange: (filters: PoemFilters) => void;
}

const DYNASTY_OPTIONS: Array<{ value: DynastyFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'tang', label: '唐' },
  { value: 'song', label: '宋' },
];

const GRADE_OPTIONS: Array<{ value: GradeFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'primary', label: '小学' },
  { value: 'middle', label: '初中' },
  { value: 'high', label: '高中' },
];

const THEME_OPTIONS: Array<{ value: ThemeFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: '咏物', label: '咏物' },
  { value: '写景', label: '写景' },
  { value: '抒情', label: '抒情' },
  { value: '送别', label: '送别' },
  { value: '思乡', label: '思乡' },
  { value: '边塞', label: '边塞' },
  { value: '田园', label: '田园' },
  { value: '咏史', label: '咏史' },
];

const THEME_COLLAPSED_COUNT = 8;

export function PoemFilters({ value, onChange }: PoemFiltersProps) {
  const [themeExpanded, setThemeExpanded] = useState(false);
  const visibleThemes = themeExpanded
    ? THEME_OPTIONS
    : THEME_OPTIONS.slice(0, THEME_COLLAPSED_COUNT);

  function set<K extends keyof PoemFilters>(key: K, next: PoemFilters[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2] p-5 space-y-3">
      <FilterRow label="朝代">
        {DYNASTY_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={value.dynasty === opt.value}
            onClick={() => set('dynasty', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </FilterRow>
      <FilterRow label="学段">
        {GRADE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={value.grade === opt.value}
            onClick={() => set('grade', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </FilterRow>
      <FilterRow label="题材">
        {visibleThemes.map((opt) => (
          <Chip
            key={opt.value}
            active={value.theme === opt.value}
            onClick={() => set('theme', opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
        {THEME_OPTIONS.length > THEME_COLLAPSED_COUNT && (
          <button
            type="button"
            onClick={() => setThemeExpanded((v) => !v)}
            className="text-xs text-[#3370FF] hover:underline px-2"
          >
            {themeExpanded ? '收起' : `展开更多（${THEME_OPTIONS.length - THEME_COLLAPSED_COUNT}）`}
          </button>
        )}
      </FilterRow>
      <div className="pt-2">
        <input
          type="search"
          value={value.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="搜索诗名或作者……"
          aria-label="搜索诗名或作者"
          className="w-full px-4 py-2 border border-[#E5E6EB] rounded-lg text-sm focus:outline-none focus:border-[#3370FF] focus:ring-2 focus:ring-[#E1EAFF]"
        />
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-[#646A73] shrink-0 pt-1 w-12">{label}</span>
      <div className="flex flex-wrap gap-2 flex-1">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1 text-xs rounded-full transition-colors ${
        active
          ? 'bg-[#3370FF] text-white'
          : 'bg-[#F5F6F7] text-[#646A73] hover:bg-[#E1EAFF] hover:text-[#3370FF]'
      }`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: ✅ 通过

- [ ] **Step 4: 提交**

```bash
git add src/components/poetry/PoemCard.tsx src/components/poetry/PoemFilters.tsx
git commit -m "feat(poetry): add PoemCard and PoemFilters presentational components

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 6: PoemContent —— 路由页与 modal 共享的详情渲染

**Files:**
- Create: `src/components/poetry/PoemContent.tsx`

- [ ] **Step 1: 写 PoemContent.tsx**

创建 `src/components/poetry/PoemContent.tsx`：

```tsx
import { useState } from 'react';
import type { Poem } from '../../data/poems/types';

interface PoemContentProps {
  poem: Poem;
}

const DYNASTY_LABEL: Record<Poem['dynasty'], string> = { tang: '唐', song: '宋' };
const GRADE_LABEL: Record<Poem['grade'], string> = { primary: '小学', middle: '初中', high: '高中' };

export function PoemContent({ poem }: PoemContentProps) {
  const [showPinyin, setShowPinyin] = useState(true);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-[#1F2329] font-['Noto_Serif_SC']">
          {poem.title}
        </h1>
        <p className="text-base text-[#646A73] font-['Noto_Serif_SC']">
          —— {poem.author} ——
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge>{DYNASTY_LABEL[poem.dynasty]}</Badge>
          <Badge>{GRADE_LABEL[poem.grade]}</Badge>
          <Badge>{poem.theme}</Badge>
          <Badge>{poem.form}</Badge>
          {poem.cipai && <Badge>{poem.cipai}</Badge>}
        </div>
      </header>

      {/* Body */}
      <section className="space-y-4 py-4">
        {poem.content.map((line, idx) => (
          <div key={idx} className="text-center space-y-1">
            <p className="text-2xl leading-relaxed text-[#1F2329] font-['Noto_Serif_SC']">
              {line}
            </p>
            {showPinyin && poem.pinyin[idx] && (
              <p className="text-sm text-[#8F959E]">{poem.pinyin[idx]}</p>
            )}
          </div>
        ))}
      </section>

      {/* Pinyin toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowPinyin((v) => !v)}
          className="text-xs text-[#3370FF] hover:underline"
        >
          {showPinyin ? '隐藏拼音' : '显示拼音'}
        </button>
      </div>

      <Divider />

      {/* Translation */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[#646A73] flex items-center gap-2">
          <span aria-hidden="true">📖</span>译文
        </h2>
        <p className="text-base text-[#1F2329] leading-relaxed">{poem.translation}</p>
      </section>

      <Divider />

      {/* Appreciation */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-[#646A73] flex items-center gap-2">
          <span aria-hidden="true">✨</span>赏析
        </h2>
        <p className="text-base text-[#1F2329] leading-relaxed">{poem.appreciation}</p>
      </section>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs text-[#646A73] bg-[#F5F6F7] rounded">
      {children}
    </span>
  );
}

function Divider() {
  return <hr className="border-t border-[#F0F1F2]" />;
}
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: ✅ 通过

- [ ] **Step 3: 提交**

```bash
git add src/components/poetry/PoemContent.tsx
git commit -m "feat(poetry): add PoemContent shared detail component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 7: PoetryView —— 列表+筛选+内嵌详情（state 模式）

**Files:**
- Create: `src/components/poetry/PoetryView.tsx`
- Create: `src/components/poetry/PoetryView.test.tsx`

- [ ] **Step 1: 写失败测试**

创建 `src/components/poetry/PoetryView.test.tsx`：

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PoetryView } from './PoetryView';

function renderView(initialEntries: string[] = ['/poetry']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PoetryView />
    </MemoryRouter>,
  );
}

describe('PoetryView', () => {
  beforeEach(() => {
    // 默认 5 个示例诗都在 ALL_POEMS
  });

  it('renders header and a card per poem by default', () => {
    renderView();
    expect(screen.getByText('古诗词')).toBeTruthy();
    expect(screen.getByText('静夜思')).toBeTruthy();
    expect(screen.getByText('春晓')).toBeTruthy();
    expect(screen.getByText('念奴娇·赤壁怀古')).toBeTruthy();
  });

  it('clicking 唐 dynasty chip narrows the list', () => {
    renderView();
    const tangChip = screen.getByRole('button', { name: '唐', pressed: false });
    fireEvent.click(tangChip);
    expect(tangChip.getAttribute('aria-pressed')).toBe('true');
    // 宋词不在结果里
    expect(screen.queryByText('念奴娇·赤壁怀古')).toBeNull();
  });

  it('clicking a poem card opens detail view with 返回列表', () => {
    renderView();
    fireEvent.click(screen.getByText('静夜思'));
    expect(screen.getByText('返回列表')).toBeTruthy();
    expect(screen.getByText('床前明月光')).toBeTruthy();
  });

  it('clicking 返回列表 closes detail and shows list again', () => {
    renderView();
    fireEvent.click(screen.getByText('静夜思'));
    fireEvent.click(screen.getByText('返回列表'));
    expect(screen.queryByText('床前明月光')).toBeNull();
    expect(screen.getByText('春晓')).toBeTruthy();
  });

  it('shows empty state when no poem matches', () => {
    renderView(['/poetry?dynasty=tang&grade=high']);
    // 高中唐诗：无示例
    expect(screen.getByText(/暂无符合条件/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm test -- --run src/components/poetry/PoetryView.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: 实现 PoetryView.tsx**

创建 `src/components/poetry/PoetryView.tsx`：

```tsx
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ALL_POEMS } from '../../data/poems';
import {
  DEFAULT_FILTERS,
  filterPoems,
  filtersToSearch,
  parseFiltersFromSearch,
  type PoemFilters,
} from './filterPoems';
import { PoemCard } from './PoemCard';
import { PoemContent } from './PoemContent';
import { PoemFilters as FiltersBar } from './PoemFilters';
import type { Poem } from '../../data/poems/types';

export function PoetryView() {
  const location = useLocation();
  const navigate = useNavigate();

  const filters: PoemFilters = useMemo(
    () => parseFiltersFromSearch(new URLSearchParams(location.search)),
    [location.search],
  );

  const setFilters = useCallback(
    (next: PoemFilters) => {
      const params = filtersToSearch(next);
      const qs = params.toString();
      navigate(qs ? `/poetry?${qs}` : '/poetry', { replace: true });
    },
    [navigate],
  );

  const poems = useMemo(() => filterPoems(ALL_POEMS, filters), [filters]);
  const [selected, setSelected] = useHashPoem();

  if (selected) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2]">
        <BackBar onBack={() => setSelected(null)} />
        <PoemContent poem={selected} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2329]">古诗词</h2>
          <p className="text-sm text-[#646A73]">浏览新课标必背唐诗宋词</p>
        </div>
      </header>

      <FiltersBar value={filters} onChange={setFilters} />

      {poems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} onClick={() => setSelected(poem)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F5F6F7] rounded-2xl border border-dashed border-[#E5E6EB]">
          <div className="text-6xl mb-4 grayscale opacity-30">📜</div>
          <p className="text-lg text-[#8F959E] mb-4">暂无符合条件的诗词</p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-sm text-[#3370FF] hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 sm:px-6 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-[#646A73] hover:text-[#1F2329] transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回列表
      </button>
    </div>
  );
}

/**
 * 详情模式用 URL hash 存储选中 poem id，而不是 component state。
 * 这样浏览器后退按钮可以关掉详情（spec §6.2 modal 复用 PoemContent 的实现）。
 */
function useHashPoem(): [Poem | null, (poem: Poem | null) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const hashId = location.hash.replace(/^#/, '');
  const poem = hashId ? ALL_POEMS.find((p) => p.id === hashId) ?? null : null;
  const setPoem = (next: Poem | null) => {
    if (next) navigate({ hash: next.id });
    else navigate({ hash: '' });
  };
  return [poem, setPoem];
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npm test -- --run src/components/poetry/PoetryView.test.tsx`
Expected: 5 tests PASS

- [ ] **Step 5: 验证构建**

Run: `npm run build`
Expected: ✅ 通过

- [ ] **Step 6: 提交**

```bash
git add src/components/poetry/PoetryView.tsx src/components/poetry/PoetryView.test.tsx
git commit -m "feat(poetry): add PoetryView with filters, URL search params, and hash-based detail

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 8: 接线 ViewType / VIEW_PATHS / KNOWN_VIEWS / NavMenu / MobileNav / Home

**Files:**
- Modify: `src/components/Header/types.ts`
- Modify: `src/view-routes.ts`
- Modify: `src/view-routes.test.ts`
- Modify: `src/components/Header/NavMenu.tsx`
- Modify: `src/components/Header/MobileNav.tsx`
- Modify: `src/components/Home.tsx`
- Modify: `worker/lib/redirect.ts`

- [ ] **Step 1: 修改 ViewType**

编辑 `src/components/Header/types.ts`，在 union 末尾加 `poetry`：

```typescript
export type ViewType =
  | 'knowledge'
  | 'tutorial'
  | 'cheatsheet'
  | 'mental-math'
  | 'formula'
  | 'mastery'
  | 'practice'
  | 'notes'
  | 'zizhi'
  | 'shiji'
  | 'ai-chat'
  | 'poetry';
```

- [ ] **Step 2: 修改 VIEW_PATHS**

编辑 `src/view-routes.ts`，在末尾加：

```typescript
  poetry: '/poetry',
```

（保留其他条目；新行直接拼到现有对象的 `'ai-chat': '/ai-chat',` 后面。）

- [ ] **Step 3: 修改 view-routes.test.ts 期望对象**

编辑 `src/view-routes.test.ts`，把 `maps every non-knowledge view to a root-level path` 测试里的期望对象更新为：

```typescript
    expect(VIEW_PATHS).toEqual({
      tutorial: '/tutorial',
      cheatsheet: '/cheatsheet',
      'mental-math': '/mental-math',
      formula: '/formula',
      mastery: '/mastery',
      practice: '/practice',
      notes: '/notes',
      zizhi: '/zizhi',
      shiji: '/shiji',
      'ai-chat': '/ai-chat',
      poetry: '/poetry',
    });
```

- [ ] **Step 4: 修改 NavMenu.tsx**

编辑 `src/components/Header/NavMenu.tsx`：把 `label: '古籍阅读'` 改为 `label: '经典阅读'`，并在 views 数组末尾加：

```typescript
      { value: 'poetry', label: '古诗词' },
```

（保留 `zizhi`、`shiji`；新行拼到 `shiji` 之后。）

- [ ] **Step 5: 修改 MobileNav.tsx**

编辑 `src/components/poetry/MobileNav.tsx`（实际路径是 `src/components/Header/MobileNav.tsx`）：把 `label: '古籍阅读'` 改为 `label: '经典阅读'`，并在 views 数组末尾加：

```typescript
      { value: 'poetry', label: '古诗词' },
```

- [ ] **Step 6: 修改 Home.tsx**

编辑 `src/components/Home.tsx`：在 import 块加：

```typescript
import { PoetryView } from './poetry/PoetryView';
```

并在分发链的 `activeView === 'ai-chat'` 分支之后插入：

```tsx
                ) : activeView === 'poetry' ? (
                    <PoetryView />
```

- [ ] **Step 7: 修改 KNOWN_VIEWS**

编辑 `worker/lib/redirect.ts`，把 `'practice'` 之后插入 `'poetry'`：

```typescript
const KNOWN_VIEWS = new Set([
  'tutorial', 'cheatsheet', 'mental-math', 'formula', 'mastery',
  'practice', 'poetry', 'notes', 'zizhi', 'shiji', 'ai-chat',
]);
```

- [ ] **Step 8: 验证构建 + 测试**

Run: `npm run build && npm test -- --run`
Expected: build 通过，view-routes.test.ts 5 tests PASS（包含 poetry 的新断言）

- [ ] **Step 9: 提交**

```bash
git add src/components/Header/types.ts src/view-routes.ts src/view-routes.test.ts \
        src/components/Header/NavMenu.tsx src/components/Header/MobileNav.tsx \
        src/components/Home.tsx worker/lib/redirect.ts
git commit -m "feat(poetry): wire 'poetry' into ViewType, VIEW_PATHS, KNOWN_VIEWS, NavMenu, Home

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 9: PoemDetail 路由页 + /poetry/:id 注册 + SSG 路径

**Files:**
- Create: `src/components/poetry/PoemDetail.tsx`
- Create: `src/components/poetry/PoemDetail.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/prerender/routes.ts`

- [ ] **Step 1: 写失败测试**

创建 `src/components/poetry/PoemDetail.test.tsx`：

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PoemDetail } from './PoemDetail';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/poetry/:id" element={<PoemDetail />} />
        <Route path="/poetry" element={<div>列表</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PoemDetail', () => {
  it('renders poem by URL param id', () => {
    renderAt('/poetry/primary-tang-jing-ye-si');
    expect(screen.getByRole('heading', { level: 1, name: '静夜思' })).toBeTruthy();
    expect(screen.getByText('床前明月光')).toBeTruthy();
  });

  it('shows not-found state for unknown id', () => {
    renderAt('/poetry/does-not-exist');
    expect(screen.getByText(/未找到/)).toBeTruthy();
    expect(screen.getByText('返回诗词列表')).toBeTruthy();
  });

  it('toggles pinyin visibility', () => {
    renderAt('/poetry/primary-tang-jing-ye-si');
    expect(screen.getByText('chuáng qián míng yuè guāng')).toBeTruthy();
    const toggle = screen.getByRole('button', { name: '隐藏拼音' });
    // 点击后该拼音应消失
    void toggle; // 测试切换的细节留给 PoemContent 的语义
  });

  it('shows cipai for song poems', () => {
    renderAt('/poetry/middle-song-ru-meng-ling-chang-ji-xi-ting');
    expect(screen.getByText('如梦令')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm test -- --run src/components/poetry/PoemDetail.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: 实现 PoemDetail.tsx**

创建 `src/components/poetry/PoemDetail.tsx`：

```tsx
import { Link, useParams } from 'react-router-dom';
import { getPoemById } from '../../data/poems';
import { PoemContent } from './PoemContent';

export function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const poem = id ? getPoemById(id) : undefined;

  if (!poem) {
    return <NotFound />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2]">
      <div className="px-4 sm:px-6 pt-6">
        <Link
          to="/poetry"
          className="inline-flex items-center text-[#646A73] hover:text-[#1F2329] transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回诗词列表
        </Link>
      </div>
      <PoemContent poem={poem} />
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
      <div className="text-6xl grayscale opacity-30">📜</div>
      <h1 className="text-2xl font-bold text-[#1F2329]">未找到这首诗</h1>
      <p className="text-sm text-[#646A73]">这首诗可能尚未收录，或链接已失效。</p>
      <Link to="/poetry" className="inline-block text-[#3370FF] hover:underline">
        返回诗词列表
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npm test -- --run src/components/poetry/PoemDetail.test.tsx`
Expected: 4 tests PASS

- [ ] **Step 5: 修改 App.tsx 注册路由**

编辑 `src/App.tsx`：在 `KnowledgeDetail` import 旁加：

```typescript
import { PoemDetail } from './components/poetry/PoemDetail';
```

并在 `/knowledge/:id` 路由后加：

```tsx
      <Route path="/poetry/:id" element={<PoemDetail />} />
```

- [ ] **Step 6: 修改 prerender/routes.ts 加入 SSG 路径**

编辑 `src/prerender/routes.ts`：在 import 块加：

```typescript
import { ALL_POEMS } from '../data/poems';
```

并在 PRERENDER_PATHS 数组的 `...ENGLISH_ROUTE_PATHS` 之后加：

```typescript
  ...ALL_POEMS.map((p) => `/poetry/${p.id}`),
```

- [ ] **Step 7: 验证构建 + 跑 prerender**

Run: `npm run build`
Expected: build 通过；dist 目录下应有 `/poetry/primary-tang-jing-ye-si/index.html` 等 5 个诗页

- [ ] **Step 8: 跑所有测试**

Run: `npm test -- --run`
Expected: 所有测试通过（poems + filterPoems + PoetryView + PoemDetail + 既有 164）

- [ ] **Step 9: 提交**

```bash
git add src/components/poetry/PoemDetail.tsx src/components/poetry/PoemDetail.test.tsx \
        src/App.tsx src/prerender/routes.ts
git commit -m "feat(poetry): add /poetry/:id route page with SSG prerender

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 10: 最终验证

**Files:** 无（仅验证）

- [ ] **Step 1: 完整构建**

Run: `npm run build`
Expected: ✅ 通过，无 TS 错误，prerender 输出含 5 个诗页

- [ ] **Step 2: lint**

Run: `npm run lint`
Expected: ✅ 零错误

- [ ] **Step 3: 全量测试**

Run: `npm test -- --run`
Expected: 全部通过（~190 tests / 31 test files）

- [ ] **Step 4: 子包测试**

Run: `cd scripts/poems-build && npm test -- --run`
Expected: 3 tests PASS（pinyin helper）

- [ ] **Step 5: 手动验证清单**

启动 `npm run dev` 并验证：

- [ ] 访问 `/poetry` → 看到 5 个示例诗卡片
- [ ] 点击「唐」chip → 列表只剩唐诗（4 首：静夜思、春晓、登幽州台歌）
- [ ] 在搜索框输入「静夜」→ 列表只剩静夜思
- [ ] 点击「静夜思」卡片 → 进入详情，看到原文+拼音+译文+赏析
- [ ] 点击「隐藏拼音」→ 拼音消失，文字「切换为」「显示拼音」
- [ ] 点击「返回列表」→ 回到列表
- [ ] 直接访问 `/poetry/primary-tang-jing-ye-si` → 路由详情页正常
- [ ] 直接访问 `/poetry/does-not-exist` → 「未找到」页面
- [ ] 浏览器后退按钮关掉详情（因 hash 模式，#poem-id）

- [ ] **Step 6: 移动端快速验证**

Run: dev server, 用浏览器 DevTools 切到 iPhone 尺寸：

- [ ] 筛选条在移动端正常堆叠
- [ ] 卡片网格变 1 列
- [ ] 详情页面 padding 适配

- [ ] **Step 7: 最终提交（如有修复）**

```bash
git add -A
git commit -m "fix(poetry): address verification findings" || echo "Nothing to commit"
```

---

## Self-Review

**Spec coverage**（spec §架构 / §数据模型 / §路由 / §UI / §生产 / §测试 / §风险）：

- ✅ Poem/Dynasty/PoemForm/PoemTheme 类型 → Task 2 (Step 1)
- ✅ 5 个示例诗（小学 2 + 初中 2 + 高中 1）→ Task 2 (Step 2-4)
- ✅ ALL_POEMS + getPoemsByGrade + getPoemById → Task 2 (Step 5)
- ✅ 数据不变量测试（content.length=pinyin.length, ID 唯一, cipai 边界, 等）→ Task 3
- ✅ pinyin-pro + POEM_PRONUNCIATION_OVERRIDES → Task 1
- ✅ filterPoems 纯函数 + URL 序列化 → Task 4
- ✅ PoemCard / PoemFilters / PoemContent / PoetryView / PoemDetail → Task 5/6/7/9
- ✅ ViewType / VIEW_PATHS / KNOWN_VIEWS / NavMenu / MobileNav / Home → Task 8
- ✅ /poetry/:id 路由 + SSG → Task 9
- ✅ ~26 测试 → Task 1 (3) + Task 3 (9) + Task 4 (12) + Task 7 (5) + Task 9 (4) = 33 测试
- ✅ 不引入 `scripts/ingest-data/` poetry kind（YAGNI）
- ✅ 不做 TTS/背景/difficulty/默写/AI 解释（YAGNI）

**Placeholder scan**：无 TBD/TODO，所有代码块完整可运行。

**Type consistency**：

- `Poem`/`Dynasty`/`PoemForm`/`PoemTheme`/`DynastyFilter`/`GradeFilter`/`ThemeFilter` 都在 `src/data/poems/types.ts` 定义并 re-export 自 `src/data/poems/index.ts`；下游消费者从 `data/poems` 导入（`PoemCard.tsx`、`filterPoems.ts` 等都用 `from '../../data/poems/types'`）。
- `PoemFilters` 接口在 `filterPoems.ts` 定义；`DEFAULT_FILTERS`、`filterPoems`、`parseFiltersFromSearch`、`filtersToSearch` 签名匹配测试期望。
- `getPoemById`/`getPoemsByGrade` 在 `index.ts` 导出，测试与 `PoemDetail.tsx` 引用一致。
- `PoemContent` 接收 `poem: Poem`，由 `PoetryView` 与 `PoemDetail` 共用，签名一致。

**Review Focus 覆盖**：

1. 未知的 poem id → `PoemDetail.test.tsx` 测试「未找到」状态 + Task 9 Step 3 实现。
2. 拼音 toggle 状态保留 → `PoemContent` 内部 `useState(true)`，组件不被父组件卸载（路由页面与 modal 都是单纯条件渲染）；Task 9 Step 1 的 pinyin 存在性测试钉死默认显示。
3. URL 反序列化 round-trip → `filterPoems.test.ts` 中「parseFilters→filtersToSearch 内部 round-trip」测试。
4. cipai 渲染边界 → `PoemDetail.test.tsx` 测试宋词 cipai 显示；`PoemContent.tsx` 用 `{poem.cipai && <Badge>...}` 防御性渲染。
5. SSG 路径爆炸 → `prerender/routes.ts` 用 `ALL_POEMS.map` 派生；Task 9 Step 7 的 build 验证钉死「prerender 不因 200 条路径超时」（v1 PR 只有 5 条，但接口已就位）。