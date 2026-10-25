/**
 * Generate school-formula KnowledgePoint entries from cn-math-taxonomy
 * for primary subjects. Supports math/chinese/english and grades 1-6.
 *
 * Usage:
 *   node scripts/align-cn-taxonomy/generate-primary-cn-taxonomy.mjs math 2
 *   node scripts/align-cn-taxonomy/generate-primary-cn-taxonomy.mjs chinese 2
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const skillRoot = path.resolve(projectRoot, '.claude', 'skills', 'cn-math-taxonomy');

const SUBJECT_CONFIG = {
  math: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['数与代数', '图形与几何', '统计与概率', '综合与实践'],
    subjectName: '数学',
    emoji: '🔢',
  },
  chinese: {
    grades: [1, 2, 3, 4, 5, 6],
    domains: ['阅读理解', '识字写字', '拼音', '习作基础', '古诗文积累', '句子', '词语'],
    subjectName: '语文',
    emoji: '📝',
  },
  english: {
    grades: [3, 4, 5, 6],
    domains: ['语音', '词汇', '语法', '日常表达'],
    subjectName: '英语',
    emoji: '',
  },
};

function validateArgs() {
  const subject = process.argv[2];
  const grade = parseInt(process.argv[3], 10);
  const config = SUBJECT_CONFIG[subject];

  if (!config) {
    throw new Error(`Usage: node generate-primary-cn-taxonomy.mjs <${Object.keys(SUBJECT_CONFIG).join('|')}> <grade>`);
  }
  if (!Number.isInteger(grade) || !config.grades.includes(grade)) {
    throw new Error(`${config.subjectName} supports grades: ${config.grades.join(', ')}`);
  }
  return { subject, grade };
}

function generateId(subject, grade, index) {
  return `p-${subject}-g${grade}-${(index + 1).toString().padStart(3, '0')}`;
}

function buildKnowledgePoint(topic, subject, grade, index) {
  const config = SUBJECT_CONFIG[subject];
  const id = generateId(subject, grade, index);
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

  return {
    id,
    title: topic.name,
    description,
    tags,
    detailedExplanation,
    studyTips,
    practiceQuestions,
    funEmoji: config.emoji,
    funFact: `${topic.name}是小学${config.subjectName}的基础内容。`,
    funStory: `${topic.name}就在我们身边，比如课堂学习、日常生活，都能见到它的身影。`,
    funQuestion: topic.diagnostic_question?.question || '你能举一个生活中的例子吗？',
    funQuestionAnswer: topic.diagnostic_question?.answer || '答案不唯一，合理即可。',
    tutorialContent: {
      objectives: topic.mastery_criteria || [],
      explanation: detailedExplanation,
      examples: practiceQuestions.map((q) => ({
        title: `基础：${topic.name}`,
        problem: q.question,
        solution: q.answer,
        tip: topic.root_reason || '理解概念后再动手',
      })),
      interaction: '请孩子结合生活实际举例说明今天学的概念，家长提问并纠正。',
      exercises: practiceQuestions.map((q) => ({
        question: q.question,
        answer: q.answer,
        explanation: '参考例题讲解',
      })),
    },
  };
}

async function main() {
  const { subject, grade } = validateArgs();
  const config = SUBJECT_CONFIG[subject];
  const topics = JSON.parse(await fs.readFile(path.join(skillRoot, 'data', 'topics.json'), 'utf8'));

  const filtered = topics
    .filter((t) => t.grade === grade && config.domains.includes(t.domain))
    .sort((a, b) => a.id.localeCompare(b.id));

  const kps = filtered.map((t, i) => buildKnowledgePoint(t, subject, grade, i));

  const mapping = {
    generatedAt: new Date().toISOString(),
    source: 'cn-math-taxonomy',
    subject,
    filter: { grade, domains: config.domains },
    total: filtered.length,
    items: filtered.map((t, i) => ({
      cnId: t.id,
      cnName: t.name,
      generatedId: generateId(subject, grade, i),
      chapter: t.chapter,
    })),
  };

  const varName = `${subject}Grade${grade}`;
  const fileName = `${subject}-grade${grade}.generated.ts`;
  const generatedFile = path.join(projectRoot, 'src', 'data', 'knowledge', 'primary', fileName);
  const mappingFile = path.join(__dirname, `mapping-${subject}-grade${grade}.json`);

  const fileContent = `import type { KnowledgePoint } from '../../types';

// Auto-generated from cn-math-taxonomy (${config.subjectName} grade ${grade})
// Do not edit by hand; regenerate with:
//   node scripts/align-cn-taxonomy/generate-primary-cn-taxonomy.mjs ${subject} ${grade}
export const ${varName}: KnowledgePoint[] = ${JSON.stringify(kps, null, 2)};
`;

  await fs.writeFile(generatedFile, fileContent, 'utf8');
  await fs.writeFile(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');

  console.log(`Generated ${filtered.length} ${subject} grade ${grade} knowledge points`);
  console.log(`  → ${path.relative(projectRoot, generatedFile)}`);
  console.log(`  → ${path.relative(projectRoot, mappingFile)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
