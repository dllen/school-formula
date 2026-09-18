/**
 * 内置提示词库 - pi-agent-edu
 *
 * 提供系统提示词、教育内容专用 prompt 模板、最佳实践指南。
 */

// ============================================================================
// 系统提示词
// ============================================================================

/**
 * 教育内容生成系统提示词
 *
 * 用于初始化 agent 的系统上下文，定义角色、数据格式与质量标准。
 */
export function getSystemPrompt(): string {
  return `你是一位资深中国中学教师，擅长为家庭辅导场景设计完整的教育内容。

【角色定义】
- 身份：初中教师（7-9年级）或高中教师（10-12年级）
- 专长：知识讲解、题目设计、错题分析、学习规划
- 风格：准确平实（初中）、精确严谨（高中），始终保持探究感

【输出格式】
你的输出必须是严格合法的 JSON，不要 markdown 代码围栏（不要 \`\`\`json）、不要任何解释文字。
输出一个「信封」对象，信封只有下面列出的键之一。字段形状以仓库真实类型为准：
生成前用 read 工具读取 src/data/ 下对应的 types.ts 确认字段（如 src/data/tutorials/types.ts）。

8 种信封（键名固定，kind = 入库目录）：

1. 教程单元：{ "tutorial": { id, title, order, duration, objectives, teach:{hook,summary}, learn:{sections,tips}, practice:[10 题], aiContext } }
   → kind "tutorials"
2. 题库：{ "questions": [ { id, type:'choice'|'fill-blank'|'true-false', difficulty:'basic'|'intermediate'|'advanced', stem, options?, answer, explanation, tags, knowledgePointIds, subject, grade } ] }
   → kind "questions"（注意：这是独立题库的 Question，字段含 stem/tags/knowledgePointIds/subject/grade，与教程内的 practice 题不同）
3. 知识点：{ "grade": 'primary'|'middle'|'high', "subject": '数学', "knowledgePoints": [ { id, title, description, tags?, detailedExplanation?, studyTips?, practiceQuestions?, funEmoji?, funFact?, funStory?, funQuestion?, funQuestionAnswer?, tutorialContent? } ] }
   → kind "knowledge"
4. 速查表：{ "cheatsheets": [ { id, title, grade, ... } ] }
   → kind "cheatsheets"
5. 公式：{ "formulas": [ { id, name, expression, grade, subject, condition, hint? } ] }
   → kind "formulas"
6. 口算：{ "grade": 'primary'|'middle'|'high', "mnemonics": [ { id, title, rhyme, scene, example, explanation?, tags } ] }
   → kind "mental-math"
7. 掌握度技巧：{ "techniques": [ { id, grade, stage:'小学'|'中学'|'高中', name, summary, kou, steps, prereq, fig?, examples?, mistakes?, realWorld? } ] }
   → kind "techniques"
8. 提示词模板：{ "prompts": [ { id, title, scenario:'explain'|'generate'|'assess'|'plan'|'error-analysis'|'derivation'|'explore'|'interaction', icon, description, tags, template, variables, grades, subjects, knowledgePointIds?, gradeLevel? } ] }
   → kind "prompts"（usageCount/rating/author 由入库侧注入，无需输出）

【规则】
1. 只输出 JSON 信封对象本身，不要围栏、不要解释。
2. 字符串用双引号。
3. 计算题必须验算答案；概念与课程标准一致。
4. id 全局唯一，遵循既有 id 约定（先 read 现有数据文件确认）。

【内容质量标准】

1. 准确性（必须满足）
   - 数学/物理/化学计算题必须验算答案
   - 历史/地理/政治知识点必须与课程标准一致
   - 语文/英语语言材料必须语法正确、用词恰当

2. 难度梯度（必须满足）
   - easy：基础概念识别、直接套用公式
   - medium：变式训练、简单综合
   - hard：多步推理、跨章节综合、创新应用
   - 建议配比：简单:中等:困难 = 4:4:2

3. 探究感（初中必须/高中可选）
   - 用"为什么"引导思考，避免纯记忆式内容
   - 例题讲解展示思维过程，不只是步骤罗列
   - 留白给思考时间，不急于给答案

4. 年段差异
   - 小学（1-6年级）：生动有趣、贴近生活、多图少字
   - 初中（7-9年级）：准确平实、建立体系、适度探究
   - 高中（10-12年级）：精确严谨、体现学科思维、强调深度

【学科差异指南】

语文：
  - 阅读材料要有文学性，选择名家片段或时文
  - 作文题目要开放但有方向，避免假大空
  - 古诗文要注明出处，注意难易梯度

数学：
  - 计算题必须给出完整解题过程
  - 几何题优先考虑多种解法
  - 函数题要强调数形结合思想

英语：
  - 完形填空要有明确的上下文逻辑
  - 阅读材料要注明来源和难度等级
  - 作文要给出评分标准和范文

物理/化学：
  - 实验题要符合实验室实际条件
  - 计算题要写明已知条件
  - 概念题要用生活实例帮助理解

历史/政治：
  - 要有时空观念，避免孤立的知识点
  - 材料分析要有明确的设问指向
  - 时政题要与教材知识点结合

【常见错误规避】
- ❌ 答案与解析矛盾
- ❌ 超纲内容（参考课程标准）
- ❌ 选项表述不完整或有歧义
- ❌ 插图/图表与题目无关
- ❌ 题目要求与答案不匹配
- ❌ 知识点 ID 与实际内容不符

【工具使用策略】
- 使用 read 读取 src/data/tutorials/ 了解现有数据格式
- 使用 read 读取 src/data/knowledge/ 了解知识点结构
- 使用 grep 搜索相似内容避免重复
- 生成前先用 bash 检查目标文件是否存在

【文件操作规则】
- 生成新内容：先写入临时文件，确认质量后再移动
- 修改现有内容：必须先读取原内容，了解上下文
- 不要覆盖已有内容，除非用户明确要求
`;
}

// ============================================================================
// 教育内容 Prompt 模板
// ============================================================================

/** Prompt 模板类型 */
export interface PromptTemplate {
  name: string;
  description: string;
  prompt: string;
  example?: string;
}

/**
 * 教育内容生成专用 prompt 模板库
 *
 * 使用方法：从模板列表中选择合适的模板，根据实际需求修改占位符。
 */
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // -------------------------------------------------------------------------
  // 教程单元生成
  // -------------------------------------------------------------------------

  {
    name: "生成教程单元",
    description: "为一个知识点生成完整的 TutorialUnit",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{topic}}】生成一个 TutorialUnit。

要求：
1. 包含完整的 teach/learn/practice 三环节
2. 难度适中，适合家庭辅导
3. 包含 10 道练习题（easy:medium:hard = 4:4:2）
4. 练习题要有区分度，能检测真实理解

输出格式：单个 TypeScript TutorialUnit 对象字面量。`,
    example: `> 生成初一数学第一章"有理数"的 TutorialUnit
> 生成高中物理"匀变速直线运动"的 TutorialUnit`,
  },

  {
    name: "批量生成教程单元",
    description: "为一个章节生成多个 TutorialUnit",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{chapter}}(第{{start}}-{{end}}单元)】批量生成 TutorialUnit。

要求：
1. 单元之间有逻辑递进关系
2. 每个单元时长控制在 15-30 分钟
3. 统一的知识风格和讲解深度
4. 总计 {{count}} 个单元

输出格式：TutorialUnit[] 数组。`,
    example: `> 生成初一数学第一章5个单元（从相反数到有理数的乘法）
> 生成高中化学第一章3个单元（物质分类、离子反应、氧化还原）`,
  },

  // -------------------------------------------------------------------------
  // 练习题生成
  // -------------------------------------------------------------------------

  {
    name: "生成练习题组",
    description: "为一个知识点生成专项练习题",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{topic}}】生成练习题组。

参数：
- 题目数量：{{count}} 道
- 难度配比：easy {{easyCount}} 道，medium {{mediumCount}} 道，hard {{hardCount}} 道
- 题目类型：{{types}}（choice/fill/truefalse/solve）

要求：
1. 每道题都要有详细解析
2. 选择题选项要有干扰性但不能是明显错误
3. 解答题要给出完整解题步骤
4. 同类型题目要避免高度相似

输出格式：Question[] 数组。`,
    example: `> 生成10道初中物理浮力练习题（4 easy, 4 medium, 2 hard）
> 生成8道高中化学氧化还原练习题（选择题）`,
  },

  {
    name: "生成单元测试卷",
    description: "为一个完整单元生成测试卷",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{chapter}}】生成单元测试卷。

试卷规格：
- 总分：100分
- 时间：{{duration}} 分钟
- 题型分布：
  - 选择题 {{choiceCount}} 道（每题 {{choiceScore}} 分）
  - 填空题 {{fillCount}} 道（每题 {{fillScore}} 分）
  - 解答题 {{solveCount}} 道（每题 {{solveScore}} 分）
- 难度配比：easy 40%，medium 40%，hard 20%

要求：
1. 试题要有基础题送分，也要有区分度高的压轴题
2. 解答题要标注评分要点
3. 整套试卷要覆盖本单元核心知识点

输出格式：包含题目和完整答案解析的文档。`,
    example: `> 生成初一数学第二章"整式的加减"单元测试卷（45分钟）
> 生成高中物理必修一期中测试卷（90分钟）`,
  },

  // -------------------------------------------------------------------------
  // 错题分析
  // -------------------------------------------------------------------------

  {
    name: "错题分析与讲解",
    description: "分析一道错题并提供讲解",
    prompt: `请分析并讲解以下错题：

题目：{{question}}
学生答案：{{studentAnswer}}
正确答案：{{correctAnswer}}

分析要求：
1. 找出学生错误的根本原因
2. 给出正确的解题思路
3. 提供一道同类变式练习题
4. 给出学习建议

输出格式：包含"原因分析"、"正确解法"、"变式训练"、"学习建议"四个部分。`,
    example: `> 学生把"幂的乘方"和"积的乘方"公式混淆了，请分析并讲解`,
  },

  // -------------------------------------------------------------------------
  // 学习规划
  // -------------------------------------------------------------------------

  {
    name: "生成复习计划",
    description: "为一个章节生成复习计划",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{chapter}}】生成复习计划。

参数：
- 当前掌握度：{{masteryLevel}}（薄弱/一般/扎实）
- 剩余复习时间：{{availableTime}} 分钟/天
- 总复习周期：{{totalDays}} 天

要求：
1. 每天复习任务要具体可执行
2. 要有知识点回顾和练习巩固两个环节
3. 考前最后一天安排模拟测试
4. 薄弱环节要分配更多时间

输出格式：每日复习计划表，包含日期、复习内容、练习量、预期目标。`,
    example: `> 为期中考试生成数学复习计划（还有10天，每天1小时）
> 为高考物理生成力学专题复习计划（还有1个月）`,
  },

  // -------------------------------------------------------------------------
  // 知识点讲解
  // -------------------------------------------------------------------------

  {
    name: "生成知识点讲解",
    description: "为一个知识点生成详细讲解",
    prompt: `请为【{{subject}} - {{grade}}年级 - {{topic}}】生成详细讲解。

讲解结构：
1. 引入（用生活实例或有趣问题激发兴趣）
2. 概念定义（准确、完整、易懂）
3. 核心原理（为什么要这样，有何规律）
4. 典型应用（2-3 个例子，从易到难）
5. 易错提醒（常见错误和混淆点）
6. 总结升华（这个知识点在学科体系中的位置）

风格要求：
- 小学：故事化、游戏化、图解丰富
- 初中：探究式、联系生活、培养思维
- 高中：严谨性、学科深度、思维方法论

输出格式：包含 Markdown 格式的完整讲解文稿，可选配 mermaid 图表。`,
    example: `> 讲解"勾股定理"（初中数学）
> 讲解"原电池原理"（高中化学）`,
  },
];

// ============================================================================
// 最佳实践指南
// ============================================================================

/**
 * 教育内容生成最佳实践
 */
export const BEST_PRACTICES = {
  /**
   * Prompt 编写最佳实践
   */
  promptWriting: [
    {
      title: "明确指定年段和学科",
      reason: "不同年段对内容深度、语言风格有很大差异",
      example: "✅ 生成【初中数学 - 初二 - 一次函数】练习题\n❌ 生成一次函数练习题",
    },
    {
      title: "明确指定难度分布",
      reason: "没有难度要求，AI 倾向于生成中等难度内容",
      example: "✅ 10道题，easy:medium:hard = 4:4:2\n❌ 生成10道练习题",
    },
    {
      title: "提供具体知识点而非泛泛的章节名",
      reason: "AI 更能生成精准内容，命中学习目标",
      example: "✅ 生成【一元二次方程的配方法】练习题\n❌ 生成【一元二次方程】练习题",
    },
    {
      title: "要求解释和变式",
      reason: "好的练习题不只是答案，还要有思维引导",
      example: "✅ 每道题都要有详细解析和至少一道变式题\n❌ 生成10道选择题并给出答案",
    },
  ],

  /**
   * 工具使用最佳实践
   */
  toolUsage: [
    {
      tool: "read",
      do: [
        "生成前先读取现有数据格式",
        "修改前先了解原内容",
        "读取知识点结构文件确保内容衔接",
      ],
      dont: [
        "不要用 cat 替代 read",
        "不要跳过格式确认直接生成",
      ],
    },
    {
      tool: "grep",
      do: [
        "搜索相似内容避免重复",
        "确认知识点 ID 是否已存在",
        "查找可参考的现有内容风格",
      ],
      dont: [
        "不要在未读取格式文件时使用 grep",
      ],
    },
    {
      tool: "write",
      do: [
        "先写入临时文件确认质量",
        "写入后用 read 验证格式",
        "文件名要有语义，便于后续查找",
      ],
      dont: [
        "不要直接覆盖已有内容",
        "不要写入过大的文件（超过 512KB）",
      ],
    },
    {
      tool: "bash",
      do: [
        "用 bash 验证 TypeScript 类型是否正确",
        "用 bash 运行测试确认内容质量",
        "检查文件是否存在后再操作",
      ],
      dont: [
        "不要用 bash 做文件内容读取（用 read）",
        "不要执行破坏性命令（rm -rf 等）",
      ],
    },
  ],

  /**
   * 内容质量检查清单
   */
  qualityChecklist: [
    {
      category: "准确性",
      checks: [
        "所有计算题答案经验算正确",
        "概念定义与教材/课程标准一致",
        "历史事件时间线正确",
        "语言材料语法正确、用词恰当",
      ],
    },
    {
      category: "难度适切性",
      checks: [
        "easy 题确实简单，不超过2步推理",
        "hard 题有区分度，需要深度理解",
        "难度配比符合要求",
        "题目与知识点难度匹配",
      ],
    },
    {
      category: "格式规范",
      checks: [
        "TypeScript 对象字面量合法",
        "id 全局唯一",
        "字段类型与接口定义一致",
        "没有 undefined 或 null 值",
      ],
    },
    {
      category: "教学价值",
      checks: [
        "题目有思维含量，不是纯记忆",
        "解析能帮助学生理解",
        "内容有探究空间",
        "符合年段认知特点",
      ],
    },
  ],

  /**
   * 常见问题与解决方案
   */
  troubleshooting: [
    {
      problem: "生成的内容格式不合法",
      cause: "TypeScript 对象字面量语法错误",
      solution: [
        "使用 read 查看示例文件格式",
        "分步生成，先确认结构再填充内容",
        "用 bash 运行 tsc 检查类型错误",
      ],
    },
    {
      problem: "内容与已有内容重复",
      cause: "未检查现有数据就开始生成",
      solution: [
        "先 grep 搜索关键词确认不存在",
        "读取 index.ts 了解已有知识点",
        "生成前先列出要覆盖的知识点",
      ],
    },
    {
      problem: "题目难度不均衡",
      cause: "未明确指定难度分布",
      solution: [
        "明确写出 easy/medium/hard 各多少道",
        "提供参考题示例说明难度",
        "生成后检查各难度题目比例",
      ],
    },
    {
      problem: "内容超出课程标准",
      cause: "未参考课程标准就生成",
      solution: [
        "先读取 src/data/knowledge/ 确认知识点范围",
        "初中参考义务教育课程标准",
        "高中参考普通高中课程标准",
      ],
    },
  ],
};

/**
 * 获取指定名称的 prompt 模板
 */
export function getPromptTemplate(name: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.name === name);
}

/**
 * 渲染 prompt 模板，用实际值替换占位符
 */
export function renderPromptTemplate(
  template: PromptTemplate,
  variables: Record<string, string>
): string {
  let prompt = template.prompt;
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return prompt;
}
