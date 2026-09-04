# 教学提示词 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 AI 智能助教基础上，新增教学提示词模板库功能。平台内置 50+ 个按清北名校教学标准设计的 prompt 模板，覆盖 8 大教学场景。用户选择模板、填写结构化变量后，调用 AI 获得高质量的教学内容。

**Architecture:** 新增 `src/data/prompts/` 静态数据模块存放模板，新增 `src/components/prompts/` 组件实现全屏模态框，在 `src/services/ai.ts` 中新增 `generateFromTemplate` 函数，在 `KnowledgeDetail.tsx` 中增加模板模式入口。

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Vite 7, OpenAI SDK

---

## 文件结构

```
src/
├── data/
│   └── prompts/                        # 新增：提示词模板数据
│       ├── types.ts                    # 类型定义
│       ├── index.ts                    # 汇总导出 + 查询函数
│       ├── explain/                    # 知识讲解类
│       │   ├── index.ts
│       │   ├── deep-concept.ts
│       │   ├── story-based.ts
│       │   ├── socratic.ts
│       │   ├── bridge-analogy.ts
│       │   ├── visual-explain.ts
│       │   └── misconception.ts
│       ├── generate/                   # 出题组卷类
│       │   ├── index.ts
│       │   ├── gradient.ts
│       │   ├── exam-paper.ts
│       │   ├── mistake-focused.ts
│       │   ├── concept-check.ts
│       │   ├── challenge.ts
│       │   └── adaptive.ts
│       ├── assess/                     # 测评批改类
│       │   ├── index.ts
│       │   ├── answer-review.ts
│       │   ├── rubric-based.ts
│       │   ├── peer-review.ts
│       │   ├── self-assessment.ts
│       │   ├── progress-check.ts
│       │   └── oral-defense.ts
│       ├── plan/                       # 学习计划类
│       │   ├── index.ts
│       │   ├── weekly-plan.ts
│       │   ├── exam-prep.ts
│       │   ├── summer-plan.ts
│       │   ├── weak-point.ts
│       │   ├── habit-building.ts
│       │   └── milestone.ts
│       ├── error-analysis/             # 错题分析类
│       │   ├── index.ts
│       │   ├── root-cause.ts
│       │   ├── concept-gap.ts
│       │   ├── thinking-path.ts
│       │   ├── transfer-practice.ts
│       │   ├── meta-cognition.ts
│       │   └── error-pattern.ts
│       ├── derivation/                 # 公式推导类
│       │   ├── index.ts
│       │   ├── step-by-step.ts
│       │   ├── intuitive-proof.ts
│       │   ├── historical-context.ts
│       │   ├── visual-proof.ts
│       │   ├── real-world.ts
│       │   └── extension.ts
│       ├── explore/                    # 拓展探究类
│       │   ├── index.ts
│       │   ├── cross-discipline.ts
│       │   ├── frontier-science.ts
│       │   ├── history-science.ts
│       │   ├── hands-on-project.ts
│       │   ├── debate-topic.ts
│       │   └── career-connection.ts
│       └── interaction/                # 亲子互动类
│           ├── index.ts
│           ├── game-based.ts
│           ├── dialogue-script.ts
│           ├── experiment-kit.ts
│           ├── story-co-create.ts
│           ├── quiz-battle.ts
│           └── real-life-task.ts
├── components/
│   └── prompts/                        # 新增：提示词 UI 组件
│       ├── PromptModal.tsx             # 全屏模态框主组件
│       ├── PromptFilterBar.tsx         # 筛选栏
│       ├── PromptCard.tsx              # 模板卡片
│       ├── PromptGrid.tsx              # 模板网格
│       ├── PromptDetail.tsx            # 模板详情 + 变量表单
│       ├── PromptVariableInput.tsx     # 变量输入组件
│       └── PromptResult.tsx            # AI 输出结果
│   └── KnowledgeDetail.tsx             # 修改：增加模板模式入口
└── services/
    └── ai.ts                           # 修改：新增 generateFromTemplate
```

---

## Task 1: 创建提示词数据层 — 类型定义

**Files:**
- Create: `src/data/prompts/types.ts`

- [ ] **Step 1: 创建类型定义文件**

创建 `src/data/prompts/types.ts`，内容如下：

```typescript
import type { GradeLevel } from '../knowledge';

/** 提示词场景分类 */
export type PromptScenario =
  | 'explain'        // 知识讲解
  | 'generate'       // 出题组卷
  | 'assess'         // 测评批改
  | 'plan'           // 学习计划
  | 'error-analysis' // 错题分析
  | 'derivation'     // 公式推导
  | 'explore'        // 拓展探究
  | 'interaction';   // 亲子互动

/** 模板变量定义 */
export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'select' | 'textarea';
  options?: string[];
  defaultValue?: string;
}

/** 提示词模板 */
export interface PromptTemplate {
  id: string;
  title: string;
  scenario: PromptScenario;
  icon: string;
  description: string;
  tags: string[];
  template: string;
  variables: PromptVariable[];
  grades: GradeLevel[];
  subjects: string[];
  knowledgePointIds?: string[];
  usageCount: number;
  rating: number;
  author: string;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/prompts/types.ts
git commit -m "feat(prompts): add PromptTemplate type definitions"
```

---

## Task 2: 创建知识讲解类模板（6 个）

**Files:**
- Create: `src/data/prompts/explain/deep-concept.ts`
- Create: `src/data/prompts/explain/story-based.ts`
- Create: `src/data/prompts/explain/socratic.ts`
- Create: `src/data/prompts/explain/bridge-analogy.ts`
- Create: `src/data/prompts/explain/visual-explain.ts`
- Create: `src/data/prompts/explain/misconception.ts`
- Create: `src/data/prompts/explain/index.ts`

- [ ] **Step 1: 概念深度讲解模板**

创建 `src/data/prompts/explain/deep-concept.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const deepConceptPrompt: PromptTemplate = {
  id: 'explain-deep-concept',
  title: '概念深度讲解',
  scenario: 'explain',
  icon: '📖',
  description: '用生活比喻+分步拆解+苏格拉底提问，让学生真正理解概念本质',
  tags: ['启发式', '苏格拉底法', '生活比喻'],
  template: `你是一位精通{{student_grade}}教学的名师，擅长用启发式教学法让学生真正理解概念本质。

请深入浅出地讲解"{{knowledge_point}}"这一概念。

{{#if prior_knowledge}}
学生已掌握以下前置知识：{{prior_knowledge}}
请在此基础上搭建理解桥梁。
{{/if}}

讲解要求：
1. 用一个生活比喻引入概念（让学生感到亲切）
2. 分 3-4 个步骤拆解核心逻辑，每一步说明"为什么"
3. 设计 2 个苏格拉底式提问，引导学生自主思考
4. 指出学生常见的误解和易混淆点
5. 用一个简单例题验证理解

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请保持语言亲切生动，适合家长辅导孩子时使用。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：浮力、二次函数、现在完成时...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二、高一...', required: true, type: 'text' },
    { key: 'prior_knowledge', label: '前置知识（选填）', placeholder: '学生已掌握的相关知识...', required: false, type: 'textarea' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '如：用航海举例、侧重实验...', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
```

- [ ] **Step 2: 故事化讲解模板**

创建 `src/data/prompts/explain/story-based.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const storyBasedPrompt: PromptTemplate = {
  id: 'explain-story-based',
  title: '故事化讲解',
  scenario: 'explain',
  icon: '📚',
  description: '用完整的故事情节串联知识点，让学习像听故事一样有趣',
  tags: ['故事教学', '情境学习', '趣味'],
  template: `你是一位擅长用故事讲知识的名师。请围绕"{{knowledge_point}}"创作一个生动的教学故事。

目标学生：{{student_grade}}

故事要求：
1. 故事主角是一个与学生年龄相仿的孩子
2. 故事自然引入"{{knowledge_point}}"概念
3. 通过主角的探索/困难/发现来展现知识点的本质
4. 故事结束后总结核心知识点
5. 设计一个"故事续写"小任务，让学生运用所学

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请保持故事趣味性，适合家长讲给孩子听。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分数的乘法、浮力...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：小学三年级...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '如：科幻背景、历史故事...', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物', '历史'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
```

- [ ] **Step 3: 苏格拉底式提问模板**

创建 `src/data/prompts/explain/socratic.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const socraticPrompt: PromptTemplate = {
  id: 'explain-socratic',
  title: '苏格拉底式提问',
  scenario: 'explain',
  icon: '🤔',
  description: '通过连环提问引导学生自主发现知识，不给答案',
  tags: ['苏格拉底法', '引导发现', '高阶思维'],
  template: `你是一位精通苏格拉底教学法的名师。请针对"{{knowledge_point}}"设计一套连环提问。

目标学生：{{student_grade}}

提问设计原则：
1. 第一层：回忆与激活（你已经知道什么？）
2. 第二层：理解与解释（这是什么意思？用自己的话说）
3. 第三层：应用与迁移（如果...会怎样？）
4. 第四层：分析与比较（这和...有什么不同？为什么？）
5. 第五层：评价与创造（你能设计一个新例子吗？）

每层 2-3 个问题，层层递进，环环相扣。
每个问题后给出"家长引导提示"——当孩子卡住时如何启发。

{{#if prior_knowledge}}
学生已掌握：{{prior_knowledge}}
{{/if}}

请记住：不要直接给答案！用提问引导孩子自己发现。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：光合作用、方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一、高二...', required: true, type: 'text' },
    { key: 'prior_knowledge', label: '前置知识（选填）', placeholder: '学生已掌握的相关知识...', required: false, type: 'textarea' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物', '历史'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
```

- [ ] **Step 4: 桥梁类比法模板**

创建 `src/data/prompts/explain/bridge-analogy.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const bridgeAnalogyPrompt: PromptTemplate = {
  id: 'explain-bridge-analogy',
  title: '桥梁类比法',
  scenario: 'explain',
  icon: '🌉',
  description: '用已知知识搭建理解新概念的桥梁，从熟悉到陌生',
  tags: ['类比', '脚手架', '建构主义'],
  template: `你是一位擅长用类比教学的名师。请用"桥梁类比法"讲解"{{knowledge_point}}"。

目标学生：{{student_grade}}

讲解结构：
1. **起点**：从学生已知的"{{known_concept}}"出发
2. **搭桥**：找到已知概念与新概念的 3 个连接点
3. **过河**：通过连接点逐步引出新概念的核心
4. **验收**：用 2 道题检验学生是否真正理解
5. **延伸**：这个类比在哪里会"失效"？（避免过度类比）

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保类比准确、不误导，适合家长辅导使用。`,
  variables: [
    { key: 'knowledge_point', label: '新知识点', placeholder: '如：负数、电流、被动语态...', required: true, type: 'text' },
    { key: 'known_concept', label: '已知的类比概念', placeholder: '如：温度、水流、主动语态...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初一...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '英语'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
```

- [ ] **Step 5: 可视化讲解模板**

创建 `src/data/prompts/explain/visual-explain.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const visualExplainPrompt: PromptTemplate = {
  id: 'explain-visual',
  title: '可视化讲解',
  scenario: 'explain',
  icon: '🎨',
  description: '用思维导图/流程图/对比表等可视化方式呈现知识结构',
  tags: ['可视化', '思维导图', '结构化'],
  template: `你是一位擅长可视化教学的名师。请用多种可视化方式呈现"{{knowledge_point}}"的知识结构。

目标学生：{{student_grade}}

可视化要求：
1. **思维导图**：用 Mermaid 语法绘制知识点的思维导图
2. **核心公式/规则**：用表格清晰呈现（含含义和单位）
3. **对比表**：与易混淆概念进行对比（至少 3 个维度）
4. **流程图**：用 Mermaid 语法制订解题步骤流程图

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保 Mermaid 语法正确可渲染，适合家长打印出来辅导孩子。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：勾股定理、化学反应速率...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
```

- [ ] **Step 6: 常见误解剖析模板**

创建 `src/data/prompts/explain/misconception.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const misconceptionPrompt: PromptTemplate = {
  id: 'explain-misconception',
  title: '常见误解剖析',
  scenario: 'explain',
  icon: '⚠️',
  description: '针对学生常见错误概念进行正误对比，防患于未然',
  tags: ['误解分析', '正误对比', '预防性'],
  template: `你是一位深谙学生思维误区的名师。请针对"{{knowledge_point}}"进行误解剖析。

目标学生：{{student_grade}}

剖析结构：
1. **正确理解**：用简洁语言准确表述概念
2. **5 个常见误解**：
   - 误解内容（学生通常怎么想错的）
   - 错误原因（为什么会这样想）
   - 正确纠正（如何讲清楚）
   - 检验问题（一题辨对错）
3. **教学建议**：家长如何提前预防这些误解
4. **诊断测试**：3 道判断题用于检测孩子是否有这些误解

请确保分析基于真实学情，不要编造不存在的"误解"。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：质量与重量、0.9循环=1...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
```

- [ ] **Step 7: 创建 explain/index.ts**

创建 `src/data/prompts/explain/index.ts`：

```typescript
import type { PromptTemplate } from '../types';
import { deepConceptPrompt } from './deep-concept';
import { storyBasedPrompt } from './story-based';
import { socraticPrompt } from './socratic';
import { bridgeAnalogyPrompt } from './bridge-analogy';
import { visualExplainPrompt } from './visual-explain';
import { misconceptionPrompt } from './misconception';

export const EXPLAIN_PROMPTS: PromptTemplate[] = [
  deepConceptPrompt,
  storyBasedPrompt,
  socraticPrompt,
  bridgeAnalogyPrompt,
  visualExplainPrompt,
  misconceptionPrompt,
];
```

- [ ] **Step 8: 提交**

```bash
git add src/data/prompts/explain/
git commit -m "feat(prompts): add 6 explain prompt templates"
```

---

## Task 3: 创建出题组卷类模板（6 个）

**Files:**
- Create: `src/data/prompts/generate/gradient.ts`
- Create: `src/data/prompts/generate/exam-paper.ts`
- Create: `src/data/prompts/generate/mistake-focused.ts`
- Create: `src/data/prompts/generate/concept-check.ts`
- Create: `src/data/prompts/generate/challenge.ts`
- Create: `src/data/prompts/generate/adaptive.ts`
- Create: `src/data/prompts/generate/index.ts`

- [ ] **Step 1: 梯度出题模板**

创建 `src/data/prompts/generate/gradient.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const gradientPrompt: PromptTemplate = {
  id: 'generate-gradient',
  title: '梯度出题',
  scenario: 'generate',
  icon: '📊',
  description: '生成基础/提高/挑战三档题目，附详细解析',
  tags: ['分层', '梯度', '系统性'],
  template: `你是一位命题经验丰富的{{student_grade}}{{subject}}名师。请围绕"{{knowledge_point}}"生成一套梯度练习题。

题目配置：
- 基础题 3 道（直接应用概念，确保信心）
- 提高题 2 道（需要一步转化或综合）
- 挑战题 1 道（需要多步推理或创新思维）

每道题包含：
1. 题目（清晰表述）
2. 解题步骤（详细、分步）
3. 答案与解析
4. 考查点标注

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保题目不超纲、表述规范、难度梯度合理。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：一元二次方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'special_request', label: '特殊要求（选填）', placeholder: '', required: false, type: 'text' },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
```

- [ ] **Step 2: 模拟卷模板**

创建 `src/data/prompts/generate/exam-paper.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const examPaperPrompt: PromptTemplate = {
  id: 'generate-exam-paper',
  title: '模拟卷生成',
  scenario: 'generate',
  icon: '📋',
  description: '生成一套完整模拟卷，含选择、填空、解答题',
  tags: ['组卷', '模拟考', '完整卷'],
  template: `你是一位精通{{student_grade}}教学的{{subject}}名师。请围绕"{{knowledge_point}}"出一套 {{duration}} 分钟的模拟卷。

试卷结构：
- 一、选择题（4 道，每题 3 分）
- 二、填空题（4 道，每题 3 分）
- 三、解答题（2 道，共 20 分）

命题要求：
- 覆盖"{{knowledge_point}}"的核心考点
- 难度分布：基础 60%、提高 30%、挑战 10%
- 每题附参考答案和详细解析
- 写出试卷说明（考查重点、建议时间分配）

请确保题目原创、无超纲内容。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：函数与方程...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
    { key: 'subject', label: '学科', placeholder: '如：数学...', required: true, type: 'text' },
    { key: 'duration', label: '考试时长（分钟）', placeholder: '如：60、90...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
```

- [ ] **Step 3: 易错题专项模板**

创建 `src/data/prompts/generate/mistake-focused.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const mistakeFocusedPrompt: PromptTemplate = {
  id: 'generate-mistake-focused',
  title: '易错题专项',
  scenario: 'generate',
  icon: '🎯',
  description: '针对常见易错点设计题目，让孩子在错误中学习',
  tags: ['易错', '避坑', '针对性'],
  template: `你是一位深谙学生易错点的名师。请针对"{{knowledge_point}}"的常见易错点设计专项练习。

目标学生：{{student_grade}}

题目设计：
1. 列出该知识点的 5 个典型易错点
2. 每个易错点配 1 道"陷阱题"（看似简单但容易做错）
3. 每道题详细解析"为什么会错"和"如何避免"
4. 最后出 2 道综合题检验是否真正掌握

请确保陷阱设计巧妙但不过分刁钻，目的是加深理解而非为难学生。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：分式方程、化学方程式...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初三...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
```

- [ ] **Step 4: 概念诊断模板**

创建 `src/data/prompts/generate/concept-check.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const conceptCheckPrompt: PromptTemplate = {
  id: 'generate-concept-check',
  title: '概念诊断',
  scenario: 'generate',
  icon: '🔬',
  description: '5 道精题快速诊断概念理解程度，定位薄弱点',
  tags: ['诊断', '快速', '定位薄弱'],
  template: `你是一位擅长学情诊断的名师。请针对"{{knowledge_point}}"设计一套 5 题概念诊断卷。

目标学生：{{student_grade}}

诊断设计：
- 第 1 题：概念识别（能否辨认）
- 第 2 题：概念理解（能否解释）
- 第 3 题：概念辨析（能否区分相似概念）
- 第 4 题：概念应用（能否解决简单问题）
- 第 5 题：概念迁移（能否解决变式问题）

每题后给出：
- 做对说明：该维度已掌握
- 做错说明：该维度需要加强 + 具体建议

最后给出整体评估：掌握程度（初阶/中阶/高阶）和后续学习建议。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：密度、函数单调性...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.7,
  author: '清北名师团队',
};
```

- [ ] **Step 5: 思维挑战题模板**

创建 `src/data/prompts/generate/challenge.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const challengePrompt: PromptTemplate = {
  id: 'generate-challenge',
  title: '思维挑战',
  scenario: 'generate',
  icon: '🏆',
  description: '设计开放性、探究性的高阶思维题目，培养创新能力',
  tags: ['挑战', '开放', '高阶思维'],
  template: `你是一位擅长培养学生高阶思维的名师。请围绕"{{knowledge_point}}"设计思维挑战题。

目标学生：{{student_grade}}

挑战题设计：
1. **开放探究题**（1 道）：条件开放或结论开放，需要学生自己探索
2. **实际建模题**（1 道）：将知识点应用到真实情境中建模求解
3. **跨学科题**（1 道）：融合其他学科知识解决问题

每题包含：
- 题目（情境化、有挑战但可解）
- 解题思路提示（分层次：金钥匙→银钥匙→铜钥匙）
- 参考解答
- 拓展思考（如果改变某个条件会怎样？）

请确保题目有"跳一跳够得着"的难度，激发思考而非打击信心。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：概率、能量守恒...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：高一...', required: true, type: 'text' },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.9,
  author: '清北名师团队',
};
```

- [ ] **Step 6: 自适应出题模板**

创建 `src/data/prompts/generate/adaptive.ts`：

```typescript
import type { PromptTemplate } from '../types';

export const adaptivePrompt: PromptTemplate = {
  id: 'generate-adaptive',
  title: '自适应出题',
  scenario: 'generate',
  icon: '🔄',
  description: '根据学生答题情况动态调整难度的出题策略',
  tags: ['自适应', '动态', '个性化'],
  template: `你是一位精通自适应学习的名师。请为"{{knowledge_point}}"设计一套自适应出题方案。

目标学生：{{student_grade}}，当前水平：{{current_level}}

自适应策略：
1. **初始评估**：3 道题快速定位学生水平
2. **动态调整规则**：
   - 连续 2 题正确 → 难度提升一档
   - 连续 2 题错误 → 难度降低一档 + 给出知识点复习提示
   - 1 对 1 错 → 保持当前难度
3. **终止条件**：连续 3 题正确（达标）或完成 10 题
4. **输出最终评估报告**：掌握度、薄弱点、建议

请生成初始 3 道评估题，并说明后续出题策略。`,
  variables: [
    { key: 'knowledge_point', label: '知识点', placeholder: '如：因式分解...', required: true, type: 'text' },
    { key: 'student_grade', label: '学生年级', placeholder: '如：初二...', required: true, type: 'text' },
    { key: 'current_level', label: '当前水平', placeholder: '基础/中等/优秀', required: true, type: 'select', options: ['基础', '中等', '优秀'] },
  ],
  grades: ['middle', 'high'],
  subjects: ['数学', '物理', '化学'],
  usageCount: 0,
  rating: 4.6,
  author: '清北名师团队',
};
```

- [ ] **Step 7: 创建 generate/index.ts**

创建 `src/data/prompts/generate/index.ts`：

```typescript
import type { PromptTemplate } from '../types';
import { gradientPrompt } from './gradient';
import { examPaperPrompt } from './exam-paper';
import { mistakeFocusedPrompt } from './mistake-focused';
import { conceptCheckPrompt } from './concept-check';
import { challengePrompt } from './challenge';
import { adaptivePrompt } from './adaptive';

export const GENERATE_PROMPTS: PromptTemplate[] = [
  gradientPrompt,
  examPaperPrompt,
  mistakeFocusedPrompt,
  conceptCheckPrompt,
  challengePrompt,
  adaptivePrompt,
];
```

- [ ] **Step 8: 提交**

```bash
git add src/data/prompts/generate/
git commit -m "feat(prompts): add 6 generate prompt templates"
```

---

## Task 4: 创建其余 6 类模板（各 6 个）

按照 Task 2-3 的模式，为剩余 6 个场景各创建 6 个高质量模板。每个场景的文件结构与 `explain/` 和 `generate/` 相同。

**Files (all created in this task):**
- `src/data/prompts/assess/` (6 个模板 + index.ts)
- `src/data/prompts/plan/` (6 个模板 + index.ts)
- `src/data/prompts/error-analysis/` (6 个模板 + index.ts)
- `src/data/prompts/derivation/` (6 个模板 + index.ts)
- `src/data/prompts/explore/` (6 个模板 + index.ts)
- `src/data/prompts/interaction/` (6 个模板 + index.ts)

- [ ] **Step 1: 测评批改类模板 (assess)**

创建以下 6 个文件 + `index.ts`：

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `answer-review.ts` | 作答点评 | 对学生答案给出专业点评和改进建议 | ['点评', '反馈', '改进'] |
| `rubric-based.ts` | 量规评分 | 按评分量规给出分维度评价和总分 | ['量规', '分维度', '客观'] |
| `peer-review.ts` | 互评引导 | 引导学生互相批改、学习他人思路 | ['互评', '合作', '多元视角'] |
| `self-assessment.ts` | 自我反思 | 引导学生自我检查和反思学习过程 | ['元认知', '反思', '自主学习'] |
| `progress-check.ts` | 阶段检测 | 单元/阶段知识掌握情况检测 | ['检测', '阶段性', '查漏补缺'] |
| `oral-defense.ts` | 口述答辩 | 通过口述方式检验理解深度 | ['口述', '理解深度', '表达能力'] |

- [ ] **Step 2: 学习计划类模板 (plan)**

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `weekly-plan.ts` | 周学习计划 | 制定一周的每日学习安排 | ['周计划', '日常', '可执行'] |
| `exam-prep.ts` | 备考计划 | 考前冲刺复习计划 | ['备考', '冲刺', '高效'] |
| `summer-plan.ts` | 假期规划 | 寒暑假长期学习规划 | ['假期', '长期', '劳逸结合'] |
| `weak-point.ts` | 弱项攻坚 | 针对薄弱知识点的专项攻坚计划 | ['弱项', '专项', '突破'] |
| `habit-building.ts` | 习惯养成 | 培养良好学习习惯的 21 天计划 | ['习惯', '21天', '养成'] |
| `milestone.ts` | 里程碑规划 | 学期/学年学习目标和里程碑 | ['里程碑', '目标', '长期规划'] |

- [ ] **Step 3: 错题分析类模板 (error-analysis)**

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `root-cause.ts` | 根因分析 | 深挖错题的根本原因 | ['根因', '深度', '治本'] |
| `concept-gap.ts` | 概念缺口 | 识别错题背后的概念理解漏洞 | ['概念', '漏洞', '补缺'] |
| `thinking-path.ts` | 思维路径 | 还原学生解题的思维过程，找到卡点 | ['思维', '过程', '诊断'] |
| `transfer-practice.ts` | 变式迁移 | 通过变式题检验是否真正掌握 | ['变式', '迁移', '举一反三'] |
| `meta-cognition.ts` | 元认知训练 | 培养学生对自身思考的监控能力 | ['元认知', '自我监控', '高阶'] |
| `error-pattern.ts` | 错误模式 | 识别学生反复出现的错误模式 | ['模式', '规律', '预防'] |

- [ ] **Step 4: 公式推导类模板 (derivation)**

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `step-by-step.ts` | 逐步推导 | 分步骤详细推导公式/定理 | ['逐步', '详细', '严谨'] |
| `intuitive-proof.ts` | 直观理解 | 用直觉和实例帮助理解公式含义 | ['直观', '直觉', '理解'] |
| `historical-context.ts` | 历史背景 | 从数学史/科学史角度讲解公式发现过程 | ['历史', '背景', '人文'] |
| `visual-proof.ts` | 图形证明 | 用图形/动画思路可视化证明公式 | ['图形', '可视化', '直觉'] |
| `real-world.ts` | 实际应用 | 展示公式在生活中的实际应用 | ['应用', '生活', '价值'] |
| `extension.ts` | 拓展延伸 | 从基础公式拓展到更一般形式 | ['拓展', '延伸', '高阶'] |

- [ ] **Step 5: 拓展探究类模板 (explore)**

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `cross-discipline.ts` | 跨学科融合 | 展示知识点与其他学科的联系 | ['跨学科', '融合', '视野'] |
| `frontier-science.ts` | 前沿科学 | 介绍知识点在前沿科学中的应用 | ['前沿', '科学', '激发'] |
| `history-science.ts` | 科学史话 | 讲述知识发现背后的科学史故事 | ['科学史', '故事', '人文'] |
| `hands-on-project.ts` | 动手实践 | 设计可动手操作的探究项目 | ['实践', '动手', '项目'] |
| `debate-topic.ts` | 辩论话题 | 围绕知识点设计辩论/讨论话题 | ['辩论', '批判思维', '表达'] |
| `career-connection.ts` | 职业连接 | 展示知识点与未来职业的联系 | ['职业', '未来', '激励'] |

- [ ] **Step 6: 亲子互动类模板 (interaction)**

| 文件 | 标题 | 描述 | 标签 |
|------|------|------|------|
| `game-based.ts` | 游戏化学习 | 设计一个亲子学习游戏 | ['游戏', '趣味', '互动'] |
| `dialogue-script.ts` | 对话脚本 | 编写家长与孩子的辅导对话脚本 | ['对话', '脚本', '实操'] |
| `experiment-kit.ts` | 家庭实验 | 用家庭材料设计简易实验 | ['实验', '材料易得', '安全'] |
| `story-co-create.ts` | 故事共创 | 家长和孩子一起创作教学故事 | ['共创', '想象', '表达'] |
| `quiz-battle.ts` | 知识问答赛 | 设计亲子知识抢答游戏 | ['竞赛', '抢答', '趣味'] |
| `real-life-task.ts` | 生活任务 | 设计将知识应用到生活中的亲子任务 | ['生活', '任务', '实用'] |

- [ ] **Step 7: 提交**

```bash
git add src/data/prompts/
git commit -m "feat(prompts): add 36 prompt templates across 6 scenarios (assess, plan, error-analysis, derivation, explore, interaction)"
```

---

## Task 5: 创建 prompts/index.ts 汇总与查询函数

**Files:**
- Create: `src/data/prompts/index.ts`

- [ ] **Step 1: 创建汇总文件**

```typescript
import type { PromptTemplate, PromptScenario, GradeLevel } from './types';
import { EXPLAIN_PROMPTS } from './explain';
import { GENERATE_PROMPTS } from './generate';
import { ASSESS_PROMPTS } from './assess';
import { PLAN_PROMPTS } from './plan';
import { ERROR_ANALYSIS_PROMPTS } from './error-analysis';
import { DERIVATION_PROMPTS } from './derivation';
import { EXPLORE_PROMPTS } from './explore';
import { INTERACTION_PROMPTS } from './interaction';

export type { PromptTemplate, PromptScenario } from './types';
export type { GradeLevel } from '../knowledge';

export const ALL_PROMPTS: PromptTemplate[] = [
  ...EXPLAIN_PROMPTS,
  ...GENERATE_PROMPTS,
  ...ASSESS_PROMPTS,
  ...PLAN_PROMPTS,
  ...ERROR_ANALYSIS_PROMPTS,
  ...DERIVATION_PROMPTS,
  ...EXPLORE_PROMPTS,
  ...INTERACTION_PROMPTS,
];

/** 按场景查找 */
export function getPromptsByScenario(scenario: PromptScenario): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => p.scenario === scenario);
}

/** 按年级和学科筛选 */
export function filterPrompts(filters: {
  grade?: GradeLevel;
  subject?: string;
  scenario?: PromptScenario;
}): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => {
    if (filters.grade && !p.grades.includes(filters.grade)) return false;
    if (filters.subject && !p.subjects.includes(filters.subject)) return false;
    if (filters.scenario && p.scenario !== filters.scenario) return false;
    return true;
  });
}

/** 按知识点查找关联模板 */
export function getPromptsByKnowledgePoint(kpId: string): PromptTemplate[] {
  return ALL_PROMPTS.filter(p => p.knowledgePointIds?.includes(kpId));
}

/** 搜索模板 */
export function searchPrompts(query: string): PromptTemplate[] {
  const q = query.toLowerCase();
  return ALL_PROMPTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

/** 根据 ID 查找 */
export function getPromptById(id: string): PromptTemplate | undefined {
  return ALL_PROMPTS.find(p => p.id === id);
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/prompts/index.ts
git commit -m "feat(prompts): add prompt index with query functions"
```

---

## Task 6: 新增 generateFromTemplate 服务函数

**Files:**
- Modify: `src/services/ai.ts`

- [ ] **Step 1: 添加 PromptTemplate 导入和 generateFromTemplate 函数**

在 `src/services/ai.ts` 顶部添加导入：

```typescript
import type { PromptTemplate } from '../data/prompts/types';
```

在文件末尾（`generateFormulaDerivation` 之后）添加：

```typescript
export const generateFromTemplate = async (
  template: PromptTemplate,
  variables: Record<string, string>,
  onStream: (chunk: string) => void
): Promise<void> => {
  const config = getAIConfig();
  if (!config || !config.apiKey) {
    throw new Error('API Key not configured');
  }

  // 组装最终 prompt：替换 {{variable}} 占位符
  let finalPrompt = template.template;
  for (const [key, value] of Object.entries(variables)) {
    finalPrompt = finalPrompt.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
      value
    );
  }

  // 处理条件块 {{#if variable}}...{{/if}}
  finalPrompt = finalPrompt.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => variables[key] ? content : ''
  );

  // 清理残留占位符
  finalPrompt = finalPrompt.replace(/\{\{[^}]+\}\}/g, '');

  const client = new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const stream = await client.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: finalPrompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onStream(content);
      }
    }
  } catch (error) {
    console.error('AI Template Generation Error:', error);
    throw error;
  }
};
```

- [ ] **Step 2: 提交**

```bash
git add src/services/ai.ts
git commit -m "feat(ai): add generateFromTemplate function for prompt templates"
```

---

## Task 7: 创建 PromptModal 及子组件

**Files:**
- Create: `src/components/prompts/PromptModal.tsx`
- Create: `src/components/prompts/PromptFilterBar.tsx`
- Create: `src/components/prompts/PromptCard.tsx`
- Create: `src/components/prompts/PromptGrid.tsx`
- Create: `src/components/prompts/PromptDetail.tsx`
- Create: `src/components/prompts/PromptVariableInput.tsx`
- Create: `src/components/prompts/PromptResult.tsx`

- [ ] **Step 1: PromptVariableInput.tsx**

```tsx
import type { PromptVariable } from '../../data/prompts/types';

interface Props {
  variable: PromptVariable;
  value: string;
  onChange: (key: string, value: string) => void;
}

export const PromptVariableInput: React.FC<Props> = ({ variable, value, onChange }) => {
  const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {variable.label}
        {variable.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {variable.type === 'textarea' ? (
        <textarea
          className={`${baseClass} h-24 resize-none`}
          placeholder={variable.placeholder}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        />
      ) : variable.type === 'select' ? (
        <select
          className={baseClass}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        >
          <option value="">请选择...</option>
          {variable.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className={baseClass}
          placeholder={variable.placeholder}
          value={value}
          onChange={e => onChange(variable.key, e.target.value)}
        />
      )}
    </div>
  );
};
```

- [ ] **Step 2: PromptCard.tsx**

```tsx
import type { PromptTemplate } from '../../data/prompts/types';

interface Props {
  template: PromptTemplate;
  onClick: (template: PromptTemplate) => void;
}

export const PromptCard: React.FC<Props> = ({ template, onClick }) => {
  return (
    <button
      onClick={() => onClick(template)}
      className="text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{template.icon}</span>
        <span className="text-xs text-gray-400">⭐ {template.rating}</span>
      </div>
      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
        {template.title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
};
```

- [ ] **Step 3: PromptGrid.tsx**

```tsx
import type { PromptTemplate } from '../../data/prompts/types';
import { PromptCard } from './PromptCard';

interface Props {
  templates: PromptTemplate[];
  onSelect: (template: PromptTemplate) => void;
}

export const PromptGrid: React.FC<Props> = ({ templates, onSelect }) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>没有找到匹配的提示词模板</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(t => (
        <PromptCard key={t.id} template={t} onClick={onSelect} />
      ))}
    </div>
  );
};
```

- [ ] **Step 4: PromptFilterBar.tsx**

```tsx
import type { GradeLevel } from '../../data/knowledge';
import type { PromptScenario } from '../../data/prompts/types';

interface Props {
  grade: GradeLevel | '';
  subject: string;
  scenario: PromptScenario | '';
  searchQuery: string;
  resultCount: number;
  onGradeChange: (grade: GradeLevel | '') => void;
  onSubjectChange: (subject: string) => void;
  onScenarioChange: (scenario: PromptScenario | '') => void;
  onSearchChange: (query: string) => void;
}

const SUBJECTS = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理'];
const SCENARIOS: { value: PromptScenario; label: string }[] = [
  { value: 'explain', label: '知识讲解' },
  { value: 'generate', label: '出题组卷' },
  { value: 'assess', label: '测评批改' },
  { value: 'plan', label: '学习计划' },
  { value: 'error-analysis', label: '错题分析' },
  { value: 'derivation', label: '公式推导' },
  { value: 'explore', label: '拓展探究' },
  { value: 'interaction', label: '亲子互动' },
];

export const PromptFilterBar: React.FC<Props> = ({
  grade, subject, scenario, searchQuery, resultCount,
  onGradeChange, onSubjectChange, onScenarioChange, onSearchChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={grade}
          onChange={e => onGradeChange(e.target.value as GradeLevel | '')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部年级</option>
          <option value="primary">小学</option>
          <option value="middle">初中</option>
          <option value="high">高中</option>
        </select>
        <select
          value={subject}
          onChange={e => onSubjectChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部学科</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={scenario}
          onChange={e => onScenarioChange(e.target.value as PromptScenario | '')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">全部场景</option>
          {SCENARIOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input
          type="text"
          placeholder="🔍 搜索提示词..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <p className="text-xs text-gray-400">共 {resultCount} 个模板</p>
    </div>
  );
};
```

- [ ] **Step 5: PromptDetail.tsx**

```tsx
import { useState } from 'react';
import type { PromptTemplate } from '../../data/prompts/types';
import { PromptVariableInput } from './PromptVariableInput';

interface Props {
  template: PromptTemplate;
  prefilledVars?: Record<string, string>;
  onSend: (variables: Record<string, string>) => void;
  onCopy: () => void;
  onBack: () => void;
}

export const PromptDetail: React.FC<Props> = ({ template, prefilledVars, onSend, onCopy, onBack }) => {
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.variables.forEach(v => {
      initial[v.key] = prefilledVars?.[v.key] || v.defaultValue || '';
    });
    return initial;
  });

  const allRequiredFilled = template.variables
    .filter(v => v.required)
    .every(v => variables[v.key]?.trim());

  const handleChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">← 返回</button>
        <span className="text-xl">{template.icon}</span>
        <h3 className="text-lg font-bold">{template.title}</h3>
      </div>
      <p className="text-sm text-gray-500">{template.description}</p>
      <div className="border-t pt-4">
        {template.variables.map(v => (
          <PromptVariableInput
            key={v.key}
            variable={v}
            value={variables[v.key]}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSend(variables)}
          disabled={!allRequiredFilled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          🚀 发送 AI
        </button>
        <button
          onClick={onCopy}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          📋 复制 Prompt
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 6: PromptResult.tsx**

```tsx
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  isStreaming: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onEditParams: () => void;
  onBack: () => void;
}

export const PromptResult: React.FC<Props> = ({ content, isStreaming, onRegenerate, onCopy, onEditParams, onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">← 返回</button>
        <div className="flex gap-2">
          <button onClick={onRegenerate} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">🔄 重新生成</button>
          <button onClick={onCopy} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">📋 复制结果</button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none bg-gray-50 rounded-xl p-6 min-h-[200px]">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5" />}
      </div>
      {!isStreaming && content && (
        <div className="flex justify-center">
          <button onClick={onEditParams} className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            ✏️ 修改参数重新生成
          </button>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 7: PromptModal.tsx（主组件）**

```tsx
import { useState, useMemo, useCallback } from 'react';
import type { PromptTemplate } from '../../data/prompts/types';
import type { GradeLevel } from '../../data/knowledge';
import type { PromptScenario } from '../../data/prompts/types';
import { ALL_PROMPTS, filterPrompts, searchPrompts } from '../../data/prompts';
import { generateFromTemplate } from '../../services/ai';
import { PromptFilterBar } from './PromptFilterBar';
import { PromptGrid } from './PromptGrid';
import { PromptDetail } from './PromptDetail';
import { PromptResult } from './PromptResult';

type ModalState = 'browse' | 'detail' | 'result';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  knowledgePointId?: string;
  knowledgePointTitle?: string;
  knowledgePointGrade?: string;
}

export const PromptModal: React.FC<Props> = ({ isOpen, onClose, knowledgePointId, knowledgePointTitle, knowledgePointGrade }) => {
  const [state, setState] = useState<ModalState>('browse');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [grade, setGrade] = useState<GradeLevel | ''>('');
  const [subject, setSubject] = useState('');
  const [scenario, setScenario] = useState<PromptScenario | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const filteredTemplates = useMemo(() => {
    let templates = grade || scenario ? filterPrompts({ grade: grade || undefined, subject: subject || undefined, scenario: scenario || undefined }) : ALL_PROMPTS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      templates = templates.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return templates;
  }, [grade, subject, scenario, searchQuery]);

  const handleSelectTemplate = useCallback((template: PromptTemplate) => {
    setSelectedTemplate(template);
    setState('detail');
  }, []);

  const handleSend = useCallback(async (vars: Record<string, string>) => {
    if (!selectedTemplate) return;
    setVariables(vars);
    setState('result');
    setResult('');
    setIsStreaming(true);

    try {
      await generateFromTemplate(selectedTemplate, vars, (chunk) => {
        setResult(prev => prev + chunk);
      });
    } catch (error) {
      setResult(`⚠️ 生成失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsStreaming(false);
    }
  }, [selectedTemplate]);

  const handleCopyPrompt = useCallback(() => {
    if (!selectedTemplate) return;
    let prompt = selectedTemplate.template;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    navigator.clipboard.writeText(prompt);
  }, [selectedTemplate, variables]);

  const handleBack = useCallback(() => {
    if (state === 'result') setState('detail');
    else if (state === 'detail') setState('browse');
    else onClose();
  }, [state, onClose]);

  const prefilledVars = useMemo(() => {
    if (!knowledgePointTitle) return undefined;
    return {
      knowledge_point: knowledgePointTitle,
      student_grade: knowledgePointGrade || '',
    };
  }, [knowledgePointTitle, knowledgePointGrade]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">📝 教学提示词</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {state === 'browse' && (
            <div className="space-y-4">
              <PromptFilterBar
                grade={grade} subject={subject} scenario={scenario}
                searchQuery={searchQuery} resultCount={filteredTemplates.length}
                onGradeChange={setGrade} onSubjectChange={setSubject}
                onScenarioChange={setScenario} onSearchChange={setSearchQuery}
              />
              <PromptGrid templates={filteredTemplates} onSelect={handleSelectTemplate} />
            </div>
          )}
          {state === 'detail' && selectedTemplate && (
            <PromptDetail
              template={selectedTemplate}
              prefilledVars={prefilledVars}
              onSend={handleSend}
              onCopy={handleCopyPrompt}
              onBack={handleBack}
            />
          )}
          {state === 'result' && (
            <PromptResult
              content={result}
              isStreaming={isStreaming}
              onRegenerate={() => handleSend(variables)}
              onCopy={() => navigator.clipboard.writeText(result)}
              onEditParams={handleBack}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 8: 提交**

```bash
git add src/components/prompts/
git commit -m "feat(prompts): add PromptModal and sub-components"
```

---

## Task 8: 在 KnowledgeDetail 中集成模板模式入口

**Files:**
- Modify: `src/components/KnowledgeDetail.tsx`

- [ ] **Step 1: 读取现有 KnowledgeDetail.tsx**

先完整阅读 `src/components/KnowledgeDetail.tsx`，找到 AI 面板的位置。

- [ ] **Step 2: 添加模板模式状态和入口**

在 KnowledgeDetail 组件中：

1. 添加 `import { PromptModal } from './prompts/PromptModal';`
2. 添加 `const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);`
3. 在 AI 面板区域增加"简单模式 / 模板模式"切换按钮
4. 在组件末尾渲染 `<PromptModal>`

具体改动示例（根据实际文件位置调整）：

```tsx
// 在 AI 面板区域增加模式切换
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setAIMode('simple')}
    className={`px-3 py-1 text-sm rounded ${aiMode === 'simple' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
  >
    简单模式
  </button>
  <button
    onClick={() => setAIMode('template')}
    className={`px-3 py-1 text-sm rounded ${aiMode === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
  >
    📝 模板模式
  </button>
</div>

// 在组件末尾添加
<PromptModal
  isOpen={isPromptModalOpen}
  onClose={() => setIsPromptModalOpen(false)}
  knowledgePointId={knowledgePoint?.id}
  knowledgePointTitle={knowledgePoint?.title}
  knowledgePointGrade={currentGrade}
/>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/KnowledgeDetail.tsx
git commit -m "feat(knowledge-detail): integrate prompt template modal"
```

---

## Task 9: 验收测试

- [ ] **Step 1: 运行类型检查**

```bash
npm run build
```

确保 TypeScript 编译通过。

- [ ] **Step 2: 功能验证清单**

逐一验证以下功能：

- [ ] 在知识点详情页能看到"模板模式"入口
- [ ] 点击后弹出全屏模态框
- [ ] 筛选栏能按年级、学科、场景筛选
- [ ] 搜索框能搜索模板
- [ ] 点击模板卡片进入详情页
- [ ] 变量表单根据模板定义动态渲染
- [ ] 必填变量未填写时"发送 AI"按钮禁用
- [ ] 填写变量后点击"发送 AI"能正常流式输出
- [ ] "复制 Prompt"功能正常
- [ ] 关联知识点的模板能自动填充上下文
- [ ] 现有简单模式 AI 功能不受影响
- [ ] 模态框能正常关闭

- [ ] **Step 3: 修复发现的问题**

如有问题，逐一修复并提交。

---

## 实施顺序总结

| 顺序 | Task | 内容 |
|------|------|------|
| 1 | Task 1 | 类型定义 |
| 2 | Task 2 | 知识讲解模板（6 个） |
| 3 | Task 3 | 出题组卷模板（6 个） |
| 4 | Task 4 | 其余 6 类模板（36 个） |
| 5 | Task 5 | 汇总与查询函数 |
| 6 | Task 6 | generateFromTemplate 服务 |
| 7 | Task 7 | PromptModal 及子组件 |
| 8 | Task 8 | KnowledgeDetail 集成 |
| 9 | Task 9 | 验收测试 |
