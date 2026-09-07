/**
 * 为知识点批量生成 tutorialContent（多 Provider）
 *
 * 用法：
 *   node scripts/generate-content.mjs --input scripts/knowledge-seed.json --outDir scripts/output-tutorials
 *   node scripts/generate-content.mjs --input ... --ranges '[{"grade":"primary","subject":"math"}]'
 *   node scripts/generate-content.mjs --input ... --dry-run --limit 2
 *   node scripts/generate-content.mjs --input ... --force
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProviderConfig, createClient, withRetry } from './provider-config.mjs';
import { renderTemplate } from './render-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const TUTORIAL_SYSTEM_PROMPT = `你是一位资深{{gradeName}}{{subjectName}}教师，擅长把抽象概念讲得通俗易懂。

请为以下知识点生成一节完整的家庭辅导教程。

知识点：{{title}}
描述：{{description}}

教程结构（严格按以下 5 节输出，使用 markdown）：

# 🎯 本课目标
（3-5 条学习目标，每条一句话，可衡量）

# 📖 知识讲解
（核心概念讲解，包含：1 个生活比喻 + 分步拆解 + 知识联系。{{lengthGuide}}）

# ✏️ 例题精讲
（2-3 道由易到难的例题，每道包含：题目、完整解答、思路点拨）

# 🧩 亲子互动
（1 个 5-10 分钟的亲子活动：准备材料、操作步骤、预期收获）

# 📝 课后练习
（3-5 道巩固题，从易到难，附答案和简要解析）

语言风格：{{styleGuide}}`;

const GRADE_STYLE = {
  primary: '语言生动活泼，多用比喻和故事，每段不超过 3 句话，适合 10 岁以下孩子',
  middle: '语言准确平实，逻辑清晰，步骤严谨，适合 12-15 岁青少年',
  high: '语言精确严谨，突出本质和推导，体现学科思维，适合 15-18 岁学生',
};
const GRADE_LENGTH = {
  primary: '总字数 600-800 字',
  middle: '总字数 800-1200 字',
  high: '总字数 1000-1500 字',
};

/** 年级专属模板查找表（同步自 src/data/prompts/{explain,interaction,generate}/{primary,middle,high}-level.ts） */
const GRADE_TEMPLATES = [
  { id: 'explain-primary-level', scenario: 'explain', gradeLevel: 'primary', subjects: ['数学', '语文', '英语', '科学', '道德与法治'] },
  { id: 'explain-middle-level', scenario: 'explain', gradeLevel: 'middle', subjects: ['数学', '语文', '英语', '物理', '化学', '生物'] },
  { id: 'explain-high-level', scenario: 'explain', gradeLevel: 'high', subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'] },
  { id: 'interaction-primary-level', scenario: 'interaction', gradeLevel: 'primary', subjects: ['数学', '语文', '英语', '科学', '道德与法治'] },
  { id: 'interaction-middle-level', scenario: 'interaction', gradeLevel: 'middle', subjects: ['数学', '语文', '英语', '物理', '化学', '生物'] },
  { id: 'interaction-high-level', scenario: 'interaction', gradeLevel: 'high', subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'] },
  { id: 'generate-primary-level', scenario: 'generate', gradeLevel: 'primary', subjects: ['数学', '语文', '英语', '科学', '道德与法治'] },
  { id: 'generate-middle-level', scenario: 'generate', gradeLevel: 'middle', subjects: ['数学', '语文', '英语', '物理', '化学', '生物'] },
  { id: 'generate-high-level', scenario: 'generate', gradeLevel: 'high', subjects: ['数学', '物理', '化学', '生物', '思想政治', '历史', '地理'] },
];

function selectBestTemplate(scenario, grade, subject) {
  const gradeMatch = GRADE_TEMPLATES.find(
    (t) => t.scenario === scenario && t.gradeLevel === grade && t.subjects.includes(subject),
  );
  if (gradeMatch) return gradeMatch;
  throw new Error(`no template found for ${scenario}/${grade}/${subject}`);
}

export function parseTutorialContent(md) {
  const sections = ['🎯 本课目标', '📖 知识讲解', '✏️ 例题精讲', '🧩 亲子互动', '📝 课后练习'];
  const parts = {};
  for (let i = 0; i < sections.length; i++) {
    const start = md.indexOf(sections[i]);
    const end = i + 1 < sections.length ? md.indexOf(sections[i + 1]) : md.length;
    parts[sections[i]] = start === -1 ? '' : md.slice(start + sections[i].length, end).trim();
  }
  const objectives = (parts['🎯 本课目标'] || '').split('\n').map((s) => s.replace(/^\d+\.\s*/, '').replace(/^#+\s*/, '').trim()).filter(Boolean);
  const explanation = parts['📖 知识讲解'] || '';
  const examples = [];
  const exText = parts['✏️ 例题精讲'] || '';
  const exBlocks = exText.split(/\n(?=\d+\.\s*\*?\*?题目)/).filter(Boolean);
  for (const block of exBlocks) {
    const titleMatch = block.match(/^\d+\.\s*\*?\*?(.+?)\*?\*?$/);
    const problem = (block.match(/题目[^：:]*[：:]\s*([\s\S]*?)(?=解答|$)/) || [, ''])[1].trim();
    const solution = (block.match(/解答[：:]\s*([\s\S]*?)(?=思路|$)/) || [, ''])[1].trim();
    const tip = (block.match(/思路[：:]\s*([\s\S]*)$/) || [, ''])[1].trim();
    if (titleMatch || problem || solution) {
      examples.push({ title: titleMatch?.[1]?.trim() || '', problem, solution, tip });
    }
  }
  const exercises = [];
  for (const line of (parts['📝 课后练习'] || '').split('\n').filter(Boolean)) {
    const q = (line.match(/(?:第\s*\d+\s*题|\d+\.)[：:]\s*(.+)/) || [, line])[1];
    exercises.push({ question: q, answer: '', explanation: '' });
  }
  return { objectives, explanation, examples, interaction: parts['🧩 亲子互动'] || '', exercises };
}

export function validateTutorialContent(tc, id) {
  const errors = [];
  if (tc.objectives.length < 2) errors.push('objectives < 2');
  if (tc.explanation.length < 200) errors.push('explanation < 200 chars');
  if (tc.examples.length < 1) errors.push('examples < 1');
  if (!tc.interaction || tc.interaction.length < 30) errors.push('interaction < 30 chars');
  if (errors.length) throw new Error(`${id}: ${errors.join(', ')}`);
}

function parseArgs(argv) {
  const args = { input: null, outDir: null, dryRun: false, limit: 0, force: false };
  for (let i = 2; i < argv.length; i++) {
    const raw = argv[i].replace(/^--/, '');
    const [k, v] = raw.split('=');
    if (v !== undefined) {
      // --key=value 模式
      if (k === 'input') args.input = v;
      if (k === 'outDir') args.outDir = v;
      if (k === 'ranges') args.ranges = JSON.parse(v);
      if (k === 'limit') args.limit = Number(v);
    } else {
      // --key value 模式（下一个 argv 是值）
      if (k === 'input') { args.input = argv[++i]; }
      else if (k === 'outDir') { args.outDir = argv[++i]; }
      else if (k === 'ranges') { args.ranges = JSON.parse(argv[++i]); }
      else if (k === 'limit') { args.limit = Number(argv[++i]); }
    }
    if (k === 'dry-run') args.dryRun = true;
    if (k === 'force') args.force = true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input || !args.outDir) {
    console.error('usage: generate-content.mjs --input <seed.json> --outDir <dir> [--ranges] [--dry-run] [--limit N] [--force]');
    process.exit(1);
  }
  const config = loadProviderConfig(process.env);
  const client = createClient(config);

  const raw = JSON.parse(readFileSync(resolve(ROOT, args.input), 'utf8'));
  let items = raw.items || raw;

  if (args.ranges?.length) {
    const set = new Set(args.ranges.map((r) => `${r.grade}:${r.subject}`));
    items = items.filter((it) => set.has(`${it.grade}:${it.subject}`));
  }
  if (args.limit > 0) items = items.slice(0, args.limit);

  mkdirSync(resolve(ROOT, args.outDir), { recursive: true });

  const outFile = join(__dirname, args.outDir, 'tutorials-all.json');
  let existing = {};
  if (existsSync(outFile)) {
    for (const row of JSON.parse(readFileSync(outFile, 'utf8'))) existing[row.id] = row;
  }

  let done = 0, failed = 0, skipped = 0;
  for (const item of items) {
    if (config.skipExisting && !args.force && existing[item.id]?.tutorialContent) { skipped++; continue; }

    selectBestTemplate('explain', item.grade, item.subjectName);
    const prompt = renderTemplate(TUTORIAL_SYSTEM_PROMPT, {
      gradeName: item.gradeName,
      subjectName: item.subjectName,
      title: item.title,
      description: item.description,
      lengthGuide: GRADE_LENGTH[item.grade],
      styleGuide: GRADE_STYLE[item.grade],
    });

    if (args.dryRun) {
      console.log(`\n--- ${item.id} ${item.title} ---`);
      console.log(prompt.slice(0, 800));
      continue;
    }

    try {
      const content = await withRetry(async () => {
        const resp = await client.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        });
        return resp.choices[0].message.content || '';
      }, config, item.id);

      const tutorialContent = parseTutorialContent(content);
      if (config.validateOutput) validateTutorialContent(tutorialContent, item.id);

      existing[item.id] = { id: item.id, grade: item.grade, subject: item.subject, title: item.title, tutorialContent, status: 'ok' };
      done++;
    } catch (err) {
      existing[item.id] = { id: item.id, grade: item.grade, subject: item.subject, title: item.title, status: 'error', error: err.message };
      failed++;
    }

    if ((done + failed) % 10 === 0) {
      writeFileSync(outFile, JSON.stringify(Object.values(existing), null, 2));
      console.log(`  progress: +${done} ok, ${failed} fail, ${skipped} skipped / total ${items.length}`);
    }
  }
  writeFileSync(outFile, JSON.stringify(Object.values(existing), null, 2));
  console.log(`✓ done: ${done} ok, ${failed} failed, ${skipped} skipped → ${outFile}`);
}

const invokedAsMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (invokedAsMain) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
