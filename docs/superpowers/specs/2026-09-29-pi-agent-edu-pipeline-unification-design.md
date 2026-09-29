# B 子项目 · 数据生产管线统一设计

> 日期：2026-09-29
> 状态：已实施完成（2026-09-29，落地至 commit 369c640；3 处实施偏差见文末「实施偏差记录」）
> 子项目 ID：B（数据生产管线统一；A 子项目 = 架构与代码质量重构，已完成于 commit dab192b）
> 范围：B 不包含后续 pi-agent-edu config/io/prompts/staging 拆分、不包含 adapter 补测试、不动 deploy 文档

## 概述

针对 A 完成后剩余的数据生产管线空间，做一轮统一：

1. **`scripts/pi-agent-edu/index.ts`** (503 行) 拆为树形目录 `cli/{args,output,help}.ts` + `wizard/{data,mapping,index}.ts`，`index.ts` 缩为 296 行 entry（main() 的 ~250 行交互式 REPL 受「行为不变」约束保留在 entry，见偏差 D-1）。
2. **`scripts/pi-agent-edu/session.ts`** (323 行) 拆为 `session/{types,helpers,class,index}.ts` 目录 + barrel。
3. **删除 `scripts/pi-agent-edu/eslint.config.js`**；顶层 `eslint.config.js` 加 Node globals overrides + 关 react-hooks 规则在 scripts 路径下的触发。
4. **vitest 接管 scripts/**：14 个 `.test.ts` 文件从 `import { ... } from 'node:test'` 改为 `from 'vitest'`；顶层 `vitest.config.ts` 以 workspace `projects` 双环境覆盖 `src/**`（happy-dom）+ `scripts/**`（node）（见偏差 D-3）；子包 `package.json` 的 `test` 命令改为 `vitest run`。
5. **文档同步**：`AGENTS.md` + `CLAUDE.md` + `scripts/pi-agent-edu/README.md` + `scripts/ingest-data/README.md` 反映新结构。

行为不变 + 允许顺手清理（注释 typo / 过期引用 / a11y / 删除注释块）。**不**允许调整用户可见文本、CLI 参数语义、staging JSON 格式、prompt 模板字符串、错误信息字符串。

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| `pi-agent-edu/index.ts` 拆法 | 树形目录 `cli/` + `wizard/` + `index.ts` entry | 与 A 的"树形 + barrel"风格一致；wizard 与 cli 物理分离 |
| `pi-agent-edu/session.ts` 拆法 | 拆为目录 `session/{types,helpers,class,index}.ts` | 322 行单 class 文件过大；types 可独立复用 |
| ESLint 双入口处理 | 完全合并到主项目 `eslint.config.js` | 单一 lint 入口；用 Node globals + overrides 区分 scripts/ |
| vitest 接管方式 | V1（全切 vitest 语法） | 最干净；测试代码改动 1-5 行/文件 |
| 子包 `test` 命令 | 子包 `test` 改 `vitest run` | 子包独立开发者仍可 `cd scripts/X && npm test` |
| adapters/ 结构 | 不动 | simple-array 是合理 factory + domain-specific adapter 分层已合理 |
| 文档同步范围 | 顶层 + 子包 README（4 个文档） | 开发者从各入口读起都准 |
| DEPLOYMENT.md 顺手修 | 不做 | 拉出 B 范围外 |

## 目标文件结构

### `scripts/pi-agent-edu/cli/`

```
scripts/pi-agent-edu/cli/
├── args.ts     # parseCliArgs + CliArgs 类型
├── output.ts   # timestampName + saveContent + errMsg
└── help.ts     # showHelp 帮助文本
```

### `scripts/pi-agent-edu/wizard/`

```
scripts/pi-agent-edu/wizard/
├── data.ts     # STAGES + SUBJECTS_BY_STAGE + GRADES_BY_STAGE + TASKS + DIFFICULTIES + QUESTION_COUNTS + KNOWN_KINDS
├── mapping.ts  # Task 类型 + WizardResult 类型 + kindFromTask
└── index.ts    # runWizard + buildPromptFromWizard（重新导出 Task 等类型）
```

### `scripts/pi-agent-edu/session/`

```
scripts/pi-agent-edu/session/
├── types.ts     # SessionEvent + SessionEventListener + SessionCreateOptions
├── helpers.ts   # DIM（ANSI dim 包装）+ summarize
├── class.ts     # InteractiveSession class 主体
└── index.ts     # barrel: export type { ... } from './types'; export { InteractiveSession } from './class';
```

### `scripts/pi-agent-edu/index.ts`（entry）

```ts
// scripts/pi-agent-edu/index.ts (296 行；main() 交互 REPL 保留，见偏差 D-1)
import { parseCliArgs } from './cli/args.js';
import { runWizard, buildPromptFromWizard } from './wizard/index.js';
import { InteractiveSession } from './session/index.js';
import { createModelRuntime } from './config.js';
import { print, prompt, selectOption } from './io.js';
// ... 原 main() body
```

### 顶层 `eslint.config.js` 单入口

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'scripts/*/node_modules/**', '.wrangler/**', 'scripts/**/*.mjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
    },
  },
  {
    files: ['scripts/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['scripts/**/*.test.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
```

### 顶层 `vitest.config.ts` 扩展（workspace projects，见偏差 D-3）

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // vitest 5 无 environmentMatchGlobs，改用 workspace projects 双环境：
    // app（src/**）需要 DOM（localStorage/window）→ happy-dom
    // scripts（scripts/**）是 Node CLI、读 import.meta.url → node
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          environment: 'happy-dom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['node_modules', 'dist'],
        },
      },
      {
        extends: true,
        test: {
          name: 'scripts',
          environment: 'node',
          include: ['scripts/**/*.{test,spec}.ts'],
          exclude: ['node_modules', 'dist', 'scripts/*/node_modules/**'],
        },
      },
    ],
  },
});
```

## 删除清单

| 路径 | 类型 | 理由 |
|------|------|------|
| `scripts/pi-agent-edu/index.ts` | 改写 | 503 行 → 拆为树形 + 缩为 296 行 entry（偏差 D-1） |
| `scripts/pi-agent-edu/session.ts` | 删除 | 拆为 `session/` 目录 |
| `scripts/pi-agent-edu/eslint.config.js` | 删除 | 合并到顶层 `eslint.config.js` |

## 14 个 test 文件 import 切换

每个 `.test.ts` 文件首行：

```ts
- import { describe, it, expect, mock, beforeEach, afterEach } from 'node:test';
+ import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
```

`mock.fn()` → `vi.fn()`；`mock.method()` → `vi.mocked(method)`。

**scripts 子包 `package.json` 的 test 命令**

```jsonc
// scripts/ingest-data/package.json — diff
{
  "scripts": {
    "test": "vitest run"
  }
}

// scripts/pi-agent-edu/package.json — diff
{
  "scripts": {
    "test": "vitest run"
  }
}
```

## 数据流

### `scripts/pi-agent-edu/` 拆后内部依赖图

```
index.ts (entry, 296 行)
  ├── cli/args.ts        → 无内部依赖
  ├── cli/output.ts      ← config.js (getProjectRoot)
  ├── cli/help.ts        ← io.js (print)
  ├── wizard/index.ts
  │   ├── wizard/data.ts       → 无内部依赖
  │   ├── wizard/mapping.ts    → 依赖 data.ts (Task)
  │   └── ← config.js (ModelChoice), io.js (print, selectOption)
  ├── session/index.ts (barrel)
  │   ├── session/types.ts     → 无内部依赖
  │   ├── session/helpers.ts   → 无内部依赖
  │   └── session/class.ts
  │       ├── ← types.ts (SessionEvent, SessionEventListener, SessionCreateOptions)
  │       ├── ← helpers.ts (DIM, summarize)
  │       ├── ← io.js (print)
  │       ├── ← config.js (Config, getAgentDir, ThinkingLevel)
  │       └── ← prompts.js (getSystemPrompt)
  ├── config.js          (不动)
  ├── io.js              (不动)
  ├── prompts.js         (不动)
  └── staging.js         (不动)
```

### `session/index.ts` barrel 导出

```ts
export type { SessionEvent, SessionEventListener, SessionCreateOptions } from './types.js';
export type { ThinkingLevel } from '../config.js';
export { InteractiveSession } from './class.js';
```

### 测试运行路径

| 命令 | runner | 跑什么 |
|------|--------|--------|
| 顶层 `npm test` | vitest | `src/**` + `scripts/**` |
| `cd scripts/ingest-data && npm test` | vitest run | 同 vitest.config.ts include |
| `cd scripts/pi-agent-edu && npm test` | vitest run | 同上 |

## 错误处理

错误信息字符串保持原样（行为不变约束）：
- `errMsg(err: unknown)` 返回的字符串模板
- `runWizard` 内部所有 `print(...)` 文本（包含 emoji）
- `main()` 的 try/catch 错误路径
- InteractiveSession 抛出的 Error

`buildPromptFromWizard` 返回的 prompt 模板保持原样。

## 验收清单

| 编号 | 项 | 通过判定 |
|------|---|---------|
| AC-1 | `npm run lint` | 0 error（含 scripts 路径） |
| AC-2 | `npm run build` | tsc -b 通过 + vite build 0 错 |
| AC-3 | `npm test`（vitest） | src/ + scripts/ 全部测试通过；零 "No test suite found" |
| AC-4 | `cd scripts/ingest-data && npm test` | vitest run 跑该子包测试 |
| AC-5 | `cd scripts/pi-agent-edu && npm test` | vitest run 跑该子包测试 |
| AC-6 | `scripts/pi-agent-edu/cli/{args,output,help}.ts` | 3 个文件存在 |
| AC-7 | `scripts/pi-agent-edu/wizard/{data,mapping,index}.ts` | 3 个文件存在 |
| AC-8 | `scripts/pi-agent-edu/session/{types,helpers,class,index}.ts` | 4 个文件存在 |
| AC-9 | `scripts/pi-agent-edu/session.ts` 不存在 | 迁位置完成 |
| AC-10 | `scripts/pi-agent-edu/eslint.config.js` 不存在 | ESLint 双入口合并完成 |
| AC-11 | 顶层 `eslint.config.js` 含 scripts overrides | Node globals + react-hooks 关闭 |
| AC-12 | 顶层 `vitest.config.ts` 覆盖 scripts | workspace `projects` 含 `name: 'scripts'`（node 环境），include `'scripts/**/*.{test,spec}.ts'` |
| AC-13 | 14 个 test 文件全用 vitest import | `grep -r "from 'vitest'" scripts/ --include='*.ts' --exclude-dir=node_modules` 输出 = 14 |
| AC-14 | 14 个 test 文件无 node:test 残留 | `grep -r "from 'node:test'" scripts/ --include='*.ts' --exclude-dir=node_modules` 零输出（须排除 node_modules，其中 `@types/node` 的 `.d.ts` 含 `node:test` 字样） |
| AC-15 | 文档同步 | 4 个文档反映新结构 |
| AC-16 | 行为不变 — CLI 参数 | `--sessions` / `--continue` / `--new` / `--help` 仍可用 |
| AC-17 | 行为不变 — staging JSON 格式 | `gen:dsl` 生成内容与拆前字节相同（手动 smoke） |
| AC-18 | scripts 子包 node_modules | 子包 `tsx` 仍为 dev 依赖 |
| AC-19 | import path 修复 | `grep "from './session.js'" scripts/` 零输出（除 session 目录内部） |

## 风险与回滚

### Phase 拆分（5 phase，独立可回滚）

```
Phase 1: refactor(pi-agent-edu): split index.ts into cli/ + wizard/ subdirectories
          - 创建 cli/args.ts + cli/output.ts + cli/help.ts
          - 创建 wizard/data.ts + wizard/mapping.ts + wizard/index.ts
          - 缩 index.ts 为 entry
          （~3-5 commits）

Phase 2: refactor(pi-agent-edu): split session.ts into session/ subdirectory
          - 创建 session/types.ts + session/helpers.ts + session/class.ts + session/index.ts
          - 删除 session.ts
          - 修复 `from './session.js'` → `from './session/index.js'`
          （1-2 commits）

Phase 3: chore(eslint): merge scripts/pi-agent-edu/eslint.config.js into root
          - 删除 scripts/pi-agent-edu/eslint.config.js
          - 顶层 eslint.config.js 加 scripts overrides（Node globals + 关 react-hooks）
          - npm run lint 验证 scripts 也被 lint
          （1 commit）

Phase 4: test(scripts): migrate scripts/* from node:test to vitest syntax
          - 顶层 vitest.config.ts 改 workspace projects（app=happy-dom + scripts=node）
          - 14 个 test 文件 import 改 vitest
          - scripts 子包 package.json test 改 "vitest run"
          - npm test 验证 src + scripts 全通过
          （~2-3 commits）

Phase 5: docs: update AGENTS/CLAUDE/READMEs for B refactor
          - AGENTS.md 更新（数据生产管线、ESLint、测试章节）
          - CLAUDE.md 更新
          - scripts/pi-agent-edu/README.md 重写
          - scripts/ingest-data/README.md 轻调
          （2-4 commits）
```

### 回滚命令模板

```bash
git revert <commit-sha>
```

任一 phase 失败单独 revert；其他 phase 不受影响。

### 风险等级

| Phase | 风险 | 缓解措施 |
|-------|------|----------|
| 1: 拆 index.ts | 中 | 拆出 cli/wizard 子目录后，import 路径必须正确（`./cli/args.js` 等）；main() 的逻辑搬到 index.ts entry |
| 2: 拆 session.ts | 中 | session.ts → `session/class.ts` 路径迁移；所有 `from './session.js'` 改为 `from './session/index.js'`；class 内部 private fields 不变 |
| 3: ESLint 合并 | 低 | 顶层 config 加 overrides 即可；删除 scripts 子包 config 后 `npm run lint` 仍能跑遍整个项目 |
| 4: vitest 接管 | 中 | 14 个 test 文件 import 切换需逐个验证；子包 `tsconfig.json` 可能影响 vitest module resolution，需实测 |
| 5: 文档同步 | 低 | 仅 markdown 更新 |

## 不在 B 范围 / 留给未来

1. **`scripts/ingest-data/adapters/{cheatsheet,mental-math,technique,formula}` 仍无单测** — 留待未来补测试子任务。
2. **`scripts/pi-agent-edu/{config,io,prompts,staging}.ts` 不拆** — 行数较小（≤ 123 行），结构 OK。
3. **ESLint 规则精细统一** — B 仅做"scripts 路径配置 Node globals + 关 react-hooks"；不强求规则集合完全统一。留待未来 lint 一致性子任务。
4. **vitest 在 scripts 子包下的 module resolution 调试** — ~~Phase 4 实施时若踩雷~~（已解决：scripts project 用 node 环境规避 `import.meta.url` 与 happy-dom 不兼容，见偏差 D-3；未需 `resolve.alias` 或 tsconfig 调整）。
5. **scripts 子包的 `package.json` 的 `type: module` 字段** — 当前已 `type: module`，与 vitest 兼容。B 不动。
6. **DEPLOYMENT.md 顺手修 base 路径不一致** — 已知问题（DEPLOYMENT.md 写 `/school-formula/`，实际是 `/`），留给后续 dev infra 子任务。

## 实施顺序总结

1. **Phase 1**：拆 `scripts/pi-agent-edu/index.ts` → `cli/` + `wizard/` + entry（~3-5 commits）
2. **Phase 2**：拆 `scripts/pi-agent-edu/session.ts` → `session/` 目录（1-2 commits）
3. **Phase 3**：ESLint 双入口合并（1 commit）
4. **Phase 4**：vitest 接管 scripts/（~2-3 commits）
5. **Phase 5**：文档同步（2-4 commits）

每 phase 完成后跑 `npm run lint && npm run build && npm test` 验证 AC-1/2/3，通过后再进下一 phase。

## 变更前 / 后基线对照

| 指标 | B 拆前 | B 拆后 |
|------|--------|--------|
| `scripts/pi-agent-edu/index.ts` | 503 行 | 296 行 entry（偏差 D-1） |
| `scripts/pi-agent-edu/session.ts` | 323 行 | 不存在 |
| `scripts/pi-agent-edu/cli/` | 不存在 | 3 个 .ts 文件 |
| `scripts/pi-agent-edu/wizard/` | 不存在 | 3 个 .ts 文件 |
| `scripts/pi-agent-edu/session/` | 不存在 | 4 个 .ts 文件 + barrel |
| `scripts/pi-agent-edu/eslint.config.js` | 存在 | 不存在 |
| 顶层 `eslint.config.js` | 双入口 | 单入口 + scripts overrides |
| 顶层 `vitest.config.ts` | include 仅 src/ | workspace `projects` 双环境（app=happy-dom + scripts=node，偏差 D-3） |
| scripts 测试 runner | `node --import tsx --test` | vitest |
| 顶层 `npm test` 测试数 | 113 passing | 164 passing（+22 ingest + 29 pi-agent-edu） |

## 实施偏差记录（2026-09-29 回填）

实施过程中产生 3 处对原设计的偏差，均经 inline review 确认接受，特回填如下；上文相关章节（代码草图、验收清单、基线对照）已按落地实况同步修订。

| 编号 | 偏差 | 原设计 | 实际落地 | 原因 |
|------|------|--------|----------|------|
| D-1 | `index.ts` 最终行数 | ~30 行 entry | 296 行 | `main()` 内含 ~250 行交互式 REPL（`while` 循环 + readline 人机对话），受「行为不变」约束不能拆分到独立模块；实际拆出的 `cli/` + `wizard/` 共 ~207 行，拆分本身符合预期 |
| D-2 | ESLint ignores 与 scripts 规则集扩大 | ignores 仅 `dist/node_modules/scripts/*/node_modules`；scripts overrides 仅关 react-hooks | ignores 追加 `.wrangler/**`、`scripts/**/*.mjs`；scripts overrides 增补 `@typescript-eslint/no-unused-vars`（`_` 前缀豁免）与 `no-explicit-any: warn`，并单列 `scripts/**/*.test.ts` 关 `no-explicit-any` | flat config 默认全局 lint，`.wrangler`（wrangler 本地状态目录）与遗留 `.mjs` 脚本泄露进 lint 范围；scripts 既有代码的 `_unused` 参数与测试中的 `any` 需要对应规则豁免才能零错误 |
| D-3 | vitest scripts 接入方式 | 单 `environment: 'happy-dom'` + `include` 扩展 | workspace `projects` 双环境（app=happy-dom + scripts=node） | vitest 5 无 `environmentMatchGlobs`；且 scripts 测试读 `import.meta.url`，与 happy-dom 不兼容，必须用 node 环境 |
