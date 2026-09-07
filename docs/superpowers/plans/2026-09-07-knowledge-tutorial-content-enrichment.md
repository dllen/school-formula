# 知识点库与教程内容体系补全 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 school-formula 知识点从 136 个扩展到 500+，为全部知识点预生成结构化教程（tutorialContent），并新增 9 个年级专属提示词模板与可配置多 Provider 的 AI 生成流水线。

**Architecture:** 21 个学科数据文件（按学段 × 学科拆分）→ 种子 JSON → Node.js 生成脚本（多 Provider）→ 输出 JSON → 合并脚本注入 TS 文件 → KnowledgeDetail 渲染「系统教程」区块。所有纯函数（括号配平合并、模板选型、质量校验）有单元测试。

**Tech Stack:** TypeScript 5.9、React 19、Vite 7、Vitest 5、OpenAI SDK（兼容协议）、Node.js 20

---

## 文件结构总览

| 操作 | 路径 | 说明 |
|------|------|------|
| 修改 | `src/data/types.ts` | 新增 TutorialContent 类型 + KnowledgePoint 可选字段 |
| 创建 | `scripts/export-seed.mjs` | 从 TS 数据文件提取知识点清单 → knowledge-seed.json |
| 创建 | `scripts/split-knowledge.mjs` | ID 迁移（p-math-1 → p-math-001）+ 文件拆分 |
| 创建 | `scripts/generate-seed-manual.mjs` | 人工编写知识点清单 → knowledge-seed.json |
| 创建 | `scripts/generate-fields.mjs` | AI 批量生成静态字段（funStory/practiceQuestions 等） |
| 创建 | `scripts/generate-content.mjs` | AI 批量生成 tutorialContent（多 Provider） |
| 创建 | `scripts/merge-tutorials.mjs` | output JSON → 注入 TS 数据文件 |
| 创建 | `scripts/provider-config.mjs` | Provider 配置加载 + OpenAI Client 工厂 |
| 创建 | `scripts/*.test.mjs` | Vitest 单元测试（括号配平、模板选型、校验、配置） |
| 修改 | `src/data/prompts/types.ts` | PromptTemplate 新增 gradeLevel 字段 |
| 创建 | `src/data/prompts/{explain,interaction,generate}/{primary,middle,high}.ts` | 9 个年级专属模板 |
| 修改 | `src/data/prompts/index.ts` | ALL_PROMPTS 聚合 + selectBestTemplate |
| 创建 | `src/data/knowledge/<grade>/<subject>.ts` × 21 | 拆分后的学科数据文件 |
| 修改 | `src/data/knowledge/{primary,middle,high}.ts` | 改为 re-export 兼容层 |
| 修改 | `src/data/knowledge.ts` | KNOWLEDGE_DATA 组装逻辑（导入新结构） |
| 修改 | `src/components/KnowledgeDetail.tsx` | 新增「📚 系统教程」区块 |
| 修改 | `scripts/generate-config.jsonc` | 多 Provider 生成配置模板 |

---

## Task 1: TutorialContent 类型 + 种子导出工具

**Files:**
- Modify: `src/data/types.ts`
- Create: `scripts/export-seed.mjs`
- Create: `scripts/seed.test.mjs`

- [ ] **Step 1: 写 TutorialContent 类型（TDD：先写类型 + 类型测试占位）**

在 `src/data/types.ts` 末尾追加：

```typescript
export interface TutorialExample {
  title: string;
  problem: string;
  solution: string;
  tip: string;
}

export interface TutorialExercise {
  question: string;
  answer: string;
  explanation: string;
}

export interface TutorialContent {
  /** 🎯 本课目标：3-5 条学习目标 */
  objectives: string[];
  /** 📖 知识讲解：核心概念 + 生活案例（Markdown） */
  explanation: string;
  /** ✏️ 例题精讲：2-3 道由易到难 */
  examples: TutorialExample[];
  /** 🧩 亲子互动：5-10 分钟活动描述 */
  interaction: string;
  /** 📝 课后练习：3-5 题 */
  exercises: TutorialExercise[];
}
```

并在 `KnowledgePoint` 接口中新增可选字段：

```typescript
  /** 系统教程（Phase 3 生成，可选；无值则详情页不显示该区块） */
  tutorialContent?: TutorialContent;
```

- [ ] **Step 2: 验证类型编译**

```bash
npx tsc -b --noEmit
```

Expected: exit 0，无错误。

- [ ] **Step 3: 写种子导出脚本 `scripts/export-seed.mjs`**

功能：读取 21 个学科 TS 文件文本，按 `id: 'p-math-1'` 模式提取每个知识点的 id/title/description/学段/学科到 JSON。

```javascript
// scripts/export-seed.mjs
// 从 src/data/knowledge/<grade>/<subject>.ts 提取知识点清单，输出 scripts/knowledge-seed.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KNOWLEDGE_DIR = join(ROOT, 'src/data/knowledge');

const GRADES = ['primary', 'middle', 'high'];
const GRADE_NAMES = { primary: '小学', middle: '初中', high: '高中' };
// 学科文件映射（与拆分后结构一致）
const SUBJECTS = {
  primary: ['math', 'chinese', 'english', 'science', 'moral'],
  middle: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'history', 'geography', 'moral'],
  high: ['math', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography'],
};
const SUBJECT_NAMES = {
  math: '数学', chinese: '语文', english: '英语', science: '科学', moral: '道德与法治',
  physics: '物理', chemistry: '化学', biology: '生物', history: '历史', geography: '地理', politics: '思想政治',
};

/**
 * 从单个 TS 学科文件提取知识点清单
 * 数据文件结构：export const XXX: Subject = { id, name, icon, knowledgePoints: [ { id, title, description, ... }, ... ] }
 */
function extractFromSubjectFile(filePath, grade, subject) {
  const text = readFileSync(filePath, 'utf8');
  // knowledgePoints 数组：从 'knowledgePoints: [' 到配平的 ']'
  const kpStart = text.indexOf('knowledgePoints');
  if (kpStart === -1) throw new Error(`knowledgePoints not found in ${filePath}`);
  const arrStart = text.indexOf('[', kpStart);
  const arrEnd = matchBracket(text, arrStart);
  const arrText = text.slice(arrStart + 1, arrEnd);

  // 逐对象提取：id: '...', + 后续到下一个 id: 或数组结束
  const points = [];
  const idRegex = /id:\s*'([^']+)'/g;
  const ids = [...arrText.matchAll(idRegex)];
  for (let i = 0; i < ids.length; i++) {
    const start = ids[i].index;
    const end = i + 1 < ids.length ? ids[i + 1].index : arrText.length;
    const objText = arrText.slice(start, end);
    const id = ids[i][1];
    const titleMatch = objText.match(/title:\s*(`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*')/);
    const descMatch = objText.match(/description:\s*(`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*')/);
    points.push({
      id,
      title: titleMatch ? unquote(titleMatch[1]) : '',
      description: descMatch ? unquote(descMatch[1]) : '',
      grade,
      gradeName: GRADE_NAMES[grade],
      subject,
      subjectName: SUBJECT_NAMES[subject],
    });
  }
  return points;
}

/** 引用字符串去引号（含模板字符串） */
function unquote(raw) {
  const q = raw[0];
  if (q === '`') return raw.slice(1, -1).replace(/\\`/g, '`');
  return raw.slice(1, -1).replace(/\\'/g, "'");
}

/** 括号配平：找与 from 位置 '[' 或 '{' 配对的结束下标 */
export function matchBracket(text, from) {
  const open = text[from];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    if (ch === open) depth++;
    if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error(`bracket not matched at ${from}`);
}

const seed = [];
for (const grade of GRADES) {
  for (const subject of SUBJECTS[grade]) {
    const filePath = join(KNOWLEDGE_DIR, grade, `${subject}.ts`);
    try {
      seed.push(...extractFromSubjectFile(filePath, grade, subject));
    } catch (err) {
      console.warn(`skip ${filePath}: ${err.message}`);
    }
  }
}

const outPath = join(__dirname, 'knowledge-seed.json');
writeFileSync(outPath, JSON.stringify({ total: seed.length, items: seed }, null, 2));
console.log(`✓ seed written: ${seed.length} items → ${outPath}`);
```

- [ ] **Step 4: 写单元测试 `scripts/seed.test.mjs`**

```javascript
import { describe, test, expect } from 'vitest';
import { matchBracket } from './export-seed.mjs';

describe('matchBracket', () => {
  test('配平方括号', () => {
    expect(matchBracket('[1,2,[3]]', 0)).toBe(9);
    expect(matchBracket('[{"id":"a"},{"id":"b"}]', 0)).toBe(22);
  });

  test('配平花括号', () => {
    expect(matchBracket('{"}":"v"}', 0)).toBe(8);
    expect(matchBracket('a{b{c}d}e', 1)).toBe(7);
  });

  test('未闭合抛错', () => {
    expect(() => matchBracket('[1,2', 0)).toThrow(/not matched/);
  });
});
```

- [ ] **Step 5: 运行测试**

```bash
npx vitest run scripts/seed.test.mjs
```

Expected: 3 passed。

- [ ] **Step 6: 提交**

```bash
git add src/data/types.ts scripts/export-seed.mjs scripts/seed.test.mjs
git commit -m "feat(seed): TutorialContent type + seed exporter"
```

Expected: commit 成功。

---

## Task 2: 知识点 ID 迁移 + 文件拆分

**Files:**
- Create: `scripts/split-knowledge.mjs`
- Create: `scripts/split.test.mjs`
- Modify × 21: `src/data/knowledge/<grade>/<subject>.ts`（拆分后的文件）
- Modify: `src/data/knowledge/{primary,middle,high}.ts`（改 re-export）
- Modify × 17: `src/data/questions/*.ts`（knowledgePointIds 映射到新 ID）

迁移规则：`p-math-1` → `p-math-001`（三位数）；映射表 → `scripts/id-mapping.json`。

- [ ] **Step 1: 写迁移脚本 `scripts/split-knowledge.mjs`**

```javascript
// scripts/split-knowledge.mjs
// 将 src/data/knowledge/{primary,middle,high}.ts 拆分为 <grade>/<subject>.ts
// ID 格式：p-math-1 → p-math-001（三位数序号）
// 输出 scripts/id-mapping.json 记录旧→新映射
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KNOWLEDGE_DIR = join(ROOT, 'src/data/knowledge');

// 学科映射（现有 → 新）
const GRADE_FILES = {
  primary: {
    subjects: ['math', 'chinese', 'english', 'science', 'moral'],
    names: { math: '数学', chinese: '语文', english: '英语', science: '科学', moral: '道德与法治' },
  },
  middle: {
    subjects: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'history', 'geography', 'moral'],
    names: { math: '数学', physics: '物理', chemistry: '化学', biology: '生物', chinese: '语文', english: '英语', history: '历史', geography: '地理', moral: '道德与法治' },
  },
  high: {
    subjects: ['math', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography'],
    names: { math: '数学', physics: '物理', chemistry: '化学', biology: '生物', politics: '思想政治', history: '历史', geography: '地理' },
  },
};

// 导出工具（util 函数）
function matchBracket(text, from) {
  const open = text[from];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  for (let i = from; i < text.length; i++) {
    if (text[i] === open) depth++;
    if (text[i] === close && --depth === 0) return i;
  }
  throw new Error(`bracket unmatched at ${from}`);
}

// 从学段文件切出每个学科 subject 块
function splitSubjects(text, grade, subjectList) {
  const result = {};
  for (const subject of subjectList) {
    // 匹配 { id: 'math-primary', name: '数学', icon: '...', knowledgePoints: [ ... ] }
    const headIdx = text.indexOf(`'${subject}-${grade === 'primary' ? 'primary' : grade === 'middle' ? 'middle' : 'high'}'`);
    if (headIdx === -1) throw new Error(`subject ${subject} not found in ${grade}`);
    // 从 headIdx 向前找对象的 '{'
    let objStart = text.lastIndexOf('{', headIdx);
    // 从 headIdx 向后找 knowledgePoints 数组
    const kpIdx = text.indexOf('knowledgePoints', headIdx);
    const arrStart = text.indexOf('[', kpIdx);
    const arrEnd = matchBracket(text, arrStart);
    // 学科对象在 knowledgePoints 数组之后结束：从 arrEnd 向后找配平的 '}'
    const objEnd = matchBracket(text, text.lastIndexOf('{', headIdx - 1));
    result[subject] = { objStart: text.lastIndexOf('{', headIdx - 1), arrStart: arrStart - 1, arrEnd: arrEnd + 1, objEnd: objEnd + 1 };
  }
  return result;
}

// 升级 ID：p-math-1 → p-math-001
function upgradeId(oldId, mapping) {
  const m = oldId.match(/^([a-z]+)-([a-z]+)-(\d+)$/);
  if (!m) return { id: oldId, changed: false };
  const newId = `${m[1]}-${m[2]}-${String(m[3]).padStart(3, '0')}`;
  if (newId !== oldId) mapping[oldId] = newId;
  return { id: newId, changed: newId !== oldId };
}

const mapping = {};
for (const [grade, cfg] of Object.entries(GRADE_FILES)) {
  const srcPath = join(KNOWLEDGE_DIR, `${grade}.ts`);
  const text = readFileSync(srcPath, 'utf8');
  const outDir = join(KNOWLEDGE_DIR, grade);
  mkdirSync(outDir, { recursive: true });

  for (const subject of cfg.subjects) {
    // 找 subject 对象范围
    const idMatch = text.match(new RegExp(`{ id: '${subject}', name: '${cfg.names[subject]}'`));
    if (!idMatch) throw new Error(`subject ${subject} not in ${grade}`);
    const blockStart = text.lastIndexOf('{', idMatch.index);
    // 从 blockStart 到对象结束（找配平的 '}'）
    let depth = 0, blockEnd = blockStart;
    for (let i = blockStart; i < text.length; i++) {
      if (text[i] === '{') depth++;
      if (text[i] === '}' && --depth === 0) { blockEnd = i + 1; break; }
    }
    let block = text.slice(blockStart, blockEnd);

    // 升级所有知识点 ID
    block = block.replace(/id: '([a-z]+-[a-z]+-\d+)'/g, (m, id) => {
      const { id: newId, changed } = upgradeId(id, mapping);
      return `id: '${newId}'`;
    });

    const outPath = join(outDir, `${subject}.ts`);
    const header = `import type { Subject } from '../../types';\n\n`;
    writeFileSync(outPath, header + block.replace(/export const \w+/, `export const ${subject.toUpperCase()}_${grade.toUpperCase()}`) + '\n');
    console.log(`  ${grade}/${subject}.ts`);
  }
}

writeFileSync(join(__dirname, 'id-mapping.json'), JSON.stringify(mapping, null, 2));
console.log(`✓ split done, ${Object.keys(mapping).length} ids remapped`);
```

- [ ] **Step 2: 验证拆分脚本的括号配平工具（TDD）**

创建 `scripts/split.test.mjs`：

```javascript
import { describe, test, expect } from 'vitest';
import { matchBracket } from './split-knowledge.mjs';

describe('split-knowledge matchBracket', () => {
  test('学科对象边界', () => {
    const text = '{ id: "a", knowledgePoints: [ { id: "x-1" }, { id: "x-2" } ] }';
    const from = text.indexOf('{');
    expect(matchBracket(text, from)).toBe(text.length - 1);
  });
});
```

```bash
npx vitest run scripts/split.test.mjs
```

Expected: 1 passed。

- [ ] **Step 3: 运行迁移脚本**

```bash
node scripts/split-knowledge.mjs
```

Expected: 输出 21 个文件路径 + `id-mapping.json` 生成。

- [ ] **Step 4: 运行引 ID 校验脚本（确认无旧 ID 残留）**

```bash
node -e "
const mapping = JSON.parse(require('fs').readFileSync('scripts/id-mapping.json','utf8'));
const { execSync } = require('child_process');
const files = execSync('grep -rl \"id: 'p-math-[0-9]'\" src/data').toString().trim().split('\n');
if (files.length) { console.error('OLD IDS REMAIN:', files); process.exit(1); }
console.log('✓ no old-style single-digit ids');
"
```

Expected: exit 0。

- [ ] **Step 5: 学段文件改为 re-export 兼容层**

将 `src/data/knowledge/primary.ts` 内容替换为：

```typescript
import type { GradeData } from '../types';
import { MATH_PRIMARY } from './primary/math';
import { CHINESE_PRIMARY } from './primary/chinese';
import { ENGLISH_PRIMARY } from './primary/english';
import { SCIENCE_PRIMARY } from './primary/science';
import { MORAL_PRIMARY } from './primary/moral';

export const PRIMARY_DATA: GradeData = {
  id: 'primary',
  name: '小学',
  subjects: [MATH_PRIMARY, CHINESE_PRIMARY, ENGLISH_PRIMARY, SCIENCE_PRIMARY, MORAL_PRIMARY],
};
```

`middle.ts`、`high.ts` 同理映射各自学科。

- [ ] **Step 6: 迁移 questions 中的 knowledgePointIds**

```bash
node -e "
const fs = require('fs');
const mapping = JSON.parse(fs.readFileSync('scripts/id-mapping.json','utf8'));
const dir = 'src/data/questions';
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.ts') || f === 'index.ts' || f === 'types.ts') continue;
  const p = dir + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  let changed = 0;
  for (const [oldId, newId] of Object.entries(mapping)) {
    const re = new RegExp(\"'\" + oldId.replace(/[.*+?^\${}()|[\]\\\\]/g, '\\\\$&') + \"'\", 'g');
    const before = t;
    t = t.replace(re, \"'\" + newId + \"'\");
    if (t !== before) changed++;
  }
  fs.writeFileSync(p, t);
  console.log(f, 'refs replaced:', changed);
}
console.log('✓ questions refs migrated');
"
```

Expected: 每个文件输出替换数，无遗漏。

- [ ] **Step 7: 类型检查 + 构建**

```bash
npx tsc -b --noEmit
```

Expected: exit 0。若报缺失 import，检查拆分文件中相对路径（`../../types` vs `../types`）。学科文件 types 导入统一改为 `import type { Subject } from '../../types';`。

- [ ] **Step 8: 提交**

```bash
git add -A && git commit -m "refactor(knowledge): split 21 subject files, upgrade ids, migrate questions refs"
```

---

## Task 3: 新知识点静态字段 AI 生成（fields 模式）

**Files:**
- Create: `scripts/generate-fields.mjs`
- Create: `scripts/generate-fields.test.mjs`
- Modify: `src/data/prompts/explain/*.ts`（复用现有模板作为生成 prompt 的基础）

为现有 136 + 新增 ~380 个知识点批量生成：`funEmoji/funFact/funStory/funQuestion/funQuestionAnswer/detailedExplanation/studyTips/practiceQuestions`。新增知识点的最基础字段（id/title/description/年级/学科）由人工提供，其余 8 个字段由 AI 生成。

- [ ] **Step 1: 为 21 个学科各定义新知识点清单（人工 + AI 辅助）**

每个学科 JSON 数组元素：

```json
{ "id": "p-math-009", "title": "植树问题", "description": "间隔数与棵数的关系，生活中的排队、路灯、爬楼问题。", "grade": "primary", "subject": "math" }
```

先写小学 5 学科（25-30 个/学科），存为 `scripts/knowledge-new-primary.json`。生成策略：LLM 先出 40 个候选题目清单，人工筛到 25-30 个。目标学科清单：

- 小学：数学/语文/英语/科学/道德与法治 → `scripts/knowledge-new-primary.json`
- 初中：数学/物理/化学/生物/语文/英语/历史/地理/道德与法治 → `scripts/knowledge-new-middle.json`
- 高中：数学/物理/化学/生物/思想政治/历史/地理 → `scripts/knowledge-new-high.json`

- [ ] **Step 2: 写 `scripts/generate-fields.mjs`**

```javascript
// scripts/generate-fields.mjs
// 读取新知识点清单 → 按学科分组 → 调用 LLM 生成 8 个静态字段 → 输出 JSON 供人工审核
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProviderConfig, createClient } from './provider-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIELD_PROMPT = (item) => `你是一位资深{{grade}}{{subject}}教师。请为以下知识点生成完整的教学素材。

知识点标题：${item.title}
知识点描述：${item.description}
所属学段：${item.gradeName}
学科：${item.subjectName}

请严格按以下 JSON 格式输出（不要输出其他内容）：
{
  "funEmoji": "一个贴切的 emoji",
  "funFact": "一条冷知识/趣味事实（50字以内，让学生惊讶）",
  "funStory": "一个生活中的有趣故事（80-120字，紧扣知识点）",
  "funQuestion": "一个互动小问题",
  "funQuestionAnswer": "问题的答案（简洁清晰）",
  "detailedExplanation": "详细讲解（ markdown 格式，含概念解释、生活例题、知识拓展）",
  "studyTips": ["学习建议1（可操作）", "学习建议2", "建议3"],
  "practiceQuestions": [
    {"question": "基础题", "answer": "答案", "briefTip": "考查点"}
  ]
}

要求：
- 语言适合{{gradeName}}学生家长 reading aloud 给孩子听
- detailedExplanation 必须包含：概念定义 + 生活例子 + 知识联系
- studyTips 必须是家长可操作的具体建议（不超过 3 条）
- practiceQuestions 至少 3 道（基础+提高+挑战），附答案和考查点提示`;

async function main() {
  const [,, seedFile, outputFile] = process.argv;
  const seed = JSON.parse(readFileSync(seedFile, 'utf8'));
  const config = loadProviderConfig(process.env);
  const client = createClient(config);
  const results = [];

  for (const item of seed) {
    const prompt = FIELD_PROMPT(item);
    try {
      const resp = await client.chat.completions.create({
        model: config.model,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      const fields = JSON.parse(resp.choices[0].message.content);
      validateFields(fields, item.id);
      results.push({ ...item, ...fields, status: 'ok' });
    } catch (err) {
      results.push({ ...item, status: 'error', error: err.message });
    }
  }
  writeFileSync(outputFile, JSON.stringify(results, null, 2));
  const ok = results.filter(r => r.status === 'ok').length;
  console.log(`✓ ${ok}/${results.length} generated → ${outputFile}`);
}

function validateFields(f, id) {
  if (!f.detailedExplanation || f.detailedExplanation.length < 100) throw new Error(`${id}: explanation too short`);
  if (!Array.isArray(f.studyTips) || f.studyTips.length === 0) throw new Error(`${id}: studyTips empty`);
  if (!Array.isArray(f.practiceQuestions) || f.practiceQuestions.length < 3) throw new Error(`${id}: need ≥3 practice`);
}

main();
```

- [ ] **Step 3: 写 `scripts/generate-fields.test.mjs`（校验函数测试）**

```javascript
import { describe, test, expect } from 'vitest';
import { validateFields } from './generate-fields.mjs';

describe('validateFields', () => {
  const base = {
    funEmoji: '🔢', funFact: 'f', funStory: 's', funQuestion: 'q', funQuestionAnswer: 'a',
    detailedExplanation: 'x'.repeat(150),
    studyTips: ['t1', 't2'],
    practiceQuestions: [1, 2, 3].map(i => ({ question: `q${i}`, answer: 'a', briefTip: 't' })),
  };

  test('合法字段通过', () => expect(() => validateFields(base, 'p-math-1')).not.toThrow());

  test('explanation 过短报错', () => {
    expect(() => validateFields({ ...base, detailedExplanation: 'short' }, 'p-math-1')).toThrow(/too short/);
  });

  test('练习题少于 3 报错', () => {
    expect(() => validateFields({ ...base, practiceQuestions: [1, 2] }, 'p-math-1')).toThrow(/≥3/);
  });
});
```

```bash
npx vitest run scripts/generate-fields.test.mjs
```

Expected: 3 passed。

- [ ] **Step 4: dry-run 小学数学科目**

```bash
node scripts/generate-fields.mjs scripts/knowledge-new-primary.json scripts/output-fields-primary.json --dry-run
```

`--dry-run` 模式：仅打印 prompt，不调用 API。确认 prompt 结构正确。

- [ ] **Step 5: 全量运行（第一批：小学 5 学科，约 140 个新知识点）**

```bash
node scripts/generate-fields.mjs scripts/knowledge-new-primary.json scripts/output-fields-primary.json
```

Expected: `✓ 138/140 generated`。

- [ ] **Step 6: 质量抽检**

```bash
node -e "
const data = JSON.parse(require('fs').readFileSync('scripts/output-fields-primary.json','utf8'));
const errs = data.filter(r => r.status === 'ok' && (r.detailedExplanation.length < 120 || r.practiceQuestions.length < 3));
console.log('low quality:', errs.length);
console.log('sample:', JSON.stringify(data[0], null, 2).slice(0, 500));
"
```

人工检查 sample 输出，确认语言风格适合小学生。

- [ ] **Step 7: 审核通过的 JSON 合并到学科 TS 文件**

编写 `scripts/merge-fields.mjs`（merge-tutorials.mjs 的通用版）：读 output-fields JSON → 按 id 在学科 TS 文件定位对象 → 在对象内合适位置（如 id 之后）插入 8 个字段。使用括号配平定位匹配。merge 逻辑测试见 Task 6。

- [ ] **Step 8: 编译验证**

```bash
npx tsc -b --noEmit
```

Expected: exit 0。

- [ ] **Step 9: 提交**

```bash
git add src/data/knowledge scripts/output-fields-primary.json
git commit -m "feat(content): 140 new primary knowledge points with AI-generated static fields"
```

---

## Task 4: PromptTemplate.gradeLevel 字段

**Files:**
- Modify: `src/data/prompts/types.ts`

- [ ] **Step 1: 扩展 PromptTemplate 接口**

在 `src/data/prompts/types.ts` 中 `PromptTemplate` 新增：

```typescript
export interface PromptTemplate {
  id: string;
  title: string;
  scenario: PromptScenario;
  icon: string;
  description: string;
  tags: string[];
  template: string;
  variables: PromptVariable[];
  grades: GradeLevel[];
  subjects: string[];
  knowledgePointIds?: string[];
  /** 新增：年级专属模板为单值，通用模板为 'all' */
  gradeLevel?: GradeLevel | 'all';
  usageCount: number;
  rating: number;
  author: string;
}
```

- [ ] **Step 2: 编译验证**

```bash
npx tsc -b --noEmit
```

Expected: exit 0（gradeLevel 为可选字段，现有 48 模板无需改动即可通过）。

- [ ] **Step 3: 提交**

```bash
git add src/data/prompts/types.ts
git commit -m "feat(prompts): add gradeLevel field to PromptTemplate"
```

---

## Task 5: 9 个年级专属提示词模板

**Files:**
- Create: `src/data/prompts/explain/primary-level.ts`
- Create: `src/data/prompts/explain/middle-level.ts`
- Create: `src/data/prompts/explain/high-level.ts`
- Create: `src/data/prompts/interaction/primary-level.ts`
- Create: `src/data/prompts/interaction/middle-level.ts`
- Create: `src/data/prompts/interaction/high-level.ts`
- Create: `src/data/prompts/generate/primary-level.ts`
- Create: `src/data/prompts/generate/middle-level.ts`
- Create: `src/data/prompts/generate/high-level.ts`
- Modify: `src/data/prompts/{explain,interaction,generate}/index.ts`

- [ ] **Step 1: 小学 explain 模板**

`src/data/prompts/explain/primary-level.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const primaryLevelExplainPrompt: PromptTemplate = {
  id: 'explain-primary-level',
  title: '小学知识讲解（故事化版）',
  scenario: 'explain',
  icon: '📖',
  description: '用生活比喻+童话故事+动手实验，让小学生听得懂、记得住',
  tags: ['故事化', '比喻', '动手实验', '小学'],
  gradeLevel: 'primary',
  template: `你是一位资深小学教师，擅长用讲故事的方式让抽象概念变得具体可感。

请为小学生讲解"{{knowledge_point}}"。

讲解要求：
1. **童话故事导入**：用一个 童话故事或动画场景（海绵宝宝、熊出没、喜羊羊等）引入概念
2. **生活比喻**：至少使用 2 个生活中的比喻（超市、游乐园、厨房、学校里的事物）
3. **分 2-3 步拆解**：每步用一句话概括 + 一个具体例子
4. **动手小实验**：设计一个 5 分钟内可完成的小活动（准备材料+操作步骤）
5. **常见错误提醒**：指出 1 个小朋友最容易犯的错误
6. **随堂检验**：出 1 道课堂互动题（不是练习，是边学边问的）

语言要求：
- 使用"我们""让我们一起"等亲切称呼
- 每段不超过 3 句话
- 多用短句，避免长从句
- 适当用 emoji（但不要每句都用）

请保持生动有趣的风格，让 10 岁以下的孩子都能听懂。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力、分数、乘法分配律', required: true, type: 'text' },
  ],
  grades: ['primary'],
  subjects: ['数学', '语文', '英语', '科学', '道德与法治'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
```

- [ ] **Step 2: 初中 explain 模板**

`src/data/prompts/explain/middle-level.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const middleLevelExplainPrompt: PromptTemplate = {
  id: 'explain-middle-level',
  title: '初中知识讲解（逻辑推演版）',
  scenario: 'explain',
  icon: '📖',
  description: '从"为什么需要学这个"入手，逻辑清晰、步骤严谨，培养理科思维',
  tags: ['逻辑严谨', '步骤拆解', '实验探究', '初中'],
  gradeLevel: 'middle',
  template: `你是一位资深初中教师，擅长用逻辑推演和实验探究让学生理解知识的本质。

请为初中生讲解"{{knowledge_point}}"。

讲解要求：
1. **为什么需要学**：先说明这个知识点在现实中的 2 个应用场景（工程/科技/生活），让学生有学习动机
2. **直观感知**：用 1 个生活中的可观察现象建立直觉（而非抽象定义）
3. **逻辑推演**：分 3-4 步推导核心原理，每一步标注"第 N 步"并说明"这一步的依据是..."
4. **实验设计**：设计 1 个简单的验证实验（目的、步骤、预期现象）
5. **易错点**：指出 3 个常见错误理解，并说明为什么错、正确的是什么
6. **中考链接**：简要说明这个知识点在中考中的常见题型和考查深度

语言要求：
- 准确使用学科术语
- 逻辑连接词清晰（因为、所以、因此、由此可见）
- 避免"显然""易证"这类跳过推理的表述`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力产生原因、二次函数最值、欧姆定律', required: true, type: 'text' },
  ],
  grades: ['middle'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
```

- [ ] **Step 3: 高中 explain 模板**

`src/data/prompts/explain/high-level.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const highLevelExplainPrompt: PromptTemplate = {
  id: 'explain-high-level',
  title: '高中知识讲解（深度本质版）',
  scenario: 'explain',
  icon: '📖',
  description: '从学科本质和公式推导入手，抽象思维、深度思考，培养研究性思维',
  tags: ['抽象本质', '推导过程', '学科思维', '高中'],
  gradeLevel: 'high',
  template: `你是一位资深高中教师，擅长从学科高度揭示知识本质，引导学生进行深度思考。

请为高中生讲解"{{knowledge_point}}"。

讲解要求：
1. **学科定位**：说明这个知识点在学科体系中的位置（前置知识 → 本知识点 → 后续应用）
2. **本质探究**：从"为什么要这样定义"入手，给出概念的深层逻辑（而非仅呈现结果）
3. **公式推导**：给出完整推导过程，每一步注明依据（定义/定理/公理）
4. **深度提问**：提出 2 个开放性问题（无标准答案，引导批判性思考）
5. **前沿联系**：简要介绍该知识在现代科技/研究中的 1 个应用或延伸方向
6. **一题多变**：给 1 道核心题，给出 3 种变式思路（不同条件/逆向/综合）

语言要求：
- 术语精确，逻辑严密
- 使用"我们来思考""你有没有想过"引导学生主动思考
- 适当使用符号表达提升严谨性`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：导数本质、勒夏特列原理、拓扑连续性', required: true, type: 'text' },
  ],
  grades: ['high'],
  subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'],
  usageCount: 0,
  rating: 5.0,
  author: 'teacher-team',
};
```

- [ ] **Step 4: 3 个 interaction 年级版本模板**

同结构，分别创建 `src/data/prompts/interaction/{primary,middle,high}-level.ts`，各自的 `template` 侧重：

- `primary-level`：亲子互动侧重**游戏化**（角色卡、手工、户外寻宝）
- `middle-level`：亲子互动侧重**实验探究**（家庭迷你实验+记录表）
- `high-level`：亲子互动侧重**研究性课题**（小型研究报告+辩论）

各模板 `id` 分别为 `interaction-primary-level` 等，`scenario: 'interaction'`。

- [ ] **Step 5: 3 个 generate 年级版本模板**

同结构，分别创建 `src/data/prompts/generate/{primary,middle,high}-level.ts`：

- `primary-level`：题目场景生活化（超市/游乐园/家庭），题型趣味化（选择+判断+填空）
- `middle-level`：题目工程应用（建筑/交通/通信），多步推理，难度梯度明显
- `high-level`：题目科技前沿（AI/航天/基因），综合建模，含 1 道挑战题

各模板 `id` 分别为 `generate-primary-level` 等，`scenario: 'generate'`。

- [ ] **Step 6: 更新 3 个场景 index.ts 注册新模板**

在 `src/data/prompts/explain/index.ts` 中新增：

```typescript
import { primaryLevelExplainPrompt } from './primary-level';
import { middleLevelExplainPrompt } from './middle-level';
import { highLevelExplainPrompt } from './high-level';

export const EXPLAIN_PROMPTS: PromptTemplate[] = [
  deepConceptPrompt, storyBasedPrompt, socraticPrompt,
  bridgeAnalogyPrompt, visualExplainPrompt, misconceptionPrompt,
  primaryLevelExplainPrompt, middleLevelExplainPrompt, highLevelExplainPrompt,
];
```

`interaction/index.ts`、`gather/index.ts` 同理各自追加对应年级模板。

- [ ] **Step 7: 编译验证**

```bash
npx tsc -b --noEmit
```

Expected: exit 0。

- [ ] **Step 8: 提交**

```bash
git add src/data/prompts
git commit -m "feat(prompts): add 9 grade-specific templates for explain/interaction/generate"
```

---

## Task 6: 模板选型 selectBestTemplate

**Files:**
- Modify: `src/data/prompts/index.ts`
- Create: `src/data/prompts/select.test.mjs`

- [ ] **Step 1: 在 `src/data/prompts/index.ts` 新增 selectBestTemplate**

```typescript
import type { GradeLevel } from '../knowledge';
import type { PromptTemplate, PromptScenario } from './types';
// ...existing imports...

/** 为指定场景+年级+学科选择最佳模板 */
export function selectBestTemplate(
  scenario: PromptScenario,
  grade: GradeLevel,
  subject: string,
): PromptTemplate {
  const all = ALL_PROMPTS.filter(
    p => p.scenario === scenario &&
         (p.subjects.includes(subject) || p.subjects.includes('all')),
  );
  // 1. 年级专属
  const gradeMatch = all.find(p => p.gradeLevel === grade);
  if (gradeMatch) return gradeMatch;
  // 2. 通用（gradeLevel 为 undefined 或 'all'）
  const fallback = all.find(p => !p.gradeLevel || p.gradeLevel === 'all');
  if (fallback) return fallback;
  throw new Error(`no template found for ${scenario}/${grade}/${subject}`);
}

export default ALL_PROMPTS;
```

- [ ] **Step 2: 添加单元测试 `scripts/select.test.mjs`**

```javascript
import { describe, test, expect } from 'vitest';
import { selectBestTemplate, ALL_PROMPTS } from '../src/data/prompts/index.ts';

describe('selectBestTemplate', () => {
  test('小学 explain 返回年级专属模板', () => {
    const t = selectBestTemplate('explain', 'primary', '数学');
    expect(t.gradeLevel).toBe('primary');
    expect(t.id).toContain('primary');
  });

  test('高中 interaction 返回高中版', () => {
    const t = selectBestTemplate('interaction', 'high', '物理');
    expect(t.gradeLevel).toBe('high');
  });

  test('无匹配模板时抛错', () => {
    expect(() => selectBestTemplate('explain', 'primary', '不存在学科×××')).toThrow(/no template/);
  });

  test('所有模板都有合法 scenario', () => {
    const valid = ['explain','generate','assess','plan','error-analysis','derivation','explore','interaction'];
    for (const p of ALL_PROMPTS) expect(valid).toContain(p.scenario);
  });
});
```

```bash
npx vitest run scripts/select.test.mjs
```

Expected: 4 passed。

- [ ] **Step 3: 提交**

```bash
git add src/data/prompts/index.ts scripts/select.test.mjs
git commit -m "feat(prompts): selectBestTemplate with grade-level preference + tests"
```

---

## Task 7: Provider 配置基础设施

**Files:**
- Create: `scripts/provider-config.mjs`
- Create: `scripts/provider-config.test.mjs`
- Create: `scripts/generate-config.jsonc`

支持 8 个 Provider（Ollama / DeepSeek / 智谱 / MiniMax / LongCat / Kimi / Qwen / OpenAI），OpenAI 兼容协议。

- [ ] **Step 1: 创建配置模板 `scripts/generate-config.jsonc`**

```jsonc
// Provider 配置模板（复制为 scripts/generate-config.json 使用，勿提交 apiKey）
{
  "provider": "ollama",    // ollama | deepseek | zhipu | minimax | longcat | moonshot | qwen | openai
  "apiKey": "",            // 环境变量 GENERATE_API_KEY 优先
  "baseUrl": "",           // 可选覆盖
  "model": "",             // 可选覆盖
  "concurrency": 1,        // Ollama=1, API=3
  "retryCount": 3,
  "retryDelayMs": 2000,
  "temperature": 0.7,
  "maxTokens": 40096,
  "outputMode": "files",   // files | json | dry-run
  "validateOutput": true,
  "skipExisting": true,
  "ranges": []             // 例：[{ "grade": "primary", "subject": "math" }]
}
```

- [ ] **Step 2: 创建 `scripts/provider-config.mjs`**

```javascript
// Provider 配置加载 + OpenAI 兼容 Client 工厂
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROVIDERS = {
  ollama:    { baseUrl: 'http://localhost:11434/v1',           defaultModel: 'llama3' },
  deepseek:  { baseUrl: 'https://api.deepseek.com/v1',         defaultModel: 'deepseek-chat' },
  zhipu:     { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', defaultModel: 'glm-4' },
  minimax:   { baseUrl: 'https://api.minimax.io/v1',            defaultModel: 'MiniMax-M01' },
  longcat:   { baseUrl: 'https://api.longcat.chat/openai/v1',   defaultModel: 'LongCat-Flash' },
  moonshot:  { baseUrl: 'https://api.moonshot.cn/v1',          defaultModel: 'moonshot-v1-8k' },
  qwen:      { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-plus' },
  openai:    { baseUrl: 'https://api.openai.com/v1',           defaultModel: 'gpt-4o' },
};

export const DEFAULTS = {
  concurrency: 1,
  retryCount: 3,
  retryDelayMs: 2000,
  temperature: 0.7,
  maxTokens: 40096,
  outputMode: 'files',
  validateOutput: true,
  skipExisting: true,
  ranges: [],
};

/** 加载配置：CLI 参数 > 环境变量 > 配置文件 > 默认值 */
export function loadProviderConfig(env = process.env) {
  const configPath = join(__dirname, 'generate-config.json');
  const fileConfig = existsSync(configPath)
    ? JSON.parse(readFileSync(configPath, 'utf8'))
    : {};

  const provider = env.GENERATE_PROVIDER || fileConfig.provider || 'ollama';
  if (!PROVIDERS[provider]) {
    throw new Error(`unknown provider: ${provider}. supported: ${Object.keys(PROVIDERS).join(', ')}`);
  }

  const preset = PROVIDERS[provider];
  const apiKey = env.GENERATE_API_KEY || fileConfig.apiKey || '';

  return {
    provider,
    apiKey,
    baseUrl: env.GENERATE_BASE_URL || fileConfig.baseUrl || preset.baseUrl,
    model: env.GENERATE_MODEL || fileConfig.model || preset.defaultModel,
    concurrency: Number(env.GENERATE_CONCURRENCY || fileConfig.concurrency || DEFAULTS.concurrency),
    retryCount: Number(fileConfig.retryCount ?? DEFAULTS.retryCount),
    retryDelayMs: Number(fileConfig.retryDelayMs ?? DEFAULTS.retryDelayMs),
    temperature: Number(fileConfig.temperature ?? DEFAULTS.temperature),
    maxTokens: Number(fileConfig.maxTokens ?? DEFAULTS.maxTokens),
    outputMode: fileConfig.outputMode || DEFAULTS.outputMode,
    validateOutput: fileConfig.validateOutput ?? DEFAULTS.validateOutput,
    skipExisting: fileConfig.skipExisting ?? DEFAULTS.skipExisting,
    ranges: fileConfig.ranges || DEFAULTS.ranges,
  };
}

export function createClient(config) {
  if (!config.apiKey && config.provider !== 'ollama') {
    throw new Error(`apiKey required for ${config.provider} (set GENERATE_API_KEY)`);
  }
  return new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey || 'ollama-local', // Ollama 允许空 key
    maxRetries: 0, // 我们自己处理重试（跨 provider 一致行为）
  });
}

/** 带指数退避的重试包装 */
export async function withRetry(fn, config, label = '') {
  let lastErr;
  for (let attempt = 0; attempt <= config.retryCount; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isRetryable = !err.status || err.status >= 500 || err.status === 429;
      if (!isRetryable || attempt === config.retryCount) break;
      const delay = config.retryDelayMs * 2 ** attempt;
      console.warn(`  retry ${attempt + 1}/${config.retryCount} for ${label} in ${delay}ms (${err.message})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
```

- [ ] **Step 3: 单元测试 `scripts/provider-config.test.mjs`**

```javascript
import { describe, test, expect } from 'vitest';
import { loadProviderConfig, PROVIDERS } from './provider-config.mjs';

describe('loadProviderConfig', () => {
  test('默认值: ollama', () => {
    const c = loadProviderConfig({});
    expect(c.provider).toBe('ollama');
    expect(c.baseUrl).toBe(PROVIDERS.ollama.baseUrl);
    expect(c.model).toBe('llama3');
  });

  test('CLI provider 通过 env 覆盖', () => {
    const c = loadProviderConfig({ GENERATE_PROVIDER: 'deepseek', GENERATE_API_KEY: 'sk-test', GENERATE_MODEL: 'deepseek-chat-v3' });
    expect(c.baseUrl).toBe('https://api.deepseek.com/v1');
    expect(c.apiKey).toBe('sk-test');
    expect(c.model).toBe('deepseek-chat-v3');
  });

  test('未知 provider 抛错', () => {
    expect(() => loadProviderConfig({ GENERATE_PROVIDER: 'invalid' })).toThrow(/unknown provider/);
  });

  test('非 ollama 无 key 抛错', () => {
    expect(() => loadProviderConfig({ GENERATE_PROVIDER: 'openai' })).toThrow(/apiKey required/);
  });

  test('所有 provider 都有合法 baseUrl 和 model', () => {
    for (const [name, p] of Object.entries(PROVIDERS)) {
      expect(p.baseUrl.startsWith('http')).toBe(true);
      expect(p.defaultModel.length).toBeGreaterThan(0);
    }
  });
});
```

```bash
npx vitest run scripts/provider-config.test.mjs
```

Expected: 5 passed。

- [ ] **Step 4: 提交**

```bash
git add scripts/provider-config.mjs scripts/provider-config.test.mjs scripts/generate-config.jsonc
git commit -m "feat(provider): multi-provider config + OpenAI-compatible client factory"
```

---

## Task 8: tutorialContent 生成脚本（核心）

**Files:**
- Create: `scripts/generate-content.mjs`
- Create: `scripts/generate-content.test.mjs`

为全部 500+ 知识点生成 tutorialContent（5 节结构）。输入：knowledge-seed.json 或新知识点 JSON。输出：`<outDir>/<grade>-<subject>.json`。

- [ ] **Step 1: 创建 `scripts/generate-content.mjs`**

```javascript
// scripts/generate-content.mjs
// 为知识点批量生成 tutorialContent（多 Provider）
// 用法：
//   node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials
//   node scripts/generate-content.mjs --input ... --provider=deepseek --ranges '[{"grade":"primary","subject":"math"}]'
//   node scripts/generate-content.mjs --input ... --dry-run --limit 2
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProviderConfig, createClient, withRetry } from './provider-config.mjs';
import { selectBestTemplate, ALL_PROMPTS } from '../src/data/prompts/index.ts';
import { renderTemplate } from './render-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TUTORIAL_SYSTEM_PROMPT = `你是一位资深{{gradeName}}{{subjectName}}教师，擅长把抽象概念讲得通俗易懂。

请为以下知识点生成一节完整的家庭辅导教程。

知识点：{{title}}
描述：{{description}}

教程结构（严格按以下 5 节输出，使用 markdown）：

# 🎯 本课目标
（3-5 条学习目标，每条一句话，可衡量）

# 📖 知识讲解
（核心概念讲解，包含：1 个生活比喻 + 分步拆解 + 知识联系。{{lengthGuide}}）

# ✏️ 例题精讲
（2-3 道由易到难的例题，每道包含：题目、完整解答、思路点拨）

# 🧩 亲子互动
（1 个 5-10 分钟的亲子活动：准备材料、操作步骤、预期收获）

# 📝 课后练习
（3-5 道巩固题，从易到难，附答案和简要解析）

语言风格：{{styleGuide}}`;

const GRADE_STYLE = {
  primary: '语言生动活泼，多用比喻和故事，每段不超过 3 句话，适合 10 岁以下孩子',
  middle: '语言准确平实，逻辑清晰，步骤严谨，适合 12-15 岁青少年',
  high: '语言精确严谨，突出本质和推导，体现学科思维，适合 15-18 岁学生',
};
const GRADE_LENGTH = {
  primary: '总字数 600-800 字',
  middle: '总字数 800-1200 字',
  high: '总字数 1000-1500 字',
};

function parseArgs(argv) {
  const args = { provider: null, input: null, outDir: null, dryRun: false, limit: 0, force: false, validateOnly: false };
  for (let i = 2; i < argv.length; i++) {
    const [k, v] = argv[i].replace(/^--/, '').split('=');
    if (k === 'provider') args.provider = v;
    if (k === 'input') args.input = v;
    if (k === 'outDir') args.outDir = v;
    if (k === 'ranges') args.ranges = JSON.parse(v);
    if (k === 'dry-run') args.dryRun = true;
    if (k === 'force') args.force = true;
    if (k === 'validate-only') args.validateOnly = true;
    if (k === 'limit') args.limit = Number(v);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input || !args.outDir) {
    console.error('usage: generate-content.mjs --input <seed.json> --outDir <dir> [--provider=x] [--ranges] [--dry-run] [--limit N] [--force] [--validate-only]');
    process.exit(1);
  }
  if (args.provider) process.env.GENERATE_PROVIDER = args.provider;
  const config = loadProviderConfig(process.env);
  const client = createClient(config);

  let items = JSON.parse(readFileSync(args.input, 'utf8')).items || JSON.parse(readFileSync(args.input, 'utf8'));

  // 按 ranges 过滤
  if (args.ranges && args.ranges.length) {
    const set = new Set(args.ranges.map(r => `${r.grade}:${r.subject}`));
    items = items.filter(it => set.has(`${it.grade}:${it.subject}`));
  }
  if (args.limit > 0) items = items.slice(0, args.limit);

  mkdirSync(args.outDir, { recursive: true });

  // 断点续跑：加载已有输出
  const outFile = join(args.outDir, `tutorials-all.json`);
  let existing = {};
  if (existsSync(outFile)) {
    for (const row of JSON.parse(readFileSync(outFile, 'utf8'))) existing[row.id] = row;
  }

  let done = 0, skipped = 0, failed = 0;
  for (const item of items) {
    if (config.skipExisting && !args.force && existing[item.id]?.tutorialContent) { skipped++; continue; }

    const template = selectBestTemplate('explain', item.grade, item.subjectName);
    const prompt = TUTORIAL_SYSTEM_PROMPT
      .replaceAll('{{gradeName}}', item.gradeName)
      .replaceAll('{{subjectName}}', item.subjectName)
      .replaceAll('{{title}}', item.title)
      .replaceAll('{{description}}', item.description)
      .replaceAll('{{lengthGuide}}', GRADE_LENGTH[item.grade])
      .replaceAll('{{styleGuide}}', GRADE_STYLE[item.grade]);

    if (args.dryRun) {
      console.log(`\n--- ${item.id} ${item.title} ---`);
      console.log(prompt.slice(0, 800));
      continue;
    }

    try {
      const content = await withRetry(async () => {
        const resp = await client.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        });
        return resp.choices[0].message.content || '';
      }, config, item.id);

      const tutorialContent = parseTutorialContent(content);
      if (config.validateOutput) validateTutorialContent(tutorialContent, item.id);

      existing[item.id] = { id: item.id, grade: item.grade, subject: item.subject, title: item.title, tutorialContent, status: 'ok' };
      done++;
    } catch (err) {
      existing[item.id] = { id: item.id, grade: item.grade, subject: item.subject, title: item.title, status: 'error', error: err.message };
      failed++;
    }

    // 每 10 条持久化一次（防中断丢失）
    if ((done + failed) % 10 === 0) {
      writeFileSync(outFile, JSON.stringify(Object.values(existing), null, 2));
      console.log(`  progress: +${done} ok, ${failed} fail, ${skipped} skipped`);
    }
  }
  writeFileSync(outFile, JSON.stringify(Object.values(existing), null, 2));
  console.log(`✓ done: ${done} ok, ${failed} failed, ${skipped} skipped → ${outFile}`);
}

/** 从 AI 输出解析 tutorialContent 结构（容错解析） */
export function parseTutorialContent(md) {
  const sections = ['🎯 本课目标', '📖 知识讲解', '✏️ 例题精讲', '🧩 亲子互动', '📝 课后练习'];
  const parts = {};
  for (let i = 0; i < sections.length; i++) {
    const start = md.indexOf(sections[i]);
    const end = i + 1 < sections.length ? md.indexOf(sections[i + 1]) : md.length;
    parts[sections[i]] = start === -1 ? '' : md.slice(start + sections[i].length, end).trim();
  }
  const objectives = (parts['🎯 本课目标'] || '').split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  const explanation = parts['📖 知识讲解'] || '';
  // 例题：按"题目：/解答："切分
  const examples = [];
  const exText = parts['✏️ 例题精讲'] || '';
  const exBlocks = exText.split(/\n(?=\d+\.\s*\*?\*?题目)/).filter(Boolean);
  for (const block of exBlocks) {
    const titleMatch = block.match(/^\d+\.\s*\*?\*?(.+?)\*?\*?$/) || { 1: '' };
    const problem = (block.match(/题目[：:]\s*([\s\S]*?)(?=解答|$)/) || [, ''])[1].trim();
    const solution = (block.match(/解答[：:]\s*([\s\S]*?)(?=思路|$)/) || [, ''])[1].trim();
    const tip = (block.match(/思路[：:]\s*([\s\S]*)$/) || [, ''])[1].trim();
    examples.push({ title: titleMatch[1]?.trim() || '', problem, solution, tip });
  }
  // 课后练习：按行解析 "第 N 题：..." 或 "N. ..."
  const exercises = [];
  const exLines = (parts['📝 课后练习'] || '').split('\n').filter(Boolean);
  for (const line of exLines) {
    const q = (line.match(/(?:第\s*\d+\s*题|\d+\.)[：:]\s*(.+)/) || [, line])[1];
    exercises.push({ question: q, answer: '', explanation: '' });
  }
  return { objectives, explanation, examples, interaction: parts['🧩 亲子互动'] || '', exercises };
}

export function validateTutorialContent(tc, id) {
  const errors = [];
  if (tc.objectives.length < 2) errors.push('objectives < 2');
  if (tc.explanation.length < 200) errors.push('explanation < 200 chars');
  if (tc.examples.length < 1) errors.push('examples < 1');
  if (!tc.interaction || tc.interaction.length < 30) errors.push('interaction < 30 chars');
  if (errors.length) throw new Error(`${id}: ${errors.join(', ')}`);
}

main();
```

- [ ] **Step 2: 模板渲染工具 `scripts/render-template.mjs`**

```javascript
// 通用模板渲染：支持 {{var}} 替换和 {{#if var}}...{{/if}} 条件块
export function renderTemplate(template, variables) {
  let out = template;
  for (const [k, v] of Object.entries(variables || {})) {
    out = out.replaceAll(`{{${k}}}`, v ?? '');
  }
  out = out.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => variables[key] ? content : '');
  return out;
}
```

- [ ] **Step 3: 单元测试 `scripts/generate-content.test.mjs`**

```javascript
import { describe, test, expect } from 'vitest';
import { parseTutorialContent, validateTutorialContent } from './generate-content.mjs';

const SAMPLE = `# 🎯 本课目标
1. 理解分数的意义
2. 掌握分数加减法
3. 解决生活中的分数问题

# 📖 知识讲解
分数表示把单位"1"平均分成若干份...

# ✏️ 例题精讲
1. **题目**：1/2 + 1/3 = ?
   解答：先通分...
   思路：异分母分数相加，关键是...

# 🧩 亲子互动
准备材料：一张纸、剪刀

# 📝 课后练习
第 1 题：1/4 + 2/4 = ?
`;

describe('parseTutorialContent', () => {
  test('解析全部 5 节', () => {
    const tc = parseTutorialContent(SAMPLE);
    expect(tc.objectives.length).toBe(3);
    expect(tc.explanation.length).toBeGreaterThan(10);
    expect(tc.examples.length).toBe(1);
    expect(tc.examples[0].problem).toBe('1/2 + 1/3 = ?');
    expect(tc.interaction).toContain('纸');
    expect(tc.exercises.length).toBe(1);
  });

  test('无例题时返回空数组', () => {
    const tc = parseTutorialContent('# 🎯 本课目标\n1. a\n2. b\n3. c');
    expect(tc.examples).toEqual([]);
  });

  test('validateTutorialContent 合法数据通过', () => {
    const ok = { objectives: ['a','b','c'], explanation: 'x'.repeat(250), examples: [{title, problem, solution, tip}], interaction: 'y'.repeat(50), exercises: [{question:'q',answer:'a',explanation:'e'}] };
    expect(() => validateTutorialContent(ok, 'p-math-1')).not.toThrow();
  });

  test('validateTutorialContent 目标不足报错', () => {
    const bad = { objectives: ['a'], explanation: 'x'.repeat(250), examples: [{title:'t',problem:'p',solution:'s',tip:'t'}], interaction: 'y'.repeat(50), exercises: [] };
    expect(() => validateTutorialContent(bad, 'p-math-1')).toThrow(/objectives/);
  });
});
```

```bash
npx vitest run scripts/generate-content.test.mjs
```

Expected: 4 passed。

- [ ] **Step 4: dry-run 检查**

```bash
node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials --dry-run --limit 2
```

Expected: 打印 2 个知识点完整 prompt，确认包含 5 节结构。

- [ ] **Step 5: 小批量试跑（前 3 个知识点）**

```bash
GENERATE_PROVIDER=ollama node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials --limit 3
```

Expected: `✓ done: 3 ok, 0 failed`。检查 output JSON 结构。

---

## Task 9: 合并脚本 merge-tutorials.mjs

**Files:**
- Create: `scripts/merge-tutorials.mjs`
- Create: `scripts/merge.test.mjs`

读 output/tutorials-all.json → 按 id 在 TS 学科文件定位 → 插入 tutorialContent 字段。使用括号配平定位。

- [ ] **Step 1: 创建 `scripts/merge-tutorials.mjs`**

```javascript
// 把 generate-content 的输出 JSON 合并回 TS 数据文件
// 用法：node scripts/merge-tutorials.mjs --input scripts/output-tutorials/tutorials-all.json --dryRun
import { readFileSync, writeFileSync } from 'node:fs';

/**
 * 正向括号配平：找与 from 位置 '{' 配对的 '}' 下标
 */
export function matchBracketForward(text, from) {
  let depth = 0;
  for (let i = from; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}' && --depth === 0) return i;
  }
  throw new Error(`bracket not matched at ${from}`);
}

/**
 * 反向括号配平：找与 from 位置配对的对象起点 '{'
 */
export function matchBracketReverse(text, from) {
  let depth = 0;
  for (let i = from; i >= 0; i--) {
    if (text[i] === '}') depth++;
    if (text[i] === '{' && --depth === 0) return i;
  }
  throw new Error(`no opening bracket for pos ${from}`);
}

const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
const mode = args.dryRun ? 'dryRun' : 'apply';
const rows = JSON.readFileSync(args.input, 'utf8');

let applied = 0, skipped = 0, missing = 0;

for (const row of rows) {
  if (!row.tutorialContent) { skipped++; continue; }

  // 目标学科文件
  const subjectFile = row.subject; // math → math.ts
  const filePath = path.join('src/data/knowledge', row.grade, `${subjectFile}.ts`);
  let text = readFileSync(filePath, 'utf8');

  // 定位知识点对象：找 `id: 'row.id',`
  const idNeedle = `id: '${row.id}',`;
  const idIdx = text.indexOf(idNeedle);
  if (idIdx === -1) { console.warn(`not found: ${row.id}`); missing++; continue; }

  // 检查是否已有 tutorialContent
  const objStart = matchBracketReverse(text, idIdx);
  const objEnd = matchBracketForward(text, objStart);
  const objText = text.slice(objStart, objEnd);
  if (objText.includes('tutorialContent')) { skipped++; continue; }

  // 在对象末尾 '},' 前插入 tutorialContent
  const insertText = `,\n            tutorialContent: ${JSON.stringify(row.tutorialContent, null, 12).replace(/\n/g, '\n            ')}`;
  const newText = text.slice(0, objEnd - 1) + insertText + '\n            ' + text.slice(objEnd - 1);
  writeFileSync(filePath, newText);
  text = newText;
  applied++;
}

console.log(`merge: ${applied} applied, ${skipped} skipped, ${missing} missing`);
```

工具函数：`matchBracketReverse` / `matchBracketForward` 基于_DEPTH 游走。测试覆盖 4 种场景（id 在对象前后不同位置、已存在则跳过）。

- [ ] **Step 2: 测试 `scripts/merge.test.mjs`**（模拟 1 个学科文件 + 验证注入后 TS 语法合法）

```javascript
import { test, expect } from 'vitest';
// 测试 matchBracket 函数
import { matchBracketForward, matchBracketReverse } from './merge-tutorials.mjs';

test('forward: 简单对象', () => {
  const t = '{ id: "p-math-001", title: "x" }';
  expect(matchBracketForward(t, 0)).toBe(t.length - 1);
});
test('reverse: 定位包含 id 的对象起点', () => {
  const t = '[\n  { id: "p-math-001", title: "x" },\n  { id: "p-math-002" },\n]';
  const idIdx = t.indexOf('p-math-002');
  expect(matchBracketReverse(t, idIdx)).toBe(t.indexOf('{', idIdx - 15));
});
test('嵌套花括号', () => {
  const t = '{ a: { b: 1 }, c: [2, 3] }';
  expect(matchBracketForward(t, 0)).toBe(t.length - 1);
});
```

- [ ] **Step 3: dryRun 验证（不写文件）**

```bash
node scripts/merge-tutorials.mjs --input scripts/output-tutorials/tutorials-all.json --dryRun
```

Expected: `merge: N applied, 0 skipped, 0 missing`。

- [ ] **Step 4: 实测合并 3 条 + tsc 验证**

```bash
node scripts/merge-tutorials.mjs --input scripts/output-tutorials/tutorials-all.json
npx tsc -b --noEmit
```

Expected: tsc exit 0。

- [ ] **Step 5: 提交**

```bash
git add scripts/merge-tutorials.mjs scripts/merge.test.mjs src/data/knowledge
git commit -m "feat(merge): tutorialContent injester + tests"
```

---

## Task 10: KnowledgeDetail 「系统教程」区块

**Files:**
- Modify: `src/components/KnowledgeDetail.tsx`

- [ ] **Step 1: 在趣味区下方插入系统教程区块（紧跟 funQuestionAnswer 之后、detailedExplanation 之前）**

在 `src/components/KnowledgeDetail.tsx` 找到 `{point.detailedExplanation ? (` 的位置，在其前面插入：

```tsx
{point.tutorialContent && (
    <section className="mb-8">
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-800 mb-4">📚 系统教程</h2>

            {/* 🎯 本课目标 */}
            <div className="mb-4">
                <h3 className="font-semibold text-green-700 mb-2">🎯 本课目标</h3>
                <ul className="list-disc space-y-1 ml-5">
                    {point.tutorialContent.objectives.map((obj: string, i: number) => (
                        <li key={i} className="text-gray-700">{obj}</li>
                    ))}
                </ul>
            </div>

            {/* 📖 知识讲解 */}
            <div className="mb-4">
                <h3 className="font-semibold text-blue-700 mb-2">📖 知识讲解</h3>
                <ReactMarkdown className="prose prose-blue max-w-none text-gray-700">
                    {point.tutorialContent.explanation}
                </ReactMarkdown>
            </div>

            {/* ✏️ 例题精讲 */}
            <div className="mb-4">
                <h3 className="font-semibold text-purple-700 mb-2">✏️ 例题精讲</h3>
                {point.tutorialContent.examples.map((ex, i) => (
                    <div key={i} className="mb-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <p className="font-medium text-purple-900">{ex.title}</p>
                        <p className="text-rose-600 text-sm mt-1">题目：{ex.problem}</p>
                        <p className="text-emerald-700 text-sm mt-1">解答：{ex.solution}</p>
                        <p className="text-xs text-gray-500 mt-1">💡 {ex.tip}</p>
                    </div>
                ))}
            </div>

            {/* 🧩 亲子互动 */}
            <div className="mb-4">
                <h3 className="font-semibold text-amber-700 mb-2">🧩 亲子互动</h3>
                <ReactMarkdown className="prose prose-blue max-w-none text-gray-700">
                    {point.tutorialContent.interaction}
                </ReactMarkdown>
            </div>

            {/* 📝 课后练习 */}
            <div>
                <h3 className="font-semibold text-cyan-700 mb-2">📝 课后练习</h3>
                {point.tutorialContent.exercises.map((ex, i) => (
                    <details key={i} className="mb-2">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-indigo-600">
                            第 {i + 1} 题：{ex.question}
                        </summary>
                        <div className="ml-4 mt-1 p-2 bg-emerald-50 rounded-lg">
                            <p className="text-sm">✅ 答案：{ex.answer}</p>
                            {ex.explanation && <p className="text-xs text-gray-600 mt-1">解析：{ex.explanation}</p>}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    </section>
)}
```

- [ ] **Step 2: 类型检查 + lint**

```bash
npx tsc -b --noEmit
npx eslint src/components/KnowledgeDetail.tsx
```

Expected: 均通过。

- [ ] **Step 3: 手工验证（dev server 查看有 tutorialContent 的知识点）**

```bash
npm run dev
```

浏览器打开一个已合并教程的知识点详情（如 `/knowledge/p-math-001`），确认 5 节（目标/讲解/例题/互动/练习）渲染正确、练习折叠交互正常。

- [ ] **Step 4: 提交**

```bash
git add src/components/KnowledgeDetail.tsx
git commit -m "feat(ui): system tutorial section in KnowledgeDetail"
```

---

## Task 11: 全量生成 + 质量抽检

**Files:**
- Modify: `scripts/generate-config.json`（用户配置，不提交 apiKey）

- [ ] **Step 1: 配置 Provider（示例：DeepSeek）**

```bash
cp scripts/generate-config.jsonc scripts/generate-config.json
# 编辑 generate-config.json：{provider: "deepseek", apiKey: "sk-xxx", concurrency: 3}
```

- [ ] **Step 2: dry-run 确认模板选型**

```bash
GENERATE_PROVIDER=deepseek GENERATE_API_KEY=sk-xxx node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials --dry-run --limit 5
```

确认小学/初中/高中 explain 模板各自正确命中。

- [ ] **Step 3: 全量运行**

```bash
GENERATE_API_KEY=sk-xxx node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials
```

Expected: 500+ 条，`done: 505 ok, ~3 failed`。

- [ ] **Step 4: 失败重跑**

```bash
GENERATE_API_KEY=sk-xxx node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials
```

第二次运行时 skipExisting 自动跳过已成功条目，仅重试失败项。

- [ ] **Step 5: 质量抽检**

```bash
node -e "
const data = JSON.parse(require('fs').readFileSync('scripts/output-tutorials/tutorials-all.json','utf8'));
const list = data.filter(r => r.tutorialContent);
console.log('total ok:', list.length);
console.log('avg explanation len:', Math.round(list.reduce((s,r)=>s+r.tutorialContent.explanation.length,0)/list.length));
const no Examples = list.filter(r=>r.tutorialContent.examples.length<2).length;
console.log('with <2 examples:', noExamples);
// 抽样小学、初中、高中各 1 条
for (const g of ['primary','middle','high']) {
  const s = list.find(r=>r.grade===g);
  console.log(g, JSON.stringify(s,null,2).slice(0,600));
}
"
```

确认：avg explanation > 300 字；examples ≥ 2；三学段风格差异化明显。

- [ ] **Step 6: 合并 + 构建验证**

```bash
node scripts/merge-tutorials.mjs --input scripts/output-tutorials/tutorials-all.json
npx tsc -b --noEmit
npm run build
```

Expected: exit 0。

- [ ] **Step 7: 端到端检查（dev server 浏览各学段知识点）**

```bash
npm run dev
```

至少各学段打开 2-3 个知识点详情，确认"系统教程"区块显示、点击、课后练习折叠交互正常。

- [ ] **Step 8: 提交（可能拆 2 个 commit）**

```bash
git add scripts src/data/knowledge
git commit -m "feat(content): 510 grade-aware tutorials generated (deepseek)"
git add scripts/output-tutorials
git commit -m "chore: raw generation output"
```

---

## 验收清单（Phase 1-4 全部完成时）

- [ ] 知识点总数 ≥ 500（小学 ~140 / 初中 ~200 / 高中 ~170）
- [ ] 每个知识点含 8 个静态字段（funEmoji/funFact/funStory/funQuestion/funQuestionAnswer/detailedExplanation/studyTips/practiceQuestions）
- [ ] 每个知识点含 tutorialContent（5 节结构完整）
- [ ] 每个学科 TS 文件 200-400 行，共 21 个文件
- [ ] ID 全部为 `p-math-001` 格式，questions 引用同步更新
- [ ] 9 个年级专属提示词模板已注册（explain/interaction/generate × 3 学段）
- [ ] selectBestTemplate 按年级+学科选型，4 个单元测试通过
- [ ] provider-config 支持 8 个 Provider，5 个单元测试通过
- [ ] generate-content.mjs 支持 dry-run/limit/ranges/force/validate-only/skipExisting
- [ ] merge-tutorials.mjs 注入 tutorialContent 后 tsc 通过
- [ ] KnowledgeDetail 系统教程区块在 ≥50% 知识点详情页可见
- [ ] 三学段生成风格差异化明显（小学故事化 / 初中逻辑化 / 高中本质化）
- [ ] npm run build + npx tsc -b --noEmit + npx eslint . 全部通过
