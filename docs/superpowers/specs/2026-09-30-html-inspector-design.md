# HTML 结构探测器（extract.sh --inspect）设计

**日期**：2026-09-30
**状态**：待评审
**前置**：extract-data 框架已稳定（commit `42f2489`，最新 bugfix `b5926e2`）
**问题**：adapter 的 HTML 选择器是占位（首次本地 fetch 后需调优），但缺少工具快速判断结构

---

## 1. 概述

扩展 `extract.sh` 加 `--inspect <url>` flag：fetch 单 URL → 保存 fixture + 打印结构报告 + 启发式推荐 selector，一站式辅助本地调优。

## 2. 范围与边界

**包含：**
- `cli/args.ts` 新增 `--inspect <url>` + `--adapter` + `--save / --no-slot` 解析
- `core/inspect.ts` 新增（fetch + 结构报告 + 候选 selector）
- `core/inspect.test.ts` fixture-based 单测
- `index.ts` dispatch 新分支
- `.gitignore` 加 `.fixtures/`

**不包含：**
- ❌ 自动改 selector 写回 adapter（手工复制更安全）
- ❌ 视觉预览（文本报告足够）
- ❌ 跨页 crawl（单 URL inspect）
- ❌ interactive / REPL（一次性输出）

## 3. CLI 签名

```bash
bash scripts/extract-data/extract.sh --inspect <url> [--adapter <kind>] [--save | --no-slot] [--max-headings 20]
```

| Flag | 含义 |
|---|---|
| `--inspect <url>` | **必填**（与位置 adapter 互斥） |
| `--adapter <kind>` | fixture 目录名 + 候选 selector 评分基准 |
| `--save` | 保存 HTML 到 `.fixtures/<adapter>/<hash>-<ts>.html`（默认开） |
| `--no-slot` | 只打印不写盘 |
| `--max-headings N` | heading 打印上限（默认 20） |

## 4. 输出格式（stdout）

```
=== URL: https://baojie.github.io/shiji-kb/benji/wudi
=== Fetched: 12.3 KB in 0.5s (cache: miss)

# Heading hierarchy (h1-h6)
h1: 周本纪 - 卷四
  h2: 太史公曰 (1)
  h2: 周纪补遗 (1)
h3: (none)

# Top class names (freq >= 2)
  .chapter-title ×3
  .period ×2
  .content ×8
  .paragraph ×12

# Container candidates (paragraph yield)
  article p        → 12 paragraphs (avg 32 chars)
  main p           →  8 paragraphs (avg 28 chars)
  .content p       → 11 paragraphs (avg 35 chars) ★
  body > div p     →  5 paragraphs (avg 24 chars)

# IDs / landmarks
  #content ×1, #main ×1

# Suggested selector (highest yield)
  → '.content p' or 'article p'

# Saved fixture: .fixtures/shiji-kb/a3f2e8b1c4d5-2026-09-30T07-40-00Z.html (12.3 KB)
```

## 5. 实现关键

**`core/inspect.ts`** 公开接口：

```ts
export interface InspectOptions {
  url: string;
  adapterKind?: string;
  save: boolean;
  maxHeadings: number;
}

export interface InspectReport {
  url: string;
  fetchedBytes: number;
  fetchedMs: number;
  cached: boolean;
  headings: Array<{ level: number; text: string }>;
  topClasses: Array<{ cls: string; count: number }>;
  candidates: Array<{ selector: string; paragraphs: number; avgChars: number }>;
  ids: Array<{ id: string; count: number }>;
  fixturePath?: string;
}

export async function inspectHtml(
  opts: InspectOptions,
  ctx: { root: string; fetchImpl?: typeof fetch }
): Promise<InspectReport>;
```

**候选 selector 启发式**：固定列表 + 实际查询
- 列表：`['article p', 'main p', '.content p', '.article-body p', 'body > div p', '.entry p', '.post p', '#content p', '#main p']`
- 对每个候选用 cheerio 实际 query，统计段落数与平均字符数
- 按段落数 desc 排序

**fixture 保存**：
- 路径：`<root>/scripts/extract-data/.fixtures/<adapter>/<url-hash>-<ts>.html`
- URL hash：sha256 前 16 字符（与 `.cache/` 复用 `hashUrl`）
- `.gitignore` 加 `.fixtures/`

## 6. 测试

**`core/inspect.test.ts`**（fixture-based）：
- 准备 `__fixtures__/sample.html`（典型古文页面：h1 + 10 个 article p）
- mock fetch 注入 HTML
- 测：
  - `fetchedBytes > 0`
  - `headings.length > 0`
  - `candidates` 含 `article p` 且 paragraphs === 10
  - fixture 文件保存成功

## 7. 验收

- [ ] `--inspect <url>` 跑通
- [ ] `--no-slot` 不写 fixture
- [ ] 输出格式符合 §4
- [ ] fixture 落到 `.fixtures/<adapter>/`
- [ ] `.fixtures/` 加 .gitignore
- [ ] 既有 221 测试全过（+ 3-4 新 inspect 测试）

## 8. 已知风险

| 风险 | 缓解 |
|---|---|
| 启发式漏掉站点特异 selector | 用户看报告后自己 grep 即可 |
| fixture 文件污染 git | .gitignore 已加 .fixtures/ |
