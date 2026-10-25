/**
 * Enrich tutorialContent for primary knowledge points generated from
 * cn-math-taxonomy. Supports math/chinese/english and grades 1-6.
 *
 * Usage:
 *   node scripts/align-cn-taxonomy/enrich-primary-cn-taxonomy.mjs math 2
 *   node scripts/align-cn-taxonomy/enrich-primary-cn-taxonomy.mjs chinese 2
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const skillRoot = path.resolve(projectRoot, '.claude', 'skills', 'cn-math-taxonomy', 'repo');

const MODEL = process.env.OLLAMA_MODEL || 'gemma4:31b-cloud';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const BATCH_SIZE = 5;

const SUBJECT_CONFIG = {
  math: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['数与代数', '图形与几何', '统计与概率', '综合与实践'],
    subjectName: '数学',
    emojis: ['', ''],
  },
  chinese: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['阅读理解', '识字写字', '拼音', '习作基础', '古诗文积累', '句子', '词语'],
    subjectName: '语文',
    emojis: [''],
  },
  english: {
    grades: [3, 4, 5, 6],
    domains: ['语音', '词汇', '语法', '日常表达'],
    subjectName: '英语',
    emojis: [''],
  },
};

function validateArgs() {
  const subject = process.argv[2];
  const grade = parseInt(process.argv[3], 10);
  const config = SUBJECT_CONFIG[subject];

  if (!config) {
    throw new Error(`Usage: node enrich-primary-cn-taxonomy.mjs <${Object.keys(SUBJECT_CONFIG).join('|')}> <grade>`);
  }
  if (!Number.isInteger(grade) || !config.grades.includes(grade)) {
    throw new Error(`${config.subjectName} supports grades: ${config.grades.join(', ')}`);
  }
  return { subject, grade };
}

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
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

function buildPrompt(batch, config, grade) {
  const intro = `你是小学${config.subjectName}教学助手。请为下面的每个知识点生成结构化的教程内容。

输出要求：
- 返回纯 JSON 对象，键是知识点的 ".id"，值是 TutorialContent 对象
- TutorialContent 字段：objectives（数组）、explanation（字符串，支持 markdown）、examples（数组）、interaction（字符串）、exercises（数组）
- examples 每项包含：title, problem, solution, tip
- exercises 每项包含：question, answer, explanation
- 每个知识点：objectives 3-5 条；examples 2-3 道由易到难；exercises 3-5 道
- 语言：简体中文，适合小学${['一', '二', '三', '四', '五', '六'][grade - 1]}年级学生

请只输出 JSON，不要其他解释。`;

  const topicsText = batch.map((t) => `--- 知识点 ---
id: ${t.id}
name: ${t.name}
description: ${t.description || ''}
chapter: ${t.chapter || ''}
domain: ${t.domain || ''}
mastery_criteria: ${(t.mastery_criteria || []).join(', ')}
diagnostic_question: ${t.diagnostic_question ? `${t.diagnostic_question.question}（答案：${t.diagnostic_question.answer}）` : '无'}
root_reason: ${t.root_reason || ''}`).join('\n');

  return `${intro}\n\n${topicsText}`;
}

function normalizeContent(raw) {
  return {
    objectives: Array.isArray(raw.objectives) ? raw.objectives.filter((o) => typeof o === 'string') : [],
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

async function loadCache(cacheFile) {
  try {
    return JSON.parse(await fs.readFile(path.join(__dirname, cacheFile), 'utf8'));
  } catch {
    return {};
  }
}

async function saveCache(cache, cacheFile) {
  await fs.writeFile(path.join(__dirname, cacheFile), JSON.stringify(cache, null, 2), 'utf8');
}

async function main() {
  const { subject, grade } = validateArgs();
  const config = SUBJECT_CONFIG[subject];
  const topics = JSON.parse(await fs.readFile(path.join(skillRoot, 'data', 'topics.json'), 'utf8'));
  const filtered = topics
    .filter((t) => t.grade === grade && config.domains.includes(t.domain))
    .sort((a, b) => a.id.localeCompare(b.id));

  const cacheFile = `.enrich-${subject}-g${grade}-cache.json`;
  const cache = await loadCache(cacheFile);
  const batches = chunk(filtered, BATCH_SIZE);

  for (const batch of batches) {
    const cacheKey = batch.map((t) => t.id).join(',');
    let content = cache[cacheKey];

    if (!content) {
      const prompt = buildPrompt(batch, config, grade);
      let attempt = 0;
      let lastError = null;
      while (attempt < 3) {
        try {
          const response = await callOllama(prompt);
          content = parseJson(response);
          break;
        } catch (e) {
          attempt += 1;
          lastError = e;
          console.error(`Batch failed (attempt ${attempt}/3): ${e.message}`);
          if (attempt === 3) {
            console.warn(`Giving up on batch ${cacheKey}; using default content.`);
            content = {};
          }
        }
      }
      cache[cacheKey] = content;
      await saveCache(cache, cacheFile);
    } else {
      console.log(`Cache hit for ${batch.map((t) => t.id).join(', ')}`);
    }
  }

  const enriched = new Map();
  for (const batch of batches) {
    const content = cache[batch.map((t) => t.id).join(',')];
    for (const topic of batch) {
      const raw = content[topic.id] || {};
      enriched.set(topic.id, normalizeContent(raw));
    }
  }

  const kps = filtered.map((topic, index) => {
    const id = `p-${subject}-g${grade}-${(index + 1).toString().padStart(3, '0')}`;
    const description = topic.description || '';
    const detailedExplanation = `${description}${topic.root_reason ? `\n\n**学习意义**：${topic.root_reason}` : ''}`;
    const tags = [
      topic.domain,
      `grade-${topic.grade}`,
      `cnm:${topic.id}`,
      ...(topic.standards || []).map((s) => s.id).filter(Boolean),
    ];
    const studyTips = topic.mastery_criteria || [];
    const practiceQuestions = [];
    if (topic.diagnostic_question && typeof topic.diagnostic_question.question === 'string' && typeof topic.diagnostic_question.answer === 'string') {
      practiceQuestions.push(topic.diagnostic_question);
    }
    const content = enriched.get(topic.id);

    return {
      id,
      title: topic.name,
      description,
      tags,
      detailedExplanation,
      studyTips,
      practiceQuestions,
      funEmoji: config.emojis[0] || '✅',
      funFact: `${topic.name}是小学${config.subjectName}的基础内容。`,
      funStory: `${topic.name}就在我们身边，比如课堂学习、日常生活，都能见到它的身影。`,
      funQuestion: topic.diagnostic_question?.question || '你能举一个生活中的例子吗？',
      funQuestionAnswer: topic.diagnostic_question?.answer || '答案不唯一，合理即可。',
      tutorialContent: {
        objectives: content.objectives,
        explanation: content.explanation,
        examples: content.examples,
        interaction: content.interaction,
        exercises: content.exercises,
      },
    };
  });

  const varName = `${subject}Grade${grade}`;
  const fileName = `${subject}-grade${grade}.generated.ts`;
  const generatedFile = path.join(projectRoot, 'src', 'data', 'knowledge', 'primary', fileName);

  const fileContent = `import type { KnowledgePoint } from '../../types';

// Auto-generated from cn-math-taxonomy (${config.subjectName} grade ${grade})
// Do not edit by hand; regenerate with:
//   node scripts/align-cn-taxonomy/enrich-primary-cn-taxonomy.mjs ${subject} ${grade}
export const ${varName}: KnowledgePoint[] = ${JSON.stringify(kps, null, 2)};
`;

  await fs.writeFile(generatedFile, fileContent, 'utf8');
  console.log(`Wrote enriched file: ${generatedFile}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
