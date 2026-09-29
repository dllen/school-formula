# extract-data + shiji-kb adapter 设计文档

**日期**：2026-09-29
**状态**：待评审
**输入**：`ref-libs.md`（3 个外部参考链接，本次只实现 `baojie.github.io/shiji-kb/`）

---

## 1. 概述

新建 `scripts/extract-data/` 子包，提供**外部数据源抽取框架**（adapter 模式），复用现有 `staging/ → ingest-data/ → src/data/` 管线。本次交付一个具体 adapter：`shiji-kb`（抽取 baojie.github.io/shiji-kb/ 的 12 本纪），后续按需追加 `dutongjian` 等 adapter。

**核心目标**：
- 让「外部站点数据 → `src/data/`」走与 AI 生成侧完全相同的 ingest 校验流程（`satisfies` + `tsc`）
- 框架抽象足够小，加新 adapter 不需要碰框架代码
- 现有 `src/data/shiji.ts` 的 4 条手工策展内容**零风险**（append-only + id 跳碰撞）

## 2. 范围与边界

**包含：**
- 新建 `scripts/extract-data/` 子包（package.json / tsconfig / vitest / CLI / 框架 / 1 个具体 adapter）
- 新增 `scripts/ingest-data/adapters/shiji.ts`（约 30 行，复用 `simpleArrayAdapter` 工厂）
- `scripts/ingest-data/registry.ts` 注册 `shijiAdapter`
- 根 `package.json` 新增 `npm run extract` / `extract:list`
- 12 本纪抽取 + 入库

**不包含：**
- 抽取 dutongjian.com / hunterhug.github.io（后续 task）
- 30 世家 / 70 列传 / 8 书（后续 task）
- interpretation 字段的 AI 生成（由 pi-agent-edu 后续任务覆盖）
- 内容清洗（去空白、繁简转换、标点统一）
- 增量去重（hash 级）—— append-only + id 跳碰撞已足够

## 3. 架构

### 3.1 子包布局

```
scripts/extract-data/
├── package.json              # name: extract-data, type: module, deps: cheerio + typescript + tsx
├── tsconfig.json             # ESM, strict, target ES2022, noEmit（沿用 pi-agent-edu/ingest-data 配置）
├── vitest.config.ts          # 独立 workspace project
├── extract.sh                # 启动脚本（与 pi-agent-edu.sh / ingest.sh 风格一致）
├── index.ts                  # CLI 入口（~50 行 parse + dispatch）
├── cli/
│   ├── args.ts               # 参数解析（subcommand / flags）
│   ├── help.ts               # help 文本
│   └── output.ts             # 时间戳文件名 + envelope 写入（先 .tmp 再 rename）
├── core/
│   ├── adapter.ts            # Adapter 接口契约
│   ├── runner.ts             # 跑一个 adapter 的全流程编排
│   ├── http.ts               # fetchWithRetry（Node 18+ 内置 fetch + 重试 + 限速）
│   ├── cache.ts              # .cache/<kind>/<url-hash>.html 本地缓存
│   └── envelope.ts           # BaseEnvelope schema（source / extractedAt）
├── adapters/
│   └── shiji-kb.ts           # 第一个具体 adapter
├── adapters/shiji-kb.test.ts
├── core/http.test.ts
├── core/cache.test.ts
└── core/envelope.test.ts
```

### 3.2 ingest-data 端改造点

仅新增两个文件 + 一行注册：

- **新增** `scripts/ingest-data/adapters/shiji.ts`（约 30 行）：
  ```ts
  import { simpleArrayAdapter } from './simple-array.js';

  export const shijiAdapter = simpleArrayAdapter({
    kind: 'shiji',
    envelopeKey: 'volumes',
    typeRef: {
      path: '<root>/src/data/shiji.ts',
      name: 'ShijiVolume',
      expr: 'ShijiVolume[]',
    },
    file: 'src/data/shiji.ts',
    arrayName: () => 'SHIJI_DATA',
    checks: (items) => {
      const errs: string[] = [];
      for (const it of items as Array<Record<string, unknown>>) {
        if (!it.id || typeof it.id !== 'string') errs.push(`id 缺失: ${JSON.stringify(it)}`);
        if (!it.title) errs.push(`title 缺失: ${it.id}`);
        if (!it.chapter) errs.push(`chapter 缺失: ${it.id}`);
        if (!Array.isArray(it.content) || it.content.length === 0) {
          errs.push(`content 缺失或空: ${it.id}`);
        }
      }
      return errs;
    },
  });
  ```

- **修改** `scripts/ingest-data/registry.ts`：在 `adapters` 数组追加 `shijiAdapter`，导出对应 `Adapter`。

- **不改** `scripts/ingest-data/index.ts` / `ingest.sh` / 任何 ingest 流程（`--kind shiji` 已通过 registry 自动支持）。

## 4. 适配器接口契约

### 4.1 `core/adapter.ts`

```ts
export interface Adapter {
  /** 必须与 scripts/ingest-data/adapters/<kind>.ts 的 kind 完全一致。 */
  readonly kind: string;
  /** 人类可读标签，--list 时显示。 */
  readonly name: string;
  /** 一句话描述，--list 时显示。 */
  readonly description: string;

  /** 列举要抓取的页面 URL（绝对或相对，相对由 fetchPage 自行拼 base）。 */
  listUrls(): Promise<string[]>;

  /** 抓取并解析单个 URL，返回该页原始解析结果（adapter 自己定义形状）。 */
  fetchPage(url: string): Promise<unknown>;

  /** 把所有 fetchPage 结果归一化为 ingest-data 期望的信封。 */
  normalize(pages: unknown[]): Envelope;
}

export interface BaseEnvelope {
  source: string;       // e.g. 'shiji-kb'
  extractedAt: string;  // ISO 8601
}
```

### 4.2 框架内建 vs adapter 自理的边界

| 能力 | 谁负责 |
|---|---|
| HTTP 请求 + 重试 + 限速 | 框架 (`core/http.ts`) |
| HTTP 缓存（可选） | 框架 (`core/cache.ts`) |
| HTML/JSON 解析 | **adapter 自己**（cheerio 由 adapter 引入） |
| `listUrls / fetchPage / normalize` | **adapter 自己** |
| 信封 schema 校验（运行时） | 框架 (`core/envelope.ts`，可选) |
| 写盘原子性 | 框架 (`cli/output.ts`) |

理由：框架做小、adapter 灵活，加新站点只动 `adapters/<site>.ts`，不动框架。

## 5. 数据流（端到端）

```
① npm run extract -- shiji-kb
   ↓
② scripts/extract-data/index.ts
   ↓
③ adapters/shiji-kb.ts: listUrls() → 12 URLs
   ↓
④ 串行 fetchPage(u) × 12（带重试 + 限速 + 缓存）
   ↓
⑤ normalize(pages) → Envelope
   ↓
⑥ cli/output.ts: 写 staging/shiji/.extracted-<ts>.json.tmp → rename → extracted-<ts>.json
   ↓
⑦ npm run ingest -- --kind shiji
   ↓
⑧ ingest-data/adapters/shiji.ts:
     extract → validate (id 唯一 + 字段非空) → merge (appendToConstArray, id 碰撞跳过)
   ↓
⑨ src/data/shiji.ts (SHIJI_DATA 数组追加 12 条)
```

### 5.1 信封契约（extract → ingest 交接面）

文件：`staging/shiji/extracted-<ISO8601>.json`

```jsonc
{
  "source": "shiji-kb",
  "extractedAt": "2026-09-29T12:34:56.789Z",
  "url": "https://baojie.github.io/shiji-kb/",
  "volumes": [
    {
      "id": "v5",
      "title": "周本纪",
      "chapter": "卷四",
      "content": ["……", "……"],
      "interpretation": ""   // 源站有则填，没有则空字符串
    }
    // …共 12 条
  ]
}
```

`envelopeKey: 'volumes'`，`arrayName: () => 'SHIJI_DATA'`，由 `simpleArrayAdapter` 工厂消费。

### 5.2 Idempotency

- 抽取端：每次写新时间戳文件，旧文件保留作审计
- 入库端：`appendToConstArray` + `collidingIds` 检测 + skip —— 重跑不丢数据也不重复

## 6. shiji-kb adapter 实现策略

> ⚠️ 沙箱无网访问不到 baojie.github.io，**HTML 结构未实测**。本节是策略而非固定选择器。

### 6.1 `listUrls()`

```ts
const BASE_URL = 'https://baojie.github.io/shiji-kb/';
const FALLBACK_URLS = [/* 12 个本纪相对路径，首次本地跑后回填 */];

async listUrls(): Promise<string[]> {
  const html = await fetchWithRetry(BASE_URL);
  const $ = cheerio.load(html);
  const urls = $('a[href*="benji"], nav a')
    .map((_, el) => $(el).attr('href'))
    .get()
    .filter(Boolean)
    .filter(href => href.startsWith(BASE_URL) || href.startsWith('/'))
    .filter(href => !href.includes('#'))
    .slice(0, 12)
    .map(href => new URL(href, BASE_URL).href);
  if (urls.length >= 12) return urls;
  return FALLBACK_URLS.map(u => new URL(u, BASE_URL).href);
}
```

- 优先动态解析（首页抓章节链接）
- 静态 `FALLBACK_URLS` 兜底（首页解析失败时不至于 0 URL）
- 兜底常量是 adapter 顶部 const，首次本地 fetch 一次后回填

### 6.2 `fetchPage(url)`

```ts
async fetchPage(url: string): Promise<RawChapter> {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);
  const title = $('h1').first().text().trim();
  const chapter = $('.chapter-num').first().text().trim();
  const paragraphs = $('article p, main p').map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const interpBlocks = $('section.interpretation, aside').map(...).get();
  const interpretation = interpBlocks.length ? interpBlocks.join('\n\n') : '';
  return { url, title, chapter, paragraphs, interpretation };
}
```

- 选择器是**占位**，首次本地 fetch 样本后调成实际结构
- interpretation 字段采用**混合策略**：源站有结构化块就抽，没有就空字符串

### 6.3 `normalize(pages)`

```ts
normalize(pages: RawChapter[]): ShijiEnvelope {
  let counter = 5;  // 现有 src/data/shiji.ts 已用 v1-v4，从 v5 起
  const volumes: ShijiVolume[] = pages.map((p) => ({
    id: `v${counter++}`,
    title: p.title,
    chapter: p.chapter,
    content: p.paragraphs,
    interpretation: p.interpretation,
  }));
  return {
    source: 'shiji-kb',
    extractedAt: new Date().toISOString(),
    url: BASE_URL,
    volumes,
  };
}
```

### 6.4 章节失败策略

- 默认：整批失败（exit 1，不写盘）
- `--partial-ok`：跳过失败章节，其余正常入库；失败 URL 进 `staging/shiji/FAILED-<ts>.txt`

## 7. 错误处理、重试、限速、缓存

### 7.1 重试（`core/http.ts` 的 `fetchWithRetry`）

| 情况 | 行为 |
|---|---|
| 2xx | 直接返回 |
| 3xx | fetch 自动跟随（最多 3 次） |
| 4xx | **不重试**，立即报错 |
| 5xx | 指数退避 1s / 2s / 4s，最多 3 次 |
| 网络错误 / 超时（60s/页） | 同 5xx |

### 7.2 限速

- 串行请求（同一 adapter 内）
- 每页间隔 ≥ 500ms
- 全局并发上限 1
- 环境变量 `EXTRACT_MIN_INTERVAL_MS` 覆盖默认

### 7.3 缓存

- 目录 `scripts/extract-data/.cache/<kind>/<url-hash>.html`
- 默认开启（7 天 TTL）
- `--no-cache` 强制重新抓
- `.cache/` 加入子包 `.gitignore`

### 7.4 写盘原子性

- 信封先写 `staging/<kind>/.extracted-<ts>.json.tmp`
- 写完 `rename` 到正式名
- `--dry-run` 模式只打印不写

### 7.5 退出码

| 码 | 含义 |
|---|---|
| 0 | 全部成功 |
| 1 | 网络/解析失败（无 `--partial-ok`） |
| 2 | 参数错误（adapter 名未知等） |
| 3 | 写盘失败 |

## 8. 测试策略

### 8.1 测试分层

| 层 | 测谁 | 工具 |
|---|---|---|
| L1 框架 | `core/http.ts` 重试/限速、`core/cache.ts`、`core/envelope.ts`、`cli/args.ts` | vitest + 手写 mock fetch |
| L2 adapter | `adapters/shiji-kb.ts` 的 listUrls / fetchPage / normalize | vitest + mock fetchRaw |
| L3 smoke | 真实跑一次 `extract shiji-kb --dry-run` | 手动 / CI weekly cron |
| L4 e2e | extract → ingest → `npm run build` 验证 tsc | CI dispatch / 本地 |

### 8.2 测试命令

```bash
cd scripts/extract-data && npm test
```

与 pi-agent-edu / ingest-data 完全对称，根 `npm test` 不覆盖。

### 8.3 Mock 注入点

adapter 构造函数接受 `{ fetchRaw?: typeof fetch }`，默认用 `fetchWithRetry`。测试传 fake 即可，无需 mock HTTP 栈。

### 8.4 Fixture 管理

- `adapters/shiji-kb.test.fixtures/`：真实抓取的 HTML 样本
- `--capture-fixture` 跑一次真实抓取落盘，后续测复用

### 8.5 覆盖率目标（不强制门禁）

- 框架 (`core/`)：≥ 90%
- adapter 层：≥ 70%（normalize 必测）

### 8.6 CI

- `npm run lint`（根）已覆盖 `scripts/**`
- 新增**可选** `.github/workflows/extract-data-smoke.yml`：每周 cron 跑 `extract shiji-kb --dry-run`，失败发 issue

## 9. CLI 与 npm scripts

### 9.1 CLI 子命令

```
scripts/extract-data/extract.sh [subcommand] [flags]
```

| 子命令 / Flag | 用途 |
|---|---|
| `<adapter>` | 跑指定 adapter |
| `--list` / `-l` | 列出所有 adapter |
| `--help` / `-h` | 帮助 |
| `--version` / `-V` | 版本 |
| `--dry-run` | 抓 + 解析但不写盘 |
| `--no-cache` | 强制重新抓 |
| `--partial-ok` | 部分失败接受 |
| `--url <single>` | 只抓单个 URL（调试） |
| `--cache-ttl <days>` | 覆盖默认 TTL |

### 9.2 根 package.json 新增脚本

```jsonc
{
  "scripts": {
    // ... 既有 scripts ...
    "extract": "bash scripts/extract-data/extract.sh",
    "extract:list": "bash scripts/extract-data/extract.sh --list"
  }
}
```

只加两个最小入口，其他场景通过 `npm run extract -- shiji-kb --dry-run` 等显式传参。

### 9.3 extract.sh 启动脚本

与 `pi-agent-edu.sh` / `ingest.sh` 同结构：

```bash
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
if [ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 18)" -ge 22 ] 2>/dev/null; then
    export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--disable-warning=ExperimentalWarning"
fi
exec node --disable-warning=ExperimentalWarning node_modules/.bin/tsx index.ts "$@"
```

### 9.4 使用示例

```bash
npm run extract:list
npm run extract -- shiji-kb --dry-run
npm run extract -- shiji-kb                # 写到 staging
npm run extract -- shiji-kb --no-cache     # 忽略缓存
npm run ingest -- --kind shiji             # 入库
```

## 10. 不做的事（YAGNI 清单）

- ❌ 抽取 dutongjian.com / hunterhug.github.io（后续 task）
- ❌ 世家 / 列传 / 书（后续 task）
- ❌ interpretation 字段的 AI 生成
- ❌ 内容清洗（去空白、繁简、标点）
- ❌ 增量去重（hash 级）
- ❌ 持久化失败重试队列
- ❌ metrics 上报
- ❌ IP 代理轮换
- ❌ mutation testing / e2e Playwright / 视觉回归

## 11. 验收清单

实现完成时满足：

- [ ] `scripts/extract-data/` 子包结构与本文档 § 3.1 一致
- [ ] `core/adapter.ts` 接口与 § 4.1 一致
- [ ] `adapters/shiji-kb.ts` 实现 § 6 三个方法
- [ ] `core/http.ts` 满足 § 7.1 重试策略
- [ ] 写盘原子性满足 § 7.4
- [ ] L1 框架单测覆盖率 ≥ 90%
- [ ] L2 adapter 单测至少覆盖 normalize + listUrls
- [ ] `cd scripts/extract-data && npm test` 全绿
- [ ] 根 `npm run lint` 零错误
- [ ] `scripts/ingest-data/adapters/shiji.ts` 用 `simpleArrayAdapter` 工厂
- [ ] `scripts/ingest-data/registry.ts` 注册 `shijiAdapter`
- [ ] 端到端：`npm run extract -- shiji-kb && npm run ingest -- --kind shiji` 后 `src/data/shiji.ts` 增加 12 条本纪（id 范围 `v5`-`v16`），`npm run build` 通过
- [ ] 重跑入库命令 idempotent（`SHIJI_DATA` 数量不变）
- [ ] 现有手工策展的 v1-v4 内容未被修改

## 12. 已知风险与待定事项

| 项 | 状态 |
|---|---|
| baojie.github.io 实际 HTML 结构未实测 | 风险：adapter 选择器需本地 fetch 一次后微调 |
| 现有 `src/data/shiji.ts` 是否需要给 `ShijiVolume[]` 加 `as const` 或导出检查 | 待确认：实现时看一眼 shiji.ts 顶部 |
| tsconfig / vitest workspace 是否需要在根 `vitest.config.ts` 注册新子包 | 待确认：默认按「各子包独立跑」实现 |
| 子包 `.gitignore`（含 `.cache/`） | 待实现时创建 |
