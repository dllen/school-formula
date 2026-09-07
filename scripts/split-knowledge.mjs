/**
 * 知识点文件拆分 + ID 迁移脚本
 *
 * 功能：
 * 1. 从 src/data/knowledge/<grade>.ts 纯文本中按学科提取知识点对象
 * 2. 升级 ID：p-math-1 → p-math-001（数字部分补零至 3 位）
 * 3. 生成 src/data/knowledge/<grade>/<subject>.ts（每学科一个文件）
 * 4. 重写 <grade>.ts 为 re-export 兼容层
 * 5. 迁移 src/data/questions/*.ts 中的 knowledgePointIds 引用
 * 6. 输出 scripts/id-mapping.json（旧 ID → 新 ID）
 *
 * 用法：node scripts/split-knowledge.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const knowledgeDir = resolve(projectRoot, 'src', 'data', 'knowledge');
const questionsDir = resolve(projectRoot, 'src', 'data', 'questions');
const mappingFile = resolve(__dirname, 'id-mapping.json');

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
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
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

/**
 * 从学段文件文本中提取所有 { ... } 顶层对象（subjects 数组元素）。
 * 返回 [{ objText, name, id }]
 */
function extractSubjectObjects(text) {
  const subjectsIdx = text.indexOf('subjects:');
  if (subjectsIdx < 0) return [];
  const arrStart = text.indexOf('[', subjectsIdx);
  if (arrStart < 0) return [];
  const arrEnd = matchBracket(text, arrStart);
  const listText = text.slice(arrStart + 1, arrEnd - 1);

  const objects = [];
  let pos = 0;
  while (pos < listText.length) {
    const objStart = listText.indexOf('{', pos);
    if (objStart < 0) break;
    const objEnd = matchBracket(listText, objStart);
    const objText = listText.slice(objStart, objEnd);
    const name = getFieldString(objText, 'name');
    const id = getFieldString(objText, 'id');
    objects.push({ objText, name, id });
    pos = objEnd;
  }
  return objects;
}

/**
 * 从 subject 对象文本中提取所有顶层 { id: ... } 知识点对象文本。
 * 只导出含 title 字段的对象（排除嵌套的 practiceQuestions 等）。
 */
function extractKpEntries(subjectText) {
  const kpIdx = subjectText.indexOf('knowledgePoints:');
  if (kpIdx < 0) return [];
  const arrStartN = subjectText.indexOf('[', kpIdx);
  if (arrStartN < 0) return [];
  const arrEndN = matchBracket(subjectText, arrStartN);
  const kpText = subjectText.slice(arrStartN, arrEndN);

  // 逐个扫描顶层 { … } 对象
  const entries = [];
  let pos = 0;
  while (pos < kpText.length) {
    const objStart = kpText.indexOf('{', pos);
    if (objStart < 0) break;
    const objEnd = matchBracket(kpText, objStart);
    const objText = kpText.slice(objStart, objEnd);
    if (/\btitle\s*:/.test(objText)) {
      const id = getFieldString(objText, 'id');
      entries.push({ id, objText });
    }
    pos = objEnd;
  }
  return entries;
}

/**
 * 知识点 ID 升级：p-math-1 → p-math-001, m-math-10 → m-math-010, h-bio-100 → h-bio-100
 * 规则：提取数字部分，补零至 3 位。
 */
function upgradeId(oldId) {
  const m = oldId.match(/^([a-z]+-[a-z]+)-(\d+)$/);
  if (!m) return oldId; // 不匹配则原样返回
  const [, prefix, num] = m;
  const padded = num.padStart(3, '0');
  return `${prefix}-${padded}`;
}

/**
 * 将学段数据写入拆分文件 + 生成 re-export 兼容层
 */
function processGrade(grade, cfg) {
  const file = resolve(knowledgeDir, cfg.file);
  const text = readFileSync(file, 'utf8');

  const subjects = extractSubjectObjects(text);
  console.log(`\n${grade}: 找到 ${subjects.length} 个 subject`);

  const idMapping = {};
  const gradeDir = resolve(knowledgeDir, grade);
  mkdirSync(gradeDir, { recursive: true });

  // 学科名 → 导出变量名映射（用于兼容层 import）
  const subjectVarNames = {};

  for (const subject of subjects) {
    if (!subject.id || !subject.name) {
      console.warn(`  ⚠️  跳过无效 subject: ${JSON.stringify(subject)}`);
      continue;
    }

    // 从 subject.id 提取学科英文 id（如 'math-primary' → 'math'）
    const subjectKey = subject.id.replace(`-${grade}`, '');
    if (!cfg.subjects.includes(subjectKey)) {
      console.warn(`  ⚠️  跳过未在配置中的 subject: ${subject.id} (key=${subjectKey})`);
      continue;
    }

    const entries = extractKpEntries(subject.objText);
    console.log(`  ${subject.id} (${subject.name}): ${entries.length} 条知识点`);

    // 生成学科数据文件内容
    const subjectFileName = `${subjectKey}.ts`;
    const subjectFilePath = resolve(gradeDir, subjectFileName);

    // 收集该学科所有知识点对象文本（原样保留格式）
    const kpTexts = [];
    for (const entry of entries) {
      const newId = upgradeId(entry.id);
      idMapping[entry.id] = newId;

      // 将对象文本中的旧 ID 替换为新 ID
      // 只替换 id: 'xxx' 这个字段值
      const newObjText = entry.objText.replace(
        new RegExp(`(id:\\s*')${entry.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`),
        `$1${newId}'`,
      );
      kpTexts.push(newObjText);
    }

    const fileContent = `import type { KnowledgePoint } from '../../types';

export const ${subjectKey}: KnowledgePoint[] = [
${kpTexts.join(',\n')}
];
`;
    writeFileSync(subjectFilePath, fileContent, 'utf8');

    // 学科变量名（与学科英文 id 相同，如 math, chinese）
    subjectVarNames[subject.id] = subjectKey;
  }

  // 写 re-export 兼容层（保留原 GradeData 结构）
  const compatContent = generateCompatLayer(grade, cfg, subjects, subjectVarNames);
  writeFileSync(file, compatContent, 'utf8');

  // 迁移 questions 中的 knowledgePointIds
  migrateQuestions(idMapping);

  return idMapping;
}

/**
 * 生成 re-export 兼容层：保留原始 GradeData 结构，数据来自拆分文件。
 */
function generateCompatLayer(grade, cfg, subjects, subjectVarNames) {
  // 提取原始 GradeData 中的顶层字段（id, name）
  // 这里我们保持兼容层只重新组装 subjects 数组
  const gradeName = grade.charAt(0).toUpperCase() + grade.slice(1);
  const varName = `${grade}Data`;

  // 按原始 subjects 顺序生成引用
  const subjectRefs = [];
  for (const subject of subjects) {
    const subjectKey = subject.id.replace(`-${grade}`, '');
    if (!cfg.subjects.includes(subjectKey)) continue;
    subjectRefs.push({ subject, subjectKey, varName: subjectVarNames[subject.id] || subjectKey });
  }

  // 生成 import 语句
  const imports = subjectRefs.map(({ subjectKey, varName }) =>
    `import { ${varName} } from './${grade}/${subjectKey}';`
  ).join('\n');

  // 生成 subjects 数组 - 每个学科保留原始字段（id, name, icon），knowledgePoints 引用拆分文件
  const subjectsArr = subjectRefs.map(({ subject, subjectKey }) => {
    // 提取 icon 字段
    const iconMatch = subject.objText.match(/\bicon\s*:\s*'([^']*)'/);
    const icon = iconMatch ? iconMatch[1] : '📚';
    return `    {
      id: '${subject.id}',
      name: '${subject.name}',
      icon: '${icon}',
      knowledgePoints: ${subjectKey},
    },`;
  }).join('\n');

  return `import type { GradeData } from '../types';

${imports}

/**
 * ${gradeName} 学段数据（re-export 兼容层）
 * 实际知识点数据已拆分至 ./${grade}/ 目录下的学科文件。
 * 此文件保留原始 GradeData 结构供下游消费者使用。
 */
export const ${varName}: GradeData = {
  id: '${grade}',
  name: '${cfg.name}',
  subjects: [
${subjectsArr}
  ],
};
`;
}

/**
 * 迁移 questions 文件中的 knowledgePointIds
 */
function migrateQuestions(idMapping) {
  const files = readdirSync(questionsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');

  for (const file of files) {
    const filePath = resolve(questionsDir, file);
    let content = readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldId, newId] of Object.entries(idMapping)) {
      // 替换 knowledgePointIds 数组中的旧 ID
      // 匹配 'oldId' → 'newId'
      const escapedOldId = oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`'${escapedOldId}'`, 'g');
      if (re.test(content)) {
        content = content.replace(re, `'${newId}'`);
        changed = true;
      }
    }

    if (changed) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ 迁移 questions/${file}`);
    }
  }
}

function main() {
  const allMapping = {};

  for (const [grade, cfg] of Object.entries(GRADES)) {
    const mapping = processGrade(grade, cfg);
    Object.assign(allMapping, mapping);
  }

  writeFileSync(mappingFile, JSON.stringify(allMapping, null, 2) + '\n', 'utf8');
  console.log(`\n共迁移 ${Object.keys(allMapping).length} 个知识点 ID → scripts/id-mapping.json`);
}

// 仅在本文件直接运行时执行
const invokedAsMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedAsMain) {
  main();
}
