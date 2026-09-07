/**
 * 知识点种子数据导出工具（v2：适配扁平 KnowledgePoint[] 学科文件结构）
 *
 * 学科文件格式：export const math: KnowledgePoint[] = [ { id, title, description, ... }, ... ]
 * 学段兼容层（primary.ts/middle.ts/high.ts）将其包装为 Subject 结构。
 *
 * 输出：scripts/knowledge-seed.json（扁平数组，每条含 id/title/description/grade/gradeName/subject/subjectName）
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const GRADES = {
  primary: { name: '小学', subjects: ['math', 'chinese', 'english', 'science', 'moral'] },
  middle: { name: '初中', subjects: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'history', 'geography', 'moral'] },
  high: { name: '高中', subjects: ['math', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography'] },
};
const SUBJECT_NAMES = {
  math: '数学', chinese: '语文', english: '英语', science: '科学', moral: '道德与法治',
  physics: '物理', chemistry: '化学', biology: '生物', history: '历史', geography: '地理', politics: '思想政治',
};

/** 括号配平：返回与 text[from] 处开括号匹配的闭括号下标 + 1 */
export function matchBracket(text, startIndex = 0) {
  const open = text[startIndex];
  const close = { '[': ']', '{': '}', '(': ')' }[open];
  if (!close) throw new Error(`text[${startIndex}] is not an opening bracket`);
  let depth = 0, inString = false, stringChar = '', escaped = false;
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (inString) {
      if (ch === '\\') { escaped = true; continue; }
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
    if (ch === open) { depth++; continue; }
    if (ch === close && --depth === 0) return i + 1;
  }
  throw new Error(`not matched at ${startIndex}`);
}

/** 从纯文本中抓取 `field: '...'` 或 `field: "..."` 的字符串值 */
function getFieldString(text, field) {
  const re = new RegExp(`\\b${field}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1`);
  const m = text.match(re);
  return m ? m[2] : '';
}

/** 从单个学科文件中提取知识点（export const xxx: KnowledgePoint[] = [...]） */
function extractFromFile(filePath, grade, subject) {
  const subjectNname = SUBJECT_NAMES[subject];
  const text = readFileSync(filePath, 'utf8');

  // 匹配导出数组：export const <name>: KnowledgePoint[] = [
  const exportMatch = text.match(/export\s+const\s+\w+\s*:\s*KnowledgePoint\[\]\s*=\s*\[/);
  if (!exportMatch) throw new Error(`KnowledgePoint[] export not found in ${filePath}`);
  const arrStart = exportMatch.index + exportMatch[0].length - 1;
  const arrEnd = matchBracket(text, arrStart);
  const arrText = text.slice(arrStart + 1, arrEnd - 1);

  // 逐对象提取：{id: '...', ...}
  const entries = [];
  const re = /\{\s*id\s*:/g;
  let m;
  while ((m = re.exec(arrText)) !== null) {
    const startIdx = m.index;
    const endIdx = matchBracket(arrText, startIdx);
    const objText = arrText.slice(startIdx, endIdx);
    entries.push({
      id: getFieldString(objText, 'id'),
      title: getFieldString(objText, 'title'),
      description: getFieldString(objText, 'description'),
      grade,
      gradeName: GRADES[grade].name,
      subject,
      subjectName: subjectNname,
    });
  }
  return entries;
}

const seed = [];
for (const [grade, cfg] of Object.entries(GRADES)) {
  for (const subject of cfg.subjects) {
    const filePath = `src/data/knowledge/${grade}/${subject}.ts`;
    try {
      const entries = extractFromFile(filePath, grade, subject);
      seed.push(...entries);
      console.log(`  ${grade}/${subject}: ${entries.length} 条`);
    } catch (err) {
      console.warn(`  skip ${filePath}: ${err.message}`);
    }
  }
}

const outPath = resolve(__dirname, 'knowledge-seed.json');
writeFileSync(outPath, JSON.stringify(seed, null, 2) + '\n', 'utf8');
console.log(`\n共导出 ${seed.length} 条知识点 → ${outPath}`);
