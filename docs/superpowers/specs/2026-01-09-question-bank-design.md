# 题库系统 & 在线答题功能设计

> 状态：草案 | 日期：2026-01-09

## 1. 背景与目标

### 1.1 当前问题

拾艺院现有 9 个功能模块中，"专题练习"（PracticeView）和"学习笔记"（NotesView）模块内容薄弱，缺乏真正的互动练习能力。学生只能被动浏览知识点，无法通过做题来检验和巩固学习成果。

### 1.2 设计目标

构建一个**结构化的题库系统**，支持在线答题、即时反馈和解析，让学生能够：

- 按知识点/专题/标签找到对应练习题
- 选择难度和题型进行针对性训练
- 获得即时批改和详细解析
- 在知识点详情页直接进入相关练习

### 1.3 不在本期范围

- 错题本功能（第二阶段）
- 学习进度追踪（第二阶段）
- 用户系统 / 云同步（后续阶段）
- 解答题 / 计算题（题型复杂，AI 批改不可靠）
- 连线题 / 排序题（开发成本高）

---

## 2. 数据模型

### 2.1 题目类型（Question）

```typescript
export type QuestionType = 'choice' | 'fill-blank' | 'true-false';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface Question {
  id: string;                    // 全局唯一 ID，格式：q-{subject}-{grade}-{hash}
  type: QuestionType;            // 题型
  difficulty: Difficulty;        // 难度
  stem: string;                  // 题干（支持 Markdown 行内格式）
  options?: string[];            // 选择题选项（仅 choice 类型）
  answer: string;                // 答案（choice 为选项字母，fill-blank 为文本，true-false 为 true/false）
  explanation: string;           // 答案解析
  tags: string[];                // 标签（关联专题/主题）
  knowledgePointIds: string[];   // 关联知识点 ID（与现有知识点数据打通）
  subject: string;               // 学科
  grade: GradeLevel;            // 学段（复用现有 'primary' | 'middle' | 'high'）
}
```

### 2.2 文件组织

```
src/data/questions/
├── types.ts              # Question / QuestionType / Difficulty 类型定义
├── index.ts              # 汇总导出 ALL_QUESTIONS + 查询工具函数
├── primary-math.ts       # 小学数学题库
├── primary-chinese.ts    # 小学语文题库
├── middle-math.ts        # 初中数学题库
├── middle-chinese.ts     # 初中语文题库
├── middle-physics.ts     # 初中物理题库
├── middle-chemistry.ts   # 初中化学题库
├── middle-english.ts     # 初中英语题库
├── high-math.ts          # 高中数学题库
├── high-physics.ts       # 高中物理题库
└── high-chemistry.ts     # 高中化学题库
```

### 2.3 查询工具函数

```typescript
// src/data/questions/index.ts
export const ALL_QUESTIONS: Question[] = [
  ...primaryMath,
  ...primaryChinese,
  // ... 其他学科
];

// 按知识点 ID 查找题目
export function getQuestionsByKnowledgePoint(kpId: string): Question[];

// 按标签查找题目
export function getQuestionsByTag(tag: string): Question[];

// 按条件筛选题目
export function filterQuestions(opts: {
  subject?: string;
  grade?: GradeLevel;
  difficulty?: Difficulty;
  type?: QuestionType;
  tags?: string[];
  knowledgePointIds?: string[];
}): Question[];

// 随机获取 N 道题（用于组卷）
export function getRandomQuestions(filter: FilterOptions, count: number): Question[];
```

---

## 3. AI 批量生成脚本

### 3.1 脚本结构

```
scripts/generate-questions/
├── generate.ts           # 主脚本入口
├── prompts.ts            # 各题型 prompt 模板
├── knowledge-loader.ts   # 加载知识点数据
└── output/               # 生成的 JSON 文件输出目录
    ├── primary-math.ts
    ├── middle-math.ts
    └── ...
```

### 3.2 生成流程

```
1. 读取指定学科-学段的知识点数据
2. 遍历每个知识点，检查是否已有足够题目
3. 对缺少题目的知识点，调用 AI 生成：
   - 3 种难度（基础/提高/挑战）
   - 3 种题型（选择/填空/判断）
   - 每个难度+题型组合 2 道题
   → 每个知识点最多 18 道题
4. 输出为标准 TypeScript 模块文件
5. 可增量生成（跳过已有足够题目的知识点）
```

### 3.3 Prompt 模板

为每种题型+难度组合设计专用 prompt，确保输出格式统一：

```
你是一位资深{grade}{subject}教师。请为知识点"{knowledgePointTitle}"生成一道{difficulty}{type}题。

知识点描述：{description}
关联标签：{tags}

要求：
- 题目表述清晰，符合{grade}学生认知水平
- 难度等级：{difficulty}
- 附带详细解析，讲解解题思路
- 选择题选项 4 个，只有一个正确答案
- 填空题答案唯一、明确
- 判断题答案明确为 true 或 false

请严格按以下 JSON 格式输出：
{
  "stem": "题干",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "解析内容"
}
```

### 3.4 使用方式

```bash
# 生成小学数学全部题目
npx tsx scripts/generate-questions/generate.ts --subject math --grade primary

# 生成所有学科（全量）
npx tsx scripts/generate-questions/generate.ts --all

# 增量生成（只补缺）
npx tsx scripts/generate-questions/generate.ts --subject math --grade primary --incremental
```

---

## 4. UI 组件设计

### 4.1 组件结构

```
src/components/
├── PracticeView.tsx              # 重构：练习主入口页面
├── practice/
│   ├── PracticeFilter.tsx        # 筛选面板（知识点/难度/题型）
│   ├── QuestionCard.tsx          # 题目卡片容器（根据 type 分发）
│   ├── ChoiceQuestion.tsx        # 选择题交互
│   ├── FillBlankQuestion.tsx     # 填空题交互
│   ├── TrueFalseQuestion.tsx     # 判断题交互
│   ├── PracticeProgress.tsx      # 答题进度条
│   ├── PracticeResult.tsx        # 答题结果统计页
│   └── ExplanationPanel.tsx      # 解析面板（答错/答对后展示）
```

### 4.2 答题流程状态机

```
IDLE → SELECTING → ANSWERING → REVIEWING → FINISHED

- IDLE:      初始状态，显示筛选面板
- SELECTING: 用户选择知识点/标签/难度/题型
- ANSWERING: 逐题作答，每题提交后即时反馈
- REVIEWING: 查看错题解析
- FINISHED:  显示统计报告
```

### 4.3 页面布局

**筛选面板（PracticeFilter）：**
```
┌─────────────────────────────────────────────┐
│  选择练习范围                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 知识点 ▼ │ │ 难度 ▼  │ │ 题型 ▼  │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│  标签：[数学基础] [几何] [方程] ...          │
│                                             │
│            [ 开始练习 ]                      │
└─────────────────────────────────────────────┘
```

**答题界面：**
```
┌─────────────────────────────────────────────┐
│  题目 3 / 10                    ⏱ 02:35     │
│  ████████░░░░░░░░░░                         │
│                                             │
│  📝 基础 · 选择题                            │
│                                             │
│  下列哪个数是质数？                           │
│                                             │
│  ○ A. 4                                     │
│  ○ B. 7                                     │
│  ○ C. 9                                     │
│  ○ D. 15                                    │
│                                             │
│            [ 提交答案 ]                      │
└─────────────────────────────────────────────┘
```

**即时反馈：**
```
┌─────────────────────────────────────────────┐
│  ✅ 回答正确！                               │
│                                             │
│  📖 解析：                                   │
│  质数是只能被 1 和自身整除的大于 1 的自然数。  │
│  4 = 2×2, 9 = 3×3, 15 = 3×5，只有 7 满足。  │
│                                             │
│  🏷️ 关联知识点：质数与合数                    │
│                                             │
│            [ 下一题 → ]                      │
└─────────────────────────────────────────────┘
```

**结果统计：**
```
┌─────────────────────────────────────────────┐
│  📊 练习报告                                 │
│                                             │
│  正确率：8/10（80%）                         │
│  用时：5 分 23 秒                            │
│                                             │
│  按难度：                                    │
│  ✅ 基础 3/3  ✅ 提高 3/4  ⚠️ 挑战 2/3      │
│                                             │
│  ⚠️ 错题回顾：                               │
│  1. 关于 x² = 4 的解...                     │
│  2. 下列运算正确的是...                      │
│                                             │
│  [ 再来一组 ]  [ 查看错题 ]  [ 返回 ]        │
└─────────────────────────────────────────────┘
```

---

## 5. 与现有系统集成

### 5.1 知识点详情页入口

在 `KnowledgeDetail.tsx` 中增加"开始练习"按钮，点击后跳转到 `/practice?kp={id}`，自动筛选该知识点的题目。

### 5.2 Header 导航

现有 Header 中"专题练习"导航项保持不变，指向重构后的 PracticeView。

### 5.3 数据关联

- 题目的 `knowledgePointIds` 字段关联到 `KNOWLEDGE_DATA` 中的知识点 ID
- 题目的 `tags` 字段与知识点的 `tags` 互通
- 后续阶段可将答题结果关联到知识点的掌握度

---

## 6. 技术约束

- **纯前端**：所有数据存储在静态 TS 模块中，无需后端
- **localStorage**：答题记录、错题本等运行时数据存于 localStorage
- **预留扩展**：Question 数据结构预留 `stats` 字段（正确率、答题次数），为后续云端统计做准备
- **性能**：题库数据按需加载（按学科-学段懒加载），避免一次性加载全部题目

---

## 7. 实施计划（分阶段）

### 第一阶段：MVP（本次实施）

1. 定义 Question 数据类型和题库文件结构
2. 编写 AI 批量生成脚本，生成小学数学题库
3. 重构 PracticeView，实现筛选 + 答题 + 即时反馈
4. 在知识点详情页增加"开始练习"入口
5. 适配移动端

### 第二阶段：内容扩充

1. 生成初中、高中各学科题库
2. 增加错题本功能
3. 增加学习打卡和连续天数

### 第三阶段：智能化

1. 学习进度追踪和掌握度评估
2. 薄弱点分析和推荐
3. AI 自适应出题

---

## 8. 验证标准

- 学生可以从知识点详情页进入相关练习
- 支持选择题、填空题、判断题三种题型
- 提交后即时显示对错和解析
- 完成练习后显示正确率统计
- 移动端可用
- 不依赖 API Key 也能正常使用（纯静态题库）
