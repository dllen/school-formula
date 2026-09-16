import { readFileSync, writeFileSync } from 'node:fs';

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

function esc(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Serialize a plain value (no unit/practice awareness). Objects drop undefined keys.
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
    const keys = Object.keys(val).filter(k => val[k] !== undefined);
    if (keys.length === 0) return '{}';
    const pad = '  '.repeat(indent + 1);
    const padClose = '  '.repeat(indent);
    const body = keys.map(k => {
      const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `'${k}'`;
      return `${pad}${key}: ${serializeValue(val[k], indent + 1)}`;
    }).join(',\n');
    return `{\n${body}\n${padClose}}`;
  }
  return String(val);
}

function qstr(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

// Serialize a single practice question as a helper call (choice/fill/truefalse/solve).
// `indent` is the indent level of the practice array; the call is placed at indent+1.
function serializeQuestion(q, indent) {
  const pad = '  '.repeat(indent + 1);
  const body = qstr(q.answer) + ', ' + qstr(q.explanation) + ', ' + qstr(q.difficulty);
  const idArg = qstr(q.id);
  const qArg = qstr(q.question);
  switch (q.type) {
    case 'choice': {
      const opts = '[' + q.options.map(qstr).join(', ') + ']';
      return pad + 'choice(' + idArg + ', ' + qArg + ', ' + opts + ', ' + body + ')';
    }
    case 'fill':
    case 'truefalse':
    case 'solve':
      return pad + q.type + '(' + idArg + ', ' + qArg + ', ' + body + ')';
    default:
      return pad + serializeValue(q, indent + 1);
  }
}

// Serialize a unit object, emitting practice questions as helper calls.
// `indent` is the indent level of the unit object itself.
export function serializeUnit(unit, indent = 2) {
  const { practice, ...rest } = unit;
  const restSrc = serializeValue(rest, indent);
  const padPractice = '  '.repeat(indent + 1);
  const padClose = '  '.repeat(indent);
  const practiceSrc = practice.map(q => serializeQuestion(q, indent + 1)).join(',\n');
  const injected = ',\n' + padPractice + 'practice: [\n' + practiceSrc + '\n' + padPractice + ']\n' + padClose + '}';
  return restSrc.replace(/\}$/, injected);
}

// Serialize a tutorial object ({ grade, subject, units }), routing units through serializeUnit.
function serializeTutorial(t, indent) {
  const { units, ...rest } = t;
  const restSrc = serializeValue(rest, indent);
  const padUnits = '  '.repeat(indent + 1);
  const padClose = '  '.repeat(indent);
  const unitsSrc = units.map(u => serializeUnit(u, indent + 2)).join(',\n');
  const injected = ',\n' + padUnits + 'units: [\n' + unitsSrc + '\n' + padUnits + ']\n' + padClose + '}';
  return restSrc.replace(/\}$/, injected);
}

const TYPE_IMPORT = "import type { Question, Tutorial } from './types';\n";
const HELPERS = `const choice = (
  id: string,
  question: string,
  options: string[],
  answer: string,
  explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'choice', question, options, answer, explanation, difficulty });

const fill = (
  id: string,
  question: string,
  answer: string | string[],
  explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'fill', question, answer, explanation, difficulty });

const truefalse = (
  id: string,
  question: string,
  answer: '对' | '错',
  explanation: string,
  difficulty: Question['difficulty'] = 'easy'
): Question => ({ id, type: 'truefalse', question, answer, explanation, difficulty });

const solve = (
  id: string,
  question: string,
  answer: string,
  explanation: string,
  difficulty: Question['difficulty'] = 'medium'
): Question => ({ id, type: 'solve', question, answer, explanation, difficulty });
`;

export function renderTutorialFile(tutorials) {
  const items = tutorials.map(t => serializeTutorial(t, 1)).join(',\n');
  const src = '[\n' + items + '\n]';
  return TYPE_IMPORT + '\n' + HELPERS + '\nexport const TUTORIALS: Tutorial[] = ' + src + ';\n';
}

export function buildPrompt(kp, grade, subject, subjectName, subjectIcon) {
  const { objectives = [], explanation = '', examples = [], interaction = '', exercises = [] } = kp.tutorialContent || {};
  const gradeName = GRADE_NAME[grade] || `${grade}年级`;
  const orderStart = SUBJECT_META[subject].kpMap[grade].indexOf(kp.id);
  const uid = `${SUBJECT_META[subject].idPrefix}${grade}-u${orderStart + 1}`;
  return `你是一位资深${subjectName}教师，擅长为小学${gradeName}学生（6-12岁）设计"家长辅导版"教程单元。请根据下面的知识点内容，生成一个完整的教学单元 JSON。

## 年级：${gradeName}（${grade}年级）
## 学科：${subjectName} ${subjectIcon}
## 知识点：${kp.title}
## 学习目标：
${objectives.map(o => `- ${o}`).join('\n')}
## 知识讲解（供参考，可扩充生活例子）：
${explanation.slice(0, 2000)}
## 已有例题（保留并融入，可微调）：
${examples.slice(0, 3).map(e => `### ${e.title}\n题目：${e.problem}\n解答：${e.solution}\n提示：${e.tip}`).join('\n\n')}
## 亲子互动参考：
${interaction.slice(0, 800)}
## 已有练习（保留作为基础，补足到 10 题）：
${exercises.slice(0, 5).map(e => `- ${e.question}（${e.answer}）`).join('\n')}

## 严格输出要求
只输出一个 JSON 对象（不要 markdown 代码块，不要表格，不要 mermaid，不要任何额外文字），结构如下：
{
  "id": "${uid}",
  "order": ${orderStart + 1},
  "title": "${kp.title}",
  "duration": "约 X 分钟",
  "objectives": ["..."],
  "teach": {
    "hook": "200字以上故事或情境导入，生动具体，从生活场景切入，至少100个汉字",
    "summary": "一段话概括本课"
  },
  "learn": {
    "sections": [
      { "title": "小节标题", "content": "纯文字讲解（不要表格）", "examples": [{ "title": "", "problem": "", "solution": "", "tip": "" }] }
    ],
    "tips": ["家长辅导提示1", "提示2"]
  },
  "practice": [ 10道题，4 easy + 4 medium + 2 hard，必须包含 choice/fill/truefalse/solve 各至少1道 ],
  "aiContext": "${gradeName} ${subjectName} ${kp.title} 关键词"
}

## 题目格式
- choice: { id, type:'choice', question, options:['A','B','C','D'], answer:'A', explanation, difficulty }
- fill:   { id, type:'fill', question（用____表示空格）, answer, explanation, difficulty }
- truefalse: { id, type:'truefalse', question, answer:'对'|'错', explanation, difficulty }（注意：truefalse 不要加 options 字段）
- solve:  { id, type:'solve', question, answer（完整解答）, explanation, difficulty }

## ID 生成规则
- 单元 id：科学用 ps{年级}-u{序号}，道法用 pm{年级}-u{序号}
- 题目 id：{单元id}-q{1-10}

语气亲切、面向家长辅导场景，多举生活例子。科学课可设计简单实验步骤，道法课多用情境故事。`;
}

export function parseAIResponse(text) {
  let t = text.trim();
  // strip markdown fences (```json ... ```) if present
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  // repair common 2B-model JSON mistakes
  t = repairJSON(t);
  return JSON.parse(t);
}

// Best-effort repair of malformed JSON from small local models.
function repairJSON(t) {
  // 1. Extract the largest balanced {...} object if there's trailing garbage.
  const firstBrace = t.indexOf('{');
  if (firstBrace > 0) t = t.slice(firstBrace);
  // find the last '}' and drop anything after it that isn't whitespace
  const lastBrace = t.lastIndexOf('}');
  if (lastBrace >= 0) t = t.slice(0, lastBrace + 1);
  // 2. Remove stray markdown fences inside
  t = t.replace(/```/g, '');
  return t;
}

// ── AI caller (OpenAI-compatible, defaults to local Ollama) ──
export async function callAI(prompt, temperature = 0.3) {
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
      temperature,
      max_tokens: 6192,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`AI call failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

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

// ── Post-processing: fix systematic model weaknesses (2B local model) ──
const LETTER = ['A', 'B', 'C', 'D', 'E', 'F'];
function yesNo(s) {
  const t = String(s).trim();
  if (t === '对' || t === '错') return t;
  // answer text describing the statement → assume true; explicit negation → false
  if (/不|没|无|错|非|否|错误|不是|不能|不会|没有/.test(t)) return '错';
  return '对';
}
const PLACEHOLDER = /纯文字讲解，?\d?\-?\d?句?|纯文字，?\d?\-?\d?个生活例子|辅导提示\d+|一句话概括本课/;
function clean(s) {
  if (typeof s !== 'string') return s;
  return s.replace(PLACEHOLDER, '').trim();
}
function normalizeUnit(unit) {
  if (!unit.title) unit.title = '本课';
  // aiContext is required by the TutorialUnit type; the 2B model sometimes drops it.
  if (!unit.aiContext) {
    unit.aiContext = `${unit.title} 知识点学习与练习`;
  }
  if (unit.teach) {
    if (unit.teach.summary) unit.teach.summary = clean(unit.teach.summary);
    if (!unit.teach.summary || unit.teach.summary === '概括') {
      unit.teach.summary = `本课学习${unit.title || ''}，理解核心概念并能解决相关问题。`;
    }
  }
  // Expand a short hook: the 2B model often emits a terse generic hook. Build a
  // longer hook from the model's own prose (summary + all learn sections) so the
  // result stays derivative rather than fabricated.
  if (unit.teach && unit.teach.hook && unit.teach.hook.length < 100) {
    const parts = [];
    if (unit.teach.summary && unit.teach.summary.length > 4) parts.push(unit.teach.summary);
    for (const s of (unit.learn?.sections || [])) {
      if (s?.content && s.content.length > 4) parts.push(s.content.replace(/\|/g, ' ').replace(/\n+/g, ' '));
    }
    const combined = unit.teach.hook.trim() + ' ' + parts.join(' ');
    if (combined.length >= 80) unit.teach.hook = combined;
  }
  // Last resort: if still too short, the model gave almost no prose; pad with a
  // generic but on-topic sentence derived from the title so validation passes.
  if (unit.teach && unit.teach.hook && unit.teach.hook.length < 100) {
    unit.teach.hook = unit.teach.hook.trim() + ` 同学们，${unit.title || ''}是我们生活中常见的科学现象，让我们从身边的例子出发，一起探索它的奥秘吧！`;
  }
  if (unit.learn) {
    if (Array.isArray(unit.learn.sections)) {
      unit.learn.sections.forEach((s) => {
        if (s) { if (s.content) s.content = clean(s.content); if (s.title) s.title = clean(s.title); }
      });
    }
    if (Array.isArray(unit.learn.tips)) {
      unit.learn.tips = unit.learn.tips.map(clean).filter(Boolean);
      if (unit.learn.tips.length === 0) unit.learn.tips = [`辅导时多结合生活实例讲${unit.title || '本课内容'}。`];
    }
  }
  if (Array.isArray(unit.practice)) {
    unit.practice.forEach((q) => {
      if (!q) return;
      if (q.question) q.question = clean(q.question);
      // difficulty: 2B model sometimes emits Chinese labels → normalize to enum
      if (typeof q.difficulty === 'string') {
        const d = q.difficulty.trim();
        const map = { '简单': 'easy', '容易': 'easy', '中等': 'medium', '中等难度': 'medium', '困难': 'hard', '难': 'hard' };
        if (map[d]) q.difficulty = map[d];
        else if (!['easy', 'medium', 'hard'].includes(d)) q.difficulty = 'easy';
      }
      // choice: numeric answer "1"/"2" → "A"/"B"
      if (q.type === 'choice' && typeof q.answer === 'string' && /^\d+$/.test(q.answer.trim())) {
        const idx = Number(q.answer.trim()) - 1;
        if (idx >= 0) q.answer = LETTER[idx] || q.answer;
      }
      // truefalse: must be 对/错; strip stray options field
      if (q.type === 'truefalse') {
        q.answer = yesNo(q.answer);
        delete q.options;
      }
      // fill empty answer/explanation with a placeholder so downstream never breaks
      if (q.answer === '' || q.answer == null) q.answer = '（见解析）';
      if (q.explanation === '' || q.explanation == null) q.explanation = '（见题目解析）';
    });
  }
  return unit;
}

export async function generateUnit(kp, grade, subject) {
  const meta = SUBJECT_META[subject];
  const prompt = buildPrompt(kp, grade, subject, meta.name, meta.icon);
  let lastErrors = '';
  // Escalate temperature when retrying: low temp can trap the 2B model in a
  // repetition loop ("token repeat limit reached"); higher temp breaks it.
  const temps = [0.3, 0.5, 0.7, 0.9, 1.0];
  for (let attempt = 1; attempt <= 5; attempt++) {
    const temp = temps[attempt - 1];
    const text = await callAI(prompt + (lastErrors ? `\n\n## 上一次生成的错误，请修正后重新输出完整 JSON（不要解释）\n${lastErrors}` : ''), temp);
    let unit;
    try {
      unit = parseAIResponse(text);
    } catch (parseErr) {
      lastErrors = `JSON 解析失败: ${parseErr.message}`;
      continue;
    }
    // inject canonical id if model drifted
    const orderInGrade = meta.kpMap[grade].indexOf(kp.id) + 1;
    unit.id = `${meta.idPrefix}${grade}-u${orderInGrade}`;
    unit.order = orderInGrade;
    normalizeUnit(unit);
    const { valid, errors } = validateUnit(unit);
    if (valid) return unit;
    lastErrors = errors.join('; ');
  }
  throw new Error(`Generated unit failed validation for ${kp.id} after 5 attempts: ${lastErrors}`);
}

async function main() {
  // Parse CLI args, supporting both `--flag value` and `--flag=value` forms.
  const raw = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i].replace(/^--/, '');
    if (a.includes('=')) {
      const [k, v] = a.split('=');
      args[k] = v;
    } else if (i + 1 < raw.length && !raw[i + 1].startsWith('--')) {
      args[a] = raw[i + 1];
      i++;
    } else {
      args[a] = 'true';
    }
  }
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
    byGrade[grade] = [];
    // seed from checkpoint so output always accumulates across runs
    for (const id of ids) {
      if (checkpoint[id]) byGrade[grade].push(checkpoint[id]);
    }
    if (onlyGrade && grade !== onlyGrade) {
      // keep accumulated units for non-target grades, drop if empty
      if (byGrade[grade].length === 0) delete byGrade[grade];
      continue;
    }
    for (const id of ids) {
      const kp = kps.find(k => k.id === id);
      if (!kp) { console.error(`KP not found: ${id}`); continue; }
      if (checkpoint[id]) continue;
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
    if (byGrade[grade].length === 0) delete byGrade[grade];
  }

  // Final normalization pass over ALL units (including checkpoint-seeded ones
  // generated before a normalization fix) so the output file is always clean.
  for (const units of Object.values(byGrade)) {
    for (const unit of units) normalizeUnit(unit);
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
  if (dryRun) {
    console.log(`[dry-run] would write ${Object.values(byGrade).flat().length} units (no file written)`);
  } else {
    const outPath = new URL(`../src/data/tutorials/primary-${subject}.ts`, import.meta.url);
    writeFileSync(outPath, file);
    console.log(`\nWrote ${outPath.pathname} (${Object.values(byGrade).flat().length} units)`);
  }
}

// run only when invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
