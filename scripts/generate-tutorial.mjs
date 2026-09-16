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

export function serializeUnit(unit) {
  return serializeValue(unit, 2);
}

const TYPE_IMPORT = `import type { Tutorial, TutorialUnit } from './types';\n`;
const HELPERS = `const choice = (id, question, options, answer, explanation, difficulty) => ({ id, type: 'choice' as const, question, options, answer, explanation, difficulty });\nconst fill = (id, question, answer, explanation, difficulty) => ({ id, type: 'fill' as const, question, answer, explanation, difficulty });\nconst truefalse = (id, question, answer, explanation, difficulty) => ({ id, type: 'truefalse' as const, question, answer: answer as '对' | '错', explanation, difficulty });\nconst solve = (id, question, answer, explanation, difficulty) => ({ id, type: 'solve' as const, question, answer, explanation, difficulty });\n`;

export function renderTutorialFile(tutorials) {
  const src = serializeValue(tutorials, 0);
  return `${TYPE_IMPORT}\n${HELPERS}\nexport const TUTORIALS: Tutorial[] = ${src};\n`;
}

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

export function parseAIResponse(text) {
  let t = text.trim();
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  return JSON.parse(t);
}
