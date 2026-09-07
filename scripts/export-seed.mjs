/**
 * 知识点种子数据导出工具
 *
 * 从 src/data/knowledge/<grade>.ts 纯文本中提取知识点清单，
 * 使用括号配平（matchBracket）定位 knowledgePoints 数组及知识点对象，
 * 无需编译 TypeScript 即可运行。
 *
 * 输出：scripts/knowledge-seed.json（扁平数组，每条含 id/title/description/grade/gradeName/subject/subjectName）
 *
 * 用法：node scripts/export-seed.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const knowledgeDir = resolve(projectRoot, 'src', 'data', 'knowledge');
const outputFile = resolve(__dirname, 'knowledge-seed.json');

// 学段 → 学科英文 id 列表
const GRADES = {
  primary: {
    file: 'primary.ts',
    name: '小学',
    subjects: ['math', 'chinese', 'english', 'science', 'moral'],
  },
  middle: {
    file: 'middle.ts',
    name: '初中',
    subjects: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'history', 'geography', 'moral'],
  },
  high: {
    file: 'high.ts',
    name: '高中',
    subjects: ['math', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography'],
  },
};

// 学科英文 id → 中文名
const SUBJECT_NAMES = {
  math: '数学',
  chinese: '语文',
  english: '英语',
  science: '科学',
  moral: '道德与法治',
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  history: '历史',
  geography: '地理',
  politics: '思想政治',
};

const BRACKET_PAIRS = { '[': ']', '{': '}', '(': ')' };

/**
 * 括号配平：返回与 text[startIndex] 处开括号相匹配的闭括号索引 + 1。
 * 支持 [] {} ()，字符串内容（"…" / '…'，含 \" 转义）不参与配平。
 * 未闭合时抛出包含 "not matched" 的 Error。
 */
export function matchBracket(text, startIndex = 0) {
  const open = text[startIndex];
  const close = BRACKET_PAIRS[open];
  if (!close) {
    throw new Error(
      `matchBracket: text[${startIndex}] is not an opening bracket (got '${open ?? 'undefined'}')`,
    );
  }
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (inString) {
      if (ch === '\\') { escaped = true; continue; }
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = true; stringChar = ch; continue; }
    if (ch === open) { depth++; continue; }
    if (ch === close) {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  throw new Error(`No matching '${close}' for '${open}' at index ${startIndex}: not matched`);
}

/** 从纯文本对象中抓取 `field: '...'` 的字符串值 */
function getFieldString(text, field) {
  const re = new RegExp(`\\b${field}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`);
  const m = text.match(re);
  if (!m) return '';
  return m[1].replace(/\\'/g, "'");
}

/** 从 knowledgePoints 数组文本中提取所有顶层知识点对象的 id/title/description */
function extractKpEntries(kpArrayText) {
  const entries = [];
  const re = /\{\s*id\s*:/g;
  let m;
  while ((m = re.exec(kpArrayText)) !== null) {
    // 仅匹配知识点对象：对象内部必须还有 title 字段（排除 practiceQuestions 之类的嵌套对象判断交给顶层 { id: ... 验证）
    const startIdx = m.index;
    const endIdx = matchBracket(kpArrayText, startIdx);
    const objText = kpArrayText.slice(startIdx, endIdx);
    if (/\btitle\s*:/.test(objText)) {
      entries.push({
        id: getFieldString(objText, 'id'),
        title: getFieldString(objText, 'title'),
        description: getFieldString(objText, 'description'),
      });
    }
  }
  return entries;
}

/**
 * 在某个学段数据文件文本中，按学科中文名定位对应 subject，
 * 返回该学科下所有知识点的 { id, title, description }。
 */
function extractSubjectEntries(text, subjectName) {
  const subjectsIdx = text.indexOf('subjects:');
  if (subjectsIdx < 0) return [];
  const arrStart = text.indexOf('[', subjectsIdx);
  if (arrStart < 0) return [];
  const arrEnd = matchBracket(text, arrStart);
  const listText = text.slice(arrStart + 1, arrEnd - 1);

  // 顺序扫描顶层 { … } 对象（matchBracket 会正确处理嵌套花括号与字符串）
  let pos = 0;
  while (pos < listText.length) {
    const objStart = listText.indexOf('{', pos);
    if (objStart < 0) break;
    const objEnd = matchBracket(listText, objStart);
    const objText = listText.slice(objStart, objEnd);
    const name = getFieldString(objText, 'name');

    if (name === subjectName) {
      const kpIdx = objText.indexOf('knowledgePoints:');
      if (kpIdx >= 0) {
        const kpArrStartN = objText.indexOf('[', kpIdx);
        const kpArrEndN = matchBracket(objText, kpArrStartN);
        const kpArrStart = objText.indexOf('[', kpIdx);
        const kpArrEnd = matchBracket(objText, kpArrStart);
        const kpText = objText.slice(kpArrStart, kpArrEnd);
        return extractKpEntries(kpText);
      }
      return [];
    }
    pos = objEnd;
  }
  return [];
}

function main() {
  const seed = [];

  for (const [grade, cfg] of Object.entries(GRADES)) {
    const file = resolve(knowledgeDir, cfg.file);
    const text = readFileSync(file, 'utf8');

    for (const subject of cfg.subjects) {
      const subjectName = SUBJECT_NAMES[subject];
      const entries = extractSubjectEntries(text, subjectName);
      for (const e of entries) {
        seed.push({
          id: e.id,
          title: e.title,
          description: e.description,
          grade,
          gradeName: cfg.name,
          subject,
          subjectName,
        });
      }
      console.log(`${grade}/${subject} (${subjectName}): ${entries.length} 条`);
    }
  }

  writeFileSync(outputFile, JSON.stringify(seed, null, 2) + '\n', 'utf8');
  console.log(`\n共导出 ${seed.length} 条知识点 → scripts/knowledge-seed.json`);
}

// 仅在本文件直接运行时执行（被 import/测试引用时不产生副作用）
const invokedAsMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedAsMain) {
  main();
}
