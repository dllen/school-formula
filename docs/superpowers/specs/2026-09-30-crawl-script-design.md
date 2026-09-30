# crawl 一键脚本设计

**日期**：2026-09-30
**状态**：待评审
**前置**：extract-data / ingest-data 已落地（commit `dfe342a`，ref-libs.md 归档在 `f950a21`）

---

## 1. 概述

新增顶层 bash wrapper `scripts/crawl.sh`，组合 `extract-data` 与 `ingest-data` 的现有 CLI，提供：
- `npm run crawl` — 一键跑全部 3 adapter extract + ingest
- `npm run crawl:extract` / `crawl:ingest` — 拆开跑
- `npm run crawl:dry` — 全 dry-run
- `npm run crawl:report` — 读最新一份 crawl report

每跑一次写一份 `staging/crawl-report-<ISO8601>.json` 含每个 adapter 的 ok/failed + ingest 结果。

## 2. 范围与边界

**包含：**
- 新增 `scripts/crawl.sh`（~40 行 bash，chmod +x）
- 根 `package.json` 加 5 个 npm scripts
- `--help` 文本

**不包含：**
- ❌ 新子包（YAGNI，组合逻辑 shell 足够）
- ❌ 新测试（YAGNI，bash 集成靠手动 + 框架既有测试覆盖）
- ❌ cron / launchd 自动调度（用户自己配）
- ❌ 增量 diff / 通知 webhook
- ❌ 并行 extract（顺序执行 + 既有 rate limit 够用）

## 3. 文件改动

| 文件 | 改动 |
|---|---|
| `scripts/crawl.sh` | 新增（chmod +x） |
| `package.json`（根） | 5 个 npm scripts 追加 |

无其它改动。框架代码、其它子包、ref-libs、staging/INGEST 数据文件零变化。

## 4. CLI 签名

```bash
scripts/crawl.sh [flags]
```

| Flag | 行为 |
|---|---|
| (无) | 全部 3 adapter extract + ingest |
| `--extract-only` / `--no-ingest` | 只跑 extract |
| `--ingest-only` / `--no-extract` | 只跑 ingest |
| `--dry-run` | extract 与 ingest 都加 `--dry-run`，不写盘 |
| `--adapter <name>` | 只跑指定 kind（默认 `shiji` + `zizhi`；shiji 跑两次即 shiji-kb + hunterhug） |
| `--quiet` / `-q` | 只打 summary，不打 fetch 日志 |
| `--no-cache` | 转发给 extract（清缓存重抓） |
| `--help` / `-h` | 帮助 |

## 5. 实现流程

1. parse args
2. extract phase：对每个 adapter 跑 `bash scripts/extract-data/extract.sh <kind> <args>`，捕获 exit code
3. ingest phase：跑 `bash scripts/ingest-data/ingest.sh --all <args>`（除非 `--no-ingest`）
4. 写 `staging/crawl-report-<ISO8601>.json`：
   ```json
   {
     "timestamp": "2026-09-30T12:34:56Z",
     "extract": [
       { "adapter": "shiji", "status": "ok" },
       { "adapter": "zizhi", "status": "failed", "exit": 1 }
     ],
     "ingest": [{ "status": "ok" }]
   }
   ```
5. exit code：全 ok → 0；任一 failed → 1

## 6. npm scripts

```jsonc
{
  "scripts": {
    "crawl": "bash scripts/crawl.sh",
    "crawl:extract": "bash scripts/crawl.sh --no-ingest",
    "crawl:ingest": "bash scripts/crawl.sh --no-extract",
    "crawl:dry": "bash scripts/crawl.sh --dry-run",
    "crawl:report": "ls -t staging/crawl-report-*.json 2>/dev/null | head -1 | xargs cat"
  }
}
```

## 7. 验收

- [ ] `scripts/crawl.sh --help` 输出
- [ ] `scripts/crawl.sh` 可执行（755）
- [ ] `npm run crawl --dry-run` 不写 staging 也不动 src/data，写 report
- [ ] `npm run crawl:extract` 只跑 extract
- [ ] `npm run crawl:ingest` 只跑 ingest
- [ ] `npm run crawl:report` 读最新 report
- [ ] 根 `npm run lint` 零错误
- [ ] 根 `npm test` 全绿（既有 221 + 0 = 221）

## 8. 已知风险

| 风险 | 缓解 |
|---|---|
| bash flag 解析对边缘情况（quoted args） | 用简单 for-case 模式，文档明示用法 |
| report 文件累积 | 加 `.gitignore` 排除 `staging/crawl-report-*.json` |
| ingest 失败但 extract 已写 staging | 下次跑 crawl:ingest 会 idempotent 重新处理（dedup 保证不重复入库） |
