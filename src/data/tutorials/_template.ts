/**
 * TutorialUnit 规格说明 + 学段样板
 *
 * ⚠ 本文件是文档+参考样板，不参与编译（主数据在 primary-*.ts）。
 * 类型标注为宽泛的 string 以兼容初高中年级编号。
 */

// ═══════════════════════════════════════════════════════════════
// 1. TutorialUnit 字段规范
// ═══════════════════════════════════════════════════════════════

/**
 * 必填字段：
 *   id          — 格式 {level}-{subject}-{grade}-u{order}，如 m-math-7-u1、h-phys-10-u12
 *   title       — 单元标题，≤20 字，具体有吸引力（如"二次函数的最值问题"）
 *   order       — 从 1 开始的序号
 *   duration    — 如 "约 45 分钟"
 *   objectives  — 3-5 条学习目标，可衡量、可观察
 *   teach       — { hook: 故事/场景引入 200-400字; summary: 本课概览 100-200字 }
 *   learn       — { sections: 分节知识点（含图解/例题）; tips: 2-4 条学习提示 }
 *   practice    — 固定 10 题，覆盖 easy/medium/hard，题型多样（choice/fill/truefalse/solve）
 *   aiContext   — 给 LLM 的生成上下文（可留空）
 *
 * 图解（diagrams）可选：
 *   mermaid 图表 或 SVG，带 caption
 *
 * 练习（practice）答案必须事实正确：
 *   choice → 选项字母 A/B/C/D
 *   fill → 文本答案（可多个，用 string[]）
 *   truefalse → '对' | '错'
 *   solve → 最终答案（解题过程在 explanation 中）
 */

// ═══════════════════════════════════════════════════════════════
// 2. 学段风格指南
// ═══════════════════════════════════════════════════════════════

/**
 * 初中（7-9 年级）：
 *   - 语气：准确平实，有探究感（"侦探破案"式引入）
 *   - 互动：小组讨论、迷你实验、地图阅读、史料分析、数据调查
 *   - 例题：2-3 道，由易到难，步骤严谨
 *   - 字数：讲解 800-1200 字
 *
 * 高中（10-12 年级）：
 *   - 语气：精确严谨，体现学科思维与推导
 *   - 互动：推导证明、建模分析、学术辩论、数据批判
 *   - 例题：2-3 道，突出本质与方法论
 *   - 字数：讲解 1000-1500 字
 *
 * 通用：
 *   - 全角中文标点
 *   - 关键术语加粗
 *   - 生活/科技/社会情境作为引入
 *   - 每道练习题附答案 + 解析
 */

// 宽松类型，兼容初高中年级
type AnyGrade = string;
interface LooseQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  difficulty: string;
  solution?: string;
}
interface LooseUnit {
  id: string;
  order: number;
  title: string;
  duration: string;
  objectives: string[];
  teach: { hook: string; summary: string };
  learn: { sections: { title: string; content: string; diagrams?: {type:string;content:string;caption?:string}[]; examples?: {title:string;problem:string;solution:string;tip:string}[] }[]; tips: string[] };
  practice: LooseQuestion[];
  aiContext: string;
}
interface LooseTutorial {
  id: string;
  grade: AnyGrade;
  gradeName: string;
  subject: string;
  subjectIcon: string;
  title: string;
  description: string;
  units: LooseUnit[];
}

// ═══════════════════════════════════════════════════════════════
// 3. 初中样板：七年级数学（m-math-7）
// ═══════════════════════════════════════════════════════════════

export const MIDDLE_MATH_GRADE7_SAMPLE: LooseTutorial = {
  id: 'middle-math-7',
  grade: '7',
  gradeName: '七年级',
  subject: '数学',
  subjectIcon: '📐',
  title: '七年级数学',
  description: '有理数、整式、一元一次方程、几何图形初步。',
  units: [
    {
      id: 'm-math-7-u1',
      order: 1,
      title: '正数与负数',
      duration: '约 45 分钟',
      objectives: [
        '理解正负数的意义，能区分相反意义的量',
        '会用正负数表示生活中的相反意义（温度、海拔、收支）',
        '能在数轴上表示有理数并比较大小',
        '理解 0 既不是正数也不是负数'
      ],
      teach: {
        hook: `冬天到了，气象台预报：哈尔滨 -25℃，北京 -5℃，上海 8℃。

你有没有想过，这些“-25℃”里的“-”是什么意思？它不是减号，而是一个新的数——负数。

早在 2000 多年前，中国人就在《九章算术》中提出了负数的概念，用红色算筹表示正数、黑色算筹表示负数。这是世界数学史上的一项伟大发明！`,
        summary: '本课我们将认识正数和负数这对“相反兄弟”，学会用它们描述生活中相反意义的量，并在数轴上找到它们的位置。'
      },
      learn: {
        sections: [
          {
            title: '相反意义的量',
            content: `生活中有很多“相反”的情况：
- **温度**：零上 8℃ 与零下 5℃
- **海拔**：珠穆朗玛峰 +8848 米，死海湖面 -430 米
- **收入/支出**：收入 500 元记作 +500，支出 200 元记作 -200
- **方向**：向东 3 千米记作 +3，向西 5 千米记作 -5

为了区分这些相反意义的量，我们引入**正数**（+）和**负数**（-）。`,
            diagrams: [
              { type: 'mermaid', content: 'graph LR\n    A[相反意义的量] --> B[正数 +]\n    A --> C[负数 -]\n    B --> D[零上/收入/向东]\n    C --> E[零下/支出/向西]', caption: '正负数表示相反意义的量' }
            ]
          },
          {
            title: '数轴与大小比较',
            content: `**数轴**：规定了原点、正方向、单位长度的直线。

**数轴三要素**：
1. 原点（0）
2. 正方向（通常向右）
3. 单位长度

**比较大小**：
- 数轴上，右边的数总比左边的大
- 正数 > 0 > 负数
- 两个负数，绝对值大的反而小（如 -5 < -2）`
          }
        ],
        tips: [
          '0 既不是正数也不是负数，它是正负数的分界点',
          '负数的比较是易错点：想象温度计，温度越低（越冷）越往下，数值越小',
          '遇到“相反意义的量”时，先规定哪个为正，再表示'
        ]
      },
      practice: [
        { id: 'm-math-7-u1-p1', type: 'choice', question: '下列各数中，负数是（    ）。', options: ['A. 0', 'B. -（-3）', 'C. -2', 'D. |5|'], answer: 'C', explanation: '-(-3)=3，|-2|=-2，|5|=5，只有 -2 是负数。', difficulty: 'easy' },
        { id: 'm-math-7-u1-p2', type: 'fill', question: '如果收入 100 元记作 +100 元，那么支出 60 元记作 ____ 元。', answer: '-60', explanation: '收入为正，支出则为负。', difficulty: 'easy' },
        { id: 'm-math-7-u1-p3', type: 'fill', question: '在数轴上，位于 -3 右边且距离原点 2 个单位的数是 ____。', answer: '-1', explanation: '-3 右边 2 个单位：-3 + 2 = -1。', difficulty: 'easy' },
        { id: 'm-math-7-u1-p4', type: 'truefalse', question: '所有的负数都比 0 小。', answer: '对', explanation: '负数都小于 0，这是负数的基本性质。', difficulty: 'easy' },
        { id: 'm-math-7-u1-p5', type: 'choice', question: '比较大小，下列正确的是（    ）。', options: ['A. -5 > -3', 'B. -1 < -2', 'C. 0 > -100', 'D. -100 > 1'], answer: 'C', explanation: '0 大于任何负数，C 正确。A 应为 -5<-3，B 应为 -1>-2，D 应为 -100<1。', difficulty: 'medium' },
        { id: 'm-math-7-u1-p6', type: 'solve', question: '某天的气温：早晨 -3℃，中午上升了 8℃，傍晚又下降了 5℃。求傍晚的气温。', solution: '-3 + 8 - 5 = 0℃。傍晚气温为 0℃。', explanation: '用正负数表示上升/下降，列式计算。', difficulty: 'medium' },
        { id: 'm-math-7-u1-p7', type: 'fill', question: '在 -4、-2、0、1、3 中，最小的数是 ____，最大的数是 ____。', answer: '-4 和 3', explanation: '负数中绝对值大的反而小，所以 -4 最小；正数 3 最大。', difficulty: 'medium' },
        { id: 'm-math-7-u1-p8', type: 'choice', question: '一种食品包装上标有“净含量 250±5 g”，这包食品的净含量范围是（    ）。', options: ['A. 245~255 g', 'B. 250~255 g', 'C. 245~250 g', 'D. 255~260 g'], answer: 'A', explanation: '250±5 表示最多 255 g，最少 245 g。', difficulty: 'medium' },
        { id: 'm-math-7-u1-p9', type: 'solve', question: '一只蚂蚁从数轴上的点 A（表示 -2）出发，先向右爬 5 个单位，再向左爬 8 个单位。求蚂蚁最终位置表示的数。', solution: '-2 + 5 - 8 = -5。最终位置是 -5。', explanation: '向右为正，向左为负，列式计算。', difficulty: 'medium' },
        { id: 'm-math-7-u1-p10', type: 'solve', question: '某地海拔高度为 +155 m，另一处为 -88 m。哪一处比较高？高多少米？', solution: '+155 m 处更高。高 155 - (-88) = 155 + 88 = 243 米。', explanation: '比较海拔即比较有理数大小；求差用减法，注意减负数等于加正数。', difficulty: 'hard' }
      ],
      aiContext: '初中数学 七年级 正数与负数 有理数 数轴'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// 4. 高中样板：高一数学（h-math-10）
// ═══════════════════════════════════════════════════════════════

export const HIGH_MATH_GRADE10_SAMPLE: LooseTutorial = {
  id: 'high-math-10',
  grade: '10',
  gradeName: '高一',
  subject: '数学',
  subjectIcon: '📊',
  title: '高一数学',
  description: '集合与函数、指数对数、三角函数、导数初步。',
  units: [
    {
      id: 'h-math-10-u1',
      order: 1,
      title: '集合的含义与表示',
      duration: '约 50 分钟',
      objectives: [
        '理解集合的概念，能判断一组对象是否构成集合',
        '掌握集合的列举法和描述法，能互相转化',
        '理解集合中元素的三个特性：确定性、互异性、无序性',
        '能正确使用属于（∈）与不属于（∉）符号'
      ],
      teach: {
        hook: `高一开学，老师点名：“请（1）所有男生站起来；（2）所有戴眼镜的同学站起来；（3）所有‘高个子’同学站起来。”

前两组同学站得整整齐齐，第三组却面面相觑——“多高算高个子？”

这就是今天我们要学习的**集合**：把确定的、互不相同的对象作为整体来看待。关键在于“确定”——给定一个元素，能明确判断它是否属于这个集合。`,
        summary: '本课我们将建立集合的精确语言，学会用列举法和描述法表示集合，并理解集合论作为现代数学基础的意义。'
      },
      learn: {
        sections: [
          {
            title: '集合的基本概念',
            content: `**集合**：把一些能够确定的、互不相同的对象汇集在一起，组成一个整体。组成这个整体的每个对象叫做该集合的**元素**。

**集合中元素的三个特性**：
1. **确定性**：对任何一个对象，都能确定它是否属于该集合。（“高个子”不构成集合，因为“多高算高”不确定）
2. **互异性**：集合中的元素互不相同。（{1,1,2} 应写作 {1,2}）
3. **无序性**：集合中的元素没有顺序。（{1,2,3} = {3,1,2}）

**元素与集合的关系**：
- 属于：a ∈ A（a 是集合 A 的元素）
- 不属于：a ∉ A（a 不是集合 A 的元素）`
          },
          {
            title: '集合的表示方法',
            content: `**列举法**：把集合中的元素一一列举出来，写在大括号内。
- 例：中国的直辖市可表示为 {北京, 上海, 天津, 重庆}

**描述法**：用集合中元素的共同特征来表示。
- 格式：{x | P(x)}，读作“满足条件 P 的所有 x”
- 例：{x | x 是中国的直辖市} = {北京, 上海, 天津, 重庆}
- 例：{x ∈ N | x < 5} = {0, 1, 2, 3, 4}

**常见数集**：
- 自然数集 **N** = {0, 1, 2, 3, ...}
- 正整数集 **N*** 或 **N₊** = {1, 2, 3, ...}
- 整数集 **Z** = {..., -2, -1, 0, 1, 2, ...}
- 有理数集 **Q**
- 实数集 **R**`
          }
        ],
        tips: [
          '判断一组对象能否构成集合，关键看“标准是否确定”',
          '描述法要写清“代表元素 | 共同特征”，如 {x | x > 2} 与 {y | y > 2} 是同一个集合',
          '空集 ∅ 是任何集合的子集，是易考点'
        ]
      },
      practice: [
        { id: 'h-math-10-u1-p1', type: 'choice', question: '下列各组对象能构成集合的是（    ）。', options: ['A. 所有的胖子', 'B. 所有的好学生', 'C. 不小于 3 的自然数', 'D. 很大的数'], answer: 'C', explanation: 'A、B、D 的标准都不确定，只有 C 有明确标准。', difficulty: 'easy' },
        { id: 'h-math-10-u1-p2', type: 'fill', question: '用列举法表示“大于 0 且小于 6 的偶数”组成的集合：____。', answer: '{2, 4}', explanation: '大于 0 且小于 6 的偶数只有 2 和 4。', difficulty: 'easy' },
        { id: 'h-math-10-u1-p3', type: 'fill', question: '用描述法表示集合 {1, 4, 9, 16, 25}：____。', answer: '{x | x = n², n ∈ N, 1 ≤ n ≤ 5}（答案不唯一）', explanation: '观察规律：1=1², 4=2², 9=3², 16=4², 25=5²。', difficulty: 'easy' },
        { id: 'h-math-10-u1-p4', type: 'truefalse', question: '空集是任何集合的子集。', answer: '对', explanation: '这是子集定义的直接推论，空集 ∅ ⊆ A 对任意集合 A 成立。', difficulty: 'easy' },
        { id: 'h-math-10-u1-p5', type: 'choice', question: '已知集合 A = {x | x² - 3x + 2 = 0}，则下列关系正确的是（    ）。', options: ['A. 1 ∉ A', 'B. {1} ∈ A', 'C. 2 ∈ A', 'D. {2} ∉ A'], answer: 'C', explanation: 'x²-3x+2=0 的根为 1 和 2，所以 A={1,2}。2 ∈ A 正确。', difficulty: 'medium' },
        { id: 'h-math-10-u1-p6', type: 'solve', question: '已知 A = {x ∈ N | x < 6}，列出 A 的所有子集。', solution: 'A = {0,1,2,3,4,5}，有 6 个元素，子集数为 2⁶ = 64 个。', explanation: 'n 元集合的子集数为 2ⁿ。本题只要求列出个数，若要求全部列出则需系统枚举。', difficulty: 'medium' },
        { id: 'h-math-10-u1-p7', type: 'fill', question: '已知 A = {1, 2, 3}，则 A 的真子集个数为 ____。', answer: '7', explanation: '3 元集合子集数 2³=8，真子集数=8-1=7。', difficulty: 'medium' },
        { id: 'h-math-10-u1-p8', type: 'choice', question: '下列集合与 {a, b, c} 相等的是（    ）。', options: ['A. {c, b, a}', 'B. {a, a, b, c}', 'C. {x | x 是三角形的三边}', 'D. 以上都正确'], answer: 'D', explanation: '集合无序性+互异性，A、B 都与 {a,b,c} 相等；C 若三角形三边为 a,b,c 则也相等。', difficulty: 'medium' },
        { id: 'h-math-10-u1-p9', type: 'solve', question: '已知 A = {x | a < x < a+3}，B = {x | x < 0 或 x > 5}。若 A ⊆ B，求 a 的取值范围。', solution: 'A ⊆ B 要求区间 (a, a+3) 完全落在 (-∞,0) 或 (5,+∞)。情况1：a+3 ≤ 0 → a ≤ -3；情况2：a ≥ 5。所以 a ≤ -3 或 a ≥ 5。', explanation: '数形结合，在数轴上分析区间包含关系。', difficulty: 'hard' },
        { id: 'h-math-10-u1-p10', type: 'solve', question: '已知 A = {x | x² - 5x + 6 = 0}，B = {x | mx - 1 = 0}，且 B ⊆ A。求 m 的所有可能值。', solution: 'A = {2, 3}。B ⊆ A 有三种情况：(1) B=∅，此时 m=0；(2) B={2}，代入得 2m-1=0，m=1/2；(3) B={3}，代入得 3m-1=0，m=1/3。所以 m ∈ {0, 1/2, 1/3}。', explanation: 'B 含参数 m，需讨论 B 是否为空集（易遗漏！）。', difficulty: 'hard' }
      ],
      aiContext: '高中数学 高一 集合 元素 列举法 描述法'
    }
  ]
};
