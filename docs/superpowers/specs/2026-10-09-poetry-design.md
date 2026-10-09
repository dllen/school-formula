# 唐诗宋词模块设计

> 日期：2026-10-09
> 状态：待批准（brainstorming 完成 7 个 section）

## 概述

为 school-formula 平台新增「唐诗宋词」学习模块，覆盖新课标必背 ~200 首（小学 75 + 初中 61 + 高中 64），作为「经典阅读」分类下的浏览+阅读型内容。

**v1 范围**：架构 + UI + 5 个示例诗。后续 Phase 2 按学段分批填充 ~195 首。

**核心决策**（来自 brainstorming）：

| 维度 | 决策 |
|------|------|
| 形态 | 浏览 + 阅读（无背诵/练习/掌握度） |
| 规模 | 新课标必背 ~200 首 |
| 视图 | 统一 `/poetry` + 多维筛选（朝代/学段/题材）+ 独立 `/poetry/:id` SSG 详情页 |
| 字段 | 标准集：原文+拼音+译文+赏析+元信息 |
| 数据生产 | 直接 `.ts` 静态文件（不走 ingest 流水线），拼音用 `pinyin-pro` + 古音 override 字典 |
| 导航分组 | 「经典阅读」组（原「古籍阅读」改名） |

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 详情页形态 | 独立路由 `/poetry/:id`（SSG） | 每首诗是可被搜索的离散内容，独立路由利于 SEO |
| 详情内容复用 | `PoemContent` 共享给路由页和 modal | 单一内容源，两种挂载点 |
| 拼音方案 | `pinyin-pro` (npm) + 古音 override 字典 | 主流库自带多音字词表；古音特读是数据问题 |
| 筛选状态持久化 | 写 URL search params | 刷新保留、可分享 |
| 文言字体 | `font-['Noto_Serif_SC']`（Tailwind 内置） | 古文衬线字体提升阅读体验 |
| 卡片预览 | 前两句 + 标题 + 作者 + 徽章 | 控制卡片高度，列表可扫读 |
| 拼音默认显示 | 是 | 小学用户刚需；提供 toggle 按钮 |

## 架构

### 文件结构

```
src/
├── data/
│   └── poems/                            ← 新增
│       ├── types.ts                      ← Poem interface, Dynasty, PoemForm, PoemTheme
│       ├── primary.ts                    ← PRIMARY_POEMS (示例 2 首)
│       ├── middle.ts                     ← MIDDLE_POEMS  (示例 2 首)
│       ├── high.ts                       ← HIGH_POEMS    (示例 1 首)
│       ├── index.ts                      ← ALL_POEMS + getPoemsByGrade / getPoemById
│       └── poems.test.ts                 ← 数据不变量 + 查询测试
│
├── components/
│   └── poetry/                           ← 新增
│       ├── PoetryView.tsx                ← 视图入口（列表+筛选+详情切换）
│       ├── PoemFilters.tsx               ← 朝代/学段/题材 chips + 搜索框
│       ├── PoemCard.tsx                  ← 列表卡片
│       ├── PoemContent.tsx               ← 详情内容（路由页和 modal 共用）
│       ├── PoemDetail.tsx                ← /poetry/:id 路由组件
│       ├── filterPoems.ts                ← 纯函数筛选 + URL 序列化
│       ├── filterPoems.test.ts           ← 筛选逻辑测试
│       ├── PoetryView.test.tsx           ← 视图交互测试
│       └── PoemDetail.test.tsx           ← 详情页渲染测试
│
└── ...

scripts/
└── poems-build/                          ← 新增独立子包
    ├── package.json                      ← vitest, pinyin-pro
    ├── pinyin.ts                         ← generatePinyin + POEM_PRONUNCIATION_OVERRIDES
    └── pinyin.test.ts                    ← 拼音生成测试（最小集）
```

### 数据模型

```typescript
// src/data/poems/types.ts
import type { GradeLevel } from '../types';

export type Dynasty = 'tang' | 'song';

export type PoemForm =
  | '五言绝句' | '七言绝句'
  | '五言律诗' | '七言律诗'
  | '五言古诗' | '七言古诗'
  | '词';

export type PoemTheme =
  | '咏物' | '写景' | '抒情' | '送别' | '思乡'
  | '边塞' | '田园' | '咏史' | '哲理' | '节日'
  | '爱情' | '闺怨' | '讽喻' | '其他';

export interface Poem {
  id: string;             // 'primary-tang-jing-ye-si'
  title: string;          // 《静夜思》
  author: string;         // 李白
  dynasty: Dynasty;       // 'tang'
  form: PoemForm;         // '五言绝句'
  grade: GradeLevel;      // 'primary'
  content: string[];      // 按行的句子数组
  pinyin: string[];       // 与 content 一一对应
  translation: string;    // 现代汉语译文
  appreciation: string;   // 30-80 字赏析
  theme: PoemTheme;
  cipai?: string;         // 宋词词牌名（form='词' 时必填）
}
```

**不变量**（由 `poems.test.ts` 强制）：
- `poem.content.length === poem.pinyin.length`
- `poem.id` 匹配 `^(primary|middle|high)-(tang|song)-[a-z0-9-]+$`
- `poem.form === '词'` ⇔ `poem.cipai` 存在
- `poem.translation.length >= 10` 且 `poem.appreciation.length >= 10`
- 全局 ID 唯一

### 路由与分发

```diff
# src/components/Header/types.ts
 export type ViewType =
   | 'knowledge' | 'tutorial' | 'cheatsheet' | 'mental-math' | 'formula'
-  | 'mastery' | 'practice' | 'notes' | 'zizhi' | 'shiji' | 'ai-chat';
+  | 'mastery' | 'practice' | 'notes' | 'zizhi' | 'shiji' | 'ai-chat'
+  | 'poetry';

# src/view-routes.ts
 export const VIEW_PATHS: ... = {
   ...,
   'ai-chat': '/ai-chat',
+  poetry: '/poetry',
 };

# src/components/Header/NavMenu.tsx
   {
-    label: '古籍阅读',
+    label: '经典阅读',
     views: [
       { value: 'zizhi', label: '资治通鉴' },
       { value: 'shiji', label: '史记' },
+      { value: 'poetry', label: '古诗词' },
     ],
   },

# src/components/Header/MobileNav.tsx —— 同步加一项

# src/components/Home.tsx
 import { AIChatView } from './AIChatView';
+import { PoetryView } from './poetry/PoetryView';
 ...
 ) : activeView === 'ai-chat' ? (
   <AIChatView />
+  ) : activeView === 'poetry' ? (
+    <PoetryView />
 ) : (
   <ShijiView />
 )}

# src/App.tsx
 import { KnowledgeDetail } from './components/KnowledgeDetail';
+import { PoemDetail } from './components/poetry/PoemDetail';
 ...
 <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
+<Route path="/poetry/:id" element={<PoemDetail />} />

# worker/lib/redirect.ts
 const KNOWN_VIEWS = new Set([
   'tutorial', 'cheatsheet', 'mental-math', 'formula', 'mastery',
-  'practice', 'notes', 'zizhi', 'shiji', 'ai-chat',
+  'practice', 'poetry', 'notes', 'zizhi', 'shiji', 'ai-chat',
 ]);

# src/entry-prerender.ts
+import { ALL_POEMS } from './data/poems';
 ...
+const POEM_PATHS = ALL_POEMS.map(p => `/poetry/${p.id}`);
 const ROUTES = [
   ...,
+  ...POEM_PATHS,
 ];
```

### UI 形态

**PoetryView 列表**：
- 顶部：标题 + 描述 + 搜索框
- 筛选条：`PoemFilters` —— 朝代/学段/题材三组 chip + 搜索框（实时）
- 卡片网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 卡片内容：标题（衬线大字）+ 作者 + 前两句预览 + 朝代/学段/题材徽章

**PoemContent（详情内容，路由和 modal 共用）**：
- 返回按钮（路由用 `navigate('/poetry')`，modal 用 `setSelectedPoem(null)`）
- 标题居中大字 + 作者 `—— 李白 ——`
- 朝代/学段/体裁/词牌徽章行
- 原文每行居中、衬线大字号
- 拼音紧贴每行下方（toggle 按钮控制显示）
- 译文段落（小标题「📖 译文」）
- 赏析段落（小标题「✨ 赏析」）

### 筛选状态持久化

`PoetryView` 启动时读 `location.search`，filter 变更时 `navigate(?dynasty=tang&grade=primary&theme=抒情&q=...)`。

```typescript
// filterPoems.ts
export interface PoemFilters {
  dynasty: 'all' | Dynasty;
  grade: 'all' | GradeLevel;
  theme: 'all' | PoemTheme;
  query: string;
}
export function filterPoems(poems: Poem[], filters: PoemFilters): Poem[]
export function parseFiltersFromSearch(search: URLSearchParams): PoemFilters
export function filtersToSearch(filters: PoemFilters): URLSearchParams
```

### 拼音生成

```typescript
// scripts/poems-build/pinyin.ts
import { pinyin } from 'pinyin-pro';

export function generatePinyin(content: string[]): string[] {
  return content.map(line =>
    pinyin(line, {
      toneType: 'symbol',
      type: 'array',
      nonZh: 'consecutive',
    }).join(' ')
  );
}

// 古音特读字典（key=字+author+title，value=指定拼音）
export const POEM_PRONUNCIATION_OVERRIDES: Record<string, string> = {
  // 例：'杜牧|山行|斜': 'xiá',  // 「远上寒山石径斜」的「斜」古读 xiá
};
```

实际录入流程：脚本先按 `pinyin-pro` 生成 → 校对古音特读 → 写到 `POEM_PRONUNCIATION_OVERRIDES` → 重新生成。

## 实施步骤

### 第一步：数据层 + 类型（半天）

**新增**：
- `src/data/poems/types.ts`
- `src/data/poems/{primary,middle,high}.ts`（含 5 个示例）
- `src/data/poems/index.ts` + 查询函数
- `src/data/poems/poems.test.ts`

**示例诗**：
- 小学：静夜思（李白）、春晓（孟浩然）
- 初中：登幽州台歌（陈子昂）、如梦令·常记溪亭（李清照）
- 高中：念奴娇·赤壁怀古（苏轼）

### 第二步：视图接线（半天）

**改动**：
- `src/components/Header/types.ts`
- `src/view-routes.ts`
- `src/components/Header/NavMenu.tsx`
- `src/components/Header/MobileNav.tsx`
- `src/components/Home.tsx`
- `worker/lib/redirect.ts`

### 第三步：UI 组件（一天）

**新增**：
- `src/components/poetry/PoemContent.tsx`（共享详情）
- `src/components/poetry/PoemCard.tsx`
- `src/components/poetry/PoemFilters.tsx`
- `src/components/poetry/filterPoems.ts`
- `src/components/poetry/PoetryView.tsx`
- `src/components/poetry/PoemDetail.tsx`

**测试**：filterPoems.test.ts、PoetryView.test.tsx、PoemDetail.test.tsx

### 第四步：路由 + SSG（半天）

**改动**：
- `src/App.tsx` 加 `/poetry/:id` 路由
- `src/entry-prerender.ts` 加 `POEM_PATHS`
- 验证 prerender 200 个路径无错误

### 第五步：拼音脚本 + 校对（半天）

**新增**：
- `scripts/poems-build/{package.json,pinyin.ts,pinyin.test.ts}`
- `vitest.config.ts` 加 workspace project
- `package.json` 加 `pinyin-pro` 依赖（scripts 子包本地依赖）

**验证**：拿 5 个示例诗 → 跑 `generatePinyin` → 校对古音 → 写 override。

## 不改动的部分

- 现有 `idioms.ts` / `chinese.ts` / `characters2000.ts` 等语文数据
- `src/data/cheatsheets.ts` / `formulas.ts` 等其他学科数据
- `scripts/ingest-data/` 流水线（v1 不引入 `poems` kind）
- `src/components/ai/`、`src/components/practice/`、`src/components/mastery/` 等其他子系统
- Worker 路由 `/api/*`、`/api/ai/gateway` 等后端
- `tailwind.config.js` / 全局样式（衬线字体通过 Tailwind 内置 `font-['Noto_Serif_SC']` 即可，无需配置）

## 测试策略

**5 个新 test 文件**：

| 文件 | 测试数（估） | 覆盖 |
|------|-----------|------|
| `poems.test.ts` | 6 | 数据不变量 + 查询函数 |
| `filterPoems.test.ts` | 8 | 纯筛选 + URL 序列化往返 |
| `PoetryView.test.tsx` | 5 | 列表交互（chip toggle、搜索、卡片点击、详情关闭、空态） |
| `PoemDetail.test.tsx` | 4 | URL param 加载、未知 ID、拼音 toggle、宋词 cipai |
| `pinyin.test.ts` | 3 | 长度对齐、override 优先级、标点处理 |

合计 ~26 个测试。现有 164 → v1 PR 后约 190 个测试 / 31 个 test files。

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| 多音字古音特读 | `POEM_PRONUNCIATION_OVERRIDES` 字典，按"作者+标题+字"键定位 |
| 译文/赏析权威性 | 手工录入，参考人教版教材 + 中华书局《唐诗鉴赏辞典》；AI 仅作加速 |
| 跨学段重复入选 | 单值 `grade`；重复条目加 suffix（如 `-jrs-2`）保证 ID 唯一 |
| SSG 路径爆炸（200 条） | prerender 已是自动派生（`ALL_POEMS.map`），无手工维护成本 |
| og:image 缺失 | v1 用通用「水墨山水」PNG；单图生成留 v2 |
| 与 cheatsheet 同质化 | CheatSheet 是表格内容（九九表/元素周期表），诗词是长文本卡片——形态上明显区分 |
| 衬线字体首次加载慢 | `Noto Serif SC` 子集化（v2 优化），v1 用浏览器默认衬线兜底 |

## YAGNI（v1 不做）

- ❌ 拼音朗读音频 / TTS
- ❌ 创作背景介绍（`background` 字段）
- ❌ 难度分级（`difficulty`）/ 必背标记（`memorizeLevel`）
- ❌ 默写填空 / 错题本 / 掌握度跟踪（属"浏览+背诵"v2）
- ❌ AI 一键解释（用户已选"纯阅读"）
- ❌ 单诗 og:image 自定义生成（v2 引入 satori 思路）
- ❌ ingest 流水线加 `poems` kind（Phase 2 评估）
- ❌ Worker 后端 API（纯前端静态数据）

## Phase 2 预留（v1 不实施但留接口）

- ~195 首剩余诗的批量填充
- 题材/朝代覆盖度分析（哪些维度稀疏，针对性补）
- 用户行为埋点（哪些诗被点开最多，指导精选）