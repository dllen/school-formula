# 教学提示词功能设计 spec

> 按年级、按学科管理 AI 教学提示词，辅助学习、出题、测评

## 1. 功能概述

在现有 AI 智能助教基础上，新增**教学提示词模板库**功能。平台内置 50+ 个按清北名校教学标准设计的 prompt 模板，覆盖 8 大教学场景。用户选择模板、填写结构化变量后，调用 AI 获得高质量的教学内容。

提示词模板作为现有 AI 功能的**增强模式**（模板模式），与简单模式并行存在，底层复用同一个 AI 调用服务。

## 2. 核心设计决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 提示词形态 | Prompt 模板库（填空式） | 用户选择模板 → 填写变量 → 发送 AI |
| 场景覆盖 | 全部 8 个场景 | 知识讲解、出题组卷、测评批改、学习计划、错题分析、公式推导、拓展探究、亲子互动 |
| 目录组织 | 年级 → 学科 → 场景 | 符合现有知识点库浏览习惯 |
| UI 形态 | 全屏模态框 | 不改变导航结构，上下文保持 |
| 入口位置 | AI 助教子功能 | 在知识点详情页 AI 面板中增加"模板模式" |
| 创建方式 | 纯内置（50+ 模板） | 按清北标准预置，用户只能使用 |
| 与现有 AI 关系 | 增强模式 | 模板模式 + 简单模式并行 |
| 知识点关联 | 混合 | 部分模板关联知识点，部分通用 |
| 数据存储 | 静态 TS 模块 | 与现有数据模式一致 |

## 3. 数据模型

### 3.1 核心类型

```typescript
// src/data/prompts/types.ts

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
  key: string;           // 变量名，如 "knowledge_point"
  label: string;         // 显示名，如 "知识点"
  placeholder: string;   // 输入提示
  required: boolean;     // 是否必填
  type: 'text' | 'select' | 'textarea';
  options?: string[];    // select 类型的选项
  defaultValue?: string; // 默认值
}

/** 提示词模板 */
export interface PromptTemplate {
  id: string;               // 唯一 ID，如 "explain-deep-concept"
  title: string;            // 模板名称
  scenario: PromptScenario; // 场景分类
  icon: string;             // 图标 emoji
  description: string;      // 简短描述
  tags: string[];           // 标签（年级/学科/特色）
  
  // 提示词内容（含 {{variable}} 占位符）
  template: string;
  
  // 需要用户填写的变量
  variables: PromptVariable[];
  
  // 适用年级和学科
  grades: GradeLevel[];
  subjects: string[];
  
  // 关联知识点 ID（可选）
  knowledgePointIds?: string[];
  
  // 元信息
  usageCount: number;       // 使用次数
  rating: number;           // 评分 1-5
  author: string;           // 作者/来源（清北名师）
}
```

### 3.2 文件结构

```
src/data/prompts/
├── types.ts              # 类型定义
├── index.ts              # 汇总导出 + 查询函数
├── explain/              # 知识讲解类（6+ 模板）
├── generate/             # 出题组卷类（6+ 模板）
├── assess/               # 测评批改类（6+ 模板）
├── plan/                 # 学习计划类（6+ 模板）
├── error-analysis/       # 错题分析类（6+ 模板）
├── derivation/           # 公式推导类（6+ 模板）
├── explore/              # 拓展探究类（6+ 模板）
└── interaction/          # 亲子互动类（6+ 模板）
```

### 3.3 模板示例

```typescript
// src/data/prompts/explain/deep-concept.ts
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
    {
      key: 'knowledge_point',
      label: '知识点',
      placeholder: '如：浮力、二次函数、现在完成时...',
      required: true,
      type: 'text',
    },
    {
      key: 'student_grade',
      label: '学生年级',
      placeholder: '如：初二、高一...',
      required: true,
      type: 'text',
    },
    {
      key: 'prior_knowledge',
      label: '前置知识（选填）',
      placeholder: '学生已掌握的相关知识...',
      required: false,
      type: 'textarea',
    },
    {
      key: 'special_request',
      label: '特殊要求（选填）',
      placeholder: '如：用航海举例、侧重实验...',
      required: false,
      type: 'text',
    },
  ],
  grades: ['primary', 'middle', 'high'],
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物'],
  usageCount: 0,
  rating: 4.8,
  author: '清北名师团队',
};
```

### 3.4 查询函数

```typescript
// src/data/prompts/index.ts

import type { GradeLevel } from '../knowledge';
import type { PromptTemplate, PromptScenario } from './types';
import { EXPLAIN_PROMPTS } from './explain';
// ... 其他导入

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

## 4. UI 设计

### 4.1 触发入口

在 `KnowledgeDetail.tsx` 的 AI 面板中，增加"简单模式 / 模板模式"切换：

- **简单模式**：保持现有 AI 功能不变
- **模板模式**：点击后打开全屏模态框

### 4.2 全屏模态框（PromptModal）

全屏模态框包含三个状态：

#### 状态 1：模板浏览

- 顶部：筛选栏（年级、学科、场景下拉 + 搜索框）
- 中部：模板卡片网格（3 列响应式）
- 每个卡片显示：图标、标题、描述、使用次数、评分
- 底部：当前筛选结果数量

#### 状态 2：模板详情 + 变量填写

- 顶部：返回按钮 + 模板标题
- 中部：变量表单（根据模板定义动态渲染）
  - text → 单行输入
  - textarea → 多行输入
  - select → 下拉选择
- 底部：操作按钮
  - "🚀 发送 AI"（必填变量填写后激活）
  - "📋 复制 Prompt"（复制完整 prompt 到剪贴板）
- 如果当前知识点有关联模板，自动填充知识点相关变量

#### 状态 3：AI 输出

- 顶部：返回按钮 + "重新生成" + "复制结果"
- 中部：Markdown 流式输出（复用现有渲染逻辑）
- 底部："修改参数"（返回状态 2）

### 4.3 组件结构

```
src/components/prompts/
├── PromptModal.tsx           # 全屏模态框主组件
├── PromptFilterBar.tsx       # 筛选栏
├── PromptCard.tsx            # 模板卡片
├── PromptGrid.tsx            # 模板网格
├── PromptDetail.tsx          # 模板详情 + 变量表单
├── PromptVariableInput.tsx   # 变量输入组件
└── PromptResult.tsx          # AI 输出结果
```

## 5. 服务层扩展

在 `src/services/ai.ts` 中新增：

```typescript
/**
 * 根据模板 + 用户填写变量，组装最终 prompt 并调用 AI
 */
export async function generateFromTemplate(
  template: PromptTemplate,
  variables: Record<string, string>,
  onStream: (chunk: string) => void
): Promise<void> {
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

  const client = new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  });

  const stream = await client.chat.completions.create({
    model: config.model,
    messages: [{ role: 'user', content: finalPrompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) onStream(content);
  }
}
```

## 6. 与现有功能的关系

### 6.1 AI 功能

- 现有 `generateKnowledgeContent`、`generateTutorialContent` 等函数**保持不变**
- 新增 `generateFromTemplate` 作为模板模式的底层调用
- 两种模式共享同一个 AI 配置（`getAIConfig`）和流式输出逻辑

### 6.2 知识点关联

- 知识讲解类模板：自动关联当前知识点的 `id`、`title`、`description`
- 公式推导类模板：关联对应公式数据
- 通用模板（学习计划、亲子互动）：不绑定特定知识点，用户自行填写

### 6.3 路由

- 不新增路由，模态框通过 `useState` 控制显隐
- 未来可考虑增加 `/prompts` 路由作为独立入口

## 7. 清北标准提示词设计原则

每个内置模板遵循以下设计原则：

1. **学科专家视角**：prompt 中明确角色设定（"你是一位精通 XX 的名师"）
2. **启发式教学**：不直接给答案，设计苏格拉底式提问引导学生思考
3. **结构化输出**：要求 AI 按固定格式输出（比喻→拆解→提问→验证）
4. **学情感知**：考虑学生年级、前置知识、常见误解
5. **家长友好**：输出语言适合家长辅导孩子使用
6. **难度分层**：出题类模板要求基础/提高/挑战三档梯度

## 8. 实施计划概览

1. **数据层**：创建 `src/data/prompts/` 目录，定义类型，编写 50+ 模板
2. **服务层**：在 `ai.ts` 中新增 `generateFromTemplate` 函数
3. **UI 层**：创建 `PromptModal` 及子组件
4. **集成**：在 `KnowledgeDetail.tsx` 中增加模板模式入口
5. **测试**：验证模板变量替换、条件块、流式输出

## 9. 验收标准

- [ ] 用户可在知识点详情页切换到"模板模式"
- [ ] 全屏模态框支持按年级、学科、场景筛选模板
- [ ] 搜索功能可快速定位模板
- [ ] 变量表单根据模板定义动态渲染
- [ ] 必填变量未填写时"发送 AI"按钮禁用
- [ ] 模板变量正确替换，条件块正确处理
- [ ] AI 流式输出正常，Markdown 渲染正确
- [ ] "复制 Prompt"功能可复制完整 prompt 到剪贴板
- [ ] 关联知识点的模板自动填充上下文
- [ ] 50+ 模板覆盖 8 大场景，每个场景 6+ 模板
- [ ] 现有简单模式 AI 功能不受影响
