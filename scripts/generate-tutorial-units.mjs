/**
 * 批量生成 TutorialUnit（Claude-native，直接输出 TypeScript 对象）
 *
 * 为初高中各年级各学科生成完整的 TutorialUnit 数据（教/学/练 + 10 题），
 * 写入 src/data/tutorials/ 目录，与现有 primary-*.ts 同级。
 *
 * 用法：
 *   node scripts/generate-tutorial-units.mjs --level middle --subject math --grade 7
 *   node scripts/generate-tutorial-units.mjs --level middle --subject math --dry-run --limit 2
 *   node scripts/generate-tutorial-units.mjs --level high --subject physics --force
 *
 * 依赖：ANTHROPIC_API_KEY 环境变量（使用 claude-sonnet-4-20250514）
 * 断点续传：已存在的 unit id 自动跳过（除非 --force）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TUTORIALS_DIR = join(ROOT, 'src/data/tutorials');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.TUTORIAL_MODEL || 'claude-sonnet-4-20250514';

// ─── Prompt 模板 ───────────────────────────────────────────────
const SYSTEM_PROMPT = `你是一位资深中国中学教师，擅长为家庭辅导场景设计完整的单课教程。

你的输出必须是**严格合法的 TypeScript 对象字面量**（不是 JSON，是 TS），符合以下 TutorialUnit 接口：

interface TutorialUnit {
  id: string;          // 格式：{level}-{subject}-{grade}-u{order}，如 m-math-7-u1
  title: string;       // 单元标题，20 字以内
  order: number;       // 从 1 开始的序号
  duration: string;    // 如 "约 45 分钟"
  objectives: string[]; // 3-5 条学习目标
  teach: {
    hook: string;      // 故事/场景引入，200-400 字
    summary: string;   // 本课概览，100-200 字
  };
  learn: {
    sections: { title: string; content: string; diagrams?: {type:'mermaid'|'svg';content:string;caption?:string}[]; examples?: {title:string;problem:string;solution:string;tip:string}[] }[];
    tips: string[];    // 2-4 条学习提示
  };
  practice: { id: string; type: 'choice'|'fill'|'truefalse'|'solve'; question: string; options?: string[]; answer: string|string[]; explanation: string; difficulty: 'easy'|'medium'|'hard' }[];  // 固定 10 题
  aiContext: string;   // 给 LLM 的生成上下文（留空字符串即可）
}

【输出规则】
1. 只输出一个 TypeScript 对象字面量，前后不要任何解释、不要 markdown 代码 fences。
2. 字符串用双引号，内部双引号用 \\" 转义；需要反引号的地方用模板字面量。
3. practice 必须恰好 10 题，覆盖 easy/medium/hard，题型多样。
4. 所有题目答案必须**事实正确**——数学/物理/化学计算请验算，历史/地理请核对年代与事实。
5. 语言风格遵循：初中准确平实、有探究感；高中精确严谨、体现学科思维。`;

const USER_PROMPT_TEMPLATE = `请为以下 {levelName} {subjectName} 知识点生成 1 个完整的 TutorialUnit。

知识点信息：
- 标题：{title}
- 描述：{description}
- 详细说明：{detailedExplanation}
- 学习提示：{studyTips}
- 参考例题：{practiceQuestions}

要求：
- id 使用 {unitId}
- order 为 {order}
- 单元标题要具体、有吸引力（如"二次函数的最值问题"而非"二次函数"）
- 输出严格合法的 TypeScript 对象字面量。`;

// ─── 学科/年级配置 ────────────────────────────────────────────
const LEVEL_CONFIG = {
  middle: {
    name: '初中',
    grades: { chinese: '7', math: '7', english: '7', physics: '8', chemistry: '9', biology: '7', history: '7', geography: '7', moral: '7' },
    subjects: ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'moral'],
    subjectNames: { chinese: '语文', math: '数学', english: '英语', physics: '物理', chemistry: '化学', biology: '生物', history: '历史', geography: '地理', moral: '道德与法治' },
  },
  high: {
    name: '高中',
    grades: { chinese: '10', math: '10', physics: '10', chemistry: '10', biology: '10', history: '10', geography: '10', politics: '10' },
    subjects: ['chinese', 'math', 'physics', 'chemistry', 'biology', 'history', 'geography', 'politics'],
    subjectNames: { chinese: '语文', math: '数学', physics: '物理', chemistry: '化学', biology: '生物', history: '历史', geography: '地理', politics: '思想政治' },
  },
};

// ─── Claude API 调用 ──────────────────────────────────────────
async function callClaude(system, user) {
  if (!ANTHROPIC_API_KEY) throw new Error('请设置 ANTHROPIC_API_KEY 环境变量');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 4096, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

// ─── 解析 TS 对象字面量（简易：用 Function 构造器） ───────────
function parseTsObject(tsSource) {
  // 去掉前后空白，用 new Function 求值（仅对象字面量，安全）
  const fn = new Function(`return (${tsSource})`);
  return fn();
}

// ─── 读取知识点元数据 ──────────────────────────────────────────
function loadKnowledgePoints(level, subject) {
  try {
    const file = join(ROOT, `src/data/knowledge/${level}/${subject}.ts`);
    const src = readFileSync(file, 'utf-8');
    // 简易解析：用正则提取每个 KP 对象（假设格式规整）
    const kps = [];
    const kpRegex = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']+)'/g;
    let m;
    while ((m = kpRegex.exec(src)) !== null) {
      kps.push({ id: m[1], title: m[2], description: m[3] });
    }
    return kps;
  } catch (e) {
    console.warn(`⚠ 无法读取 ${level}/${subject}: ${e.message}`);
    return [];
  }
}

// ─── CLI ───────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, force: false, limit: Infinity };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--level') opts.level = args[++i];
    else if (args[i] === '--subject') opts.subject = args[++i];
    else if (args[i] === '--grade') opts.grade = args[++i];
    else if (args[i] === '--dry-run') opts.dryRun = true;
    else if (args[i] === '--force') opts.force = true;
    else if (args[i] === '--limit') opts.limit = parseInt(args[++i], 10);
  }
  return opts;
}

// ─── 主流程 ────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();
  if (!opts.level || !opts.subject) {
    console.error('用法: node scripts/generate-tutorial-units.mjs --level middle|high --subject <subject> [--grade N] [--dry-run] [--limit N] [--force]');
    console.error('示例: node scripts/generate-tutorial-units.mjs --level middle --subject math --grade 7 --dry-run --limit 2');
    process.exit(1);
  }

  const config = LEVEL_CONFIG[opts.level];
  if (!config) throw new Error(`未知学段: ${opts.level}`);
  if (!config.subjects.includes(opts.subject)) throw new Error(`${opts.level} 不支持学科: ${opts.subject}`);

  const kps = loadKnowledgePoints(opts.level, opts.subject);
  if (kps.length === 0) {
    console.log(`⚠ ${opts.level}/${opts.subject} 无知识点，跳过`);
    return;
  }

  console.log(`\n📚 ${config.name}${config.subjectNames[opts.subject]}：${kps.length} 个知识点 → 生成 TutorialUnit`);

  const outFile = join(TUTORIALS_DIR, `${opts.level}-${opts.subject}.ts`);
  const existing = existsSync(outFile) ? readFileSync(outFile, 'utf-8') : '';
  const existingIds = new Set([...existing.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]));

  const units = [];
  const limit = Math.min(opts.limit, kps.length);
  for (let i = 0; i < limit; i++) {
    const kp = kps[i];
    const unitId = `${opts.level[0]}-${opts.subject}-${opts.grade || config.grades[opts.subject]}-u${i + 1}`;
    if (existingIds.has(unitId) && !opts.force) {
      console.log(`  ⏭ 跳过已存在: ${unitId}`);
      continue;
    }
    console.log(`  🔄 生成 [${i + 1}/${limit}]: ${kp.title} → ${unitId}`);
    if (opts.dryRun) { console.log(`    (dry-run)`); continue; }

    const user = USER_PROMPT_TEMPLATE
      .replaceAll('{levelName}', config.name)
      .replaceAll('{subjectName}', config.subjectNames[opts.subject])
      .replaceAll('{title}', kp.title)
      .replaceAll('{description}', kp.description)
      .replaceAll('{detailedExplanation}', '')
      .replaceAll('{studyTips}', '')
      .replaceAll('{practiceQuestions}', '')
      .replaceAll('{unitId}', unitId)
      .replaceAll('{order}', String(i + 1));

    try {
      const raw = await callClaude(SYSTEM_PROMPT, user);
      const obj = parseTsObject(raw);
      units.push(obj);
      existingIds.add(obj.id);
      console.log(`    ✅ ${obj.title}`);
    } catch (e) {
      console.error(`    ❌ 失败: ${e.message}`);
    }
  }

  if (!opts.dryRun && units.length > 0) {
    mkdirSync(TUTORIALS_DIR, { recursive: true });
    const header = `import type { Tutorial } from './types';\n\nexport const ${opts.level.toUpperCase()}_${opts.subject.toUpperCase()}_TUTORIALS: Tutorial[] = [\n`;
    const body = units.map((u) => `  ${JSON.stringify(u, null, 2).replace(/"([^"]+)":/g, '$1:')}`).join(',\n');
    writeFileSync(outFile, header + body + '\n];\n');
    console.log(`\n✅ 写入 ${outFile}（${units.length} 个单元）`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
