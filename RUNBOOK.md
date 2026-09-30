# extract-data End-to-End Runbook

> 本文档记录 `extract-data` 子包 + `shiji-kb` adapter 的端到端验证流程。

## 概述

- **目标**: 从 `baojie.github.io/shiji-kb/` 抽取 12 篇《史记》本纪，合并入 `src/data/shiji.ts`
- **已完成**: Tasks 1-12 (框架 + adapter + ingest-data 消费者) ✅
- **待验证**: Task 13 (真实网络抽取 + 入库)

## 验证步骤

### Step 1: Dry-run 测试（仅列出 URL，不写盘）

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula
npm run extract -- shiji --dry-run
```

**预期输出**:
```
[extract-data] shiji: 12 URLs planned
[extract-data] fetching: https://baojie.github.io/shiji-kb/...
...
```

**注意**: 沙箱环境会报 `fatal: fetch failed`（DNS 不可用），这是正常的。

---

### Step 2: 真实抽取（写盘）

```bash
npm run extract -- shiji
```

**预期输出**:
```
[extract-data] shiji: 12 URLs planned
[extract-data] fetching: https://baojie.github.io/shiji-kb/...
[extract-data] written: staging/shiji/extracted-<timestamp>.json
```

**检查**:
```bash
ls -la staging/shiji/
```

---

### Step 3: 入库

```bash
npm run ingest -- --kind shiji
```

**预期输出**:
```
[ingest-data] shiji adapter registered
[ingest-data] append N volumes to src/data/shiji.ts
```

---

### Step 4: 验证 src/data/shiji.ts

```bash
grep -c "id:" src/data/shiji.ts
# 预期: 16 (原 4 条 + 新 12 条)
```

检查:
- 顶部保留原 4 条手工策展条目 (id v1-v4)
- 末尾追加 12 条新条目 (id v5-v16)
- `interpretation` 字段可为空字符串

---

### Step 5: 构建验证

```bash
npm run build
```

**预期**: 零错误

---

### Step 6: 幂等性验证

再次运行入库，验证 id 碰撞跳过：

```bash
npm run ingest -- --kind shiji
```

**预期**: 显示 `0 volumes inserted`（全部跳过），无 diff

---

### Step 7: 提交

```bash
git add src/data/shiji.ts
git commit -m "feat(data): merge 12 extracted 本纪 into src/data/shiji.ts"
```

---

## 调试技巧

### 单 URL 调试

```bash
npm run extract -- shiji --url "https://baojie.github.io/shiji-kb/taizu.html"
```

### 查看可用 adapter

```bash
npm run extract:list
```

### 查看 ingest 列表

```bash
npm run ingest -- --list
```

---

## 已知限制

1. **HTML 选择器可能需调优**: `shiji` adapter 中的 cheerio 选择器基于页面结构假设，需根据实际 `baojie.github.io/shiji-kb/` 结构调整
2. **网络依赖**: 必须有真实网络访问，沙箱无法完成
3. **interpretation 字段**: 新抽取的条目 `interpretation` 暂时为空字符串，需后续手动补充或批量生成

---

## 相关文件

- `scripts/extract-data/` - 抽取框架
- `scripts/extract-data/adapters/shiji.ts` - shiji adapter
- `scripts/ingest-data/adapters/shiji.ts` - 入库 adapter
- `src/data/shiji.ts` - 目标数据文件
- `docs/superpowers/plans/2026-09-29-extract-data-shiji-kb.md` - 完整计划

---

## 完成后

- [ ] Step 1: dry-run 输出 12 URLs
- [ ] Step 2: staging/shiji/ 写入 extracted JSON
- [ ] Step 3: ingest 追加 12 条
- [ ] Step 4: src/data/shiji.ts 总长 16
- [ ] Step 5: npm run build 零错误
- [ ] Step 6: 幂等性验证通过
- [ ] Step 7: 提交成功

---

## D. 抽取读通鉴（资治通鉴）

```bash
npm run extract -- dutongjian --dry-run
npm run extract -- dutongjian
npm run ingest -- --kind zizhi
```

期望：`src/data/zizhi.ts` 末尾追加新条目（id `v18+`），现有 v1-v17 不变。

## E. 抽取 Hunterhug 史记

```bash
npm run extract -- hunterhug --dry-run
npm run extract -- hunterhug
npm run ingest -- --kind shiji
```

期望：`src/data/shiji.ts` 末尾追加新条目（id `v100+`），现有 v1-v4 + 之前 shiji-kb 抽取的 v5+ 不变。

注：hunterhug 抽到的 shiji 数据与 shiji-kb 数据并存（不同 ID 区间），不会覆盖。可手动挑选保留哪一份。
