# extract-data 扩展：dutongjian + hunterhug adapter 设计

**日期**：2026-09-30
**状态**：待评审
**前置**：`scripts/extract-data/` 框架已交付（spec 2026-09-29，14 tasks 完成，commit ee514f7..42f2489 推 origin/main）
**输入**：`ref-libs.md` 中剩余两个 URL
  - https://www.dutongjian.com/ — **读通鉴**（资治通鉴）
  - https://hunterhug.github.io/ — **史记之类经典数据**

---

## 1. 概述

在已有 `scripts/extract-data/` 框架上**增量扩展两个 adapter**，对接现有 `ingest-data` 管线：
- **dutongjian** → kind=`zizhi`，append 到现有 `src/data/zizhi.ts`（已有 v1-v17 手工策展）
- **hunterhug** → kind=`shiji`，append 到现有 `src/data/shiji.ts`（已有 v1-v4 手工策展 + 后续 shiji-kb 抽取）

shiji-kb adapter 不动（counter 仍从 5 开始）。hunterhug 用 `v100+` 明确区分「补充源」。dutongjian 用 `v18+`（现有 v1-v17 已用完）。

## 3. 范围与边界

**包含：**
- `scripts/extract-data/adapters/dutongjian.ts`（kind=`zizhi`，~80 行）
- `scripts/extract-data/adapters/hunterhug.ts`（kind=`shiji`，~80 行）
- 两个 adapter 对应 `.test.ts`（各 4 个测试）
- `scripts/ingest-data/adapters/zizhi.ts`（~30 行，simpleArrayAdapter 工厂）
- `scripts/ingest-data/adapters/zizhi.test.ts`（4 个测试）
- `scripts/ingest-data/registry.ts` 注册 zizhiAdapter
- `RUNBOOK.md` 增加 dutongjian / hunterhug 步骤

**不包含：**
- ❌ shiji-kb adapter 改动（counter 仍 5）
- ❌ 重写 shiji.ts / zizhi.ts 现有数据
- ❌ 内容清洗 / 重复章节去重 / interpretation AI 生成
- ❌ 抽取其他经典（论语/史记列传/世家 等 hunterhug 子站点）—— YAGNI

## 3. 架构

### 3.1 新增文件

```
scripts/extract-data/adapters/
├── shiji-kb.ts          (已有,不动)
├── dutongjian.ts         ← 新 (kind: 'zizhi', counter 起步 18)
└── hunterhug.ts          ← 新 (kind: 'shiji', counter 起步 100)

scripts/ingest-data/adapters/
├── shiji.ts              (已有,不动)
└── zizhi.ts              ← 新 (~30 行, simpleArrayAdapter)

docs/superpowers/specs/2026-09-30-extract-data-dutongjian-hunterhug-design.md   ← 本文件
docs/superpowers/plans/2026-09-30-extract-data-dutongjian-hunterhug.md           ← 计划
```

### 3.2 改动文件

- `scripts/ingest-data/registry.ts`：注册 `zizhiAdapter`
- `RUNBOOK.md`：增加两条新命令的验证流程

**框架层、shiji-kb、root package.json、根 tsconfig、vitest 等均不动**。

## 4. 适配器接口契约

完全沿用 spec 2026-09-29 §4.1 已有的 7 字段接口：
```
kind / name / description / listUrls() / fetchHtml() / parseHtml() / normalize()
```

无需扩展框架。

## 5. 数据契约

### 5.1 dutongjian 信封（kind='zizhi'）

文件：`staging/zizhi/extracted-<ISO8601>.json`

```jsonc
{
  "source": "dutongjian",
  "extractedAt": "2026-09-30T...",
  "url": "https://www.dutongjian.com/",
  "volumes": [
    {
      "id": "v18",
      "title": "周纪三",
      "period": "威烈王二十三年...",
      "content": ["..."],
      "interpretation": ""   // 源站有就填,没有空字符串
    }
  ]
}
```

`simpleArrayAdapter` 配置：
- `kind: 'zizhi'`, `envelopeKey: 'volumes'`
- `typeRef: { path: '<root>/src/data/zizhi.ts', name: 'ZizhiVolume', expr: 'ZizhiVolume[]' }`
- `file: 'src/data/zizhi.ts'`, `arrayName: () => 'ZIZHI_DATA'`
- checks: id / title / period / content 必填

### 5.2 hunterhug 信封（kind='shiji'）

文件：`staging/shiji/extracted-<ISO8601>.json`

```jsonc
{
  "source": "hunterhug",
  "extractedAt": "...",
  "url": "https://hunterhug.github.io/",
  "volumes": [
    { "id": "v100", "title": "...", "chapter": "...", "content": ["..."], "interpretation": "" }
  ]
}
```

shijiAdapter **无改动**——kind='shiji' 已注册，envelope 兼容。

## 6. 抽取策略

### 6.1 dutongjian adapter

```ts
const BASE_URL = 'https://www.dutongjian.com/';
const FALLBACK_URLS: string[] = [
  '/zhou-ji/yi',   // 周纪一
  '/zhou-ji/er',
  // ... 实际URL首次本地fetch后回填
];

listUrls(): 抓首页 → cheerio 解析链接（同 shiji-kb 过滤：同站绝对或相对，排除 # 锚点，slice 0,12）
fetchHtml(url): fetch + 4xx throw（同 shiji-kb）
parseHtml(url, html):
  title   = $('.chapter-title, h1').first().text().trim()
  period  = $('.period, .time').first().text().trim()
  paragraphs = $('article p, main p, .content p').filter(Boolean)
  interpretation = '' // 混合策略
normalize(pages):
  let counter = 18; // v1-v17 已用
  volumes: { id: `v${counter++}`, title, period, content, interpretation: '' }
```

### 6.2 hunterhug adapter

```ts
const BASE_URL = 'https://hunterhug.github.io/';
const FALLBACK_URLS: string[] = [/* 本地 fetch 后回填 */];

// 结构同 shiji-kb，但 normalize 用 counter=100
listUrls/fetchHtml/parseHtml: 同 shiji-kb 模式
normalize:
  let counter = 100; // 与 shiji-kb v5+ 明确区分
  volumes: { id: `v${counter++}`, title, chapter, content, interpretation: '' }
```

### 6.3 章节失败策略

沿用 runner 既有 `--partial-ok` 行为（spec 2026-09-29 §6.4）：
- 默认：任一失败 → 整批 exit 1
- `--partial-ok`：跳过失败，其余入库；失败 URL 写到 `staging/<kind>/FAILED-<ts>.txt`

## 7. 测试策略

### 7.1 单元测试（每 adapter 4 个）

**`adapters/dutongjian.test.ts`**：
1. identity（kind='zizhi'）
2. normalize 起始 counter=18（pages[0].id === 'v18'）
3. normalize 空数组 → `volumes: []`
4. parseHtml 抽取 title/period/paragraphs（fixture HTML）

**`adapters/hunterhug.test.ts`**：
1. identity（kind='shiji'）
2. normalize 起始 counter=100（pages[0].id === 'v100'）
3. normalize 空数组
4. parseHtml 抽取 title/chapter/paragraphs（fixture HTML）

### 7.2 ingest-data 端

**`adapters/zizhi.test.ts`**（4 个测试，与 shiji.test.ts 同构）：
1. zizhiAdapter 在 registry 里（`getAdapter('zizhi') === zizhiAdapter`）
2. extract 从信封拿 volumes
3. 校验 missing id
4. 校验 empty content

### 7.3 全量验证

- 根 `npm run lint` 零错误
- 根 `npm run build` 通过
- 根 `npm test` 全绿（既有 205 个 + 新增 12 个 ≈ 217 个）
- `npm run extract:list` 输出三行（shiji / zizhi）

## 8. CLI 与 npm scripts

**根 package.json 无新脚本**：

```bash
# 沿用既有 extract 入口
npm run extract -- dutongjian                # 抽 zizhi 到 staging/zizhi/
npm run extract -- dutongjian --dry-run      # 试跑
npm run ingest -- --kind zizhi                # 入库 zizhi

npm run extract -- hunterhug                  # 抽 shiji 数据到 staging/shiji/
npm run ingest -- --kind shiji                # 合并（与 shiji-kb 数据一起 append-only）
```

## 9. 不做的事（YAGNI）

- ❌ shiji-kb 改动（counter 仍 5）
- ❌ 重写现有手工策展数据（v1-v4 shiji / v1-v17 zizhi 保留）
- ❌ 重复章节去重（hunterhug v100 周本纪 vs shiji-kb v5 周本纪 并存）
- ❌ interpretation 字段 AI 生成
- ❌ 内容清洗 / 繁简转换
- ❌ 抽取其他 hunterhug 子站经典
- ❌ 增量去重（hash 级）

## 10. 验收清单

实现完成时满足：

- [ ] `adapters/dutongjian.ts` 存在，kind='zizhi'
- [ ] `adapters/hunterhug.ts` 存在，kind='shiji'
- [ ] dutongjian normalize 起始 18
- [ ] hunterhug normalize 起始 100
- [ ] 两个 adapter 对应 `.test.ts` 各 4 测试通过
- [ ] `scripts/ingest-data/adapters/zizhi.ts` 存在
- [ ] `scripts/ingest-data/registry.ts` 注册 zizhiAdapter
- [ ] `scripts/ingest-data/adapters/zizhi.test.ts` 4 测试通过
- [ ] 根 `npm run lint` 零错误
- [ ] 根 `npm run build` 通过
- [ ] 根 `npm test` 全绿
- [ ] `npm run extract:list` 显示三行（shiji-kb / dutongjian / hunterhug）
- [ ] `RUNBOOK.md` 增加两条新命令的本地执行步骤
- [ ] 端到端：本地 `extract dutongjian && ingest --kind zizhi` 后 `src/data/zizhi.ts` 追加新条目（id v18+），build 通过
- [ ] 端到端：本地 `extract hunterhug && ingest --kind shiji` 后 `src/data/shiji.ts` 追加新条目（id v100+），build 通过
- [ ] 重跑入库 idempotent（id 碰撞跳过）

## 11. 已知风险与待定

| 状态 |
|------|
| dutongjian / hunterhug 实际 HTML 结构未实测 | 风险：adapter 选择器需本地 fetch 后微调 |
| hunterhug 是否真有 shiji 数据 | 假设有；首次本地 fetch 后如无相关章节需重新评估范围 |
| FALLBACK_URLS 占位 | 首次本地 fetch 后回填真实 URL |
