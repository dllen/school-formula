# pi-agent-edu 数据入库管线 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `scripts/ingest-data` 确定性入库脚本：读取 `staging/` 下的 JSON payload，逐类型校验（真实类型 `satisfies` + 业务规则）→ 合并进 `src/data/` → 接线 `index.ts`/`ALL_*`，覆盖 8 种数据类型。

**Architecture:** 「生成/入库分离」。生成侧只产出规范 JSON 到 `staging/`；本脚本是独立的确定性入库侧。schema 单一事实源 = `src/data/*/types.ts`，用 `satisfies` + `typescript` 编译器 API 做类型校验（零漂移），只 `JSON.parse`（零代码执行），只追加不覆盖。

**Tech Stack:** TypeScript（strict + verbatimModuleSyntax），`tsx` 运行，`node --import tsx --test` 测试，`typescript` 编译器 API。

**Spec:** `docs/superpowers/specs/2026-09-17-pi-agent-edu-data-ingestion-design.md`

## Global Constraints

- TypeScript 严格模式 + `verbatimModuleSyntax: true`（导入类型必须 `import type`）。
- 运行：`npx tsx index.ts`；测试：`node --import tsx --test *.test.ts`。
- 依赖 `typescript`（用编译器 API，不 shell 调 `tsc`）。
- `staging/` 加入 `.gitignore`（含 `scripts/ingest-data/.tmp/`）。
- schema 单一事实源：`src/data/*/types.ts`；payload 形状由 `satisfies` 校验，不在脚本里重写枚举。
- 零代码执行：只 `JSON.parse`，`typeCheck` 只编译临时文件、绝不执行。
- 只追加、不覆盖已有内容；日志/报错信息用简体中文。
- 最终入库后必须能跑通完整 `npm run build`（`tsc -b`）。

---

## 文件结构

```
scripts/ingest-data/
├── package.json          # 依赖 typescript + tsx，scripts: dev/typecheck/test
├── tsconfig.json         # NodeNext + strict + verbatimModuleSyntax + allowImportingTsExtensions
├── types.ts              # Adapter / TypeRef / IngestContext / MergeResult / WireResult
├── mapping.ts            # SUBJECT_KEYS、gradeToStage（学段/学科中文名 → 文件键）
├── tsedit.ts             # appendToConstArray、insertLineAfter、renderArrayItem、extractIds
├── validate.ts           # typeCheck（编译器 API）、duplicateIds、collidingIds
├── registry.ts           # kind → adapter 注册表
├── index.ts              # CLI：--all / <file> / --list / --dry-run
├── adapters/
│   ├── simple-array.ts   # simpleArrayAdapter 工厂（薄 adapter 复用）
│   ├── cheatsheet.ts     # ALL_CHEATSHEETS
│   ├── formula.ts        # *_FORMULAS（按 grade 分数组）
│   ├── mental-math.ts    # *_MNEMONICS（按 grade 分数组）
│   ├── technique.ts      # TECHNIQUES
│   ├── tutorial.ts       # XXX_TUTORIALS（含 create+wire）
│   ├── question-bank.ts  # xxxQuestions
│   ├── knowledge.ts      # knowledge/<stage>/<subject>.ts
│   └── prompt.ts         # prompts/<scenario>.ts（注入 usageCount/rating/author 默认）
└── *.test.ts             # 与实现同目录的测试
```

---

## Task 1: 脚手架 + 共享类型

**Files:**
- Create: `scripts/ingest-data/package.json`
- Create: `scripts/ingest-data/tsconfig.json`
- Create: `scripts/ingest-data/types.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `types.ts` 导出 `TypeRef`、`IngestContext`、`MergeResult`、`WireResult`、`Adapter`。

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "ingest-data",
  "version": "1.0.0",
  "description": "确定性数据入库脚本：读取 staging JSON，校验并合并进 src/data",
  "type": "module",
  "scripts": {
    "dev": "tsx index.ts",
    "typecheck": "tsc --noEmit",
    "test": "node --import tsx --test *.test.ts"
  },
  "dependencies": {
    "typescript": "^5.9.3"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^24.10.1"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**（`moduleResolution: bundler`，与本包 extensionless 相对导入及 app 的 Vite/bundler 风格一致；不用 NodeNext，避免 TS2835）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["."],
  "exclude": [".tmp", "node_modules", "dist"]
}
```

- [ ] **Step 3: 创建 types.ts**

```typescript
// scripts/ingest-data/types.ts

/** 描述一个 payload 对应的真实 TS 类型，用于 `satisfies` 校验。 */
export interface TypeRef {
  /** 导出该类型的模块绝对路径（如 `<root>/src/data/tutorials/types.ts`）。 */
  path: string;
  /** 要 import 的类型名（如 `Tutorial`）。 */
  name: string;
  /** `satisfies` 用的类型表达式（如 `'Tutorial'`、`'Question[]'`）。 */
  expr: string;
}

export interface IngestContext {
  /** 仓库根绝对路径。 */
  root: string;
  /** 仅校验不写盘。 */
  dryRun: boolean;
  /** 已加载的知识点 id 全集（index.ts 预加载，供 question-bank 校验 knowledgePointIds）。 */
  knowledgePointIds: Set<string>;
}

export interface MergeResult {
  /** 创建/修改的绝对路径列表。 */
  files: string[];
  /** 插入的顶层条目数。 */
  inserted: number;
}

export interface WireResult {
  /** 被编辑的 index 文件绝对路径列表（无需接线则为空数组）。 */
  files: string[];
}

/** 数据类型适配器：extract → validate → merge → wire。 */
export interface Adapter {
  kind: string;
  typeRef: TypeRef;
  /** 从 JSON 信封中提取类型化值（可注入默认字段）。 */
  extract(raw: unknown): unknown;
  /** 业务规则校验（不含类型层），返回错误列表，空数组=通过。 */
  validate(value: unknown, ctx: IngestContext): string[];
  /** 合并进目标文件。`raw` 为完整 JSON 信封（当 `value` 不含 grade/subject 等定位字段时使用）。 */
  merge(value: unknown, raw: unknown, ctx: IngestContext): MergeResult;
  /** 接线 index/ALL_*。`raw` 同上。 */
  wire(value: unknown, raw: unknown, ctx: IngestContext): WireResult;
}
```

- [ ] **Step 4: .gitignore 追加**

```gitignore
# pi-agent-edu 数据入库
staging/
scripts/ingest-data/.tmp/
```

- [ ] **Step 5: 安装依赖并跑类型检查**

Run: `cd scripts/ingest-data && npm install && npm run typecheck`
Expected: 通过（`types.ts` 无错误）。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/package.json scripts/ingest-data/tsconfig.json scripts/ingest-data/types.ts scripts/ingest-data/package-lock.json .gitignore
git commit -m "feat(ingest-data): scaffold package + shared types"
```

---

## Task 2: mapping.ts（学段/学科映射）

**Files:**
- Create: `scripts/ingest-data/mapping.ts`
- Test: `scripts/ingest-data/mapping.test.ts`

**Interfaces:**
- Produces:
  - `SUBJECT_KEYS: Record<string, string>` — 学科中文名 → 文件键（`数学→math`…`政治→politics`）
  - `gradeToStage(grade: string): 'primary' | 'middle' | 'high'` — 兼容数值（`'7'`）与单词（`'middle'`）

- [ ] **Step 1: 写失败测试**

```typescript
// mapping.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECT_KEYS, gradeToStage } from './mapping';

test('SUBJECT_KEYS 覆盖全部学科', () => {
  assert.equal(SUBJECT_KEYS['数学'], 'math');
  assert.equal(SUBJECT_KEYS['道德与法治'], 'moral');
  assert.equal(SUBJECT_KEYS['政治'], 'politics');
});

test('gradeToStage 兼容数值与单词', () => {
  assert.equal(gradeToStage('7'), 'middle');
  assert.equal(gradeToStage('12'), 'high');
  assert.equal(gradeToStage('middle'), 'middle');
  assert.equal(gradeToStage('primary'), 'primary');
});

test('gradeToStage 未知值抛错', () => {
  assert.throws(() => gradeToStage('99'));
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test mapping.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```typescript
// mapping.ts

/** 学科中文名 → 数据文件键。 */
export const SUBJECT_KEYS: Record<string, string> = {
  '数学': 'math',
  '语文': 'chinese',
  '英语': 'english',
  '科学': 'science',
  '道德与法治': 'moral',
  '物理': 'physics',
  '化学': 'chemistry',
  '生物': 'biology',
  '历史': 'history',
  '地理': 'geography',
  '政治': 'politics',
};

/** 把学段（数值字符串或 GradeLevel 单词）归一化为文件级 stage。 */
export function gradeToStage(grade: string): 'primary' | 'middle' | 'high' {
  if (grade === 'primary' || grade === 'middle' || grade === 'high') return grade;
  const n = Number(grade);
  if (n >= 1 && n <= 6) return 'primary';
  if (n >= 7 && n <= 9) return 'middle';
  if (n >= 10 && n <= 12) return 'high';
  throw new Error(`未知学段: ${grade}`);
}
```

- [ ] **Step 4: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test mapping.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add scripts/ingest-data/mapping.ts scripts/ingest-data/mapping.test.ts
git commit -m "feat(ingest-data): add subject/grade mapping"
```

---

## Task 3: tsedit.ts（确定性源码编辑）

**Files:**
- Create: `scripts/ingest-data/tsedit.ts`
- Test: `scripts/ingest-data/tsedit.test.ts`

**Interfaces:**
- Produces:
  - `appendToConstArray(content: string, name: string, items: unknown[]): string` — 在 `export const <name> = [...]` 数组尾部插入 `items`（返回新内容，不落盘）
  - `insertLineAfter(content: string, afterText: string, line: string): string`
  - `extractIds(content: string): Set<string>` — 提取文件内所有 `id: '…'` / `"id": "…"`

- [ ] **Step 1: 写失败测试**

```typescript
// tsedit.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendToConstArray, insertLineAfter, extractIds } from './tsedit';

const SRC = `export const X: T[] = [\n  { id: 'a' },\n];\n`;

test('appendToConstArray 在数组尾部插入', () => {
  const out = appendToConstArray(SRC, 'X', [{ id: 'b' }]);
  assert.ok(out.includes(`{ id: 'a' }`));
  assert.ok(out.includes(`"id": "b"`));
  assert.ok(out.indexOf('a') < out.indexOf('b'));
});

test('insertLineAfter 在锚点后插入一行', () => {
  const out = insertLineAfter("line1\nline2\n", 'line1', 'INSERTED');
  assert.equal(out, "line1\nINSERTED\nline2\n");
});

test('extractIds 提取单双引号 id', () => {
  const ids = extractIds(`{ id: 'a' }, { "id": "b" }, { id: "a" }`);
  assert.deepEqual([...ids].sort(), ['a', 'b']);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test tsedit.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现**

```typescript
// tsedit.ts

/** 把 JSON 值渲染成 2 空格缩进的 TS 对象字面量（JSON 是 TS 对象字面量子集）。 */
export function renderArrayItem(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  return json.split('\n').map((l) => '  ' + l).join('\n') + ',';
}

/** 在 `export const <name> = [...]` 的数组末尾插入若干条目，返回新内容。 */
export function appendToConstArray(content: string, name: string, items: unknown[]): string {
  const decl = `export const ${name}`;
  const declIdx = content.indexOf(decl);
  if (declIdx === -1) throw new Error(`未找到声明: ${name}`);
  // 先定位赋值 `=`，再找 `=` 之后的 `[`——避免命中类型注解里的 `[]`（如 `T[]`）。
  const eq = content.indexOf('=', declIdx);
  if (eq === -1) throw new Error(`未找到赋值符号: ${name}`);
  const open = content.indexOf('[', eq);
  if (open === -1) throw new Error(`未找到数组起始: ${name}`);
  let depth = 0;
  let close = open;
  for (let i = open; i < content.length; i++) {
    const c = content[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { close = i; break; }
    }
  }
  if (depth !== 0) throw new Error(`数组括号不匹配: ${name}`);
  const rendered = items.map(renderArrayItem).join('\n');
  return content.slice(0, close) + '\n' + rendered + '\n' + content.slice(close);
}

/** 在首次出现的 `afterText` 所在行之后插入一行。 */
export function insertLineAfter(content: string, afterText: string, line: string): string {
  const idx = content.indexOf(afterText);
  if (idx === -1) throw new Error(`未找到锚点: ${afterText}`);
  const end = content.indexOf('\n', idx);
  const insertAt = end === -1 ? content.length : end + 1;
  return content.slice(0, insertAt) + line + '\n' + content.slice(insertAt);
}

/** 提取源文件内所有 `id: '…'` 与 `"id": "…"`。 */
export function extractIds(content: string): Set<string> {
  const ids = new Set<string>();
  // `(?:\bid|"id")`：`\bid` 匹配 `id:`（裸键），`"id"` 匹配 `"id":`（带引号键，引号在 id 与 : 之间）。
  const re = /(?:\bid|"id")\s*:\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) ids.add(m[1]);
  return ids;
}
```

- [ ] **Step 4: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test tsedit.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add scripts/ingest-data/tsedit.ts scripts/ingest-data/tsedit.test.ts
git commit -m "feat(ingest-data): add deterministic TS source editing"
```

---

## Task 4: validate.ts（类型层校验）

**Files:**
- Create: `scripts/ingest-data/validate.ts`
- Test: `scripts/ingest-data/validate.test.ts`

**Interfaces:**
- Produces:
  - `typeCheck(value: unknown, ref: TypeRef, root: string): string[]` — 编译临时 `.ts`（`satisfies`）取诊断，空数组=通过
  - `duplicateIds(items: { id: string }[]): string[]`
  - `collidingIds(items: { id: string }[], existing: Set<string>): string[]`

- [ ] **Step 1: 写失败测试**

```typescript
// validate.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { typeCheck, duplicateIds, collidingIds } from './validate';
import { getRoot } from './paths';

test('typeCheck 合法值通过', () => {
  const errs = typeCheck(
    [{ id: 'q-x-1', name: 'x', expression: 'a', grade: 'primary', subject: '数学', condition: 'c' }],
    { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
    getRoot(),
  );
  assert.deepEqual(errs, []);
});

test('typeCheck 缺必填字段报错', () => {
  const errs = typeCheck(
    [{ id: 'q-x-2' }],
    { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
    getRoot(),
  );
  assert.ok(errs.length > 0);
});

test('duplicateIds / collidingIds', () => {
  assert.deepEqual(duplicateIds([{ id: 'a' }, { id: 'a' }]), ['a']);
  assert.deepEqual(collidingIds([{ id: 'a' }, { id: 'b' }], new Set(['b'])), ['b']);
});
```

- [ ] **Step 2: 创建 paths.ts（供测试与实现共用 root 解析）**

```typescript
// paths.ts
import { fileURLToPath } from 'node:url';

/** 仓库根：本文件在 <root>/scripts/ingest-data/paths.ts。 */
export function getRoot(): string {
  return fileURLToPath(new URL('../..', import.meta.url));
}
```

- [ ] **Step 3: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test validate.test.ts`
Expected: FAIL（`./validate` 不存在）。

- [ ] **Step 4: 实现**

```typescript
// validate.ts
import ts from 'typescript';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { TypeRef } from './types';

const COMPILER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  allowImportingTsExtensions: true,
  esModuleInterop: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};

/** 用真实类型 `satisfies` 校验 value，返回错误列表（空=通过）。 */
export function typeCheck(value: unknown, ref: TypeRef, root: string): string[] {
  const tmpDir = join(root, 'scripts', 'ingest-data', '.tmp');
  mkdirSync(tmpDir, { recursive: true });
  const file = join(tmpDir, `check-${randomUUID()}.ts`);
  const relPath = relative(tmpDir, ref.path).replace(/\\/g, '/').replace(/\.ts$/, '');
  const importSpec = relPath.startsWith('.') ? relPath : `./${relPath}`;
  const source =
    `import type { ${ref.name} } from ${JSON.stringify(importSpec)};\n` +
    `const __payload = ${JSON.stringify(value)} satisfies ${ref.expr};\n` +
    `void __payload;\n`;
  writeFileSync(file, source, 'utf-8');
  const program = ts.createProgram([file], COMPILER_OPTIONS);
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName === file);
  rmSync(tmpDir, { recursive: true, force: true });
  return diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

export function duplicateIds(items: { id: string }[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const it of items) {
    if (seen.has(it.id)) dups.add(it.id);
    seen.add(it.id);
  }
  return [...dups];
}

export function collidingIds(items: { id: string }[], existing: Set<string>): string[] {
  return items.map((it) => it.id).filter((id) => existing.has(id));
}
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test validate.test.ts`
Expected: PASS（注意：`typeCheck` 会加载类型图，首次可能稍慢，属正常）。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/validate.ts scripts/ingest-data/validate.test.ts scripts/ingest-data/paths.ts
git commit -m "feat(ingest-data): add type-layer validation via tsc compiler API"
```

---

## Task 5: simple-array.ts + 4 个薄 adapter + registry

**Files:**
- Create: `scripts/ingest-data/adapters/simple-array.ts`
- Create: `scripts/ingest-data/adapters/cheatsheet.ts`
- Create: `scripts/ingest-data/adapters/formula.ts`
- Create: `scripts/ingest-data/adapters/mental-math.ts`
- Create: `scripts/ingest-data/adapters/technique.ts`
- Create: `scripts/ingest-data/registry.ts`
- Test: `scripts/ingest-data/adapters/simple-array.test.ts`

**Interfaces:**
- Consumes: `Adapter`、`TypeRef`（Task 1）、`appendToConstArray`/`extractIds`（Task 3）、`duplicateIds`/`collidingIds`（Task 4）、`gradeToStage`/`SUBJECT_KEYS`（Task 2）。
- Produces:
  - `simpleArrayAdapter(cfg: SimpleArrayConfig): Adapter` — 通用「追加到 const 数组」工厂
  - `cheatsheetAdapter`、`formulaAdapter`、`mentalMathAdapter`、`techniqueAdapter`
  - `registry: Map<string, Adapter>` + `getAdapter(kind): Adapter`

- [ ] **Step 1: 写失败测试**

```typescript
// simple-array.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simpleArrayAdapter } from './simple-array';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cfg = {
  kind: 'test',
  envelopeKey: 'items',
  typeRef: { path: '/nope/types.ts', name: 'T', expr: 'T[]' },
  file: 'data.ts',
  arrayName: () => 'ALL',
};

test('extract + validate + merge 全链路', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ingest-'));
  writeFileSync(join(dir, 'data.ts'), "export const ALL: T[] = [\n  { id: 'a' },\n];\n", 'utf-8');
  const adapter = simpleArrayAdapter(cfg);
  const value = adapter.extract({ items: [{ id: 'b' }] });
  assert.deepEqual(value, [{ id: 'b' }]);
  const ctx = { root: dir, dryRun: false, knowledgePointIds: new Set<string>() };
  assert.deepEqual(adapter.validate([{ id: 'a' }], ctx), ['id 已存在: a']);
  const merged = adapter.merge([{ id: 'b' }], { items: [{ id: 'b' }] }, ctx);
  assert.equal(merged.inserted, 1);
  assert.ok(readFileSync(join(dir, 'data.ts'), 'utf-8').includes('"id": "b"'));
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/simple-array.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 simple-array.ts**

```typescript
// adapters/simple-array.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext, TypeRef } from '../types';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

export interface SimpleArrayConfig {
  kind: string;
  envelopeKey: string;
  typeRef: TypeRef;
  /** 目标文件（相对仓库根）。 */
  file: string;
  /** 由单个 item 推导目标 const 数组名（用于按 grade 分数组）。 */
  arrayName: (item: any) => string;
  /** 额外业务校验（id 唯一之外）。 */
  checks?: (items: any[], ctx: IngestContext) => string[];
}

export function simpleArrayAdapter(cfg: SimpleArrayConfig): Adapter {
  return {
    kind: cfg.kind,
    typeRef: cfg.typeRef,
    extract(raw) {
      return (raw as Record<string, unknown>)[cfg.envelopeKey];
    },
    validate(value, ctx) {
      if (!Array.isArray(value)) return ['payload 必须是数组'];
      const items = value as { id: string }[];
      const errs: string[] = [];
      const existing = existingIds(cfg, ctx);
      for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
      for (const id of collidingIds(items, existing)) errs.push(`id 已存在: ${id}`);
      if (cfg.checks) errs.push(...cfg.checks(items, ctx));
      return errs;
    },
    merge(value, _raw, ctx) {
      const abs = join(ctx.root, cfg.file);
      const content = readFileSync(abs, 'utf-8');
      const items = value as any[];
      const groups = new Map<string, any[]>();
      for (const it of items) {
        const name = cfg.arrayName(it);
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name)!.push(it);
      }
      let updated = content;
      for (const [name, group] of groups) {
        updated = appendToConstArray(updated, name, group);
      }
      writeFileSync(abs, updated, 'utf-8');
      return { files: [abs], inserted: items.length };
    },
    wire() {
      return { files: [] };
    },
  };
}

function existingIds(cfg: SimpleArrayConfig, ctx: IngestContext): Set<string> {
  return extractIds(readFileSync(join(ctx.root, cfg.file), 'utf-8'));
}
```

- [ ] **Step 4: 实现 4 个薄 adapter + registry**

```typescript
// adapters/cheatsheet.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

export const cheatsheetAdapter = simpleArrayAdapter({
  kind: 'cheatsheets',
  envelopeKey: 'cheatsheets',
  typeRef: { path: `${getRoot()}/src/data/cheatsheets.ts`, name: 'CheatSheet', expr: 'CheatSheet[]' },
  file: 'src/data/cheatsheets.ts',
  arrayName: () => 'ALL_CHEATSHEETS',
});
```

```typescript
// adapters/formula.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

const ARRAYS: Record<string, string> = {
  primary: 'PRIMARY_FORMULAS', middle: 'MIDDLE_FORMULAS', high: 'HIGH_FORMULAS',
};

export const formulaAdapter = simpleArrayAdapter({
  kind: 'formulas',
  envelopeKey: 'formulas',
  typeRef: { path: `${getRoot()}/src/data/formulas.ts`, name: 'Formula', expr: 'Formula[]' },
  file: 'src/data/formulas.ts',
  arrayName: (it) => ARRAYS[(it as { grade: string }).grade] ?? 'PRIMARY_FORMULAS',
});
```

```typescript
// adapters/mental-math.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

const ARRAYS: Record<string, string> = {
  primary: 'PRIMARY_MNEMONICS', middle: 'MIDDLE_MNEMONICS', high: 'HIGH_MNEMONICS',
};

export const mentalMathAdapter = simpleArrayAdapter({
  kind: 'mental-math',
  envelopeKey: 'mnemonics',
  typeRef: { path: `${getRoot()}/src/data/mentalMath.ts`, name: 'MentalMathMnemonic', expr: 'MentalMathMnemonic[]' },
  file: 'src/data/mentalMath.ts',
  arrayName: (it) => ARRAYS[(it as { grade: string }).grade] ?? 'PRIMARY_MNEMONICS',
});
```

```typescript
// adapters/technique.ts
import { simpleArrayAdapter } from './simple-array';
import { getRoot } from '../paths';

export const techniqueAdapter = simpleArrayAdapter({
  kind: 'techniques',
  envelopeKey: 'techniques',
  typeRef: { path: `${getRoot()}/src/data/mastery/types.ts`, name: 'Technique', expr: 'Technique[]' },
  file: 'src/data/mastery/techniques.ts',
  arrayName: () => 'TECHNIQUES',
});
```

```typescript
// registry.ts
import type { Adapter } from './types';
import { cheatsheetAdapter } from './adapters/cheatsheet';
import { formulaAdapter } from './adapters/formula';
import { mentalMathAdapter } from './adapters/mental-math';
import { techniqueAdapter } from './adapters/technique';

// 后续 task 会把其余 adapter 加进来。
const adapters: Adapter[] = [
  cheatsheetAdapter,
  formulaAdapter,
  mentalMathAdapter,
  techniqueAdapter,
];

export const registry: Map<string, Adapter> = new Map(adapters.map((a) => [a.kind, a]));

export function getAdapter(kind: string): Adapter {
  const a = registry.get(kind);
  if (!a) throw new Error(`未知数据类型: ${kind}`);
  return a;
}
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/simple-array.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/adapters/ scripts/ingest-data/registry.ts
git commit -m "feat(ingest-data): add simple-array factory + 4 thin adapters + registry"
```

---

## Task 6: tutorial adapter（垂直切片，含 create+wire）

**Files:**
- Create: `scripts/ingest-data/adapters/tutorial.ts`
- Test: `scripts/ingest-data/adapters/tutorial.test.ts`
- Modify: `scripts/ingest-data/registry.ts`

**Interfaces:**
- Consumes: `gradeToStage`/`SUBJECT_KEYS`（Task 2）、`appendToConstArray`/`extractIds`/`insertLineAfter`（Task 3）、`duplicateIds`/`collidingIds`（Task 4）。
- Produces: `tutorialAdapter: Adapter`（kind `tutorial`，envelope `{ tutorial: Tutorial }`）。

**规则：** payload 为单个 `Tutorial`（含 `grade`/`subject`/`units[]`）。目标文件 `src/data/tutorials/<stage>-<subjectKey>.ts`，数组名 `<STAGE>_<SUBJECT>_TUTORIALS`（大写）。文件已存在则追加；不存在则创建并接线 `src/data/tutorials/index.ts`。

- [ ] **Step 1: 写失败测试**

```typescript
// tutorial.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tutorialAdapter, arrayNameFor } from './tutorial';
import { getRoot } from '../paths';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('validate 拒绝 id 冲突与题量非 10', () => {
  const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
  // 用已存在的 id（middle-math-7 已在库中）制造冲突
  const dup = { id: 'middle-math-7', grade: '7', gradeName: '七年级', subject: '数学', subjectIcon: '📐', title: 'x', description: 'x', units: [] };
  assert.ok(tutorialAdapter.validate(dup, ctx).some((e) => e.includes('已存在')));
  const bad = { id: 'middle-math-9', grade: '7', gradeName: '七年级', subject: '数学', subjectIcon: '📐', title: 'x', description: 'x', units: [{ id: 'm-math-9-u1', title: 'x', order: 1, duration: 'x', objectives: [], teach: { hook: '', summary: '' }, learn: { sections: [], tips: [] }, practice: [], aiContext: '' }] };
  assert.ok(tutorialAdapter.validate(bad, ctx).some((e) => e.includes('10')));
});

test('arrayNameFor 推导正确数组名', () => {
  const tutorial = { id: 'middle-math-9', grade: '7', subject: '数学' } as any;
  assert.equal(arrayNameFor(tutorial), 'MIDDLE_MATH_TUTORIALS');
});

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/tutorial.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 tutorial.ts**

```typescript
// adapters/tutorial.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, insertLineAfter, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface TutorialLike {
  id: string;
  grade: string;
  subject: string;
  units: { id: string; practice: unknown[] }[];
}

export function arrayNameFor(tutorial: TutorialLike): string {
  const stage = gradeToStage(tutorial.grade);
  const key = SUBJECT_KEYS[tutorial.subject];
  if (!key) throw new Error(`未知学科: ${tutorial.subject}`);
  return `${stage.toUpperCase()}_${key.toUpperCase()}_TUTORIALS`;
}

function targetFile(t: TutorialLike, ctx: IngestContext): string {
  const stage = gradeToStage(t.grade);
  const key = SUBJECT_KEYS[t.subject];
  return join(ctx.root, 'src', 'data', 'tutorials', `${stage}-${key}.ts`);
}

function existingIdsFor(t: TutorialLike, ctx: IngestContext): Set<string> {
  const abs = targetFile(t, ctx);
  return existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set();
}

export const tutorialAdapter: Adapter = {
  kind: 'tutorials',
  typeRef: { path: join(getRoot(), 'src/data/tutorials/types.ts'), name: 'Tutorial', expr: 'Tutorial' },
  extract(raw) {
    return (raw as { tutorial: unknown }).tutorial;
  },
  validate(value, ctx) {
    const t = value as TutorialLike;
    if (!t || typeof t.id !== 'string') return ['payload 需包含 tutorial 对象'];
    const errs: string[] = [];
    const existing = existingIdsFor(t, ctx);
    if (existing.has(t.id)) errs.push(`id 已存在: ${t.id}`);
    for (const id of duplicateIds(t.units)) errs.push(`重复单元 id: ${id}`);
    for (const id of collidingIds(t.units, existing)) errs.push(`单元 id 已存在: ${id}`);
    for (const u of t.units) {
      if (u.practice.length !== 10) errs.push(`单元 ${u.id} 练习题数量为 ${u.practice.length}，应为 10`);
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const t = value as TutorialLike;
    const abs = targetFile(t, ctx);
    const name = arrayNameFor(t);
    if (existsSync(abs)) {
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, [value]), 'utf-8');
    } else {
      const header = `import type { Tutorial } from './types';\n\nexport const ${name}: Tutorial[] = [\n];\n`;
      writeFileSync(abs, header, 'utf-8');
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, [value]), 'utf-8');
    }
    return { files: [abs], inserted: 1 };
  },
  wire(value, _raw, ctx) {
    const t = value as TutorialLike;
    const stage = gradeToStage(t.grade);
    const key = SUBJECT_KEYS[t.subject];
    const name = arrayNameFor(t);
    const indexPath = join(ctx.root, 'src', 'data', 'tutorials', 'index.ts');
    let content = readFileSync(indexPath, 'utf-8');
    if (content.includes(`export { ${name} }`)) return { files: [] };
    content = insertLineAfter(content, `export * from './types';`, `export { ${name} } from './${stage}-${key}';`);
    content = insertLineAfter(content, `import type { Tutorial, TutorialUnit } from './types';`, `import { ${name} } from './${stage}-${key}';`);
    content = content.replace('export const ALL_TUTORIALS: Tutorial[] = [', `export const ALL_TUTORIALS: Tutorial[] = [\n  ...${name},`);
    writeFileSync(indexPath, content, 'utf-8');
    return { files: [indexPath] };
  },
};
```

- [ ] **Step 4: 把 tutorialAdapter 加入 registry**

```typescript
// registry.ts（追加 import + 数组项）
import { tutorialAdapter } from './adapters/tutorial';
// ...
const adapters: Adapter[] = [
  cheatsheetAdapter,
  formulaAdapter,
  mentalMathAdapter,
  techniqueAdapter,
  tutorialAdapter,
];
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/tutorial.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/adapters/tutorial.ts scripts/ingest-data/adapters/tutorial.test.ts scripts/ingest-data/registry.ts
git commit -m "feat(ingest-data): add tutorial adapter with create+wire"
```

---

## Task 7: question-bank adapter

**Files:**
- Create: `scripts/ingest-data/adapters/question-bank.ts`
- Test: `scripts/ingest-data/adapters/question-bank.test.ts`
- Modify: `scripts/ingest-data/registry.ts`

**Interfaces:**
- Consumes: `gradeToStage`/`SUBJECT_KEYS`（Task 2）、`appendToConstArray`/`extractIds`（Task 3）、`duplicateIds`/`collidingIds`（Task 4）。
- Produces: `questionBankAdapter: Adapter`（kind `question-bank`，envelope `{ questions: Question[] }`）。

**规则：** 目标文件 `src/data/questions/<stage>-<subjectKey>-questions.ts`，数组名 `{stage}{SubjectKey首字母大写}Questions`（如 `middleMathQuestions`）。`subject`/`grade` 取自每题的 `subject`/`grade` 字段；校验同 payload 内所有题的 `subject`+`grade` 一致。

- [ ] **Step 1: 写失败测试**

```typescript
// question-bank.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionBankAdapter } from './question-bank';
import { getRoot } from '../paths';

const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
const q = (id: string, kp: string[]) => ({
  id, type: 'choice', difficulty: 'basic', stem: 's', options: ['A', 'B'], answer: 'A',
  explanation: 'e', tags: ['t'], knowledgePointIds: kp, subject: '数学', grade: 'middle',
});

test('校验 knowledgePointIds 必须存在', () => {
  const errs = questionBankAdapter.validate([q('q-x-1', ['不存在的kp'])], ctx);
  assert.ok(errs.some((e) => e.includes('knowledgePointId')));
});

test('校验同 payload subject/grade 不一致', () => {
  const errs = questionBankAdapter.validate([q('q-x-1', []), { ...q('q-x-2', []), subject: '物理' }], ctx);
  assert.ok(errs.some((e) => e.includes('一致')));
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/question-bank.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 question-bank.ts**

```typescript
// adapters/question-bank.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface QuestionLike {
  id: string;
  subject: string;
  grade: string;
  knowledgePointIds: string[];
}

function targetArray(stage: string, key: string): string {
  const cap = key.charAt(0).toUpperCase() + key.slice(1);
  return `${stage}${cap}Questions`;
}

export const questionBankAdapter: Adapter = {
  kind: 'questions',
  typeRef: { path: join(getRoot(), 'src/data/questions/types.ts'), name: 'Question', expr: 'Question[]' },
  extract(raw) {
    return (raw as { questions: unknown }).questions;
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as QuestionLike[];
    const errs: string[] = [];
    const subject = items[0]?.subject;
    const grade = items[0]?.grade;
    if (!subject || !grade) return ['题目需含 subject 与 grade 字段'];
    for (const it of items) {
      if (it.subject !== subject || it.grade !== grade) {
        errs.push(`题目 subject/grade 需一致: ${it.id}`);
      }
    }
    const stage = gradeToStage(grade);
    const key = SUBJECT_KEYS[subject];
    const abs = join(ctx.root, 'src', 'data', 'questions', `${stage}-${key}-questions.ts`);
    const existing = existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set<string>();
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    for (const id of collidingIds(items, existing)) errs.push(`id 已存在: ${id}`);
    for (const it of items) {
      for (const kp of it.knowledgePointIds) {
        if (!ctx.knowledgePointIds.has(kp)) errs.push(`knowledgePointId 不存在: ${kp}`);
      }
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const items = value as QuestionLike[];
    const stage = gradeToStage(items[0].grade);
    const key = SUBJECT_KEYS[items[0].subject];
    const abs = join(ctx.root, 'src', 'data', 'questions', `${stage}-${key}-questions.ts`);
    const name = targetArray(stage, key);
    if (!existsSync(abs)) {
      writeFileSync(abs, `import type { Question } from './types';\n\nexport const ${name}: Question[] = [\n];\n`, 'utf-8');
    }
    writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), name, value), 'utf-8');
    return { files: [abs], inserted: items.length };
  },
  wire() {
    return { files: [] }; // ALL_QUESTIONS 已自动 spread 各 import
  },
};
```

- [ ] **Step 4: 把 questionBankAdapter 加入 registry**

```typescript
// registry.ts
import { questionBankAdapter } from './adapters/question-bank';
// ...
const adapters: Adapter[] = [/* … */, questionBankAdapter];
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/question-bank.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/adapters/question-bank.ts scripts/ingest-data/adapters/question-bank.test.ts scripts/ingest-data/registry.ts scripts/ingest-data/types.ts
git commit -m "feat(ingest-data): add question-bank adapter with knowledge-point validation"
```

---

## Task 8: knowledge adapter

**Files:**
- Create: `scripts/ingest-data/adapters/knowledge.ts`
- Test: `scripts/ingest-data/adapters/knowledge.test.ts`
- Modify: `scripts/ingest-data/registry.ts`

**Interfaces:**
- Consumes: `gradeToStage`/`SUBJECT_KEYS`（Task 2）、`appendToConstArray`/`extractIds`/`insertLineAfter`（Task 3）、`duplicateIds`/`collidingIds`（Task 4）。
- Produces: `knowledgeAdapter: Adapter`（kind `knowledge`，envelope `{ grade, subject, knowledgePoints }`）。

**规则：** 目标文件 `src/data/knowledge/<stage>/<subjectKey>.ts`，数组名即 subjectKey（如 `math`）。已存在则追加；不存在则创建 `export const <key>: KnowledgePoint[] = [...]` 并在 `src/data/knowledge/<stage>.ts` 加 import + subjects 项。

- [ ] **Step 1: 写失败测试**

```typescript
// knowledge.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeAdapter } from './knowledge';
import { getRoot } from '../paths';

const ctx = { root: getRoot(), dryRun: true, knowledgePointIds: new Set<string>() };
const kp = (id: string) => ({ id, title: 't', description: 'd' });

test('validate 拒绝重复 id', () => {
  const errs = knowledgeAdapter.validate([kp('p-math-001'), kp('p-math-001')], ctx);
  assert.ok(errs.some((e) => e.includes('重复')));
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/knowledge.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 knowledge.ts**

```typescript
// adapters/knowledge.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { gradeToStage, SUBJECT_KEYS } from '../mapping';
import { appendToConstArray, insertLineAfter, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface KnowledgeEnvelope {
  grade: string;
  subject: string;
  knowledgePoints: { id: string }[];
}

function targetFile(env: KnowledgeEnvelope, ctx: IngestContext): string {
  const stage = gradeToStage(env.grade);
  const key = SUBJECT_KEYS[env.subject];
  return join(ctx.root, 'src', 'data', 'knowledge', stage, `${key}.ts`);
}

export const knowledgeAdapter: Adapter = {
  kind: 'knowledge',
  typeRef: { path: join(getRoot(), 'src/data/types.ts'), name: 'KnowledgePoint', expr: 'KnowledgePoint[]' },
  extract(raw) {
    return (raw as KnowledgeEnvelope).knowledgePoints;
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as { id: string }[];
    const errs: string[] = [];
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    return errs;
  },
  merge(value, raw, ctx) {
    const env = raw as KnowledgeEnvelope;
    const abs = targetFile(env, ctx);
    const key = SUBJECT_KEYS[env.subject];
    if (!existsSync(abs)) {
      writeFileSync(abs, `import type { KnowledgePoint } from '../../types';\n\nexport const ${key}: KnowledgePoint[] = [\n];\n`, 'utf-8');
    }
    writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), key, value), 'utf-8');
    return { files: [abs], inserted: (value as unknown[]).length };
  },
  wire(value, raw, ctx) {
    const env = raw as KnowledgeEnvelope;
    const stage = gradeToStage(env.grade);
    const key = SUBJECT_KEYS[env.subject];
    const agg = join(ctx.root, 'src', 'data', 'knowledge', `${stage}.ts`);
    let content = readFileSync(agg, 'utf-8');
    if (content.includes(`./${stage}/${key}`)) return { files: [] };
    content = insertLineAfter(content, `import type { GradeData } from '../types';`, `import { ${key} } from './${stage}/${key}';`);
    content = insertSubject(content, key, stage, env.subject);
    writeFileSync(agg, content, 'utf-8');
    return { files: [agg] };
  },
};

/** 在 `subjects: [...]` 数组末尾插入一个新学科对象（括号匹配，确定性）。 */
function insertSubject(content: string, key: string, stage: string, name: string): string {
  const anchor = content.indexOf('subjects: [');
  if (anchor === -1) throw new Error('未找到 subjects 数组');
  const open = content.indexOf('[', anchor);
  let depth = 0;
  let close = open;
  for (let i = open; i < content.length; i++) {
    const c = content[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { close = i; break; }
    }
  }
  const item =
    `    {\n      id: '${key}-${stage}',\n      name: '${name}',\n      icon: '📚',\n      knowledgePoints: ${key},\n    },`;
  return content.slice(0, close) + '\n' + item + '\n  ' + content.slice(close);
}
```

- [ ] **Step 4: 把 knowledgeAdapter 加入 registry**

```typescript
// registry.ts
import { knowledgeAdapter } from './adapters/knowledge';
// ...
const adapters: Adapter[] = [/* … */, knowledgeAdapter];
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/knowledge.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/adapters/knowledge.ts scripts/ingest-data/adapters/knowledge.test.ts scripts/ingest-data/registry.ts
git commit -m "feat(ingest-data): add knowledge adapter with subject wiring"
```

---

## Task 9: prompt adapter

**Files:**
- Create: `scripts/ingest-data/adapters/prompt.ts`
- Test: `scripts/ingest-data/adapters/prompt.test.ts`
- Modify: `scripts/ingest-data/registry.ts`

**Interfaces:**
- Consumes: `appendToConstArray`/`extractIds`（Task 3）、`duplicateIds`/`collidingIds`（Task 4）。
- Produces: `promptAdapter: Adapter`（kind `prompt`，envelope `{ prompts: PromptTemplate[] }`）。

**规则：** 按 `scenario` 分组追加到 `src/data/prompts/<scenario>.ts` 的 `<SCENARIO>_PROMPTS`（`-`→`_` 大写）。`extract` 时注入 `usageCount: 0`、`rating: 0`、`author: 'pi-agent-edu'`。

- [ ] **Step 1: 写失败测试**

```typescript
// prompt.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promptAdapter } from './prompt';

test('extract 注入运行时默认字段', () => {
  const v = promptAdapter.extract({
    prompts: [{ id: 'p1', title: 't', scenario: 'explain', icon: '💡', description: 'd', tags: [], template: 'x', variables: [], grades: ['primary'], subjects: ['all'] }],
  });
  const item = (v as any[])[0];
  assert.equal(item.usageCount, 0);
  assert.equal(item.rating, 0);
  assert.equal(item.author, 'pi-agent-edu');
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/prompt.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 prompt.ts**

```typescript
// adapters/prompt.ts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Adapter, IngestContext } from '../types';
import { getRoot } from '../paths';
import { appendToConstArray, extractIds } from '../tsedit';
import { duplicateIds, collidingIds } from '../validate';

interface PromptLike { id: string; scenario: string }

/** 原始 scenario（如 `error-analysis`）→ 数组名（如 `ERROR_ANALYSIS_PROMPTS`）。 */
function scenarioArray(scenario: string): string {
  return `${scenario.toUpperCase().replace(/-/g, '_')}_PROMPTS`;
}

export const promptAdapter: Adapter = {
  kind: 'prompts',
  typeRef: { path: join(getRoot(), 'src/data/prompts/types.ts'), name: 'PromptTemplate', expr: 'PromptTemplate[]' },
  extract(raw) {
    const prompts = (raw as { prompts: any[] }).prompts;
    return prompts.map((p) => ({ ...p, usageCount: 0, rating: 0, author: 'pi-agent-edu' }));
  },
  validate(value, ctx) {
    if (!Array.isArray(value)) return ['payload 必须是数组'];
    const items = value as PromptLike[];
    const errs: string[] = [];
    for (const id of duplicateIds(items)) errs.push(`重复 id: ${id}`);
    for (const it of items) {
      const abs = join(ctx.root, 'src', 'data', 'prompts', `${it.scenario}.ts`);
      const existing = existsSync(abs) ? extractIds(readFileSync(abs, 'utf-8')) : new Set<string>();
      for (const id of collidingIds([it], existing)) errs.push(`id 已存在: ${id}`);
    }
    return errs;
  },
  merge(value, _raw, ctx) {
    const items = value as PromptLike[];
    const groups = new Map<string, any[]>();
    for (const it of items as any[]) {
      const scenario = it.scenario; // 原始 scenario（如 'explain'），作文件名 + 分组键
      if (!groups.has(scenario)) groups.set(scenario, []);
      groups.get(scenario)!.push(it);
    }
    const files: string[] = [];
    for (const [scenario, group] of groups) {
      const abs = join(ctx.root, 'src', 'data', 'prompts', `${scenario}.ts`);
      const arrayName = scenarioArray(scenario);
      if (!existsSync(abs)) {
        writeFileSync(abs, `import type { PromptTemplate } from './types';\n\nexport const ${arrayName}: PromptTemplate[] = [\n];\n`, 'utf-8');
      }
      writeFileSync(abs, appendToConstArray(readFileSync(abs, 'utf-8'), arrayName, group), 'utf-8');
      files.push(abs);
    }
    return { files, inserted: items.length };
  },
  wire() {
    return { files: [] }; // 所有 scenario 已在 prompts/index.ts 中
  },
};
```

- [ ] **Step 4: 加入 registry**

```typescript
import { promptAdapter } from './adapters/prompt';
// ...
const adapters: Adapter[] = [/* … */, promptAdapter];
```

- [ ] **Step 5: 运行确认通过**

Run: `cd scripts/ingest-data && node --import tsx --test adapters/prompt.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add scripts/ingest-data/adapters/prompt.ts scripts/ingest-data/adapters/prompt.test.ts scripts/ingest-data/registry.ts
git commit -m "feat(ingest-data): add prompt adapter with runtime-default injection"
```

---

## Task 10: CLI（index.ts）+ 端到端

**Files:**
- Create: `scripts/ingest-data/index.ts`
- Test: `scripts/ingest-data/index.test.ts`
- Modify: 根 `package.json`（加 `ingest` 快捷命令）

**Interfaces:**
- Consumes: `getAdapter`/`registry`（Task 5-9）、`typeCheck`（Task 4）、`getRoot`（Task 4 的 paths.ts）。
- Produces: CLI `npx tsx index.ts --all | <file> | --list | --dry-run`。

- [ ] **Step 1: 写失败测试（纯函数）**

```typescript
// index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kindFromPath, listStaged } from './index';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('kindFromPath 从 staging 路径推断 kind', () => {
  assert.equal(kindFromPath('/repo/staging/formulas/x.json'), 'formulas');
  assert.equal(kindFromPath('/repo/staging/tutorials/a.json'), 'tutorials');
  assert.throws(() => kindFromPath('/repo/foo/x.json'));
});

test('listStaged 只收集 staging/<kind>/*.json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ingest-'));
  mkdirSync(join(dir, 'staging', 'formulas'), { recursive: true });
  mkdirSync(join(dir, 'staging', 'tutorials'), { recursive: true });
  writeFileSync(join(dir, 'staging', 'formulas', 'a.json'), '{}');
  writeFileSync(join(dir, 'staging', 'tutorials', 'b.json'), '{}');
  writeFileSync(join(dir, 'staging', 'tutorials', 'skip.txt'), '{}');
  const files = listStaged(dir);
  assert.deepEqual(files.sort(), [
    join(dir, 'staging', 'formulas', 'a.json'),
    join(dir, 'staging', 'tutorials', 'b.json'),
  ]);
  rmSync(dir, { recursive: true, force: true });
});
```

> 端到端写盘路径由人工 `--dry-run` + 临时 payload 验证（见 Step 5）；单测聚焦无副作用纯函数。

- [ ] **Step 2: 实现 index.ts**

```typescript
// index.ts
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parseArgs } from 'node:util';
import { getAdapter, registry } from './registry';
import { typeCheck } from './validate';
import { getRoot } from './paths';
import type { IngestContext } from './types';

const STAGING_DIR = 'staging';

export function kindFromPath(path: string): string {
  const parts = path.split('/');
  const stagingIdx = parts.lastIndexOf(STAGING_DIR);
  if (stagingIdx === -1 || stagingIdx + 1 >= parts.length) throw new Error(`无法从路径推断 kind: ${path}`);
  return parts[stagingIdx + 1];
}

export function listStaged(root: string): string[] {
  const base = join(root, STAGING_DIR);
  if (!existsSync(base)) return [];
  const out: string[] = [];
  for (const kind of readdirSync(base)) {
    const dir = join(base, kind);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) {
      if (extname(f) === '.json') out.push(join(dir, f));
    }
  }
  return out.sort();
}

export async function runIngest(root: string, paths: string[], dryRun: boolean): Promise<string[]> {
  const ctx: IngestContext = { root, dryRun, knowledgePointIds: await loadKnowledgePointIds(root) };
  const reports: string[] = [];
  for (const p of paths) {
    const kind = kindFromPath(p);
    const adapter = getAdapter(kind);
    const raw = JSON.parse(readFileSync(p, 'utf-8'));
    const value = adapter.extract(raw);
    const typeErrs = typeCheck(value, adapter.typeRef, root);
    const bizErrs = adapter.validate(value, ctx);
    if (typeErrs.length || bizErrs.length) {
      reports.push(`✗ ${p}\n  ${[...typeErrs, ...bizErrs].join('\n  ')}`);
      continue;
    }
    if (dryRun) {
      reports.push(`✓ ${p}（dry-run，未写盘）`);
      continue;
    }
    const merged = adapter.merge(value, raw, ctx);
    const wired = adapter.wire(value, raw, ctx);
    reports.push(`✓ ${p} → 合并 ${merged.files.join(', ')}${wired.files.length ? ' / 接线 ' + wired.files.join(', ') : ''}`);
  }
  return reports;
}

async function loadKnowledgePointIds(root: string): Promise<Set<string>> {
  const mod = (await import(join(root, 'src', 'data', 'knowledge'))) as {
    KNOWLEDGE_DATA: { subjects: { knowledgePoints: { id: string }[] }[] }[];
  };
  const ids = new Set<string>();
  for (const g of mod.KNOWLEDGE_DATA) for (const s of g.subjects) for (const kp of s.knowledgePoints) ids.add(kp.id);
  return ids;
}

async function main() {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', short: 'a' },
      list: { type: 'boolean', short: 'l' },
      'dry-run': { type: 'boolean', short: 'd' },
    },
  });
  const root = getRoot();
  const dryRun = values['dry-run'] === true;

  if (values.list) {
    const files = listStaged(root);
    console.log(files.length ? files.join('\n') : '（staging 为空）');
    return;
  }

  const positional = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  let paths: string[];
  if (values.all) paths = listStaged(root);
  else if (positional.length) paths = positional.map((p) => join(root, p));
  else {
    console.log('用法: npx tsx index.ts --all | <file> [--dry-run] [--list]');
    return;
  }

  if (paths.length === 0) {
    console.log('没有待入库的 staging 文件');
    return;
  }

  const reports = await runIngest(root, paths, dryRun);
  for (const r of reports) console.log(r);
  if (!dryRun) {
    console.log('（完成。建议运行 npm run build 验证整库仍编译通过）');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(`Fatal: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  });
}
```

- [ ] **Step 3: 根 package.json 加快捷命令**

```json
"ingest": "bash scripts/ingest-data/ingest.sh --all",
"ingest:list": "bash scripts/ingest-data/ingest.sh --list",
"ingest:dry": "bash scripts/ingest-data/ingest.sh --dry-run"
```

并创建 `scripts/ingest-data/ingest.sh`：

```bash
#!/usr/bin/env bash
cd "$(dirname "$0")/../.."
node --import tsx "$(dirname "$0")/index.ts" "$@"
```

- [ ] **Step 4: 运行确认通过**

Run: `cd scripts/ingest-data && npm run typecheck && node --import tsx --test index.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add scripts/ingest-data/index.ts scripts/ingest-data/index.test.ts scripts/ingest-data/ingest.sh package.json
git commit -m "feat(ingest-data): add CLI with dry-run and list"
```

---

## Task 11: README + 全量验证

**Files:**
- Create: `scripts/ingest-data/README.md`

- [ ] **Step 1: 写 README**（含：安装、`--all/--list/--dry-run` 用法、staging 契约、8 种 payload 示例、`npm run build` 验证）

- [ ] **Step 2: 全量验证**

Run: `cd scripts/ingest-data && npm run typecheck && npm test && cd ../.. && npm run build`
Expected: 全部通过；`dist/` 正常产出。

- [ ] **Step 3: 提交**

```bash
git add scripts/ingest-data/README.md
git commit -m "docs(ingest-data): add README"
```

---

## 自我检查清单

**Spec 覆盖检查：**
- [x] Section 1 staging 契约 — Task 10 `kindFromPath`/`listStaged` + README
- [x] Section 2 脚本结构（validate/wire/adapter/registry）— Task 3/4/5 + registry
- [x] 类型层校验 `satisfies` + 编译器 API — Task 4
- [x] 业务规则（id 唯一/题量/knowledgePointIds）— Task 5/6/7
- [x] 8 个 adapter — Task 5（4 薄）+ 6/7/8/9（4 定制）
- [x] `--dry-run` / `--list` — Task 10
- [x] 生成侧改动（P2）— **不在本计划**（单独计划，见 spec 分阶段交付）

**类型一致性（已在写计划时统一，各任务按此为准）：**
- `Adapter.merge/wire` 签名自 Task 1 起即固定为 `(value: unknown, raw: unknown, ctx: IngestContext)`，Task 5-9 全部一致，Task 10 `runIngest` 以 `(value, raw, ctx)` 调用。
- `IngestContext` 自 Task 1 起即含 `knowledgePointIds: Set<string>`，各任务测试 ctx 均传 `new Set()` 或由 `runIngest` 预加载。
- 所有 adapter 统一 `import { getRoot } from '../paths'`，`typeRef.path` 用 `join(getRoot(), …)` 拼接，无内联重复实现。
