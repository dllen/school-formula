/**
 * 静态字段合并工具（一次性脚本）
 *
 * 读取 scripts/output-fields-primary.json（AI 生成的 8 个静态字段），
 * 按学科追加到 src/data/knowledge/primary/<subject>.ts 的 knowledgePoints 数组末尾。
 *
 * 用法：node scripts/merge-fields.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KNOWLEDGE_DIR = join(ROOT, 'src/data/knowledge/primary');

const SUBJECTS = {
  math: 'math', chinese: 'chinese', english: 'english', science: 'science', moral: 'moral'
};

/** 将 JS 字符串安全地转义为 TS 单引号字符串 */
function tsString(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

/** 模板字符串（反引号）包裹，转义反引号 */
function tsTemplate(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

/** 生成一个 TS 知识对象字面量文本（缩进 20 空格，与现有文件一致） */
function toTSObject(item, indent = '                    ') {
  const lines = [];
  lines.push(`{`);
  lines.push(`${indent}id: '${item.id}',`);
  lines.push(`${indent}title: '${tsString(item.title)}',`);
  lines.push(`${indent}description: '${tsString(item.description)}',`);
  lines.push(`${indent}funEmoji: '${tsString(item.funEmoji)}',`);
  lines.push(`${indent}funFact: '${tsString(item.funFact)}',`);
  lines.push(`${indent}funStory: '${tsString(item.funStory)}',`);
  lines.push(`${indent}funQuestion: '${tsString(item.funQuestion)}',`);
  lines.push(`${indent}funQuestionAnswer: '${tsString(item.funQuestionAnswer)}',`);
  // detailedExplanation 用反引号模板字符串
  lines.push(`${indent}detailedExplanation: \``);
  // 内容缩进 12 空格，与现有文件中最深层缩进一致
  const explLines = String(item.detailedExplanation).split('\n').map(l => `            ${l}`.trimEnd());
  lines.push(...explLines);
  lines.push(`          \`,`);
  // studyTips
  lines.push(`${indent}studyTips: [`);
  for (const tip of item.studyTips) {
    lines.push(`${indent}  '${tsString(tip)}',`);
  }
  lines.push(`${indent}],`);
  // practiceQuestions
  lines.push(`${indent}practiceQuestions: [`);
  for (const q of item.practiceQuestions) {
    lines.push(`${indent}  { question: '${tsString(q.question)}', answer: '${tsString(q.answer)}' },`);
  }
  lines.push(`${indent}]`);
  lines.push(`                }`);
  return lines.join('\n');
}

const data = JSON.parse(readFileSync(join(__dirname, 'output-fields-primary.json'), 'utf8'));
const ok = data.filter(r => r.status === 'ok');
console.log(`✓ 读取 ${ok.length} 条通过审核的知识点`);

const bySubject = {};
for (const item of ok) {
  if (!SUBJECTS[item.subject]) { console.warn(`未知学科：${item.subject}`); continue; }
  (bySubject[item.subject] ||= []).push(item);
}

let total = 0;
for (const [subject, items] of Object.entries(bySubject)) {
  const file = join(KNOWLEDGE_DIR, `${subject}.ts`);
  const content = readFileSync(file, 'utf8');
  // 定位数组末尾：最后一个 } 后的 ];
  const endIdx = content.lastIndexOf('];');
  if (endIdx < 0) { console.error(`未找到 ]; 结束符：${subject}`); continue; }
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  // 最后一个对象末尾的 } 已经存在，直接在其后追加新对象（以逗号分隔）
  const lastBrace = before.lastIndexOf('}');
  const insertPos = lastBrace + 1;
  const newItems = items.map(it => `,\n${toTSObject(it)}`).join('\n');
  const merged = before.slice(0, insertPos) + newItems + before.slice(insertPos) + after;
  writeFileSync(file, merged);
  console.log(`✓ ${subject}.ts：追加 ${items.length} 个知识点`);
  total += items.length;
}
console.log(`\n=== 合并完成：共 ${total} 个新知识点 ===`);
