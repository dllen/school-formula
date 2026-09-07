# 知识点库与教程内容体系补全设计

> 状态：已确认
> 日期：2026-09-07
> 分支：school-formula main

---

## 1. 背景与目标

### 1.1 现状

| 资产 | 现状 | 问题 |
|------|------|------|
| 知识点 | 136 个（小学 31 / 初中 59 / 高中 46） | 覆盖面不足，每学科仅 4-11 个核心知识点 |
| 教程 | 3 本 113 单元（仅小学） | 初高中无预置教程，完全依赖 AI 实时生成 |
| 题库 | ~1422 题 | 初高中题量充足，小学偏少 |
| 提示词模板 | 48 个（8 场景 × 6） | 所有年级共用同一 prompt，生成质量参差不齐 |
| 知识点文件 | 3 个学段大文件 | 单文件 1000-2000 行，扩展后不可维护 |

### 1.2 目标

1. **知识点扩容**：按课程标准全覆盖，达到 500+ 知识点（每学科 20-30 个）
2. **教程入库**：为每个知识点预生成结构化tutorialContent，不依赖 API Key 即可展示完整教程
3. **提示词优化**：为核心场景（explain/interaction/generate）构建年级专属模板，AI 生成质量分级提升
4. **生成流水线**：多 Provider 可配置的批量生成脚本，支持 Ollama（本地）+ DeepSeek/智谱/MiniMax/LongCat/月之暗面等国内主流模型

---

## 2. 设计决策汇总

| # | 决策 | 结论 |
|---|------|------|
| 1 | 整体方案 | 分阶段混合：静态数据 + AI 预生成 + 提示词渐进优化 |
| 2 | 知识点规模 | C 级：按课程标准全覆盖，500+ 知识点 |
| 3 | 文件组织 | 按学段 × 学科拆分为 ~21 个文件 |
| 4 | 生成流水线 | Node.js 脚本，多 Provider 配置（不止 Ollama） |
| 5 | 提示词细化 | explain/interaction/generate 各 3 个年级版本（+9 模板） |
| 6 | 教程展示 | KnowledgeDetail 详情页新增「系统教程」区块 |
| 7 | 知识点分配 | 小学 ~140 / 初中 ~200 / 高中 ~170 |

---

## 3. 数据架构设计

### 3.1 知识点文件拆分

**目标结构**：
```
src/data/knowledge/
├── primary/
│   ├── math.ts          # 数学（~25-30 知识点）
│   ├── chinese.ts       # 语文
│   ├── english.ts       # 英语
│   ├── science.ts       # 科学
│   └── moral.ts         # 道德与法治
├── middle/
│   ├── math.ts          # 数学
│   ├── physics.ts       # 物理
│   ├── chemistry.ts     # 化学
│   ├── biology.ts       # 生物
│   ├── chinese.ts       # 语文
│   ├── english.ts       # 英语
│   ├── history.ts       # 历史
│   ├── geography.ts     # 地理
│   └── moral.ts         # 道德与法治
├── high/
│   ├── math.ts          # 数学
│   ├── physics.ts       # 物理
│   ├── chemistry.ts     # 化学
│   ├── biology.ts       # 生物
│   ├── politics.ts      # 思想政治
│   ├── history.ts       # 历史
│   └── geography.ts     # 地理
├── types.ts             # 类型定义（不变）
├── index.ts             # 统一 re-export 组装 KNOWLEDGE_DATA
├── primary.ts           # re-export primary/* 组装 GradeData（兼容层）
├── middle.ts            # re-export middle/*
└── high.ts              # re-export high/*
```

**每个学科文件结构**（以 `primary/math.ts` 例）：
```typescript
import type { Subject } from '../types';

export const MATH_PRIMARY: Subject = {
    id: 'math-primary',
    name: '数学',
    icon: '🔢',
    knowledgePoints: [
        {
            id: 'p-math-001',
            title: '数的认识',
            description: '整数、小数、分数的认识与比较。',
            funEmoji: '🔢',
            funFact: '...',
            funStory: '...',
            funQuestion: '...',
            funQuestionAnswer: '...',
            detailedExplanation: `...`,
            studyTips: ['...'],
            practiceQuestions: [{ question: '...', answer: '...' }],
            tutorialContent: {           // 新增字段（Phase 3 生成）
                objectives: ['...'],
                explanation: '...',
                examples: [{ title, problem, solution, tip }],
                interaction: '...',
                exercises: [{ question, answer, explanation }]
            }
        },
        // ...25-30 个知识点
    ]
};
```

**迁移策略**（`scripts/split-knowledge.ts` 一次性运行）：

1. **文件拆分**：现有 3 个大文件 → 21 个学科文件（按 3.1 结构）
2. **ID 重命名**：`p-math-1` → `p-math-001`（三位数序号，支持未来扩展到 999）
   - 同步导出 ID 映射表 `scripts/id-mapping.json`（旧 → 新），供其他模块引用更新
3. **引用更新**：以下模块中引用知识点 ID 的字段全部映射到新 ID：
   - `src/data/questions/*.ts` 中的 `knowledgePointIds`（~1422 条引用）
   - `src/data/tutorials/*.ts` 中的知识点关联（如有）
   - `src/data/mastery/` 中的引用（如有）
   - `src/data/prompts/` 中的 `knowledgePointIds`（如有）
4. **兼容层**：原 `primary.ts` / `middle.ts` / `high.ts` 变为 re-export 兼容层，现有导入路径保持不变（`../knowledge/primary` 等）
5. **IDLinter 验证**：运行 `node scripts/validate-id-update.ts` 确认无旧 ID 残留

### 3.2 tutorialContent 类型定义

```typescript
// src/data/types.ts 新增
export interface TutorialContent {
    /** 🎯 本课目标：3-5 条学习目标 */
    objectives: string[];
    /** 📖 知识讲解：核心概念 + 生活案例 + 比喻故事（Markdown） */
    explanation: string;
    /** ✏️ 例题精讲：2-3 道由易到难 */
    examples: {
        title: string;
        problem: string;
        solution: string;
        tip: string;
    }[];
    /** 🧩 亲子互动：5-10 分钟活动描述 */
    interaction: string;
    /** 📝 课后练习：3-5 题 */
    exercises: {
        question: string;
        answer: string;
        explanation: string;
    }[];
}
```

`KnowledgePoint` 新增可选字段 `tutorialContent?: TutorialContent`（渐进兼容：无值则详情页不显示）。

### 3.3 questions 模块同步扩展

题库扩展至覆盖 500+ 知识点，按学段 × 学科拆分：
```
src/data/questions/
├── primary-math-questions.ts      # 新增（目前只有 primary-math.ts）
├── primary-chinese-questions.ts
├── primary-english-questions.ts
├── primary-science-questions.ts   # 新增
├── primary-moral-questions.ts     # 新增
├── middle-*.ts                    # 已有 9 个
└── high-*.ts                      # 新增 7 个
```
`Question.knowledgePointIds` 关联知识点 ID，`getQuestionsByKnowledgePoint` 自动适配新 ID。

---

## 4. 提示词模板体系

### 4.1 新增 9 个年级专属模板

| 场景 | 文件 | 年级定位 |
|------|------|----------|
| explain | `explain-primary.ts` | 小学：故事化、比喻多、emoji 丰富 |
| explain | `explain-middle.ts` | 初中：逻辑清晰、步骤拆解、有严谨性 |
| explain | `explain-high.ts` | 高中：抽象本质、推导过程、深度思考 |
| interaction | `interaction-primary.ts` | 小学：游戏、画画、动手实验 |
| interaction | `interaction-middle.ts` | 初中：探究式、实验设计、讨论 |
| interaction | `interaction-high.ts` | 高中：研究性学习、课题调研 |
| generate | `generate-primary.ts` | 小学：生活场景题、趣味性强 |
| generate | `generate-middle.ts` | 初中：工程应用题、多步推理 |
| generate | `generate-high.ts` | 高中：科技前沿题、综合建模 |

### 4.2 PromptTemplate 类型扩展

```typescript
export interface PromptTemplate {
    // ...现有字段...
    /** 新增：年级专属模板为单值，通用模板为 'all' */
    gradeLevel?: GradeLevel | 'all';
}
```

### 4.3 模板选型逻辑

```typescript
// src/data/prompts/index.ts
export function selectBestTemplate(
    scenario: PromptScenario,
    grade: GradeLevel,
    subject: string
): PromptTemplate {
    // 1. 优先选年级专属模板
    const gradeSpecific = ALL_PROMPTS.find(p =>
        p.scenario === scenario &&
        p.gradeLevel === grade &&
        (p.subjects.includes(subject) || p.subjects.includes('all'))
    );
    if (gradeSpecific) return gradeSpecific;

    // 2. 回退到通用模板
    return ALL_PROMPTS.find(p =>
        p.scenario === scenario &&
        p.gradeLevel === 'all'
    )!;
}
```

### 4.4 差异化 Prompt 设计要点

**小学 explain 模板新增约束**：
- 必须用 1 个生活比喻引入概念（超市、游乐园、厨房等场景）
- 每段文字不超过 3 句话，多用短句
- 至少使用 2 个 emoji 增强可读性
- 亲子互动必须是"5 分钟内可完成的游戏"

**初中 explain 模板新增约束**：
- 必须说明"为什么需要学这个"（实际应用场景）
- 步骤拆解必须标注"第 1 步/第 2 步"
- 例题必须包含易错点提醒

**高中 explain 模板新增约束**：
- 必须给出公式的推导过程（而非仅呈现结果）
- 至少提出 1 个深度思考题（无标准答案，开放讨论）
- 必须联系学科前沿或科技进展

---

## 5. AI 生成流水线（多 Provider）

### 5.1 支持的 Provider

| Provider | baseUrl | 默认模型 | 接入方式 | 备注 |
|----------|---------|----------|----------|------|
| **Ollama（本地）** | http://localhost:11434/v1 | llama3 | 本地 | 免费、无速率限制，需用户自装 Ollama |
| **DeepSeek** | https://api.deepseek.com/v1 | deepseek-chat | API Key | 国内主流，性价比高 |
| **智谱 GLM** | https://open.bigmodel.cn/api/paas/v4 | glm-4 | API Key | 清华系，中文能力强 |
| **MiniMax** | https://api.minimax.io/v1 | MiniMax-M01 | API Key | 多模态，长文本支持好 |
| **LongCat** | https://api.longcat.chat/openai/v1 | LongCat-Flash | API Key | 国产开源，可自部署 |
| **月之暗面 Kimi** | https://api.moonshot.cn/v1 | moonshot-v1-8k | API Key | 长文本能力强 |
| **通义千问** | https://dashscope.aliyuncs.com/compatible-mode/v1 | qwen-plus | API Key | 阿里云，OpenAI 兼容 |
| **OpenAI** | https://api.openai.com/v1 | gpt-4o | API Key | 国际主流，兜底选项 |

所有Provider 均通过 OpenAI 兼容协议接入（`openai` npm 包支持自定义 baseUrl），无需为每个平台编写独立 SDK。

### 5.2 配置文件

```jsonc
// scripts/generate-config.json（gitignore 脱敏后提交模板 generate-config.jsonc）
{
    "provider": "deepseek",           // ollama | deepseek | zhipu | minimax | longcat | moonshot | qwen | openai
    "apiKey": "sk-...",                // 从环境变量 GENERATE_API_KEY 读取优先
    "baseUrl": "",                     // 可选覆盖（默认按 provider 预设）
    "model": "",                       // 可选覆盖
    "concurrency": 3,                  // 并发数（Ollama 建议 1，API 建议 3-5）
    "retryCount": 3,                   // 失败重试次数
    "retryDelayMs": 2000,              // 重试间隔
    "temperature": 0.7,
    "maxTokens": 40096,
    "outputMode": "files",             // files | json | dry-run
    "validateOutput": true,            // 生成后校验必填字段
    "skipExisting": true,              // 断点续跑：跳过已有 tutorialContent 的知识点
    "ranges": [                        // 可选：仅生成指定范围
        { "grade": "primary", "subject": "math" }
    ]
}
```

环境变量支持：`GENERATE_API_KEY`、`GENERATE_BASE_URL`、`GENERATE_MODEL`。

### 5.3 脚本接口

```bash
# 全量生成（跳过已有内容）
node scripts/generate-content.mjs

# 指定 provider
node scripts/generate-content.mjs --provider=deepseek

# 仅小学数学生成
node scripts/generate-content.mjs --grade=primary --subject=math

# 指定多个学科（逗号分隔）
node scripts/generate-content.mjs --subject=math,chinese

# 强制重跑（忽略已有 tutorialContent）
node scripts/generate-content.mjs --force

# 生成校验报告（不写文件，仅检查现有内容质量）
node scripts/generate-content.mjs --validate-only

# dry-run：仅显示 prompt 不调用 API
node scripts/generate-content.mjs --dry-run --grade=primary --subject=math --limit=2
```

### 5.4 生成流程

```
┌─────────────────────────────────────────────────────┐
│ 1. 加载配置（CLI 参数 > 环境变量 > 配置文件）       │
│ 2. 初始化 OpenAI Client（provider baseUrl + apiKey） │
│ 3. 遍历知识点（按 ranges 过滤，skipExisting 跳过）   │
│ 4. 为每个知识点选模板（selectBestTemplate）           │
│ 5. 填充模板变量（注入知识点标题/描述/学科/年级）     │
│ 6. 流式调用 API → 累积输出                           │
│ 7. 校验输出结构（必填字段 + 长度 + 格式）            │
│ 8. 成功：写回学科文件 / 失败：记录 + 重试             │
│ 9. 输出生成报告（成功/失败/跳过统计）+ errors.log     │
└─────────────────────────────────────────────────────┘
```

### 5.5 质量校验规则

```typescript
function validateTutorialContent(tc: TutorialContent): string[] {
    const errors: string[] = [];
    if (tc.objectives.length < 3) errors.push('本课目标少于 3 条');
    if (tc.explanation.length < 200) errors.push('知识讲解过短（<200字）');
    if (tc.examples.length < 2) errors.push('例题少于 2 道');
    if (tc.examples.some(e => !e.solution)) errors.push('例题缺少解答');
    if (tc.interaction.length < 50) errors.push('亲子互动描述过短');
    if (tc.exercises.length < 3) errors.push('课后练习少于 3 道');
    if (tc.exercises.some(ex => !ex.answer)) errors.push('课后练习缺少答案');
    return errors;
}
```

校验失败的知识点写入 `errors.log`，脚本继续下一个。

### 5.6 输出模式

- **`files`（默认）**：直接写回学科数据文件（`tutorialContent` 字段）
- **`json`**：输出 JSON 文件到 `scripts/output/<grade>-<subject>.json`，人工审核后手动合并
- **`dry-run`**：仅生成 prompt 和预期结构，不调用 API，不写文件

### 5.7 Provider 适配要点

| Provider | 已知兼容性问题 | 处理方式 |
|----------|----------------|----------|
| DeepSeek | 默认 maxTokens=4096，需显式放大 | 配置文件设置 `maxTokens: 40096` |
| 智谱 GLM | 部分旧版 SDK 不兼容 streaming | 启用 `stream: true` + 降级为 non-stream fallback |
| MiniMax | 偶发 5xx | retryCount=3，指数退避 |
| Ollama | 无速率限制但本地算力受限 | concurrency=1，避免 OOM |
| LongCat | 需确认 baseUrl 是否正确 | 配置文件可覆盖 baseUrl |

---

## 6. UI 集成

### 6.1 KnowledgeDetail.tsx 变更

在趣味性字段区（funEmoji/funFact/funStory/funQuestion）下方、detailedExplanation 上方新增「📚 系统教程」区块：

```tsx
{point.tutorialContent && (
    <section className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">📚 系统教程</h2>
        {/* 🎯 本课目标 */}
        <div className="mb-4">
            <h3 className="font-semibold text-green-700 mb-2">🎯 本课目标</h3>
            <ul className="list-disc list-inside space-y-1">
                {point.tutorialContent.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                ))}
            </ul>
        </div>
        {/* 📖 知识讲解 */}
        <div className="mb-4">
            <h3 className="font-semibold text-blue-700 mb-2">📖 知识讲解</h3>
            <ReactMarkdown>{point.tutorialContent.explanation}</ReactMarkdown>
        </div>
        {/* ✏️ 例题精讲 */}
        <div className="mb-4">
            <h3 className="font-semibold text-purple-700 mb-2">✏️ 例题精讲</h3>
            {point.tutorialContent.examples.map((ex, i) => (
                <div key={i} className="mb-3 p-3 bg-gray-50 rounded">
                    <p className="font-medium">{ex.title}</p>
                    <p className="text-rose-600">题目：{ex.problem}</p>
                    <p className="text-emerald-700">解答：{ex.solution}</p>
                    <p className="text-sm text-gray-500">💡 {ex.tip}</p>
                </div>
            ))}
        </div>
        {/* 🧩 亲子互动 */}
        <div className="mb-4">
            <h3 className="font-semibold text-amber-700 mb-2">🧩 亲子互动</h3>
            <ReactMarkdown>{point.tutorialContent.interaction}</ReactMarkdown>
        </div>
        {/* 📝 课后练习 */}
        <div>
            <h3 className="font-semibold text-cyan-700 mb-2">📝 课后练习</h3>
            {point.tutorialContent.exercises.map((ex, i) => (
                <details key={i} className="mb-2">
                    <summary className="cursor-pointer font-medium">第 {i+1} 题：{ex.question}</summary>
                    <div className="ml-4 mt-1 p-2 bg-emerald-50 rounded">
                        <p>✅ 答案：{ex.answer}</p>
                        <p className="text-sm text-gray-600">解析：{ex.explanation}</p>
                    </div>
                </details>
            ))}
        </div>
    </section>
)}
```

### 6.2 渐进兼容

- **无 tutorialContent** 的知识点：不显示「系统教程」区块，保持现状
- **有 tutorialContent** 的知识点：完整显示 5 节内容
- **AI 实时生成**（现 generateKnowledgeContent 按钮）：保留在下方，作为"自由拓展"能力

---

## 7. 分阶段实施计划

| 阶段 | 内容 | 交付物 | 验收标准 | 估时 |
|------|------|--------|----------|------|
| **Phase 1** | 知识点文件拆分 + 类型扩展 + 首批学科数据 | 21 个学科文件 + 迁移脚本 | `tsc -b` + `eslint` 通过；首页知识点加载正常 | 1-2h |
| **Phase 2** | 9 个年级专属模板 + 自动选型逻辑 | 57 模板 + selectBestTemplate | 浏览器实测 3 学段生成效果，内容风格差异化明显 | 1-2h |
| **Phase 3** | 生成脚本 + Provider 配置 + 全量教程生成 | scripts/generate-content.mjs + 510 知识点 tutorialContent | 抽检 10% 质量合格，errors.log 集中于可接受的格式问题 | 4-6h（生成 2h + 校验审核 2-4h） |
| **Phase 4** | 提示词迭代优化 + 质量反馈闭环 | 模板 v2 + 质量评分机制 | 用户对比 v1/v2 生成质量，选出更优模板 | 持续 |

### Phase 1 验收

```bash
npm ci
npm run tsc -b --noEmit    # 通过
npm run lint                # 通过
npm run build                # 通过
npm run dev                  # 首页知识点数量显示为 21 个学科的汇总
```

### Phase 2 验收

```bash
# 浏览器打开知识点详情 → 点击 AI 生成 → 观察不同学段的生成结果是否有风格差异
# 检查 explain-primary / explain-middle / explain-high 模板的 prompt 差异化
```

### Phase 3 验收

```bash
node scripts/generate-content.mjs --provider=deepseek --grade=primary --subject=math --dry-run --limit=2
# 确认 prompt 构造正确后，全量运行
GENERATE_API_KEY=sk-xxx node scripts/generate-content.mjs --provider=deepseek
# 检查 errors.log 中的失败条目，人工修复后重跑
```

---

## 8. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 500+ 知识点手工编写工作量巨大 | Phase 1 延期 | AI 辅助生成草稿 + 人工审核，首批先做小学 5 学科（最高价值） |
| AI 生成质量不稳定 | tutorialContent 质量参差 | 质量校验 + errors.log + 人工抽检 + Phase 4 迭代 |
| Provider API 费用/速率限制 | Phase 3 生成慢或失败 | 默认推荐 Ollama（免费）；API provider 设置并发和重试 |
| 知识点文件合并冲突 | 多人协作冲突 | 按学段 × 学科拆文件后，每人负责不同文件，冲突概率极低 |
| tutorialContent 数据结构变更 | 未来升级困难 | 可选字段设计，旧知识点不受影响；类型系统 narrow 校验 |

---

## 9. 范围边界（明确不做）

- ❌ 不修改现有 `tutorials` 模块（小学教程已有 113 单元，独立体系）
- ❌ 不修改现有 `mastery` 模块（心算技巧+进度系统）
- ❌ 不重构路由和 App.tsx 主结构
- ❌ 不新增后端（仍然纯前端 SPA + 本地 AI 生成）
- ❌ 不实现教程评分/用户反馈功能（Phase 4 再说）
- ❌ 不改 `KnowledgePoint` 现有字段（只新增可选字段）

---

## 10. 后续扩展方向（超出本期范围）

- 教程版本管理（v1/v2 共存，用户可选）
- 基于튜토리얼 内容自动生成 Flashcard（Anki 兼容导出）
- 学段过渡知识点关联（小学→初中→高中的知识图谱）
- 家长自定义提示词（以自身教学风格改写模板）
- 多语言教程（基于中文教程生成英文版）

