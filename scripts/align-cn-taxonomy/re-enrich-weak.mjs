/**
 * Re-enrich weak/default tutorialContent in generated knowledge point files.
 *
 * Usage:
 *   node scripts/align-cn-taxonomy/re-enrich-weak.mjs math 4
 *   node scripts/align-cn-taxonomy/re-enrich-weak.mjs chinese 2
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const skillRoot = path.resolve(projectRoot, '.claude', 'skills', 'cn-math-taxonomy');

const MODEL = process.env.OLLAMA_MODEL || 'gemma4:31b-cloud';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

const SUBJECT_CONFIG = {
  math: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['数与代数', '图形与几何', '统计与概率', '综合与实践'],
    subjectName: '数学',
  },
  chinese: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['阅读理解', '识字写字', '拼音', '习作基础', '古诗文积累', '句子', '词语'],
    subjectName: '语文',
  },
  english: {
    grades: [3, 4, 5, 6],
    domains: ['语音', '词汇', '语法', '日常表达'],
    subjectName: '英语',
  },
};

function validateArgs() {
  const subject = process.argv[2];
  const grade = parseInt(process.argv[3], 10);
  const config = SUBJECT_CONFIG[subject];
  if (!config) {
    throw new Error(`Usage: node re-enrich-weak.mjs <${Object.keys(SUBJECT_CONFIG).join('|')}> <grade>`);
  }
  if (!Number.isInteger(grade) || !config.grades.includes(grade)) {
    throw new Error(`${config.subjectName} supports grades: ${config.grades.join(', ')}`);
  }
  return { subject, grade };
}

async function callOllama(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      format: 'json',
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama HTTP ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.response;
}

function parseJson(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  return JSON.parse(text);
}

function isWeak(content) {
  if (!content || typeof content !== 'object') return true;
  if (!content.explanation || content.explanation.length < 30) return true;
  if (!Array.isArray(content.examples) || content.examples.length === 0) return true;
  if (content.examples.some((ex) => !ex.problem || !ex.solution)) return true;
  if (!Array.isArray(content.exercises) || content.exercises.length === 0) return true;
  if (content.exercises.some((ex) => !ex.question || !ex.answer)) return true;
  if (JSON.stringify(content.objectives) === JSON.stringify(['理解本课核心概念', '能完成基础练习'])) return true;
  return false;
}

function buildPrompt(topic, config, grade) {
  const intro = `你是小学${config.subjectName}教学助手。请为下面的知识点生成结构化的教程内容。

输出要求：
- 返回纯 JSON 对象，即 TutorialContent 对象（不是对象嵌套）
- TutorialContent 字段：objectives（数组）、explanation（字符串，支持 markdown）、examples（数组）、interaction（字符串）、exercises（数组）
- examples 每项包含：title, problem, solution, tip
- exercises 每项包含：question, answer, explanation
- objectives 3-5 条；examples 2-3 道由易到难；exercises 3-5 道
- 语言：简体中文，适合小学${['一', '二', '三', '四', '五', '六'][grade - 1]}年级学生

请只输出 JSON，不要其他解释。`;

  return `${intro}

--- 知识点 ---
id: ${topic.id}
name: ${topic.name}
description: ${topic.description || ''}
chapter: ${topic.chapter || ''}
domain: ${topic.domain || ''}
mastery_criteria: ${(topic.mastery_criteria || []).join(', ')}
diagnostic_question: ${topic.diagnostic_question ? `${topic.diagnostic_question.question}（答案：${topic.diagnostic_question.answer}）` : '无'}
root_reason: ${topic.root_reason || ''}`;
}

function normalizeContent(raw) {
  return {
    objectives: Array.isArray(raw.objectives) ? raw.objectives.filter((o) => typeof o === 'string') : ['理解本课核心概念', '能完成基础练习'],
    explanation: typeof raw.explanation === 'string' ? raw.explanation : '',
    examples: Array.isArray(raw.examples)
      ? raw.examples.map((ex) => ({
          title: ex.title || '例题',
          problem: ex.problem || '',
          solution: ex.solution || '',
          tip: ex.tip || '理解概念后再动手',
        }))
      : [],
    interaction: typeof raw.interaction === 'string' ? raw.interaction : '请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。',
    exercises: Array.isArray(raw.exercises)
      ? raw.exercises.map((ex) => ({
          question: ex.question || '',
          answer: ex.answer || '',
          explanation: ex.explanation || '参考例题讲解',
        }))
      : [],
  };
}

function extractJsonArray(fileContent) {
  const exportMatch = fileContent.match(/export\s+const\s+\w+\s*:\s*KnowledgePoint\[\]\s*=\s*/);
  if (!exportMatch) {
    throw new Error('Could not find export statement');
  }
  const start = exportMatch.index + exportMatch[0].length;
  let i = start;
  while (i < fileContent.length && /\s/.test(fileContent[i])) i += 1;
  if (fileContent[i] !== '[') {
    throw new Error('Expected array after export statement');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let arrayStart = i;
  for (; i < fileContent.length; i += 1) {
    const ch = fileContent[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
    } else {
      if (ch === '"') {
        inString = true;
      } else if (ch === '[') {
        depth += 1;
      } else if (ch === ']') {
        depth -= 1;
        if (depth === 0) {
          return fileContent.slice(arrayStart, i + 1);
        }
      }
    }
  }
  throw new Error('Could not find matching closing bracket');
}

async function main() {
  const { subject, grade } = validateArgs();
  const config = SUBJECT_CONFIG[subject];
  const fileName = `${subject}-grade${grade}.generated.ts`;
  const generatedFile = path.join(projectRoot, 'src', 'data', 'knowledge', 'primary', fileName);

  const topics = JSON.parse(await fs.readFile(path.join(skillRoot, 'data', 'topics.json'), 'utf8'));
  const filtered = topics
    .filter((t) => t.grade === grade && config.domains.includes(t.domain))
    .sort((a, b) => a.id.localeCompare(b.id));
  const topicById = new Map(filtered.map((t) => [t.id, t]));

  const fileContent = await fs.readFile(generatedFile, 'utf8');
  const json = extractJsonArray(fileContent);
  const kps = JSON.parse(json);

  let fixed = 0;
  for (let i = 0; i < kps.length; i += 1) {
    const kp = kps[i];
    if (!isWeak(kp.tutorialContent)) continue;

    const cnmId = kp.tags.find((t) => t.startsWith('cnm:'))?.replace('cnm:', '');
    const topic = topicById.get(cnmId);
    if (!topic) {
      console.warn(`Could not find source topic for ${kp.id}`);
      continue;
    }

    console.log(`Re-enriching ${kp.id}: ${kp.title}`);
    const prompt = buildPrompt(topic, config, grade);
    let content = null;
    let attempt = 0;
    while (attempt < 3) {
      try {
        const response = await callOllama(prompt);
        content = parseJson(response);
        break;
      } catch (e) {
        attempt += 1;
        console.error(`  Failed (attempt ${attempt}/3): ${e.message}`);
        if (attempt === 3) {
          console.warn(`  Giving up on ${kp.id}`);
          content = {};
        }
      }
    }

    kp.tutorialContent = normalizeContent(content);
    fixed += 1;
  }

  const varName = `${subject}Grade${grade}`;
  const newContent = `import type { KnowledgePoint } from '../../types';

// Auto-generated from cn-math-taxonomy (${config.subjectName} grade ${grade})
// Do not edit by hand; regenerate with:
//   node scripts/align-cn-taxonomy/enrich-primary-cn-taxonomy.mjs ${subject} ${grade}
export const ${varName}: KnowledgePoint[] = ${JSON.stringify(kps, null, 2)};
`;

  await fs.writeFile(generatedFile, newContent, 'utf8');
  console.log(`Fixed ${fixed} weak topics in ${generatedFile}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
