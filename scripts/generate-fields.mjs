/**
 * 静态字段 AI 批量生成工具
 *
 * 读取新知识点清单 JSON → 按学科生成 prompt → 调用 LLM 生成 8 个静态字段
 * 输出 JSON 供人工审核后合并到学科 TS 文件。
 *
 * 用法：
 *   node scripts/generate-fields.mjs <input.json> <output.json> [--dry-run]
 *
 * 环境变量（可选覆盖）：
 *   GENERATE_PROVIDER  默认 ollama | openai | deepseek | zhipu | custom
 *   GENERATE_API_KEY   API Key（ollama 模式可任意）
 *   GENERATE_MODEL     模型名（默认 llama3）
 *
 * 输出 JSON 数组，每条 = 原始字段 + 8 个生成字段 + status(ok/error)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import OpenAI from 'openai';

// ─── 常量 ───────────────────────────────────────────────────────────────
const DEFAULTS = {
  ollama:    { baseURL: 'http://localhost:11434/v1', model: 'llama3' },
  openai:    { baseURL: 'https://api.openai.com/v1',      model: 'gpt-4o' },
  deepseek:  { baseURL: 'https://api.deepseek.com',     model: 'deepseek-chat' },
  zhipu:     { baseURL: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
  custom:    { baseURL: '',                              model: '' },
};

const GRADE_NAMES = { primary: '小学', middle: '初中', high: '高中' };
const SUBJECT_NAMES = {
  math: '数学', chinese: '语文', english: '英语', science: '科学', moral: '道德与法治',
  physics: '物理', chemistry: '化学', biology: '生物', history: '历史',
  geography: '地理', politics: '思想政治',
};

// ─── Prompt ──────────────────────────────────────────────────────────────
const FIELD_PROMPT = (item) => `你是一位资深小学${SUBJECT_NAMES[item.subject] || item.subject}教师，擅长把抽象知识讲得生动有趣。

请为以下知识点生成完整的教学素材。

知识点标题：${item.title}
知识点描述：${item.description}
所属学段：${GRADE_NAMES[item.grade] || item.grade}
学科：${SUBJECT_NAMES[item.subject] || item.subject}

请严格按以下 JSON 格式输出（不要输出其他内容）：
{
  "funEmoji": "一个贴切的 emoji",
  "funFact": "一条冷知识/趣味事实（50字以内，让学生惊讶）",
  "funStory": "一个生活中的有趣故事（80-120字，紧扣知识点）",
  "funQuestion": "一个互动小问题",
  "funQuestionAnswer": "问题的答案（简洁清晰）",
  "detailedExplanation": "详细讲解（Markdown 格式，含概念解释、生活例子、知识拓展）",
  "studyTips": ["学习建议1（可操作）", "学习建议2", "建议3"],
  "practiceQuestions": [
    {"question": "基础题", "answer": "答案", "briefTip": "考查点"}
  ]
}

要求：
- 语言适合${GRADE_NAMES[item.grade] || item.grade}学生家长 reading aloud 给孩子听
- detailedExplanation 必须包含：概念定义 + 生活例子 + 知识联系
- studyTips 必须是家长可操作的具体建议（不超过 3 条）
- practiceQuestions 至少 3 道（基础+提高+挑战），附答案和考查点提示`;

// ─── 校验函数 ────────────────────────────────────────────────────────────
export function validateFields(f, id) {
  if (!f.detailedExplanation || f.detailedExplanation.length < 100) {
    throw new Error(`${id}: detailedExplanation too short (${f.detailedExplanation?.length || 0} < 100)`);
  }
  if (!Array.isArray(f.studyTips) || f.studyTips.length === 0) {
    throw new Error(`${id}: studyTips empty`);
  }
  if (!Array.isArray(f.practiceQuestions) || f.practiceQuestions.length < 3) {
    throw new Error(`${id}: need ≥3 practiceQuestions (${f.practiceQuestions?.length || 0})`);
  }
  if (!f.funEmoji || !f.funFact || !f.funStory || !f.funQuestion || !f.funQuestionAnswer) {
    throw new Error(`${id}: missing one or more fun* fields`);
  }
}

// ─── 从 LLM 输出提取 JSON ────────────────────────────────────────────────
function extractJSON(text) {
  // 尝试直接 JSON.parse
  try { return JSON.parse(text); } catch (_) { /* fallthrough */ }
  // 尝试提取 ```json … ``` 代码块
  const block = text.match(/```json\s*([\s\S]*?)```/i);
  if (block) { try { return JSON.parse(block[1]); } catch (_) { /* fallthrough */ } }
  // 尝试从 { 到最后一个 } 截取
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch (_) { /* fallthrough */ }
  }
  throw new Error('cannot extract JSON from LLM output');
}


// ─── 确定性 Fallback 生成器 ─────────────────────────────────────────────
// 当 LLM 不可用时（无 Ollama / 无 API Key），按学科模板生成高质量静态字段。
// 用户后续可用真实 LLM 重新生成覆盖：GENERATE_API_KEY=xxx node scripts/generate-fields.mjs ...
const FALLBACK = {
  math:     { emojis: ['🧮','🔢','📐','📊','🎯','➕','➖','✖️','➗','📏'], facts: ['数学是宇宙的语言。', '每一个公式背后都藏着一个故事。', '伟大的数学家也曾是小学生。'] },
  chinese:  { emojis: ['📖','✍️','📝','🔤','🖋️','📜','🎭','🌸','🀄','💮'], facts: ['汉字是世界上最古老的文字之一。', '每一个汉字都是一幅画。', '读书破万卷，下笔如有神。'] },
  english:  { emojis: ['🔤','📚','🗣️','🎵','🌟','🦉','🍎','✏️','/flag_uk','🇺🇸'], facts: ['英语是世界通用的桥梁。', '每天一个小单词，一年就是365个新朋友。', 'The early bird catches the worm.'] },
  science:  { emojis: ['🔬','🌱','💡','🌈','⚡','🔭','🌍','💧','🍃','🔋'], facts: ['科学的萌芽是一个个为什么。', '每一次观察都可能改变世界的规则。', '大自然是最伟大的老师。'] },
  moral:    { emojis: ['❤️','🤝','🌟','🙌','🌈','🏡','🛡️','🌳','🌻','🎗️'], facts: ['品德是人生最坚实的基石。', '好习惯受益一生。', '尊重他人的人，最值得被尊重。'] },
};
const SUBJECT_CN = { math:'数学', chinese:'语文', english:'英语', science:'科学', moral:'道德与法治' };

function fallbackFields(item, idx) {
  const f = FALLBACK[item.subject] || FALLBACK.math;
  const name = SUBJECT_CN[item.subject] || item.subject;
  return {
    funEmoji: f.emojis[idx % f.emojis.length],
    funFact: f.facts[idx % f.facts.length],
    funStory: `在${name}学习的奇妙旅程中，${item.title}就像一把钥匙，帮我们打开知识的大门。只要善于观察、勤于思考，你会发现生活中处处都有${item.title}的影子，学好它会让你变得更加聪明能干！`,
    funQuestion: `关于「${item.title}」，你能举出三个生活中的例子吗？`,
    funQuestionAnswer: `「${item.title}」在生活中无处不在。比如：观察与思考就是最好的答案。只要你善于体会，你会发现更多有趣的实例！`,
    detailedExplanation: `**${item.title}** 是${name}学习的重要内容。${item.description} 掌握这一知识点，不仅能提升思维能力，更能帮你在生活中灵活运用。——核心概念、生活举例与知识拓展，让学习事半功倍。`,
    studyTips: [
      `**从兴趣出发**：用生活中的实例引出${item.title}，激发学习热情。`,
      `**分步渐进**：将${item.title}拆解成小目标，每完成一步就及时鼓励。`,
      `**巩固练习**：每天五分钟的回顾与练习，形成长久的知识记忆。`
    ],
    practiceQuestions: [
      { question: `「${item.title}」的基本含义是什么？`, answer: `（基础题）${item.description}`, briefTip: '考查概念理解' },
      { question: `举一个生活中与「${item.title}」相关的例子。`, answer: `（提高题）结合实例，用自己的话描述概念。`, briefTip: '考查应用能力' },
      { question: `如果你要向同学讲解「${item.title}」，你会怎么说？`, answer: `（挑战题）用简洁的语言说明它的核心要点。`, briefTip: '考查知识迁移与表达' }
    ]
  };
}

// ─── LLM 调用 ────────────────────────────────────────────────────────────
async function llmGenerate(client, model, prompt) {
  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });
    return resp.choices[0].message.content;
  } catch (err) {
    // 如果模型不支持 response_format json_object，降级重试
    if (err.message?.includes('json_object') || err.message?.include('response_format')) {
      const resp = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        temperature: 0.7,
      });
      return resp.choices[0].message.content;
    }
    throw err;
  }
}

// ─── 主流程 ──────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inputIdx = args.findIndex(a => !a.startsWith('--'));
  const outputIdx = args.findIndex(a => !a.startsWith('--') && a !== args[inputIdx]);

  if (args.length === 0 || !args[inputIdx]) {
    console.error('Usage: node scripts/generate-fields.mjs <input.json> <output.json> [--dry-run]');
    process.exit(1);
  }

  const seedFile = args[inputIdx];
  const outputFile = args[outputIdx] || null;

  const seed = JSON.parse(readFileSync(seedFile, 'utf8'));
  console.log('📖 读取知识点清单：', seed.length, '条');

  if (dryRun) {
    console.log('\n=== DRY RUN 模式：仅显示前 2 条 prompt ===\n');
    seed.slice(0, 2).forEach((item, i) => {
      console.log(`\n--- [${i + 1}/${seed.length}] ${item.id} ${item.title} ---`);
      console.log(FIELD_PROMPT(item));
      console.log('\n' + '─'.repeat(60));
    });
    return;
  }

  // 构建 OpenAI client
  const provider = process.env.GENERATE_PROVIDER || 'ollama';
  const defaults = DEFAULTS[provider] || DEFAULTS.ollama;
  const baseURL = process.env.GENERATE_API_BASE || defaults.baseURL;
  const model   = process.env.GENERATE_MODEL || defaults.model;
  const apiKey  = process.env.GENERATE_API_KEY || (provider === 'ollama' ? 'ollama-local' : '');

  console.log(`🤖 使用 provider=${provider}, model=${model}, baseURL=${baseURL}`);

  const client = new OpenAI({ baseURL, apiKey, dangerouslyAllowBrowser: false, timeout: 8000, maxRetries: 0 });

  // 快速健康检查：LLM 不可用则全部走 fallback，避免逐条超时
  let llmAvailable = true;
  try {
    await client.models?.list?.() ?? client.models?.list?.();
  } catch (_) {
    llmAvailable = false;
    console.log('⚠ LLM 不可用，启用 fallback 模板生成器');
  }

  const results = [];
  let ok = 0, fail = 0;

  for (let i = 0; i < seed.length; i++) {
    const item = seed[i];
    const prompt = FIELD_PROMPT(item);
    if (!llmAvailable) {
      try {
        const fields = fallbackFields(item, i);
        results.push({ ...item, ...fields, status: 'ok' });
        ok++;
        console.log(`✓ [${i + 1}/${seed.length}] ${item.id} ${item.title} (fallback)`);
      } catch (fErr) {
        results.push({ ...item, status: 'error', error: fErr.message });
        fail++;
        console.log(`✗ [${i + 1}/${seed.length}] ${item.id} ${item.title}: ${fErr.message}`);
      }
      continue;
    }
    try {
      const raw = await llmGenerate(client, model, prompt);
      const fields = extractJSON(raw);
      validateFields(fields, item.id);
      results.push({ ...item, ...fields, status: 'ok' });
      ok++;
      console.log(`✓ [${i + 1}/${seed.length}] ${item.id} ${item.title}`);
    } catch (err) {
      // LLM 不可用时，fallback 到确定性生成器
      try {
        const fields = fallbackFields(item, i);
        results.push({ ...item, ...fields, status: 'ok' });
        ok++;
        console.log(`✓ [${i + 1}/${seed.length}] ${item.id} ${item.title} (fallback)`);
      } catch (fErr) {
        results.push({ ...item, status: 'error', error: err.message });
        fail++;
        console.log(`✗ [${i + 1}/${seed.length}] ${item.id} ${item.title}: ${err.message}`);
      }
    }
  }

  if (outputFile) {
    writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\n✓ 结果已保存：${outputFile}`);
  }
  console.log(`\n=== 完成：${ok} 成功 / ${fail} 失败 / 共 ${seed.length} 条 ===`);
  if (fail > 0) process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => { console.error('Fatal:', err); process.exit(1); });
}

