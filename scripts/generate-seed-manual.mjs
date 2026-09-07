/**
 * 从手工编写的知识点清单生成 knowledge-seed.json
 *
 * 用法：
 *   node scripts/generate-seed-manUAL.mjs --input scripts/knowledge-new-primary.json
 *   node scripts/generate-seed-manUAL.mjs --input scripts/knowledge-new-primary.json --output scripts/knowledge-seed-primary.json
 *
 * 输入 JSON 格式：[ { "id": "p-math-009", "title": "植树问题", "description": "...", "grade": "primary", "subject": "math" } ]
 * 输出格式与 export-seed.mjs 一致。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SUBJECT_NAMES = {
  math: '数学', chinese: '语文', english: '英语', science: '科学', moral: '道德与法治',
  physics: '物理', chemistry: '化学', biology: '生物', history: '历史', geography: '地理', politics: '思想政治',
};
const GRADE_NAMES = { primary: '小学', middle: '初中', high: '高中' };

function main() {
  const args = process.argv.slice(2);
  let input = null;
  let output = null;
  for (let i = 0; i < args.length; i++) {
    const [k, v] = args[i].replace(/^--/, '').split('=');
    if (k === 'input') input = v;
    if (k === 'output') output = v;
  }
  if (!input || !output) {
    console.error('usage: generate-seed-manUAL.mjs --input <json> --output <json>');
    process.exit(1);
  }
  const inputPath = resolve(ROOT, input);
  const outputPath = resolve(ROOT, output);
  const items = JSON.parse(readFileSync(inputPath, 'utf8'));
  const seed = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    grade: item.grade,
    gradeName: GRADE_NAMES[item.grade] || item.grade,
    subject: item.subject,
    subjectName: SUBJECT_NAMES[item.subject] || item.subject,
  }));
  writeFileSync(outputPath, JSON.stringify(seed, null, 2) + '\n', 'utf8');
  console.log(`✓ ${seed.length} items → ${outputPath}`);
}

const invokedAsMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (invokedAsMain) main();
