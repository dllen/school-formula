# Primary Science & Moral Tutorials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete "科学" (Science) and "道德与法治" (Moral) tutorials to the primary school TutorialView — ~65 units total, unified heavy structure (teach/learn/practice + 10 questions each), AI-generated from existing `tutorialContent` knowledge data.

**Architecture:** A Node generation script (`scripts/generate-tutorial.mjs`) reads knowledge points directly from `src/data/knowledge/primary/{science,moral}.ts` via `--experimental-strip-types`, builds a prompt per unit, calls an OpenAI-compatible API (default local Ollama), validates the returned `TutorialUnit`, and writes `src/data/tutorials/primary-{science,moral}.ts`. Grade assignment uses an in-script `GRADE_MAP` (knowledge points have no `grade` field). UI change is a 3-line extension of `TutorialView.tsx` subject list. Two-phase delivery (science first to lock prompt style, then moral reuses it).

**Tech Stack:** Node 22+ ESM, `--experimental-strip-types` for direct `.ts` import, `fetch` for OpenAI-compatible chat completions, `node:test` for unit tests, TypeScript strict mode, React 19, existing `Tutorial`/`TutorialUnit` types.

**Spec:** `docs/superpowers/specs/2026-09-16-primary-science-moral-tutorials-design.md`

## Global Constraints

- Every generated unit MUST have exactly 10 practice questions (`practice.length === 10`) — validated by both the script and the existing `validatePracticeQuestionCount()`.
- Practice difficulty distribution: 4 easy + 4 medium + 2 hard; each unit must contain at least one of each question type: `choice`, `fill`, `truefalse`, `solve`.
- Target audience: 6–12 year-old students; tone is warm, concrete, life-oriented, for parent-guided learning.
- `teach.hook` must be 200–300 Chinese characters (story/scenario intro).
- Node invocation MUST use `node --experimental-strip-types` (plain `node` will fail on `.ts` imports).
- Do NOT modify upstream `src/data/knowledge/primary/*.ts` files — grade mapping lives only in the script.
- Generated `.ts` files must compile under `npm run build` (TypeScript strict + `verbatimModuleSyntax`).

---

## File Structure

**Create:**
- `scripts/generate-tutorial.mjs` — generator: grade maps, prompt builder, AI caller, validator, serializer, CLI, checkpoint/resume.
- `scripts/generate-tutorial.test.mjs` — unit tests for pure functions (validate, serialize, grade-map completeness, prompt builder).
- `src/data/tutorials/primary-science.ts` — 33 units, 6 `Tutorial` objects (grades 1–6).
- `src/data/tutorials/primary-moral.ts` — 32 units, 6 `Tutorial` objects (grades 1–6).

**Modify:**
- `src/components/TutorialView.tsx` — extend `Subject` type + `SUBJECTS` array with `science`/`moral` (3 small edits).
- `src/data/tutorials/index.ts` — add `PRIMARY_SCIENCE_TUTORIALS` / `PRIMARY_MORAL_TUTORIALS` exports and append to `ALL_TUTORIALS`.

---

## Task 1: Generation script — pure functions + unit tests

**Files:**
- Create: `scripts/generate-tutorial.mjs`
- Create: `scripts/generate-tutorial.test.mjs`

**Interfaces:**
- Produces: `validateUnit(unit)` → `{ valid: boolean, errors: string[] }`
- Produces: `serializeUnit(unit)` → `string` (TS source for one unit)
- Produces: `renderTutorialFile(tutorial)` → `string` (full file source)
- Produces: `buildPrompt(kp, grade, subject, subjectIcon)` → `string`
- Produces: `SCIENCE_GRADE_MAP`, `MORAL_GRADE_MAP` → `{ [grade: string]: string[] }` (KP id arrays)
- Produces: `parseAIResponse(text)` → `TutorialUnit` (throws on invalid JSON)

- [ ] **Step 1: Write the failing tests**

Create `scripts/generate-tutorial.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateUnit, serializeUnit, renderTutorialFile, buildPrompt,
  SCIENCE_GRADE_MAP, MORAL_GRADE_MAP, parseAIResponse,
} from './generate-tutorial.mjs';

// --- validateUnit ---
test('validateUnit accepts a well-formed unit', () => {
  const unit = makeSampleUnit(); // 10 questions, all fields present
  assert.deepEqual(validateUnit(unit), { valid: true, errors: [] });
});

test('validateUnit rejects wrong practice count', () => {
  const unit = makeSampleUnit();
  unit.practice = unit.practice.slice(0, 7);
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('10')));
});

test('validateUnit rejects missing question type', () => {
  const unit = makeSampleUnit();
  unit.practice = unit.practice.map(q => ({ ...q, type: 'choice' }));
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('fill') && e.includes('missing')));
});

test('validateUnit rejects short hook', () => {
  const unit = makeSampleUnit();
  unit.teach.hook = '太短';
  const { valid, errors } = validateUnit(unit);
  assert.equal(valid, false);
  assert.ok(errors.some(e => e.includes('hook')));
});

// --- grade maps ---
test('SCIENCE_GRADE_MAP covers all 33 knowledge points exactly once', () => {
  const all = Object.values(SCIENCE_GRADE_MAP).flat();
  assert.equal(all.length, 33);
  assert.equal(new Set(all).size, 33, 'no duplicate ids');
});

test('MORAL_GRADE_MAP covers all 32 knowledge points exactly once', () => {
  const all = Object.values(MORAL_GRADE_MAP).flat();
  assert.equal(all.length, 32);
  assert.equal(new Set(all).size, 32, 'no duplicate ids');
});

// --- serializeUnit ---
test('serializeUnit produces TypeScript that round-trips', () => {
  const unit = makeSampleUnit();
  const src = serializeUnit(unit);
  assert.ok(src.includes('id:'));
  assert.ok(src.includes('practice:'));
  // Must not contain raw newlines inside string content that break the literal
  assert.ok(!src.includes('undefined'));
});

// --- buildPrompt ---
test('buildPrompt embeds title, grade, objectives', () => {
  const kp = { title: '植物', tutorialContent: { objectives: ['认识根'] } };
  const prompt = buildPrompt(kp, '1', '科学', '🔬');
  assert.ok(prompt.includes('植物'));
  assert.ok(prompt.includes('一年级'));
  assert.ok(prompt.includes('认识根'));
});

// --- parseAIResponse ---
test('parseAIResponse parses bare JSON', () => {
  const unit = makeSampleUnit();
  const parsed = parseAIResponse(JSON.stringify(unit));
  assert.equal(parsed.id, unit.id);
});

test('parseAIResponse strips markdown fences', () => {
  const unit = makeSampleUnit();
  const text = '```json\n' + JSON.stringify(unit) + '\n```';
  const parsed = parseAIResponse(text);
  assert.equal(parsed.id, unit.id);
});

test('parseAIResponse throws on invalid JSON', () => {
  assert.throws(() => parseAIResponse('not json'), SyntaxError);
});

// helper
function makeSampleUnit() {
  const mk = (id, type, diff) => ({ id, type, question: `${id}?`, answer: 'x', explanation: 'e', difficulty: diff, options: type === 'choice' ? ['a', 'b', 'c', 'd'] : undefined });
  return {
    id: 'ps1-u1', order: 1, title: '植物', duration: '约 40 分钟',
    objectives: ['认识植物器官'],
    teach: { hook: '这是一段足够长的故事导入文字，用来测试 hook 长度校验逻辑，需要超过一百字才能通过验证，所以我们继续补充一些内容让这段文字足够长，达到两百字左右的要求。', summary: '本课认识植物。' },
    learn: { sections: [{ title: '根', content: '根在土壤里。', examples: [{ title: '例', problem: '题', solution: '解', tip: '提示' }] }], tips: ['观察实物'] },
    practice: [
      mk('q1', 'choice', 'easy'), mk('q2', 'fill', 'easy'), mk('q3', 'truefalse', 'easy'), mk('q4', 'solve', 'easy'),
      mk('q5', 'choice', 'medium'), mk('q6', 'fill', 'medium'), mk('q7', 'truefalse', 'medium'), mk('q8', 'solve', 'medium'),
      mk('q9', 'choice', 'hard'), mk('q10', 'fill', 'hard'),
    ],
    aiContext: '一年级 科学 植物',
  };
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node --experimental-strip-types --test scripts/generate-tutorial.test.mjs
```

Expected: FAIL — `Cannot find module './generate-tutorial.mjs'`.

- [ ] **Step 3: Implement the pure functions**

Create `scripts/generate-tutorial.mjs` with this structure. First, the grade maps (知识 points have no `grade` field — assigned by curriculum difficulty):

```js
// ── Grade maps: KP id → grade (assigned by curriculum difficulty) ──
export const SCIENCE_GRADE_MAP = {
  '1': ['p-sci-001', 'p-sci-002'],
  '2': ['p-sci-003', 'p-sci-009', 'p-sci-010', 'p-sci-011', 'p-sci-013'],
  '3': ['p-sci-012', 'p-sci-014', 'p-sci-015', 'p-sci-016', 'p-sci-017'],
  '4': ['p-sci-004', 'p-sci-018', 'p-sci-019', 'p-sci-020', 'p-sci-024', 'p-sci-025'],
  '5': ['p-sci-005', 'p-sci-021', 'p-sci-022', 'p-sci-023', 'p-sci-026', 'p-sci-027'],
  '6': ['p-sci-028', 'p-sci-029', 'p-sci-030', 'p-sci-031', 'p-sci-032', 'p-sci-033', 'p-sci-034', 'p-sci-035', 'p-sci-036'],
};

export const MORAL_GRADE_MAP = {
  '1': ['p-mor-001', 'p-mor-002', 'p-mor-003', 'p-mor-004', 'p-mor-009', 'p-mor-010'],
  '2': ['p-mor-011', 'p-mor-012', 'p-mor-013', 'p-mor-014', 'p-mor-015', 'p-mor-016'],
  '3': ['p-mor-017', 'p-mor-018', 'p-mor-019', 'p-mor-020', 'p-mor-021', 'p-mor-022'],
  '4': ['p-mor-023', 'p-mor-024', 'p-mor-025', 'p-mor-026', 'p-mor-027', 'p-mor-028'],
  '5': ['p-mor-029', 'p-mor-030', 'p-mor-031', 'p-mor-032', 'p-mor-033', 'p-mor-034'],
  '6': ['p-mor-035', 'p-mor-036'],
};

export const GRADE_NAME = { '1': '一年级', '2': '二年级', '3': '三年级', '4': '四年级', '5': '五年级', '6': '六年级' };
```

Then the validator:

```js
const QUESTION_TYPES = ['choice', 'fill', 'truefalse', 'solve'];

export function validateUnit(unit) {
  const errors = [];
  if (!unit || typeof unit !== 'object') return { valid: false, errors: ['unit is not an object'] };
  for (const f of ['id', 'title', 'duration']) if (!unit[f]) errors.push(`missing ${f}`);
  if (!Array.isArray(unit.objectives) || unit.objectives.length === 0) errors.push('objectives empty');
  if (!unit.teach?.hook || unit.teach.hook.length < 100) errors.push(`teach.hook too short (< 100 chars): ${unit.teach?.hook?.length ?? 0}`);
  if (!unit.teach?.summary) errors.push('missing teach.summary');
  if (!Array.isArray(unit.learn?.sections) || unit.learn.sections.length === 0) errors.push('learn.sections empty');
  if (!Array.isArray(unit.practice)) {
    errors.push('practice not an array');
  } else {
    if (unit.practice.length !== 10) errors.push(`practice count ${unit.practice.length} !== 10`);
    const types = new Set(unit.practice.map(q => q.type));
    for (const t of QUESTION_TYPES) if (!types.has(t)) errors.push(`missing question type: ${t}`);
    unit.practice.forEach((q, i) => {
      if (!q.id || !q.question || (!q.options && q.type === 'choice')) errors.push(`practice[${i}] malformed`);
    });
  }
  return { valid: errors.length === 0, errors };
}
```

The serializer (uses single quotes; escapes embedded apostrophes; handles `choice.options`):

```js
function esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeValue(val, indent) {
  if (val === null || val === undefined) return 'undefined';
  if (typeof val === 'string') return `'${esc(val)}'`;
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const pad = '  '.repeat(indent + 1);
    const padClose = '  '.repeat(indent);
    return `[\n${val.map(v => pad + serializeValue(v, indent + 1)).join(',\n')}\n${padClose}]`;
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const pad = '  '.repeat(indent + 1);
    const padClose = '  '.repeat(indent);
    const body = keys.map(k => {
      // unquote keys that are valid identifiers
      const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `'${k}'`;
      return `${pad}${key}: ${serializeValue(val[k], indent + 1)}`;
    }).join(',\n');
    return `{\n${body}\n${padClose}}`;
  }
  return String(val);
}

export function serializeUnit(unit) {
  // Pretty-print with the unit wrapper so it drops into the units array
  return serializeValue(unit, 2);
}
```

The file renderer (full `Tutorial[]` source):

```js
const TYPE_IMPORT = `import type { Tutorial, TutorialUnit } from './types';\n`;
const HELPERS = `const choice = (id, question, options, answer, explanation, difficulty) => ({ id, type: 'choice' as const, question, options, answer, explanation, difficulty });\nconst fill = (id, question, answer, explanation, difficulty) => ({ id, type: 'fill' as const, question, answer, explanation, difficulty });\nconst truefalse = (id, question, answer, explanation, difficulty) => ({ id, type: 'truefalse' as const, question, answer: answer as '对' | '错', explanation, difficulty });\nconst solve = (id, question, answer, explanation, difficulty) => ({ id, type: 'solve' as const, question, answer, explanation, difficulty });\n`;

export function renderTutorialFile(tutorials) {
  const src = serializeValue(tutorials, 0);
  return `${TYPE_IMPORT}\n${HELPERS}\nexport const TUTORIALS: Tutorial[] = ${src};\n`;
}
```

The prompt builder — this is the quality-critical piece. It instructs the model to return ONLY a JSON object matching `TutorialUnit`:

```js
export function buildPrompt(kp, grade, subject, subjectIcon) {
  const { objectives = [], explanation = '', examples = [], interaction = '', exercises = [] } = kp.tutorialContent || {};
  const gradeName = GRADE_NAME[grade] || `${grade}年级`;
  return `你是一位资深${subject}教师，擅长为小学${gradeName}学生（6-12岁）设计"家长辅导版"教程单元。请根据下面的知识点内容，生成一个完整的教学单元 JSON。

## 年级：${gradeName}（${grade}年级）
## 学科：${subject} ${subjectIcon}
## 知识点：${kp.title}
## 学习目标：
${objectives.map(o => `- ${o}`).join('\n')}
## 知识讲解（供参考，可扩充生活例子和 mermaid 图解）：
${explanation.slice(0, 3000)}
## 已有例题（保留并融入，可微调）：
${examples.slice(0, 3).map(e => `### ${e.title}\n题目：${e.problem}\n解答：${e.solution}\n提示：${e.tip}`).join('\n\n')}
## 亲子互动参考：
${interaction.slice(0, 1000)}
## 已有练习（保留作为基础，补足到 10 题）：
${exercises.slice(0, 5).map(e => `- ${e.question}（${e.answer}）`).join('\n')}

## 严格输出要求
只输出一个 JSON 对象（不要 markdown 代码块，不要任何额外文字），结构如下：
{
  "id": "<unit id，格式见下>",
  "order": <在年级内的课程序号 1-9>,
  "title": "${kp.title}",
  "duration": "约 X 分钟",
  "objectives": ["..."],
  "teach": {
    "hook": "200-300字故事或情境导入，生动具体，从生活场景切入",
    "summary": "一段话概括本课"
  },
  "learn": {
    "sections": [
      { "title": "小节标题", "content": "Markdown 讲解，可含 mermaid 图：diagrams: [mermaid(\`graph ...\`, '说明')]", "examples": [{ "title": "", "problem": "", "solution": "", "tip": "" }] }
    ],
    "tips": ["家长辅导提示1", "提示2"]
  },
  "practice": [ 10道题，4 easy + 4 medium + 2 hard，必须包含 choice/fill/truefalse/solve 各至少1道 ],
  "aiContext": "${gradeName} ${subject} ${kp.title} 关键词"
}

## 题目格式
- choice: { id, type:'choice', question, options:['A','B','C','D'], answer:'A', explanation, difficulty }
- fill:   { id, type:'fill', question（用____表示空格）, answer, explanation, difficulty }
- truefalse: { id, type:'truefalse', question, answer:'对'|'错', explanation, difficulty }
- solve:  { id, type:'solve', question, answer（完整解答）, explanation, difficulty }

## ID 生成规则
- 单元 id：科学用 ps{年级}-u{序号}，道法用 pm{年级}-u{序号}
- 题目 id：{单元id}-q{1-10}

语气亲切、面向家长辅导场景，多举生活例子。科学课可设计简单实验步骤，道法课多用情境故事。`;
}
```

The parser (strips fences, parses JSON):

```js
export function parseAIResponse(text) {
  let t = text.trim();
  // strip ```json ... ``` fences if present
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  return JSON.parse(t);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --experimental-strip-types --test scripts/generate-tutorial.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-tutorial.mjs scripts/generate-tutorial.test.mjs
git commit -m "feat: add tutorial generation script with unit tests

Pure functions: validateUnit, serializeUnit, renderTutorialFile,
buildPrompt, parseAIResponse, grade maps for science (33 KP) and
moral (32 KP). Tests via node:test.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Generation script — AI call + CLI + checkpoint/resume

**Files:**
- Modify: `scripts/generate-tutorial.mjs` (append the runtime/orchestration part)

**Interfaces:**
- Produces: `callAI(prompt)` → resolves to raw response string
- Produces: `async function main()` — CLI entry with `--subject`, `--grade`, `--resume`, `--dry-run`
- Consumes: `SCIENCE_GRADE_MAP` / `MORAL_GRADE_MAP`, `buildPrompt`, `parseAIResponse`, `validateUnit`, `renderTutorialFile` (from Task 1)

- [ ] **Step 1: Add AI caller**

Append to `scripts/generate-tutorial.mjs`:

```js
// ── AI caller (OpenAI-compatible, defaults to local Ollama) ──
export async function callAI(prompt) {
  const base = process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1';
  const model = process.env.OPENAI_MODEL || 'llama3';
  const apiKey = process.env.OPENAI_API_KEY || '';
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`AI call failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
```

- [ ] **Step 2: Add knowledge loader + checkpoint + main CLI**

Append:

```js
// ── Knowledge data loader ──
async function loadKnowledge(subject) {
  if (subject === 'science') {
    const m = await import('../src/data/knowledge/primary/science.ts');
    return m.science;
  }
  if (subject === 'moral') {
    const m = await import('../src/data/knowledge/primary/moral.ts');
    return m.moral;
  }
  throw new Error(`unknown subject: ${subject}`);
}

const SUBJECT_META = {
  science: { name: '科学', icon: '🔬', idPrefix: 'ps', kpMap: SCIENCE_GRADE_MAP },
  moral:   { name: '道德与法治', icon: '⚖️', idPrefix: 'pm', kpMap: MORAL_GRADE_MAP },
};

function checkpointPath(subject) { return new URL(`./._checkpoint_${subject}.json`, import.meta.url); }

export async function generateUnit(kp, grade, subject) {
  const meta = SUBJECT_META[subject];
  const prompt = buildPrompt(kp, grade, meta.name, meta.icon);
  const text = await callAI(prompt);
  const unit = parseAIResponse(text);
  // inject canonical id if model drifted
  const orderInGrade = meta.kpMap[grade].indexOf(kp.id) + 1;
  unit.id = `${meta.idPrefix}${grade}-u${orderInGrade}`;
  unit.order = orderInGrade;
  const { valid, errors } = validateUnit(unit);
  if (!valid) throw new Error(`Generated unit failed validation for ${kp.id}: ${errors.join('; ')}`);
  return unit;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
  const subject = args.subject;
  const onlyGrade = args.grade || null;
  const resume = args.resume === 'true' || args.resume === undefined; // default resume on
  const dryRun = args.dryRun === 'true';
  if (!SUBJECT_META[subject]) { console.error('usage: --subject science|moral [--grade N] [--resume true|false] [--dryRun true]'); process.exit(1); }

  const meta = SUBJECT_META[subject];
  const kps = await loadKnowledge(subject);

  // load checkpoint
  let checkpoint = {};
  const cpPath = checkpointPath(subject);
  if (resume) { try { checkpoint = JSON.parse(readFileSync(cpPath, 'utf8')); } catch { checkpoint = {}; } }

  const byGrade = {};
  for (const [grade, ids] of Object.entries(meta.kpMap)) {
    if (onlyGrade && grade !== onlyGrade) continue;
    byGrade[grade] = [];
    for (const id of ids) {
      const kp = kps.find(k => k.id === id);
      if (!kp) { console.error(`KP not found: ${id}`); continue; }
      if (checkpoint[id]) { byGrade[grade].push(checkpoint[id]); continue; }
      if (dryRun) { console.log(`[dry-run] would generate ${id} (${kp.title})`); continue; }
      console.log(`Generating ${subject} grade ${grade}: ${id} ${kp.title}...`);
      try {
        const unit = await generateUnit(kp, grade, subject);
        checkpoint[id] = unit;
        byGrade[grade].push(unit);
        writeFileSync(cpPath, JSON.stringify(checkpoint, null, 2));
        console.log(`  ✓ ${unit.id} (${unit.practice.length} questions)`);
      } catch (e) {
        console.error(`  ✗ ${id}: ${e.message}`);
      }
    }
  }

  // render output file
  const tutorials = Object.entries(byGrade).map(([grade, units]) => ({
    id: `primary-${subject}-${grade}`,
    grade,
    gradeName: GRADE_NAME[grade],
    subject: meta.name,
    subjectIcon: meta.icon,
    title: `${GRADE_NAME[grade]}${meta.name}`,
    description: `${GRADE_NAME[grade]}${meta.name}系统教程。`,
    units,
  }));
  const file = renderTutorialFile(tutorials);
  const outPath = new URL(`../src/data/tutorials/primary-${subject}.ts`, import.meta.url);
  writeFileSync(outPath, file);
  console.log(`\nWrote ${outPath.pathname} (${Object.values(byGrade).flat().length} units)`);
}

// run only when invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, writeFileSync } = await import('node:fs');
  main();
}
```

> Note: hoist `readFileSync`/`writeFileSync` import to the top of the file (static `import { readFileSync, writeFileSync } from 'node:fs'`) and remove the dynamic import inside `main` — the dynamic import above is illustrative; use the static form in the actual file.

- [ ] **Step 3: Smoke test (dry-run)**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --dryRun true
```

Expected: prints `[dry-run] would generate p-sci-001 (植物)` ... for all 33 KPs, grouped by grade. No errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-tutorial.mjs
git commit -m "feat: wire AI caller + CLI + checkpoint resume to generator

OpenAI-compatible caller defaults to local Ollama. Per-unit generation
with validation, JSON checkpoint for resume, --dryRun smoke test.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: Generate science sample (3 units) + review gate

**Files:**
- Create: `src/data/tutorials/primary-science.ts` (partial — 3 sample units)
- Create: `scripts/._checkpoint_science.json`

**Interfaces:**
- Produces: a compiling `primary-science.ts` with 3 valid units (grades 1, 3, 6).
- Consumes: `generateUnit`, `callAI`, `renderTutorialFile` (from Tasks 1–2)

- [ ] **Step 1: Generate one low-grade sample (grade 1, first KP)**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 1 --resume false
```

Expected: writes `primary-science.ts` with 2 units (grade 1 has 2 KPs). Prints `✓ ps1-u1`, `✓ ps1-u2`.

- [ ] **Step 2: Generate one mid-grade sample (grade 3) — append to checkpoint**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 3
```

Expected: checkpoint now has grade 1 (2) + grade 3 (5) = 7 units. File re-rendered with 7 units.

- [ ] **Step 3: Generate one high-grade sample (grade 6) — append**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 6
```

Expected: checkpoint = 7 + 9 = 16 units. File re-rendered.

- [ ] **Step 4: Verify it compiles in isolation**

```bash
node --experimental-strip-types -e "
import('./src/data/tutorials/primary-science.ts').then(m => {
  const units = m.TUTORIALS.flatMap(t => t.units);
  console.log('units:', units.length);
  const bad = units.filter(u => u.practice.length !== 10);
  console.log('bad-count units:', bad.length);
  const types = units.every(u => ['choice','fill','truefalse','solve'].every(t => u.practice.some(q => q.type === t)));
  console.log('all-4-types present every unit:', types);
}).catch(e => { console.error('IMPORT FAILED:', e.message); process.exit(1); });
"
```

Expected: `units: 16`, `bad-count units: 0`, `all-4-types present every unit: true`.

- [ ] **Step 5: Human review gate — pause for approval**

Stop here. Review 2–3 units in `primary-science.ts` for tone, accuracy, hook quality. If prompt needs adjustment, edit `buildPrompt` in Task 1 and regenerate. **Do not proceed to Task 4 until sample style is approved.**

- [ ] **Step 6: Commit the sample**

```bash
git add src/data/tutorials/primary-science.ts scripts/._checkpoint_science.json
git commit -m "feat: add science tutorial sample (16 units, grades 1/3/6)

AI-generated sample to validate prompt style before full batch.
33-unit target; remaining grades generated in follow-up.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: Generate remaining science units (grades 2, 4, 5)

**Files:**
- Modify: `src/data/tutorials/primary-science.ts` (complete — all 33 units)
- Modify: `scripts/._checkpoint_science.json`

**Interfaces:**
- Produces: full `primary-science.ts` with 33 units across 6 grades.
- Consumes: checkpoint from Task 3 (grades 1/3/6 already done — skipped via resume).

- [ ] **Step 1: Generate grade 2**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 2
```

Expected: +5 units (checkpoint 16 → 21).

- [ ] **Step 2: Generate grade 4**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 4
```

Expected: +6 units (21 → 27).

- [ ] **Step 3: Generate grade 5**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject science --grade 5
```

Expected: +6 units (27 → 33).

- [ ] **Step 4: Verify full file**

```bash
node --experimental-strip-types -e "
import('./src/data/tutorials/primary-science.ts').then(m => {
  const units = m.TUTORIALS.flatMap(t => t.units);
  console.log('total units:', units.length);
  console.log('all 10 questions:', units.every(u => u.practice.length === 10));
  console.log('all 4 types:', units.every(u => ['choice','fill','truefalse','solve'].every(t => u.practice.some(q=>q.type===t))));
  console.log('grades:', m.TUTORIALS.map(t => t.grade + '(' + t.units.length + ')').join(', '));
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
```

Expected: `total units: 33`, `all 10 questions: true`, `all 4 types: true`, `grades: 1(2), 2(5), 3(5), 4(6), 5(6), 6(9)`.

- [ ] **Step 5: Commit**

```bash
git add src/data/tutorials/primary-science.ts scripts/._checkpoint_science.json
git commit -m "feat: complete all 33 primary science tutorial units

Grades 1-6, 33 units, 330 questions. Validated: 10 questions each,
all 4 question types present per unit.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Generate moral sample (3 units) + review gate

**Files:**
- Create: `src/data/tutorials/primary-moral.ts` (partial — sample units)
- Create: `scripts/._checkpoint_moral.json`

**Interfaces:**
- Produces: a compiling `primary-moral.ts` with sample units (grades 1, 3, 6).
- Consumes: same generator script (Task 1–2), moral grade map.

- [ ] **Step 1: Generate moral grades 1, 3, 6 (same pattern as Task 3)**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 1 --resume false
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 3
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 6
```

Expected: moral checkpoint = 6 + 6 + 2 = 14 units. File rendered.

- [ ] **Step 2: Verify it compiles**

```bash
node --experimental-strip-types -e "
import('./src/data/tutorials/primary-moral.ts').then(m => {
  const units = m.TUTORIALS.flatMap(t => t.units);
  console.log('units:', units.length, '| all-10:', units.every(u => u.practice.length === 10), '| all-types:', units.every(u => ['choice','fill','truefalse','solve'].every(t => u.practice.some(q=>q.type===t))));
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
```

Expected: `units: 14 | all-10: true | all-types: true`.

- [ ] **Step 3: Human review gate — pause for approval**

Review 2–3 moral units. Moral pedagogy is scenario-based — confirm the `teach.hooks` read as situational stories and the practice questions test judgment, not rote recall. Adjust `buildPrompt` if needed, then regenerate. **Do not proceed to Task 6 until approved.**

- [ ] **Step 4: Commit the sample**

```bash
git add src/data/tutorials/primary-moral.ts scripts/._checkpoint_moral.json
git commit -m "feat: add moral tutorial sample (14 units, grades 1/3/6)

AI-generated sample to validate prompt style for moral pedagogy
(scenario-based). 32-unit target; remaining grades follow.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6: Generate remaining moral units (grades 2, 4, 5)

**Files:**
- Modify: `src/data/tutorials/primary-moral.ts` (complete — all 32 units)
- Modify: `scripts/._checkpoint_moral.json`

**Interfaces:**
- Produces: full `primary-moral.ts` with 32 units across 6 grades.
- Consumes: checkpoint from Task 5 (grades 1/3/6 already done — skipped via resume).

- [ ] **Step 1: Generate grades 2, 4, 5**

```bash
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 2
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 4
node --experimental-strip-types scripts/generate-tutorial.mjs --subject moral --grade 5
```

Expected: +6 + 6 + 6 = 18 units (14 → 32).

- [ ] **Step 2: Verify full file**

```bash
node --experimental-strip-types -e "
import('./src/data/tutorials/primary-moral.ts').then(m => {
  const units = m.TUTORIALS.flatMap(t => t.units);
  console.log('total units:', units.length);
  console.log('all 10 questions:', units.every(u => u.practice.length === 10));
  console.log('grades:', m.TUTORIALS.map(t => t.grade + '(' + t.units.length + ')').join(', '));
}).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
"
```

Expected: `total units: 32`, `all 10 questions: true`, `grades: 1(6), 2(6), 3(6), 4(6), 5(6), 6(2)`.

- [ ] **Step 3: Commit**

```bash
git add src/data/tutorials/primary-moral.ts scripts/._checkpoint_moral.json
git commit -m "feat: complete all 32 primary moral tutorial units

Grades 1-6, 32 units, 320 questions. Validated: 10 questions each.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7: Extend TutorialView with science + moral subjects

**Files:**
- Modify: `src/components/TutorialView.tsx`

**Interfaces:**
- Consumes: `ALL_TUTORIALS` (will include science/moral after Task 8) — but this task is UI-only and works even before wiring.
- Produces: 5-subject tab bar; lookup via `subjectNameMap`.

- [ ] **Step 1: Update the Subject type and SUBJECTS array**

In `src/components/TutorialView.tsx`, change:

```ts
type Subject = 'math' | 'chinese' | 'english';
```
to:
```ts
type Subject = 'math' | 'chinese' | 'english' | 'science' | 'moral';
```

Change the `SUBJECTS` array to:

```ts
const SUBJECTS: { id: Subject; name: string; icon: string }[] = [
  { id: 'math', name: '数学', icon: '🔢' },
  { id: 'chinese', name: '语文', icon: '📝' },
  { id: 'english', name: '英语', icon: '🔤' },
  { id: 'science', name: '科学', icon: '🔬' },
  { id: 'moral', name: '道德与法治', icon: '⚖️' },
];
```

- [ ] **Step 2: Replace the inline ternary lookup with a map**

Replace the `tutorial = ALL_TUTORIALS.find(...)` line and its ternary subject expression with:

```ts
const subjectNameMap: Record<Subject, string> = {
  math: '数学',
  chinese: '语文',
  english: '英语',
  science: '科学',
  moral: '道德与法治',
};

const tutorial = ALL_TUTORIALS.find(t => t.grade === selectedGrade && t.subject === subjectNameMap[selectedSubject]) || null;
```

- [ ] **Step 3: Verify it compiles**

```bash
npm run build
```

Expected: build passes (science/moral tutorials not yet in `ALL_TUTORIALS`, so those tabs show the "暂无教程" empty state — that is correct and expected here).

- [ ] **Step 4: Commit**

```bash
git add src/components/TutorialView.tsx
git commit -m "feat: extend TutorialView with science + moral subjects

Add 科学 and 道德与法治 to the subject tab bar. Lookup refactored
from ternary chain to subjectNameMap. Empty-state until index.ts wired.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8: Wire science + moral into index.ts

**Files:**
- Modify: `src/data/tutorials/index.ts`

**Interfaces:**
- Consumes: `TUTORIALS` from `primary-science.ts` and `primary-moral.ts` (renamed to `PRIMARY_SCIENCE_TUTORIALS` / `PRIMARY_MORAL_TUTORIALS`).
- Produces: updated `ALL_TUTORIALS` including all 65 new units.

- [ ] **Step 1: Rename exports in the generated files**

In `src/data/tutorials/primary-science.ts`, change:
```ts
export const TUTORIALS: Tutorial[] = ...
```
to:
```ts
export const PRIMARY_SCIENCE_TUTORIALS: Tutorial[] = ...
```

In `src/data/tutorials/primary-moral.ts`, change:
```ts
export const TUTORIALS: Tutorial[] = ...
```
to:
```ts
export const PRIMARY_MORAL_TUTORIALS: Tutorial[] = ...
```

- [ ] **Step 2: Update index.ts**

Add to the export block at the top:
```ts
export { PRIMARY_SCIENCE_TUTORIALS } from './primary-science';
export { PRIMARY_MORAL_TUTORIALS } from './primary-moral';
```

Add to the import block:
```ts
import { PRIMARY_SCIENCE_TUTORIALS } from './primary-science';
import { PRIMARY_MORAL_TUTORIALS } from './primary-moral';
```

Add to `ALL_TUTORIALS`:
```ts
  ...PRIMARY_SCIENCE_TUTORIALS,
  ...PRIMARY_MORAL_TUTORIALS,
```

- [ ] **Step 3: Verify build + validator**

```bash
npm run build
node --experimental-strip-types -e "
const { validatePracticeQuestionCount } = await import('./src/data/tutorials/index.ts');
const errors = validatePracticeQuestionCount();
console.log('validation errors:', errors.length);
if (errors.length) console.log(errors.slice(0, 5).join('\n'));
"
```

Expected: build passes, `validation errors: 0`.

- [ ] **Step 4: Commit**

```bash
git add src/data/tutorials/primary-science.ts src/data/tutorials/primary-moral.ts src/data/tutorials/index.ts
git commit -m "feat: wire science + moral tutorials into ALL_TUTORIALS

Rename exports to PRIMARY_SCIENCE/MORAL_TUTORIALS, append to
ALL_TUTORIALS. validatePracticeQuestionCount passes (0 errors).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9: Final validation

**Files:** none new (verify only)

**Interfaces:** final acceptance check against spec.

- [ ] **Step 1: Full build + lint**

```bash
npm run build && npm run lint
```

Expected: clean, no errors.

- [ ] **Step 2: Confirm unit inventory**

```bash
node --experimental-strip-types -e "
const { ALL_TUTORIALS } = await import('./src/data/tutorials/index.ts');
const sci = ALL_TUTORIALS.filter(t => t.subject === '科学');
const mor = ALL_TUTORIALS.filter(t => t.subject === '道德与法治');
console.log('science:', sci.length, 'tutorials,', sci.reduce((a,t)=>a+t.units.length,0), 'units');
console.log('moral:', mor.length, 'tutorials,', mor.reduce((a,t)=>a+t.units.length,0), 'units');
const total = ALL_TUTORIALS.flatMap(t=>t.units);
console.log('total units across all subjects:', total.length);
console.log('every unit has exactly 10 questions:', total.every(u => u.practice.length === 10));
"
```

Expected: `science: 6 tutorials, 33 units`, `moral: 6 tutorials, 32 units`, `every unit has exactly 10 questions: true`.

- [ ] **Step 3: Run test suite**

```bash
npm test
```

Expected: all tests pass (no regressions).

- [ ] **Step 4: Manual spot-check (3 units)**

Open `src/data/tutorials/primary-science.ts` and `primary-moral.ts`. Spot-check one low / one mid / one high grade unit each. Confirm:
- `teach.hook` is a vivid 200–300 char story.
- `learn.sections` each have content + ≥1 example.
- 10 questions, difficulty spread 4/4/2, all 4 types present.
- No placeholder text like "TODO" or "待补充".

If any unit fails, regenerate just that unit via the script with a targeted checkpoint edit, then re-verify.

- [ ] **Step 5: Final commit (if spot-check edits were made)**

```bash
git add -A
git commit -m "fix: regenerate spot-checked units after final review

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

(If no edits were needed, there is nothing to commit — this step is a no-op.)

---

## Self-Review Notes

- **Spec coverage:** grade maps (spec §数据映射), one-KP-one-unit (spec §粒度), unified heavy structure (spec §结构), AI generation with script + sample-first review (spec §生成工作流), TutorialView 3-line extension (spec §UI), two-phase delivery (Task 3→4 science, Task 5→6 moral), validation via `validatePracticeQuestionCount` (spec §验收). All covered.
- **Placeholders:** none — every code block is concrete; grade maps contain real KP ids.
- **Type consistency:** `validateUnit`/`serializeUnit`/`buildPrompt`/`parseAIResponse`/`renderTutorialFile` signatures stable across Tasks 1–2; `primary-{science,moral}.ts` export names stable across Tasks 3–8.
