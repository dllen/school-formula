# pi-agent-edu 生成侧 JSON 输出 实现计划（P2）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 让 `pi-agent-edu` 生成侧产出规范 JSON 到 `staging/<kind>/`，与已落地的 `scripts/ingest-data` 入库脚本对接（P2 = 生成侧改造）。

**Architecture:** 系统提示词改为「输出严格 JSON 信封（字段以 `src/data/*/types.ts` 为准）」，向导扩到 8 种任务类型，`save`/`退出` 把生成结果解析成 JSON 并写入 `staging/<kind>/<timestamp>.json`。入库侧无需改动。

**Tech Stack:** TypeScript（strict + verbatimModuleSyntax），`tsx` 运行，`node --import tsx --test` 测试。

**Spec:** `docs/superpowers/specs/2026-09-17-pi-agent-edu-data-ingestion-design.md`（Section 3 = 生成侧改动）

## Global Constraints

- TypeScript 严格模式 + `verbatimModuleSyntax: true`。
- 运行 `npx tsx index.ts`；测试 `node --import tsx --test *.test.ts`。
- 简体中文日志/报错。
- 不修改 `scripts/ingest-data/`（入库侧已冻结）。
- 信封形状与 `scripts/ingest-data` 的 staging 契约一致（kind = staging 目录名，复数）。

## 信封 → staging 目录映射

| 信封 key | kind（目录名） | 数据类型 |
|----------|---------------|----------|
| `tutorial` | `tutorials` | `Tutorial` |
| `questions` | `questions` | `Question[]` |
| `knowledgePoints`（+`grade`+`subject`） | `knowledge` | `KnowledgePoint[]` |
| `cheatsheets` | `cheatsheets` | `CheatSheet[]` |
| `formulas` | `formulas` | `Formula[]` |
| `mnemonics`（+`grade`） | `mental-math` | `MentalMathMnemonic[]` |
| `techniques` | `techniques` | `Technique[]` |
| `prompts` | `prompts` | `PromptTemplate[]` |

---

## Task 1: 系统提示词改 JSON 输出（prompts.ts）

**Files:**
- Modify: `scripts/pi-agent-edu/prompts.ts`

**Interfaces:**
- Produces: `getSystemPrompt()` 的【输出格式】段改为 JSON 信封说明，删除过期 TS 接口。

- [ ] **Step 1: 替换【输出格式】段**

在 `getSystemPrompt()` 里，把现有的 `【输出格式】` 段（含 `interface TutorialUnit` / `interface Question` 两个 TS 接口块）替换为下面的 JSON 信封说明（其余段落——角色定义/质量标准/学科差异/错误规避/工具策略/文件操作——保持不变）：

```
【输出格式】
你的输出必须是严格合法的 JSON，不要 markdown 代码围栏（不要 ```json）、不要任何解释文字。
输出一个「信封」对象，信封只有下面列出的键之一。字段形状以仓库真实类型为准：
生成前用 read 工具读取 src/data/ 下对应的 types.ts 确认字段（如 src/data/tutorials/types.ts）。

8 种信封（键名固定，kind = 入库目录）：

1. 教程单元：{ "tutorial": { id, title, order, duration, objectives, teach:{hook,summary}, learn:{sections,tips}, practice:[10 题], aiContext } }
   → kind "tutorials"
2. 题库：{ "questions": [ { id, type:'choice'|'fill-blank'|'true-false', difficulty:'basic'|'intermediate'|'advanced', stem, options?, answer, explanation, tags, knowledgePointIds, subject, grade } ] }
   → kind "questions"（注意：这是独立题库的 Question，字段含 stem/tags/knowledgePointIds/subject/grade，与教程内的 practice 题不同）
3. 知识点：{ "grade": 'primary'|'middle'|'high', "subject": '数学', "knowledgePoints": [ { id, title, description, tags?, detailedExplanation?, studyTips?, practiceQuestions?, funEmoji?, funFact?, funStory?, funQuestion?, funQuestionAnswer?, tutorialContent? } ] }
   → kind "knowledge"
4. 速查表：{ "cheatsheets": [ { id, title, grade, ... } ] }
   → kind "cheatsheets"
5. 公式：{ "formulas": [ { id, name, expression, grade, subject, condition, hint? } ] }
   → kind "formulas"
6. 口算：{ "grade": 'primary'|'middle'|'high', "mnemonics": [ { id, title, rhyme, scene, example, explanation?, tags } ] }
   → kind "mental-math"
7. 掌握度技巧：{ "techniques": [ { id, grade, stage:'小学'|'中学'|'高中', name, summary, kou, steps, prereq, fig?, examples?, mistakes?, realWorld? } ] }
   → kind "techniques"
8. 提示词模板：{ "prompts": [ { id, title, scenario:'explain'|'generate'|'assess'|'plan'|'error-analysis'|'derivation'|'explore'|'interaction', icon, description, tags, template, variables, grades, subjects, knowledgePointIds?, gradeLevel? } ] }
   → kind "prompts"（usageCount/rating/author 由入库侧注入，无需输出）

【规则】
1. 只输出 JSON 信封对象本身，不要围栏、不要解释。
2. 字符串用双引号。
3. 计算题必须验算答案；概念与课程标准一致。
4. id 全局唯一，遵循既有 id 约定（先 read 现有数据文件确认）。
```

- [ ] **Step 2: 运行 typecheck**

Run: `cd scripts/pi-agent-edu && npm run typecheck`
Expected: 通过（`prompts.ts` 只是字符串内容变化）。

- [ ] **Step 3: 提交**

```bash
git add scripts/pi-agent-edu/prompts.ts
git commit -m "feat(pi-agent-edu): system prompt emits JSON envelopes for ingest-data"
```

---

## Task 2: 向导扩到 8 类型 + kind 映射（index.ts）

**Files:**
- Modify: `scripts/pi-agent-edu/index.ts`
- Test: `scripts/pi-agent-edu/index.test.ts`（若有 `buildPromptFromWizard`/`kindFromTask` 单测则更新；否则新增）

**Interfaces:**
- Produces: `TASKS` 8 项；`kindFromTask(task): string`；`buildPromptFromWizard` 按 8 类构造 prompt。

- [ ] **Step 1: 定义 8 类型与 kind 映射**

把 `scripts/pi-agent-edu/index.ts` 的 `TASKS` 改为：

```typescript
const TASKS = [
  '教程单元',
  '题库',
  '知识点',
  '速查表',
  '公式',
  '口算',
  '掌握度技巧',
  '提示词模板',
] as const;
type Task = typeof TASKS[number];
```

新增导出函数：

```typescript
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
```

- [ ] **Step 2: 更新 `buildPromptFromWizard`**

`buildPromptFromWizard` 改为按 8 类构造（难度/数量选择仅保留给题库；口算/知识点等用固定 grade/学科参数）：

```typescript
export function buildPromptFromWizard(result: WizardResult): string {
  const { stage, subject, grade, task, difficulty, questionCount } = result;
  const kind = kindFromTask(task);
  switch (task) {
    case '教程单元':
      return `生成【${stage}${subject} - ${grade}】的 TutorialUnit，输出 JSON 信封 { "tutorial": {…} }，含 10 道练习题（easy:medium:hard = 4:4:2）`;
    case '题库': {
      const count = questionCount || '10';
      const diff = difficulty ? `（${difficulty}）` : '（easy:medium:hard = 4:4:2）';
      return `生成 ${count} 道${stage}${subject}${grade}练习题，输出 JSON 信封 { "questions": [ …Question ] }，难度${diff}`;
    }
    case '知识点':
      return `生成【${stage}${subject} - ${grade}】知识点，输出 JSON 信封 { "grade", "subject", "knowledgePoints": [ … ] }`;
    case '速查表':
      return `生成【${stage}${subject}】速查表，输出 JSON 信封 { "cheatsheets": [ … ] }`;
    case '公式':
      return `生成【${stage}${subject}】公式，输出 JSON 信封 { "formulas": [ … ] }`;
    case '口算':
      return `生成【${stage}${subject}】口算口诀，输出 JSON 信封 { "grade", "mnemonics": [ … ] }`;
    case '掌握度技巧':
      return `生成【${stage}${subject}】掌握度技巧，输出 JSON 信封 { "techniques": [ … ] }`;
    case '提示词模板':
      return `生成【${stage}${subject}】提示词模板，输出 JSON 信封 { "prompts": [ … ] }`;
  }
}
```

- [ ] **Step 3: 记录当前 kind**

在 `main()` 里，新建会话时把 `wizard.task` 对应的 kind 保存到一个模块级变量（供 `save` 使用），续会话时该变量为空（`save` 会从信封推断，见 Task 3）：

```typescript
let currentKind: string | null = null;
// 在 runWizard 之后：
currentKind = kindFromTask(wizard.task);
```

- [ ] **Step 4: 运行 typecheck + 单测**

Run: `cd scripts/pi-agent-edu && npm run typecheck && node --import tsx --test *.test.ts`
Expected: 通过（若 `index.test.ts` 断言了旧的 4 类 TASKS，需同步更新）。

- [ ] **Step 5: 提交**

```bash
git add scripts/pi-agent-edu/index.ts
git commit -m "feat(pi-agent-edu): expand wizard to 8 task types with kind mapping"
```

---

## Task 3: save/退出 写 staging JSON（index.ts + 新 helper）

**Files:**
- Create: `scripts/pi-agent-edu/staging.ts`（JSON 提取 + 信封推断 + 写盘）
- Modify: `scripts/pi-agent-edu/index.ts`（save/退出 改走 staging）
- Test: `scripts/pi-agent-edu/staging.test.ts`

**Interfaces:**
- Produces: `extractJson(text): unknown`；`inferKindFromEnvelope(json): string`；`saveToStaging(text, kind?): string`（返回写盘路径）。

- [ ] **Step 1: 写失败测试（staging.test.ts）**

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractJson, inferKindFromEnvelope } from './staging';

test('extractJson 去掉围栏与尾部文字', () => {
  assert.deepEqual(extractJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(extractJson('{"a":1}\n\n以上是结果。'), { a: 1 });
});

test('extractJson 非法输入抛错', () => {
  assert.throws(() => extractJson('没有 JSON'));
});

test('inferKindFromEnvelope 按信封键推断', () => {
  assert.equal(inferKindFromEnvelope({ tutorial: {} }), 'tutorials');
  assert.equal(inferKindFromEnvelope({ questions: [] }), 'questions');
  assert.equal(inferKindFromEnvelope({ mnemonics: [] }), 'mental-math');
  assert.equal(inferKindFromEnvelope({ knowledgePoints: [] }), 'knowledge');
});
```

- [ ] **Step 2: 运行确认失败**

Run: `cd scripts/pi-agent-edu && node --import tsx --test staging.test.ts`
Expected: FAIL（`./staging` 不存在）。

- [ ] **Step 3: 实现 staging.ts**

```typescript
// scripts/pi-agent-edu/staging.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getProjectRoot } from './config';

const ENVELOPE_KEY_TO_KIND: Record<string, string> = {
  tutorial: 'tutorials',
  questions: 'questions',
  knowledgePoints: 'knowledge',
  cheatsheets: 'cheatsheets',
  formulas: 'formulas',
  mnemonics: 'mental-math',
  techniques: 'techniques',
  prompts: 'prompts',
};

/** 从 agent 文本回复中提取 JSON 值（去围栏、去尾部文字）。 */
export function extractJson(text: string): unknown {
  let s = text.replace(/```(?:json)?/gi, '').trim();
  const start = s.search(/[\[{]/);
  if (start === -1) throw new Error('未找到 JSON');
  s = s.slice(start);
  // 逐次从末尾裁剪，直到 JSON.parse 成功（容忍尾部 prose）
  for (let end = s.length; end > 0; end--) {
    if ('} ]'.includes(s[end - 1])) {
      try { return JSON.parse(s.slice(0, end)); } catch { /* 继续收缩 */ }
    }
  }
  throw new Error('JSON 解析失败');
}

/** 按信封键推断入库 kind（staging 目录名）。 */
export function inferKindFromEnvelope(json: unknown): string {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    for (const key of Object.keys(json)) {
      const kind = ENVELOPE_KEY_TO_KIND[key];
      if (kind) return kind;
    }
  }
  throw new Error('无法识别信封类型');
}

/** 把生成的 JSON 文本写入 staging/<kind>/<timestamp>.json，返回路径。 */
export function saveToStaging(text: string, explicitKind?: string): string {
  const json = extractJson(text);
  const kind = explicitKind ?? inferKindFromEnvelope(json);
  const root = getProjectRoot();
  const name = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const target = join(root, 'staging', kind, `generated-${name}.json`);
  mkdirSync(join(root, 'staging', kind), { recursive: true });
  writeFileSync(target, JSON.stringify(json, null, 2), 'utf-8');
  return target;
}
```

- [ ] **Step 4: 运行确认通过**

Run: `cd scripts/pi-agent-edu && node --import tsx --test staging.test.ts`
Expected: PASS。

- [ ] **Step 5: 改 save/退出 走 staging**

在 `scripts/pi-agent-edu/index.ts`：
1. `import { saveToStaging } from './staging';`
2. `退出` 分支：把 `saveContent(text)` 换成 `saveToStaging(text, currentKind ?? undefined)`。
3. `save`/`保存` 分支：支持 `save <kind>`（指定目录）与 `save <路径>`（旧行为保留？不——统一走 staging；若用户给了以 `/` 或 `.ts` 结尾的参数，回退到旧的 `saveContent` 写任意路径）。实现为：`save`（无参）→ `saveToStaging(text, currentKind ?? undefined)`；`save <kind>`（纯字母数字/连字符）→ `saveToStaging(text, <kind>)`；`save <path>`（含 `/` 或 `.`）→ 旧的 `saveContent(text, <path>)`。

- [ ] **Step 6: 运行 typecheck + 全量单测**

Run: `cd scripts/pi-agent-edu && npm run typecheck && node --import tsx --test *.test.ts`
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add scripts/pi-agent-edu/staging.ts scripts/pi-agent-edu/staging.test.ts scripts/pi-agent-edu/index.ts
git commit -m "feat(pi-agent-edu): save/exit writes staging JSON"
```

---

## Task 4: 验证 + README 更新

**Files:**
- Modify: `scripts/pi-agent-edu/README.md`

- [ ] **Step 1: 更新 README**

在 README 的「输出格式」「数据文件位置」章节更新为：系统提示词输出 JSON 信封，`save`/`退出` 写入 `staging/<kind>/generated-<timestamp>.json`，随后运行 `npm run ingest`（根快捷命令）入库。

- [ ] **Step 2: 全量验证**

Run: `cd scripts/pi-agent-edu && npm run typecheck && node --import tsx --test *.test.ts && cd /Users/shichaopeng/Work/self-dir/projects/school-formula && node_modules/.bin/eslint scripts/pi-agent-edu`
Expected: 全部通过；eslint 0 错误（若 pi-agent-edu 有既有 lint 错误，与本次无关则记录不修）。

- [ ] **Step 3: 提交**

```bash
git add scripts/pi-agent-edu/README.md
git commit -m "docs(pi-agent-edu): document JSON/staging output"
```

---

## 自我检查清单

**Spec 覆盖：** Section 3 三条（提示词 JSON / 向导 8 类型 / save 写 staging）→ Task 1/2/3。
**类型一致：** `kindFromTask`（Task 2）与 `ENVELOPE_KEY_TO_KIND`（Task 3）的 8 个 kind 一一对应；`staging.ts` 用 `getProjectRoot`（来自 config.ts，已在仓库中存在）。
**占位符：** 无 TBD/TODO；Task 3 Step 5 的 `save <kind>` vs `save <path>` 分支有明确判定规则。
