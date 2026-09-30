# shiji 去重设计（基于 title+chapter）

**日期**：2026-09-30
**状态**：待评审
**前置**：commit `800f396`（三 adapter 全部推送）
**问题**：shiji-kb（v5+）与 hunterhug（v100+）抽到同一篇章时（如 周本纪），两份都会进 `src/data/shiji.ts` —— 当前 ingest 端只查 `id` 碰撞，跨 id range 不会 dedup。

---

## 1. 概述

扩展 `simpleArrayAdapter` 加 `dedupBy` / `dedupFields` 配置项，在 `merge()` 阶段按业务字段（**非 id**）对比现有数据，跳过已有相同 key 的 incoming items，避免重复数据。

shijiAdapter 启用 dedup：`dedupBy = (it) => \`${it.title ?? ''}|${it.chapter ?? ''}\``。其它 adapter 暂不启用（保留 YAGNI）。

## 2. 范围与边界

**包含：**
- `scripts/ingest-data/tsedit.ts` 新增 `extractItemFields(content, ...fieldNames)` 工具
- `scripts/ingest-data/tsedit.test.ts` 新增 2 个测试
- `scripts/ingest-data/adapters/simple-array.ts` 加 `dedupBy` / `dedupFields` 配置 + merge 阶段 dedup 逻辑
- `scripts/ingest-data/adapters/simple-array.test.ts`（或 formula-merge.test.ts）新增 1 个 dedup 集成测试
- `scripts/ingest-data/adapters/shiji.ts` 启用 dedup

**不包含：**
- ❌ dutongjian / hunterhug adapter 改动（不动 extract 端）
- ❌ zizhiAdapter 改动（暂不需要，zizhi 只有单一源 dutongjian）
- ❌ validate() 改动（dedup 是 merge 期做的；仍查 record id 碰撞）
- ❌ TypeScript compiler 解析（regex 够用，不引入复杂度）
- ❌ 重复章节去重 UI（用户手工 grep）
- ❌ 选择器调优（用户本地操作，spec 外）

## 3. 架构

```
ingest pipeline (现有):
  staging JSON → extract() → validate() → merge() → wire()
                                       ↑
                                  现在加 dedup（仅 merge 阶段）
```

**两个改动点**：
- `tsedit.ts`：新增工具函数（无副作用）
- `simple-array.ts`：merge() 内前插入 dedup filter

其它代码不动。

## 4. 适配器接口契约

### 4.1 `SimpleArrayConfig` 扩展

```ts
export interface SimpleArrayConfig {
  kind: string;
  envelopeKey: string;
  typeRef: TypeRef;
  file: string;
  arrayName: (item: unknown, raw: unknown) => string;
  checks?: (items: { id: string }[], ctx: IngestContext) => string[];
  /** 新增：dedup key 函数。返回相同 key 的 incoming item 会被跳过。返回空字符串 → 不参与 dedup。 */
  dedupBy?: (item: Record<string, unknown>) => string;
  /** 新增：与 dedupBy 配套，用于从现有数据文件抽取字段以重建 dedup key。 */
  dedupFields?: string[];
}
```

### 4.2 shijiAdapter 配置新增

```ts
dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
dedupFields: ['title', 'chapter'],
```

## 5. 关键工具函数

### 5.1 `extractItemFields`（新增到 `tsedit.ts`）

```ts
/** 从源文件提取每个 item 块的字段映射。
 *  item 块按最外层 {...} 切分（不适用于嵌套对象，但本项目所有 array item 都是 flat 的）。
 *  返回并行数组：[{ field1: 'v1', field2: 'v2' }, ...]。 */
export function extractItemFields(
  content: string,
  ...fieldNames: string[]
): Array<Record<string, string>> {
  const items: Array<Record<string, string>> = [];
  const itemRegex = /\{[^{}]*\}/g;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(content))) {
    const block = m[0];
    const entry: Record<string, string> = {};
    for (const f of fieldNames) {
      const re = new RegExp(`\\b${f}:\\s*['"]([^'"]+)['"]`);
      const fm = re.exec(block);
      if (fm) entry[f] = fm[1];
    }
    if (Object.keys(entry).length > 0) items.push(entry);
  }
  return items;
}
```

## 6. merge 阶段 dedup 流程

```ts
merge(value, raw, ctx) {
  const abs = join(ctx.root, cfg.file);
  const content = readFileSync(abs, 'utf-8');
  let items = value as Record<string, unknown>[];

  // 新增：dedup against existing data
  if (cfg.dedupBy && cfg.dedupFields) {
    const existingItems = extractItemFields(content, ...cfg.dedupFields);
    const existingKeys = new Set(
      existingItems
        .map(e => cfg.dedupBy!(e as Record<string, unknown>))
        .filter(k => k.length > 0)
    );
    const filtered: typeof items = [];
    for (const it of items) {
      const key = cfg.dedupBy(it);
      if (key && existingKeys.has(key)) {
        console.error(`[ingest-data] ${cfg.kind}: skip "${key}" — 已有`);
      } else {
        filtered.push(it);
      }
    }
    items = filtered;
  }

  // 原有 appendToConstArray 逻辑不变
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const it of items) {
    const name = cfg.arrayName(it, raw);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push(it);
  }
  let updated = content;
  for (const [name, group] of groups) {
    updated = appendToConstArray(updated, name, group);
  }
  writeFileSync(abs, updated, 'utf-8');
  return { files: [abs], inserted: items.length };
}
```

### 6.1 边界行为

| 情况 | 行为 |
|---|---|
| `dedupBy(item)` 返回空字符串 | 该 item 不参与 dedup（避免空 title 把所有 item 误判为同一 key） |
| `dedupBy` 配了但 `dedupFields` 漏配 | adapter 配置错误，TypeScript 编译失败 |
| 现有数据文件不存在（首次入库） | `extractItemFields` 返回 `[]`，无 dedup 比对，全部 append |
| 现有数据中有相同 key | skip + stderr warn `[ingest-data] shiji: skip "周本纪|卷四" — 已有` |
| 同一 envelope 内有重复 key（hunterhug 抽到重复） | 不去重（去重仅针对现有文件）—— 这是 YAGNI 边界 |

## 7. 测试策略

### 7.1 `tsedit.test.ts` 新增 2 个测试

- `extractItemFields` 提取 title+chapter 正确（验证并行数组结构）
- `extractItemFields` 对缺失字段返回空记录 / 跳过

### 7.2 `simple-array.test.ts`（或 formula-merge.test.ts）新增 1 个集成测试

- mock fs 构造 existing data (周本纪 v1)
- 给 adapter 传 dedupBy + dedupFields
- 喂入 incoming (周本纪 v_new, 夏本纪 v_new)
- 验证：
  - 夏本纪 append 到结果
  - 周本纪 **不** append
  - inserted 计数 = 1（不是 2）
  - stderr 含 skip log

### 7.3 现有测试不受影响

- 其它 adapter（tutorial / formula / knowledge / prompt / 等）不配 `dedupBy`，行为不变
- validate() 阶段不受影响（仍查 record id 碰撞）

### 7.4 端到端

- 根 `npm run lint` 零错误
- 根 `npm run build` 通过
- 根 `npm test` 全绿（既有 217 + 新增 3 ≈ 220）

## 8. CLI 与 npm scripts

**无新脚本**。沿用 `npm run ingest -- --kind shiji`，自动应用 dedup。

## 9. 不做的事（YAGNI）

- ❌ TypeScript compiler 解析现有数据
- ❌ 跨 envelope 内去重（intra-batch dedup）
- ❌ zizhiAdapter / 其它 adapter 启用 dedup
- ❌ Source priority 列表（复杂；当前「先到先得 + stderr warn」足够）
- ❌ 内容哈希去重
- ❌ UI 标记重复章节

## 10. 验收清单

实现完成时满足：

- [ ] `tsedit.ts` 新增 `extractItemFields` 函数 + JSDoc
- [ ] `tsedit.test.ts` 新增 2 测试通过
- [ ] `SimpleArrayConfig` 加 `dedupBy` / `dedupFields` 两个可选字段
- [ ] `simple-array.ts` merge() 加 dedup filter（保留原有 appendToConstArray 逻辑）
- [ ] `simple-array.test.ts`（或 formula-merge.test.ts）新增 1 个集成测试通过
- [ ] `shijiAdapter` 启用 `dedupBy` + `dedupFields`
- [ ] shijiAdapter 现有 4 测试不受影响
- [ ] 根 `npm run lint` 零错误
- [ ] 根 `npm run build` 通过
- [ ] 根 `npm test` 全绿
- [ ] 现有 217 个测试 + 新增 3 ≈ 220 个通过

## 11. 已知风险

| 风险 | 缓解 |
|---|---|
| `extractItemFields` regex 不适用于嵌套对象 | 本项目所有 array item 都是 flat 的；future-proof 但当前够用 |
| shiji.ts 数据文件未来字段重排（如多行 title） | 单元测试覆盖典型格式；新增 fixture 时回归 |
| 现有数据 v1-v4 与 hunterhug v100+ 完全相同（不可能但理论） | 走 skip 路径，不丢数据，但需要用户事后手动决定保留哪份 |
