# A 子项目 · 架构与代码质量重构设计

> 日期：2026-09-29
> 状态：待用户审批
> 子项目 ID：A（架构与代码质量；B 子项目 = 数据生产管线统一，独立后续）
> 范围：A 不包含 B、不包含 pi-agent-edu 拆分、不包含 ESLint 防回归规则

## 概述

针对 `school-formula` 仓库做一轮架构与代码质量重构：

1. **`src/services/ai.ts`** (812 行) 拆为树形目录 `src/services/ai/`：8 个 generator 各 1 文件 + `config.ts` + `storage.ts` + `client.ts`（内部 helper）+ `index.ts` barrel。**外部 import 路径不动**。
2. **`src/components/KnowledgeDetail.tsx`** (390 行) 拆为 `src/components/KnowledgeDetail/`：1 个容器 + 6 个 section 子组件 + AIGenerator（stateful）。
3. **删除 4 个无 caller 的 generator**：`generateExamQuestions` / `generateErrorAnalysis` / `generateStudyPlan` / `generateFormulaDerivation`。
4. **删除 `src/App.css`**（Vite 模板遗留，未引用）。
5. **删除 `scripts/` 根目录所有未引用的 `.mjs` 旧脚本** + 247M 中间产物进 `.gitignore`。
6. **新增 `vitest.config.ts`**，include 收窄到 `src/`，消除 `scripts/**/*.test.{ts,mjs}` 的 "No test suite found" 噪声。
7. **8 个 generator 各加 1 个 happy-path 单测**（mock openai SDK + callGateway）。
8. **删除 KnowledgeDetail 里的 `<SettingsModal>` 死代码**（`isSettingsOpen` 永远 `false`，无 setter）。

行为不变 + 允许顺手清理（修正 typo / 过期注释 / 删除注释掉的代码 / 调整 a11y）。**不**允许调整用户可见文案、Storage key、路由路径、API 调用语义、错误信息字符串。

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| `ai.ts` 拆法 | 树形目录 + barrel | 与 `Header/`、`AIChatView/` 等已有分层一致；调用点 0 改动 |
| `KnowledgeDetail.tsx` 拆法 | 按视图 section 拆 | 与 JSX 注释 1:1 对应；状态归属清楚 |
| `AIGenerator` 状态归属 | 子组件自己持有 aiContent/isGenerating | 状态归属最近消费者；容器不消费 |
| `createOpenAIClient` helper | 抽到 `services/ai/client.ts` | 8 个 generator 重复 `new OpenAI(...)` 10 次，顺手去重 |
| `SettingsModal` 在 KD 中的死代码 | 删除 state + 渲染，保留组件文件 | 行为不变 + 简化 |
| 测试覆盖 | 8 个 happy-path 单测 | 最小成本拿到结构性保护 |
| 死代码防回归（ESLint 规则） | 不做 | A 范围外；留待 code health audit |
| `pi-agent-edu/index.ts` 503 行 | **不动** | 留给 B2 子项目 |
| `mastery/` 空目录 + 6 个 MasteryView 组件 | **不动** | 是否在用未验证；留给未来 audit |
| 顺手清理范围 | 注释 typo / 过期引用 / 删除注释块 / a11y 微调 | 行为不变；不改用户可见文本 |

## 目标文件结构

### `src/services/ai/`

```
src/services/ai/
├── index.ts        # barrel — 显式 re-export 8 个 generate + AIConfig + PROVIDER_DEFAULTS + getAIConfig + saveAIConfig
├── config.ts       # AIConfig 类型 + PROVIDER_DEFAULTS 常量 + provider 守卫
├── storage.ts      # getAIConfig + saveAIConfig + STORAGE_KEY 常量
├── client.ts       # createOpenAIClient(config) — 内部 helper，不在 index.ts 导出
├── knowledge.ts    # generateKnowledgeContent
├── tutorial.ts     # generateTutorialContent
├── practice.ts     # generatePracticeQuestions
├── classical.ts    # generateClassicalInterpretation
├── template.ts     # generateFromTemplate
└── chat.ts         # generateChat
```

`index.ts` barrel 显式列出：

```ts
export type { AIConfig } from './config';
export { PROVIDER_DEFAULTS } from './config';
export { getAIConfig, saveAIConfig } from './storage';
export { generateKnowledgeContent } from './knowledge';
export { generateTutorialContent } from './tutorial';
export { generatePracticeQuestions } from './practice';
export { generateClassicalInterpretation } from './classical';
export { generateFromTemplate } from './template';
export { generateChat } from './chat';
```

**不导出**：`createOpenAIClient`（内部基础设施，外部不应直接构造 client）。

### `src/components/KnowledgeDetail/`

```
src/components/KnowledgeDetail/
├── index.tsx       # 容器：useParams + findKnowledgePoint + isPromptModalOpen + 渲染 6 sections + PromptModal
├── Header.tsx      # 纯展示：标题/图标/描述/tags
├── TutorialSection.tsx   # 纯展示：tutorialContent 渲染
├── PracticeQuestions.tsx # 纯展示：实战练习题列表
├── FunCorner.tsx         # 纯展示：funFact/funStory/funQuestion
├── RelatedPractice.tsx   # 纯展示：巩固练习入口（跳转按钮）
└── AIGenerator.tsx       # stateful：aiContent/isGenerating + handleGenerateAI + PromptModal 触发按钮
```

返回按钮（用 `useNavigate`）保留在 `index.tsx`——属于路由行为，不属于 Header 展示。

### section 子组件 props

```ts
// Header.tsx
type HeaderProps = {
  point: { title: string; description: string; tags?: string[] };
  subject: { icon: string; name: string };
};

// TutorialSection.tsx
type TutorialSectionProps = {
  content: string;  // point.tutorialContent
};

// PracticeQuestions.tsx
type PracticeQuestionsProps = {
  questions: Array<{ question: string; answer: string }>;
};

// FunCorner.tsx
type FunCornerProps = {
  funFact?: string;
  funStory?: string;
  funQuestion?: string;
  funQuestionAnswer?: string;
};

// RelatedPractice.tsx
type RelatedPracticeProps = {
  pointId: string;
  relatedCount: number;
};

// AIGenerator.tsx（stateful）
type AIGeneratorProps = {
  topic: string;
  context: string;
  knowledgePointTitle: string;
  knowledgePointGrade: string;
  onPromptModalOpen: () => void;
};
// 内部 useState：aiContent、isGenerating；内部调 generateKnowledgeContent
```

## 数据流

### `services/ai/` 内部依赖图

```
config.ts  ←（类型基础，被所有 generator 引用）
storage.ts ← getAIConfig()  /  saveAIConfig()
client.ts  ← createOpenAIClient(config)，供非 gateway 路径使用

每个 generator（knowledge/tutorial/practice/classical/template/chat）：
  1. getAIConfig()             ← storage.ts
  2. config.provider === 'gateway'?
       yes → callGateway({prompt}, onStream)  ← ../gateway
       no  → createOpenAIClient(config)        ← ./client
              → client.chat.completions.create({stream:true})
              → for await chunk → onStream(delta.content || '')
```

每个 generator 文件内部 import 模板：

```ts
import type { AIConfig } from './config';
import { getAIConfig } from './storage';
import { createOpenAIClient } from './client';
import { callGateway } from '../gateway';

export async function generateXxx(...) {
  const config = getAIConfig();
  if (!config) throw new Error('AI 配置未找到');
  // ...
}
```

### `KnowledgeDetail` 数据流

```
[index.tsx 容器]
  useParams<{id}>() → id
  useNavigate() → 返回按钮
  findKnowledgePoint(id) → { point, subject, grade }
  getQuestionsByKnowledgePoint(point.id).length → relatedCount
  useState isPromptModalOpen
  
  渲染:
    <button onClick={() => navigate('/')}>返回</button>
    <Header point={point} subject={subject} />
    <TutorialSection content={point.tutorialContent} />
    <PracticeQuestions questions={point.practiceQuestions ?? []} />
    <FunCorner {...funProps} />
    <RelatedPractice pointId={point.id} relatedCount={relatedCount} />
    <AIGenerator
      topic={point.title}
      context={`年级：${grade.name}，学科：${subject.name}，知识点：${point.title}，描述：${point.description}`}
      knowledgePointTitle={point.title}
      knowledgePointGrade={grade.name}
      onPromptModalOpen={() => setIsPromptModalOpen(true)}
    />
    <PromptModal isOpen={isPromptModalOpen} onClose={...} ... />

[AIGenerator.tsx（stateful）]
  useState aiContent / isGenerating
  handleGenerateAI() → generateKnowledgeContent(topic, context, chunk => setAiContent(prev + chunk))
  渲染：生成按钮 + 模板按钮 + ReactMarkdown 渲染
```

## 删除清单

### 函数级（4 个）

`src/services/ai.ts`（拆前）中以下 4 个函数及配套 prompt 模板：

- `generateExamQuestions`
- `generateErrorAnalysis`
- `generateStudyPlan`
- `generateFormulaDerivation`

拆后这些符号在新 `services/ai/` 任何文件中均**不出现**。

### 文件级

| 路径 | 类型 | 理由 |
|------|------|------|
| `src/App.css` | 删除 | Vite 模板遗留，未在 main.tsx 引用 |
| `src/services/ai.ts` | 删除 | 已拆为 `services/ai/` |
| `src/components/KnowledgeDetail.tsx` | 删除 | 已拆为 `KnowledgeDetail/` |

### `scripts/` 根目录清理

**删除（16 个文件）**：

旧生成器：
- `scripts/generate-content.mjs` + `.test.mjs`
- `scripts/generate-fields.mjs` + `.test.mjs`
- `scripts/generate-tutorial.mjs` + `.test.mjs`
- `scripts/generate-tutorial-units.mjs`
- `scripts/generate-seed-manual.mjs`
- `scripts/export-seed.mjs`
- `scripts/generate-questions/`（整个目录：`generate.ts` / `knowledge-loader.ts` / `prompts.ts`）

旧合并/拆分：
- `scripts/merge-fields.mjs`
- `scripts/merge-tutorials.mjs` + `.test.mjs`
- `scripts/split-knowledge.mjs` + `.test.mjs`

旧 provider 抽象：
- `scripts/provider-config.mjs` + `.test.mjs`
- `scripts/render-template.mjs`

旧 test 噪音：
- `scripts/seed.test.mjs`
- `scripts/select.test.mjs`

中间产物（保留本地，git 忽略）：
- `scripts/._checkpoint_science.json`
- `scripts/output-fields-primary.json`
- `scripts/output-tutorials/`
- `scripts/knowledge-seed.json`
- `scripts/knowledge-new-primary.json`
- `scripts/id-mapping.json`
- `scripts/generate-config.json`
- `scripts/generate-config.jsonc`

**.gitignore 新增**（`.gitignore` 文件末尾追加）：

```
# Legacy generator artifacts (kept locally, not tracked)
scripts/._checkpoint_*.json
scripts/output-*.json
scripts/output-*/
scripts/knowledge-*.json
scripts/id-mapping.json
scripts/generate-config.json*
```

## 错误处理

错误信息字符串保持原样（行为不变约束）：

- `'AI 配置未找到'`
- `'API Key not configured'`
- `'生成失败，请检查 API 配置'`（KnowledgeDetail 容器的 `alert(...)`，删除 SettingsModal 后该 alert 路径仍存在 —— KnowledgeDetail 当前不调用 alert，仅 AIGenerator 容器层未触发 alert；保留 alert 路径）
- gateway 路径的 throw error

`<SettingsModal>` 删除后，`isSettingsOpen` state 整个从 KnowledgeDetail 中消失；SettingsModal.tsx 组件文件**保留**（其他视图可能引用，本任务不验证其 caller）。

## 测试策略

### 测试位置

`src/services/ai/<name>.test.ts`，与被测代码同目录：

```
src/services/ai/
├── knowledge.test.ts
├── tutorial.test.ts
├── practice.test.ts
├── classical.test.ts
├── template.test.ts
└── chat.test.ts
```

注：`config.test.ts` / `storage.test.ts` / `client.test.ts` 不写 —— config 和 storage 是纯数据；client 是 1 行 wrapper；generator 测试已通过 mock 间接覆盖。

### mock 模式（knowledge.test.ts 示例）

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          [Symbol.asyncIterator]: async function* () {
            yield { choices: [{ delta: { content: 'Hello ' } }] };
            yield { choices: [{ delta: { content: 'world' } }] };
          },
        }),
      },
    },
  })),
}));

vi.mock('../gateway', () => ({
  callGateway: vi.fn(),
}));

// 各 generator 测试断言：
// 1. 非 gateway：client.chat.completions.create 被以正确 model/prompt 调用
// 2. for await chunk 累加的 delta.content 全部通过 onStream 回调传出
// 3. gateway 模式走 callGateway 而非 openai
```

### 不写的内容

- 不写 React 组件层测试（happy-dom + React 19 渲染 + 流式回调成本高于收益）
- 不写 E2E
- 不写 visual regression

组件层验证靠 manual smoke（见验收清单 AC-13/AC-14）。

### vitest 配置

新建 `vitest.config.ts`（与 `vite.config.ts` 并存；不抽离 vite plugins，避免影响 dev server）：

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'scripts/**', 'worker/**'],
  },
});
```

`vite.config.ts` 删除 `test` 块（避免重复定义），保留 plugins / server proxy。

## 验收清单

| 编号 | 项 | 通过判定 |
|------|---|---------|
| AC-1 | `npm run lint` | 零 error、零 warning |
| AC-2 | `npm run build` | tsc -b 通过、vite build 0 错 |
| AC-3 | `npm test`（vitest） | 126（src 原测试）+ 1（chat-history）+ 5（mastery）+ **8 新 generator** = 140 个全过；无 "No test suite found" |
| AC-4 | `cd scripts/pi-agent-edu && npm test` | 仍全过（未触动） |
| AC-5 | `cd scripts/ingest-data && npm test` | 仍全过（未触动） |
| AC-6 | `src/services/ai/{config,storage,client,knowledge,tutorial,practice,classical,template,chat,index}.ts` | 10 个文件全部存在 |
| AC-7 | `src/components/KnowledgeDetail/{index,Header,TutorialSection,PracticeQuestions,FunCorner,RelatedPractice,AIGenerator}.{tsx}` | 7 个文件全部存在 |
| AC-8 | `grep "from '.*services/ai'" src/` | 与拆前输出完全一致（8 处调用，路径不变） |
| AC-9 | `grep "from '.*KnowledgeDetail'" src/` | 与拆前输出完全一致（App.tsx 仅 1 处调用） |
| AC-10 | Dead code 文件不存在 | `src/services/ai.ts` / `src/components/KnowledgeDetail.tsx` / `src/App.css` 全部不存在 |
| AC-11 | 4 个被删 generator 无残留 | `grep -rn "generateExamQuestions\|generateErrorAnalysis\|generateStudyPlan\|generateFormulaDerivation" src/` 零输出 |
| AC-12 | `scripts/` 根目录 .mjs 旧脚本无残留 | 16 个删除文件全部 `ls` 不到 |
| AC-13 | `.gitignore` 含新增模式 | 8 个新 pattern 全部出现 |
| AC-14 | 行为不变 — dev server | `npm run dev` 启动成功，浏览器访问 `/` 渲染正常 |
| AC-15 | 行为不变 — 路由 | `/knowledge/:id` 渲染 KnowledgeDetail 详情页（任意 ID） |
| AC-16 | 行为不变 — AI 流式 | 在 KnowledgeDetail 详情页点击"生成深度辅导指南"按钮，触发流式 Markdown 渲染（manual smoke） |
| AC-17 | 行为不变 — Header AI 配置弹窗 | 在首页打开 `Header/` 入口的 AI 配置弹窗，可配置 OpenAI/DeepSeek/智谱/custom/gateway（与拆前一致） |

## 风险与回滚

### Phase 拆分（5 个独立可回滚 commit）

```
commit 1: chore(scripts): remove obsolete legacy generators and intermediate artifacts
          - rm scripts/根目录 .mjs + .test.mjs + generate-questions/
          - .gitignore 增加 8 个新 pattern

commit 2: chore(ui): drop unused App.css
          - rm src/App.css

commit 3: refactor(ai): split monolithic ai.ts into per-generator modules with barrel
          - 创建 src/services/ai/ 目录及 10 个文件
          - 删除 src/services/ai.ts
          - 创建 src/services/ai/client.ts（内部 helper）
          - 删除 4 个无 caller 的 generator（generateExamQuestions 等）
          - barrel 严格按设计 8 个 generate + 3 个 config 符号

commit 4: refactor(KnowledgeDetail): split into per-section components
          - 创建 src/components/KnowledgeDetail/ 目录及 7 个文件
          - 删除 src/components/KnowledgeDetail.tsx
          - 删除 KnowledgeDetail 里的 <SettingsModal> 死代码（state + import + JSX）
          - AIGenerator 改为 stateful（持有 aiContent/isGenerating + handleGenerateAI）

commit 5: chore(test): scope vitest to src/ only
          - 创建 vitest.config.ts
          - vite.config.ts 删除 test 块
          - 删除 4 个 scripts/根 .test.mjs（与 commit 1 同步）

commit 6: test(ai): add happy-path coverage for 8 generators
          - 创建 8 个 src/services/ai/*.test.ts
```

注：commit 1 与 commit 5 中的 scripts/根 .test.mjs 删除在两份 commit 里；为避免双 commit 改同一文件，最终实施方案：**scripts/根目录全部删除归在 commit 1**，commit 5 只处理 vitest.config。

### 回滚命令模板

```bash
git revert <commit-sha>
```

任一 phase 失败，单独 revert；其他 phase 不受影响。

### 风险等级

| Phase | 风险 | 缓解措施 |
|-------|------|----------|
| 1: 删 scripts/App.css | 极低 | 仅删未引用文件；git log 保留所有历史 |
| 3: 拆 ai.ts | 中 | barrel 必须包含 8 个 generate + 3 个 config 符号；AC-8 硬验证 import 路径 0 改动 |
| 4: 拆 KnowledgeDetail | 中 | AIGenerator stateful 重构需保持 `aiContent` 累加逻辑不变；手动 smoke（AC-16）验证流式渲染 |
| 5: vitest config | 低 | include 只允许 `src/**`；AC-3 验证 scripts 子包测试不受影响 |
| 6: 加 8 个测试 | 低 | 与 commit 3 配套，单独 revert |

## 不在 A 范围 / 留给未来

1. **`scripts/pi-agent-edu/index.ts`** 503 行大文件 —— B2 子项目。
2. **`mastery/` 空目录 + 6 个 MasteryView 组件 + `src/data/mastery/*` 测试** —— 是否在用未验证；留给未来 code health audit。
3. **ESLint 防回归规则**（防止未用导出再涨回来） —— 留待未来 code health audit。
4. **`scripts/` 旧脚本删除后是否影响本地手动生成流程** —— 本任务不验证；PR 描述需明示 "removed legacy generators"，让 reviewer 判断。
5. **`SettingsModal.tsx` 组件本身的 caller audit** —— 保留文件；不验证外部使用。

## 实施顺序总结

1. **Phase 1**：删 `scripts/` 根目录 + 更新 `.gitignore` + 删 `src/App.css`（合并到 1-2 个 commit）
2. **Phase 2**：拆 `src/services/ai.ts` + 删除 4 个未用 generator（1 commit）
3. **Phase 3**：拆 `src/components/KnowledgeDetail.tsx` + 删除 SettingsModal 死代码（1 commit）
4. **Phase 4**：`vitest.config.ts` 独立文件 + `vite.config.ts` 清理 test 块（1 commit）
5. **Phase 5**：8 个 generator happy-path 单测（1 commit）

每 phase 完成后跑 `npm run lint && npm run build && npm test` 验证 AC-1/2/3，通过后再进下一 phase。

## 变更前 / 后基线对照

| 指标 | 拆前 | 拆后 |
|------|------|------|
| `src/services/ai.ts` | 812 行 | 不存在 |
| `src/services/ai/` | 不存在 | 10 个 `.ts` 文件，最大 < 200 行 |
| `src/components/KnowledgeDetail.tsx` | 390 行 | 不存在 |
| `src/components/KnowledgeDetail/` | 不存在 | 7 个 `.tsx` 文件，最大 < 200 行 |
| `src/App.css` | 存在但未引用 | 不存在 |
| `scripts/` 根 .mjs | 16 个未引用旧脚本 | 0 |
| `scripts/` 根中间产物 | 247M（git 跟踪） | git 忽略，本地保留 |
| vitest 测试数 | 126 + 1 + 5 = 132 | 132 + 8 = 140 |
| vitest 噪声 "No test suite found" | 有 | 无 |

