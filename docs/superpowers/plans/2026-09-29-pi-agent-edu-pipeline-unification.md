# Pi-Agent-Edu Pipeline Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 拆 `scripts/pi-agent-edu/index.ts` (503 行) 和 `session.ts` (323 行) 为树形目录；删除 `scripts/pi-agent-edu/eslint.config.js` 合并到顶层；vitest 接管 scripts/（14 个 test 文件改 import + 子包 `test` 命令改 vitest run）；同步 AGENTS.md/CLAUDE.md/2 个 README.md。

**Architecture:** 5 个独立 phase，每个 phase 一个或多个独立 commit 可单独 revert。`pi-agent-edu/index.ts` 拆为 `cli/{args,output,help}.ts` + `wizard/{data,mapping,index}.ts` + `index.ts` entry；`pi-agent-edu/session.ts` 拆为 `session/{types,helpers,class,index}.ts` + barrel；ESLint 单入口加 scripts overrides（Node globals + 关 react-hooks）；vitest 接管 scripts/（V1 全切 vitest 语法）。

**Tech Stack:** TypeScript 5.9.3、Node.js 22+、Vitest 5.0.0、ESLint 9 (flat config)、tsx 4.19、@earendil-works/pi-coding-agent 0.85.1。

**Reference Spec:** `docs/superpowers/specs/2026-09-29-pi-agent-edu-pipeline-unification-design.md` (commit 3117d78)

---

## File Structure

### New Files (10)

```
scripts/pi-agent-edu/cli/
├── args.ts     # parseCliArgs + CliArgs 类型
├── output.ts   # timestampName + saveContent + errMsg
└── help.ts     # showHelp 帮助文本

scripts/pi-agent-edu/wizard/
├── data.ts     # STAGES + SUBJECTS_BY_STAGE + GRADES_BY_STAGE + TASKS + DIFFICULTIES + QUESTION_COUNTS + KNOWN_KINDS
├── mapping.ts  # Task 类型 + WizardResult 类型 + kindFromTask
└── index.ts    # runWizard + buildPromptFromWizard（重新导出 Task 等类型）

scripts/pi-agent-edu/session/
├── types.ts    # SessionEvent + SessionEventListener + SessionCreateOptions
├── helpers.ts  # DIM + summarize
├── class.ts    # InteractiveSession class 主体
└── index.ts    # barrel
```

### Modified Files

```
eslint.config.js                         # 加 scripts overrides
vitest.config.ts                         # include 加 scripts/**
scripts/ingest-data/package.json         # test 命令改 vitest run
scripts/pi-agent-edu/package.json        # test 命令改 vitest run
scripts/pi-agent-edu/index.ts            # 缩为 ~30 行 entry
scripts/pi-agent-edu/index.ts (原 main body) → 迁到 entry
AGENTS.md                                # 文档同步
CLAUDE.md                                # 文档同步
scripts/pi-agent-edu/README.md           # 重写
scripts/ingest-data/README.md            # 轻调
```

### Deleted Files

```
scripts/pi-agent-edu/session.ts                # 拆为目录
scripts/pi-agent-edu/eslint.config.js          # 合并到顶层
```

### Test Files (14 modified)

```
scripts/ingest-data/{index,mapping,tsedit,validate}.test.ts          # 4 个
scripts/ingest-data/adapters/{formula-merge,knowledge,prompt,question-bank,simple-array,tutorial}.test.ts  # 6 个
scripts/pi-agent-edu/{config,index,io,staging}.test.ts                # 4 个
```

---

## Phase 1: 拆 scripts/pi-agent-edu/index.ts

### Task 1: 创建 cli/args.ts

**Files:**
- Create: `scripts/pi-agent-edu/cli/args.ts`

- [ ] **Step 1: 从原 index.ts 提取 parseCliArgs**

读取 `scripts/pi-agent-edu/index.ts` L41-55（`function parseCliArgs(): CliArgs` 与 `CliArgs` 类型定义），原样提取到 `scripts/pi-agent-edu/cli/args.ts`：

```ts
// scripts/pi-agent-edu/cli/args.ts
// ... 从原 index.ts 完整复制 parseCliArgs 实现
```

注：保留所有行为不变；不改错误信息、参数解析顺序。

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error（文件暂未挂载，但 tsc 应不报错）。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/cli/args.ts
git commit -m "refactor(pi-agent-edu): extract cli/args.ts (parseCliArgs)"
```

### Task 2: 创建 cli/output.ts

**Files:**
- Create: `scripts/pi-agent-edu/cli/output.ts`

- [ ] **Step 1: 从原 index.ts 提取 timestampName + saveContent + errMsg**

读取原 L51-56（`errMsg`）、L62-83（`timestampName` + `saveContent`），原样提取到 `scripts/pi-agent-edu/cli/output.ts`：

```ts
// scripts/pi-agent-edu/cli/output.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getProjectRoot } from '../config.js';

// ... 从原 index.ts 完整复制 timestampName + saveContent + errMsg
```

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/cli/output.ts
git commit -m "refactor(pi-agent-edu): extract cli/output.ts (timestampName + saveContent + errMsg)"
```

### Task 3: 创建 cli/help.ts

**Files:**
- Create: `scripts/pi-agent-edu/cli/help.ts`

- [ ] **Step 1: 从原 index.ts 提取 showHelp**

读取原 L85-138（`function showHelp(): void`），原样提取到 `scripts/pi-agent-edu/cli/help.ts`：

```ts
// scripts/pi-agent-edu/cli/help.ts
import { print } from '../io.js';

// ... 从原 index.ts 完整复制 showHelp 帮助文本（包含 emoji 与中文）
```

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/cli/help.ts
git commit -m "refactor(pi-agent-edu): extract cli/help.ts (showHelp)"
```

### Task 4: 创建 wizard/data.ts

**Files:**
- Create: `scripts/pi-agent-edu/wizard/data.ts`

- [ ] **Step 1: 从原 index.ts 提取常量字典**

读取原 L143-163 区块（`STAGES` + `Stage` 类型 + `SUBJECTS_BY_STAGE` + `GRADES_BY_STAGE` + `TASKS` + `DIFFICULTIES` + `QUESTION_COUNTS` + `KNOWN_KINDS`），原样提取到 `scripts/pi-agent-edu/wizard/data.ts`：

```ts
// scripts/pi-agent-edu/wizard/data.ts

export const STAGES = ['小学', '初中', '高中'] as const;
export type Stage = typeof STAGES[number];

export const SUBJECTS_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['数学', '语文', '英语', '科学', '道德与法治'],
  '初中': ['数学', '物理', '化学', '语文', '英语', '历史', '地理', '道德与法治'],
  '高中': ['数学', '物理', '化学', '生物', '语文', '英语', '历史', '地理', '政治'],
};

export const GRADES_BY_STAGE: Record<Stage, readonly string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三'],
};

export const TASKS = [
  '教程单元',
  '题库',
  '知识点',
  '速查表',
  '公式',
  '口算',
  '掌握度技巧',
  '提示词模板',
] as const;
export type Task = typeof TASKS[number];

export const DIFFICULTIES = ['basic（基础）', 'intermediate（中等）', 'advanced（进阶）'] as const;
export const QUESTION_COUNTS = ['5', '10', '15', '20'] as const;
```

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/wizard/data.ts
git commit -m "refactor(pi-agent-edu): extract wizard/data.ts (常量字典)"
```

### Task 5: 创建 wizard/mapping.ts

**Files:**
- Create: `scripts/pi-agent-edu/wizard/mapping.ts`

- [ ] **Step 1: 创建文件**

```ts
// scripts/pi-agent-edu/wizard/mapping.ts
import type { Task } from './data.js';
import { TASKS } from './data.js';

/** 任务类型 → 入库 kind（staging 目录名）。 */
export function kindFromTask(task: Task): string {
  switch (task) {
    case '教程单元': return 'tutorials';
    case '题库': return 'questions';
    case '知识点': return 'knowledge';
    case '速查表': return 'cheatsheets';
    case '公式': return 'formulas';
    case '口算': return 'mental-math';
    case '掌握度技巧': return 'techniques';
    case '提示词模板': return 'prompts';
  }
}

/** 入库 kind 白名单（staging 目录名）。 */
export const KNOWN_KINDS = new Set(TASKS.map(kindFromTask));

export interface WizardResult {
  provider: string;
  model: string;
  stage: import('./data.js').Stage;
  subject: string;
  grade: string;
  task: Task;
  difficulty?: string;
  questionCount?: string;
}
```

注：`WizardResult` 类型从原 index.ts L167-175 完整复制。

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/wizard/mapping.ts
git commit -m "refactor(pi-agent-edu): extract wizard/mapping.ts (kindFromTask + WizardResult)"
```

### Task 6: 创建 wizard/index.ts + 缩 index.ts 为 entry

**Files:**
- Create: `scripts/pi-agent-edu/wizard/index.ts`
- Modify: `scripts/pi-agent-edu/index.ts`

- [ ] **Step 1: 创建 wizard/index.ts**

```ts
// scripts/pi-agent-edu/wizard/index.ts
import { print, selectOption } from '../io.js';
import type { ModelChoice } from '../config.js';
import { STAGES, SUBJECTS_BY_STAGE, GRADES_BY_STAGE, TASKS, DIFFICULTIES, QUESTION_COUNTS } from './data.js';
import type { Stage, Task } from './data.js';
import type { WizardResult } from './mapping.js';

export { kindFromTask, KNOWN_KINDS } from './mapping.js';
export type { WizardResult } from './mapping.js';
export type { Stage, Task } from './data.js';

// ... 从原 index.ts L170-247 完整复制 runWizard + buildPromptFromWizard 实现
```

注：`runWizard` 内部引用 `'../config.js'`（ModelChoice）+ `'../io.js'`（print, selectOption）；实现从原 index.ts L170-247 完整复制。

- [ ] **Step 2: 重写 index.ts 为 ~30 行 entry**

```ts
// scripts/pi-agent-edu/index.ts
// ... 从原 index.ts L1-39 (imports) + L248-end (main + 全部子函数) 重新组装
// 全部具名函数从 cli/* + wizard/* + session/* 导入，main() body 保留原行为
```

注：
- main() body 完整保留（L248-end）
- `currentKind` 顶层 mutable 变量保留
- 所有 helper 调用改为跨目录 import：`parseCliArgs` from `'./cli/args.js'`、`saveContent` from `'./cli/output.js'`、`showHelp` from `'./cli/help.js'`、`runWizard` / `buildPromptFromWizard` from `'./wizard/index.js'`、`InteractiveSession` from `'./session/index.js'`

- [ ] **Step 3: 验证 tsc + build**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 4: Commit**

```bash
git add scripts/pi-agent-edu/wizard/index.ts scripts/pi-agent-edu/index.ts
git commit -m "refactor(pi-agent-edu): extract wizard/index.ts + shrink index.ts to entry"
```

---

## Phase 2: 拆 scripts/pi-agent-edu/session.ts

### Task 7: 创建 session/types.ts

**Files:**
- Create: `scripts/pi-agent-edu/session/types.ts`

- [ ] **Step 1: 从原 session.ts 提取 types**

读取 `scripts/pi-agent-edu/session.ts` L27-50（`SessionEvent` + `SessionEventListener` + `SessionCreateOptions`），原样提取到 `scripts/pi-agent-edu/session/types.ts`：

```ts
// scripts/pi-agent-edu/session/types.ts

export type SessionEvent =
  | { type: 'thinking_start' }
  | { type: 'thinking'; text: string }
  | { type: 'thinking_end' }
  | { type: 'speaking'; text: string }
  | { type: 'tool_call'; tool: string; args: Record<string, unknown> }
  | { type: 'tool_result'; tool: string; result: string; isError: boolean }
  | { type: 'error'; error: string };

export type SessionEventListener = (event: SessionEvent) => void;

export interface SessionCreateOptions {
  continue?: boolean;
  sessionPath?: string;
}
```

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/session/types.ts
git commit -m "refactor(pi-agent-edu): extract session/types.ts"
```

### Task 8: 创建 session/helpers.ts

**Files:**
- Create: `scripts/pi-agent-edu/session/helpers.ts`

- [ ] **Step 1: 从原 session.ts 提取 helpers**

读取原 L42-66（`DIM` + `summarize`），原样提取到 `scripts/pi-agent-edu/session/helpers.ts`：

```ts
// scripts/pi-agent-edu/session/helpers.ts

export const DIM = (t: string) => `\x1b[2m${t}\x1b[0m`;

export function summarize(result: unknown, max = 200): string {
  const s = typeof result === 'string' ? result : JSON.stringify(result);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}...`;
}
```

- [ ] **Step 2: 验证 tsc**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/session/helpers.ts
git commit -m "refactor(pi-agent-edu): extract session/helpers.ts (DIM + summarize)"
```

### Task 9: 创建 session/class.ts + 删除 session.ts + 创建 session/index.ts barrel

**Files:**
- Create: `scripts/pi-agent-edu/session/class.ts`
- Create: `scripts/pi-agent-edu/session/index.ts`
- Delete: `scripts/pi-agent-edu/session.ts`

- [ ] **Step 1: 创建 session/class.ts**

读取 `scripts/pi-agent-edu/session.ts` L70-end（`InteractiveSession` class 完整实现），原样提取到 `scripts/pi-agent-edu/session/class.ts`，把所有内部 import 改为新路径：

```ts
// scripts/pi-agent-edu/session/class.ts
// ... 完整 InteractiveSession class 实现，import path 改为：
//   import type { SessionEvent, SessionEventListener, SessionCreateOptions } from './types.js';
//   import { DIM, summarize } from './helpers.js';
//   import { print } from '../io.js';
//   import { getAgentDir, type Config, type ThinkingLevel } from '../config.js';
//   import { getSystemPrompt } from '../prompts.js';
//   import { DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager, createAgentSession, type AgentSession, type AgentSessionEvent } from '@earendil-works/pi-coding-agent';
```

- [ ] **Step 2: 创建 session/index.ts barrel**

```ts
// scripts/pi-agent-edu/session/index.ts
export type { SessionEvent, SessionEventListener, SessionCreateOptions } from './types.js';
export type { ThinkingLevel } from '../config.js';
export { InteractiveSession } from './class.js';
```

- [ ] **Step 3: 删除 session.ts**

```bash
rm scripts/pi-agent-edu/session.ts
```

- [ ] **Step 4: 修复所有 `from './session.js'` import 路径**

```bash
grep -rln "from './session.js'" scripts/pi-agent-edu/
```

Expected: 找出所有 caller（典型：`index.ts`）。逐个改为 `from './session/index.js'`。

- [ ] **Step 5: 验证 tsc + build**

```bash
cd scripts/pi-agent-edu && npx tsc --noEmit && cd ../..
```

Expected: 零 error。

- [ ] **Step 6: 验证 import path 修复**

```bash
grep -rln "from './session.js'" scripts/pi-agent-edu/ | grep -v "session/"
```

Expected: 零输出（除 session 目录内部的 cross-path，可视作"调用方"修复完毕）。

- [ ] **Step 7: Commit**

```bash
git add -A scripts/pi-agent-edu/session/ scripts/pi-agent-edu/index.ts
git commit -m "refactor(pi-agent-edu): extract session/ subdirectory + delete monolithic session.ts

Fixes all 'from ./session.js' imports to './session/index.js'.
InteractiveSession class migrated to session/class.ts with no internal changes."
```

---

## Phase 3: ESLint 双入口合并

### Task 10: 删除 scripts/pi-agent-edu/eslint.config.js + 顶层 config 加 scripts overrides

**Files:**
- Delete: `scripts/pi-agent-edu/eslint.config.js`
- Modify: `eslint.config.js`（项目根）

- [ ] **Step 1: 删除子包 config**

```bash
rm scripts/pi-agent-edu/eslint.config.js
```

- [ ] **Step 2: 修改顶层 `eslint.config.js`**

读取项目根的 `eslint.config.js`，在 `tseslint.config(...)` 数组里追加 scripts overrides 块：

```js
{
  files: ['scripts/**/*.ts'],
  languageOptions: { globals: { ...globals.node, ...globals.es2021 } },
  rules: {
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': 'off',
  },
},
```

并确保 `ignores` 包含 `scripts/*/node_modules/**`（已存在则保留）。

注：顶层 `eslint.config.js` 当前可能用不同写法（legacy `tseslint.config` / `defineConfig`），按实际代码追加对应 block。

- [ ] **Step 3: 验证 lint 通过**

```bash
npm run lint 2>&1 | tail -30
```

Expected: 0 error（含 scripts 路径也通过）。

- [ ] **Step 4: 验证 scripts 路径被 lint**

```bash
npx eslint scripts/pi-agent-edu/index.ts scripts/pi-agent-edu/session/class.ts scripts/ingest-data/index.ts 2>&1 | tail -10
```

Expected: 0 error（scripts 路径被顶层配置覆盖）。

- [ ] **Step 5: Commit**

```bash
git add -A scripts/pi-agent-edu/eslint.config.js eslint.config.js
git commit -m "chore(eslint): merge scripts/pi-agent-edu/eslint.config.js into root

Adds scripts overrides to root eslint.config.js:
- Node globals for scripts/**/*.ts
- Disables react-hooks / react-refresh rules in scripts paths"
```

---

## Phase 4: vitest 接管 scripts/

### Task 11: 修改顶层 vitest.config.ts include

**Files:**
- Modify: `vitest.config.ts`

- [ ] **Step 1: 修改 vitest.config.ts**

读取项目根 `vitest.config.ts`，把 `include` 改为：

```ts
test: {
  environment: 'happy-dom',
  include: ['src/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.{test,spec}.ts'],
  exclude: ['node_modules', 'dist', 'scripts/*/node_modules/**'],
},
```

- [ ] **Step 2: 验证 vitest 仍能找到 scripts 测试**

```bash
npx vitest list 2>&1 | head -30
```

Expected: 列出 src/ + scripts/ 的所有 .test.ts 文件。

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore(test): extend vitest include to scripts/**/*.test.ts"
```

### Task 12: ingest-data 测试 import 切换（10 个 .test.ts）

**Files:**
- Modify: `scripts/ingest-data/{index,mapping,tsedit,validate}.test.ts`
- Modify: `scripts/ingest-data/adapters/{formula-merge,knowledge,prompt,question-bank,simple-array,tutorial}.test.ts`

- [ ] **Step 1: 改 ingest-data/*.test.ts（4 个文件）**

对每个文件：
```bash
sed -i.bak "s|from 'node:test'|from 'vitest'|g" \
  scripts/ingest-data/index.test.ts \
  scripts/ingest-data/mapping.test.ts \
  scripts/ingest-data/tsedit.test.ts \
  scripts/ingest-data/validate.test.ts
rm scripts/ingest-data/*.bak 2>/dev/null
```

再人工检查每个文件中的 `mock.fn` / `mock.method`，改为 `vi.fn` / `vi.mocked`（每个文件 0-3 处）。

- [ ] **Step 2: 改 ingest-data/adapters/*.test.ts（6 个文件）**

```bash
for f in scripts/ingest-data/adapters/{formula-merge,knowledge,prompt,question-bank,simple-array,tutorial}.test.ts; do
  sed -i.bak "s|from 'node:test'|from 'vitest'|g" "$f"
  rm "$f.bak" 2>/dev/null
done
```

再人工检查每个文件中的 `mock.fn` / `mock.method`，改为 `vi.fn` / `vi.mocked`。

- [ ] **Step 3: 验证 ingest-data 测试通过**

```bash
npx vitest run scripts/ingest-data/ 2>&1 | tail -15
```

Expected: 所有 ingest-data 测试通过（22 测试）。

- [ ] **Step 4: 验证 scripts 子包独立 npm test 也通过**

```bash
cd scripts/ingest-data && npm test 2>&1 | tail -15 && cd ../..
```

Expected: `vitest run` 跑该子包测试，全部 22 通过。

- [ ] **Step 5: Commit**

```bash
git add scripts/ingest-data/
git commit -m "test(ingest-data): migrate from node:test to vitest syntax"
```

### Task 13: pi-agent-edu 测试 import 切换（4 个 .test.ts）+ 子包 package.json test 改 vitest run

**Files:**
- Modify: `scripts/pi-agent-edu/{config,index,io,staging}.test.ts`
- Modify: `scripts/ingest-data/package.json`
- Modify: `scripts/pi-agent-edu/package.json`

- [ ] **Step 1: 改 pi-agent-edu/*.test.ts（4 个文件）**

```bash
for f in scripts/pi-agent-edu/{config,index,io,staging}.test.ts; do
  sed -i.bak "s|from 'node:test'|from 'vitest'|g" "$f"
  rm "$f.bak" 2>/dev/null
done
```

再人工检查每个文件中的 `mock.fn` / `mock.method`，改为 `vi.fn` / `vi.mocked`。

- [ ] **Step 2: 修改 scripts/ingest-data/package.json**

```diff
-    "test": "node --import tsx --test"
+    "test": "vitest run"
```

- [ ] **Step 3: 修改 scripts/pi-agent-edu/package.json**

```diff
-    "test": "node --import tsx --test *.test.ts"
+    "test": "vitest run"
```

- [ ] **Step 4: 验证 pi-agent-edu 测试通过**

```bash
npx vitest run scripts/pi-agent-edu/ 2>&1 | tail -15
```

Expected: 所有 pi-agent-edu 测试通过（29 测试）。

- [ ] **Step 5: 验证 scripts 子包独立 npm test 也通过**

```bash
cd scripts/pi-agent-edu && npm test 2>&1 | tail -15 && cd ../..
```

Expected: `vitest run` 跑该子包测试，全部 29 通过。

- [ ] **Step 6: 验证顶层 npm test 全通过**

```bash
npm test 2>&1 | tail -15
```

Expected: src + scripts 全部通过，**164** 测试 passing（113 src + 22 ingest + 29 pi-agent-edu）。

- [ ] **Step 7: Commit**

```bash
git add scripts/pi-agent-edu/
git commit -m "test(pi-agent-edu): migrate from node:test to vitest + update sub-package test command"
```

---

## Phase 5: 文档同步

### Task 14: 更新 AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: 读取当前 AGENTS.md 相关章节**

```bash
grep -n "pi-agent-edu\|session.ts\|eslint.config\|vitest\|数据生产" AGENTS.md | head -30
```

- [ ] **Step 2: 更新相关章节**

- "数据生产管线"章节：更新 pi-agent-edu/ 目录结构（cli/ + wizard/ + session/）；更新 session 拆为子目录
- "测试"章节：删除 "scripts 子包各自跑 node:test" 描述，改为 "scripts 子包也走 vitest run"
- "ESLint" 章节：删除"双入口"描述，改为"单入口 eslint.config.js，scripts 路径用 Node globals overrides"

注：保留其余章节（构建、部署、API Key 存储等）不变。

- [ ] **Step 3: 验证无占位符**

```bash
grep -nE "TBD|TODO|FIXME" AGENTS.md | head -10
```

Expected: 零匹配。

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs(AGENTS): update for B refactor (pi-agent-edu/ structure, vitest, ESLint)"
```

### Task 15: 更新 CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 读取当前 CLAUDE.md 相关章节**

```bash
grep -n "pi-agent-edu\|session.ts\|eslint.config\|vitest\|数据生产" CLAUDE.md | head -30
```

- [ ] **Step 2: 更新相关章节**

对应 AGENTS.md 同样的更新（数据生产管线、ESLint、测试）。

- [ ] **Step 3: 验证无占位符**

```bash
grep -nE "TBD|TODO|FIXME" CLAUDE.md | head -10
```

Expected: 零匹配。

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): update for B refactor"
```

### Task 16: 重写 scripts/pi-agent-edu/README.md

**Files:**
- Modify: `scripts/pi-agent-edu/README.md`

- [ ] **Step 1: 读取当前 README**

```bash
wc -l scripts/pi-agent-edu/README.md
head -50 scripts/pi-agent-edu/README.md
```

- [ ] **Step 2: 重写 README**

反映新结构：
- 目录树（cli/ + wizard/ + session/ + 顶层文件）
- 测试命令（`npm test` 走 vitest）
- 入口（`bin: "pi-agent-edu": "./index.ts"`）
- 8 个 kind/task 映射表（kindFromTask 输出）

保留原 README 中的 quickstart / usage / 命令行参数表。

- [ ] **Step 3: Commit**

```bash
git add scripts/pi-agent-edu/README.md
git commit -m "docs(pi-agent-edu): rewrite README for new subdirectory structure"
```

### Task 17: 轻调 scripts/ingest-data/README.md

**Files:**
- Modify: `scripts/ingest-data/README.md`

- [ ] **Step 1: 读取当前 README**

```bash
wc -l scripts/ingest-data/README.md
grep -n "node --import tsx\|test\|vitest" scripts/ingest-data/README.md | head -10
```

- [ ] **Step 2: 轻调 README**

仅改动：
- "测试" 段落从 `npm run test` (node --import tsx --test) 改为 `npm run test` (vitest run)
- 文件结构章节：保留 ingest-data 整体结构（adapters/ 等不动）

其余内容保留。

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest-data/README.md
git commit -m "docs(ingest-data): update test command to vitest"
```

### Task 18: 最终全量验证

- [ ] **Step 1: 完整 build + test + lint**

```bash
npm run lint && npm run build && npm test
```

Expected: lint 0 error、build 通过、**164** 测试 passing（113 + 22 + 29）、零 "No test suite found"。

- [ ] **Step 2: 验证 scripts 子包独立 npm test**

```bash
cd scripts/ingest-data && npm test && cd ../..
cd scripts/pi-agent-edu && npm test && cd ../..
```

Expected: 两个子包均 `vitest run`，所有测试通过。

- [ ] **Step 3: 验证 19 条 AC**

逐条对照 `docs/superpowers/specs/2026-09-29-pi-agent-edu-pipeline-unification-design.md` 验收清单（AC-1 到 AC-19）：

```bash
# AC-1: lint
npm run lint

# AC-2: build
npm run build

# AC-3: vitest 覆盖 src + scripts = 164 passing
npm test 2>&1 | grep -E "Test Files|Tests"

# AC-4: scripts/ingest-data npm test
cd scripts/ingest-data && npm test && cd ../..

# AC-5: scripts/pi-agent-edu npm test
cd scripts/pi-agent-edu && npm test && cd ../..

# AC-6: cli/{args,output,help}.ts 存在
ls scripts/pi-agent-edu/cli/{args,output,help}.ts

# AC-7: wizard/{data,mapping,index}.ts 存在
ls scripts/pi-agent-edu/wizard/{data,mapping,index}.ts

# AC-8: session/{types,helpers,class,index}.ts 存在
ls scripts/pi-agent-edu/session/{types,helpers,class,index}.ts

# AC-9: session.ts 不存在
ls scripts/pi-agent-edu/session.ts 2>&1

# AC-10: scripts/pi-agent-edu/eslint.config.js 不存在
ls scripts/pi-agent-edu/eslint.config.js 2>&1

# AC-11: 顶层 eslint.config.js 含 scripts overrides
grep -A 5 "scripts/\*\*" eslint.config.js

# AC-12: vitest.config.ts include 覆盖 scripts
grep "include" vitest.config.ts

# AC-13: 14 个 test 文件用 vitest
grep -r "from 'vitest'" scripts/ | wc -l  # 期望 ≥ 14

# AC-14: 无 node:test 残留
grep -r "from 'node:test'" scripts/ | wc -l  # 期望 0

# AC-15: 4 个文档更新
git log --oneline -10 -- AGENTS.md CLAUDE.md scripts/pi-agent-edu/README.md scripts/ingest-data/README.md

# AC-19: session.js import 路径修复
grep "from './session.js'" scripts/pi-agent-edu/ -r | grep -v "session/"  # 期望零
```

- [ ] **Step 4: Manual smoke（CLI 行为不变）**

```bash
node scripts/pi-agent-edu/index.ts --help
```

Expected: 打印帮助文本，与拆前相同。

```bash
node scripts/pi-agent-edu/index.ts --sessions
```

Expected: 列出所有会话（无崩溃）。

---

## Self-Review Checklist

执行完所有 task 后，对照以下清单：

- [ ] AC-1 到 AC-19 全部通过
- [ ] 5 个 phase 的 commit 全部存在，message 符合约定
- [ ] scripts 子包测试通过（顶层 + 子包独立）
- [ ] 164 测试 passing（无 "No test suite found"）
- [ ] `node scripts/pi-agent-edu/index.ts --help` 仍可用（行为不变）
- [ ] import 路径与拆前一致（除 session/ 目录迁移）
- [ ] 文档同步反映新结构
