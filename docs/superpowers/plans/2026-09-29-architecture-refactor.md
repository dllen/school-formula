# Architecture & Code Quality Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `src/services/ai.ts` (812 行) 和 `src/components/KnowledgeDetail.tsx` (390 行) 拆为树形目录与按视图 section 的子组件；删除 4 个无 caller 的 generator；清理 `scripts/` 根目录 ~16 个未引用的旧脚本与中间产物；删除 Vite 模板遗留 `src/App.css`；新增 `vitest.config.ts` 收窄 include；为 8 个 generator 各加一个 happy-path 单测。行为不变 + 允许顺手清理（注释 typo / 过期引用 / 删除注释块 / a11y 微调）。

**Architecture:** 5 个独立 phase，每个 phase 一个独立 commit 可单独 revert。`src/services/ai.ts` 拆为 10 文件树形目录（8 generator + config + storage + client + index barrel），外部 import 路径不动；`KnowledgeDetail.tsx` 拆为 7 文件（AIGenerator stateful，6 个 section 纯 props）；`scripts/` 根 16 个 `.mjs` 旧脚本直删；`.gitignore` 增加 8 个新 pattern 忽略中间产物；`vitest.config.ts` 独立文件，include 收窄到 `src/`，消除 scripts 子包测试 runner 的"无 test suite found"噪声。

**Tech Stack:** TypeScript 5.9.3、React 19.2.0、Vite 7.2.4、Vitest 5.0.0、ESLint 9 (flat config)、Tailwind CSS 4.1.17、`openai` SDK 6.15.0、`react-markdown` 10.1.0、`react-router-dom` 7.11.0。

**Reference Spec:** `docs/superpowers/specs/2026-09-29-architecture-refactor-design.md` (commit 15f1c5c)

---

## File Structure

### New Files

```
src/services/ai/
├── index.ts              # barrel — 8 generate + AIConfig + PROVIDER_DEFAULTS + getAIConfig + saveAIConfig
├── config.ts             # AIConfig 类型 + PROVIDER_DEFAULTS 常量 + isValidProvider 守卫
├── storage.ts            # getAIConfig + saveAIConfig + STORAGE_KEY 常量
├── client.ts             # createOpenAIClient(config) — 内部 helper，不导出
├── knowledge.ts          # generateKnowledgeContent
├── tutorial.ts           # generateTutorialContent
├── practice.ts           # generatePracticeQuestions
├── classical.ts          # generateClassicalInterpretation
├── template.ts           # generateFromTemplate
└── chat.ts               # generateChat

src/components/KnowledgeDetail/
├── index.tsx             # 容器：useParams + findKnowledgePoint + isPromptModalOpen
├── Header.tsx            # 纯展示：point/subject
├── TutorialSection.tsx   # 纯展示：tutorialContent
├── PracticeQuestions.tsx # 纯展示：practiceQuestions
├── FunCorner.tsx         # 纯展示：funFact/funStory/funQuestion
├── RelatedPractice.tsx   # 纯展示：跳转按钮
└── AIGenerator.tsx       # stateful：aiContent/isGenerating + handleGenerateAI

src/services/ai/
├── knowledge.test.ts     # happy-path single test
├── tutorial.test.ts
├── practice.test.ts
├── classical.test.ts
├── template.test.ts
└── chat.test.ts

vitest.config.ts          # 独立 vitest 配置，include 仅 src/
```

### Deleted Files

```
src/App.css                       # Vite 模板遗留未引用
src/services/ai.ts                # 拆为 services/ai/ 后删除
src/components/KnowledgeDetail.tsx  # 拆为 KnowledgeDetail/ 后删除

# scripts/ 根目录 16 个 .mjs 旧脚本：
scripts/generate-content.mjs + .test.mjs
scripts/generate-fields.mjs + .test.mjs
scripts/generate-tutorial.mjs + .test.mjs
scripts/generate-tutorial-units.mjs
scripts/generate-seed-manual.mjs
scripts/export-seed.mjs
scripts/generate-questions/        # 整个目录
scripts/merge-fields.mjs
scripts/merge-tutorials.mjs + .test.mjs
scripts/split-knowledge.mjs + .test.mjs
scripts/provider-config.mjs + .test.mjs
scripts/render-template.mjs
scripts/seed.test.mjs
scripts/select.test.mjs
```

### Modified Files

```
.gitignore                       # 末尾追加 8 个新 pattern
src/main.tsx                     # 移除 import './App.css'（如存在）
src/components/Home.tsx          # 行为不变验证
src/App.tsx                      # 行为不变验证
vite.config.ts                   # 移除 test 块
```

---

## Phase 1: 清理 scripts/ 根目录 + App.css

### Task 1: 更新 .gitignore 增加 scripts 中间产物 pattern

**Files:**
- Modify: `.gitignore` (末尾追加 8 行)

- [ ] **Step 1: 读取当前 .gitignore 末尾**

```bash
tail -20 .gitignore
```

- [ ] **Step 2: 追加 8 个新 pattern**

```bash
cat >> .gitignore << 'EOF'

# Legacy generator artifacts (kept locally, not tracked)
scripts/._checkpoint_*.json
scripts/output-*.json
scripts/output-*/
scripts/knowledge-*.json
scripts/id-mapping.json
scripts/generate-config.json*
EOF
```

- [ ] **Step 3: 验证新增行**

```bash
tail -10 .gitignore
```

Expected: 8 个新 pattern 全部出现。

- [ ] **Step 4: 验证中间产物已忽略**

```bash
git check-ignore -v scripts/._checkpoint_science.json scripts/output-fields-primary.json scripts/knowledge-seed.json scripts/id-mapping.json
```

Expected: 每个文件都返回 ignore 规则（最后两列含 `.gitignore:行号:pattern`）。

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore(gitignore): ignore legacy generator artifacts"
```

### Task 2: 删除 scripts/ 根目录 .mjs 旧脚本

**Files:**
- Delete: `scripts/` 根目录 16 个 `.mjs` + `.test.mjs`

- [ ] **Step 1: 删除旧生成器**

```bash
rm scripts/generate-content.mjs scripts/generate-content.test.mjs \
   scripts/generate-fields.mjs scripts/generate-fields.test.mjs \
   scripts/generate-tutorial.mjs scripts/generate-tutorial.test.mjs \
   scripts/generate-tutorial-units.mjs \
   scripts/generate-seed-manual.mjs \
   scripts/export-seed.mjs \
   scripts/seed.test.mjs \
   scripts/select.test.mjs
```

- [ ] **Step 2: 删除 generate-questions 目录**

```bash
rm -rf scripts/generate-questions
```

- [ ] **Step 3: 删除旧合并/拆分工具**

```bash
rm scripts/merge-fields.mjs \
   scripts/merge-tutorials.mjs scripts/merge-tutorials.test.mjs \
   scripts/split-knowledge.mjs scripts/split-knowledge.test.mjs
```

- [ ] **Step 4: 删除 provider 抽象**

```bash
rm scripts/provider-config.mjs scripts/provider-config.test.mjs \
   scripts/render-template.mjs
```

- [ ] **Step 5: 验证 scripts/ 根目录只剩 ingest-data/ + pi-agent-edu/**

```bash
ls scripts/
```

Expected: 仅 `ingest-data/` 和 `pi-agent-edu/` 两个目录，加上 `export-seed.mjs` 不在删除清单内（如存在）。

- [ ] **Step 6: 删除中间产物（可选，本地清理）**

```bash
rm -f scripts/._checkpoint_science.json \
      scripts/output-fields-primary.json \
      scripts/knowledge-seed.json \
      scripts/knowledge-new-primary.json
rm -rf scripts/output-tutorials/
```

- [ ] **Step 7: Commit**

```bash
git add -A scripts/
git commit -m "chore(scripts): remove obsolete legacy generators"
```

### Task 3: 删除 src/App.css 模板遗留

**Files:**
- Delete: `src/App.css`

- [ ] **Step 1: 验证 App.css 未被 main.tsx 引用**

```bash
grep -n "App.css" src/main.tsx
```

Expected: 零输出（未引用）。

- [ ] **Step 2: 删除文件**

```bash
rm src/App.css
```

- [ ] **Step 3: 验证 Vite 构建不受影响**

```bash
npm run build
```

Expected: tsc -b 通过 + vite build 0 错。

- [ ] **Step 4: Commit**

```bash
git add -A src/
git commit -m "chore(ui): drop unused App.css"
```

---

## Phase 2: 拆 src/services/ai.ts + 删 4 个未用 generator

### Task 4: 创建 services/ai/config.ts

**Files:**
- Create: `src/services/ai/config.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/services/ai/config.ts
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu' | 'gateway';
    apiKey: string;
    baseUrl: string;
    model: string;
}

export const PROVIDER_DEFAULTS: Record<string, Partial<AIConfig>> = {
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
    },
    deepseek: {
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
    },
    zhipu: {
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        model: 'glm-4',
    },
    custom: {
        baseUrl: '',
        model: '',
    },
    gateway: {
        baseUrl: '',
        model: '',
    },
};

export function isValidProvider(p: string): p is AIConfig['provider'] {
    return ['custom', 'openai', 'deepseek', 'zhipu', 'gateway'].includes(p);
}
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/config.ts
git commit -m "refactor(ai): extract config.ts (AIConfig + PROVIDER_DEFAULTS)"
```

### Task 5: 创建 services/ai/storage.ts

**Files:**
- Create: `src/services/ai/storage.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/services/ai/storage.ts
import type { AIConfig } from './config';

const STORAGE_KEY = 'school_formula_ai_config';

export const getAIConfig = (): AIConfig | null => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AIConfig) : null;
};

export const saveAIConfig = (config: AIConfig): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
```

注：保留原 `STORAGE_KEY = 'school_formula_ai_config'`（行为不变约束）；加 `typeof window` 守卫避免 SSR / happy-dom 异常。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/storage.ts
git commit -m "refactor(ai): extract storage.ts (get/save + STORAGE_KEY)"
```

### Task 6: 创建 services/ai/client.ts

**Files:**
- Create: `src/services/ai/client.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/services/ai/client.ts
// Internal helper — not exported via barrel. Use generator functions instead.
import OpenAI from 'openai';
import type { AIConfig } from './config';

export function createOpenAIClient(config: AIConfig): OpenAI {
    return new OpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
    });
}
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/client.ts
git commit -m "refactor(ai): extract client.ts (createOpenAIClient helper)"
```

### Task 7: 创建 services/ai/knowledge.ts

**Files:**
- Create: `src/services/ai/knowledge.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts 提取 generateKnowledgeContent）**

```ts
// src/services/ai/knowledge.ts
import { callGateway } from '../gateway';
import type { AIConfig } from './config';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

const KNOWLEDGE_PROMPT = (topic: string, context: string) => `
你是一位专业的家庭教育顾问和学科专家。请为家长撰写一份关于"${topic}"的深度辅导指南。
背景信息：${context}

请严格按以下markdown格式输出（不要输出其他无关内容）：

# 💡 深度解析
（用通俗易懂的语言，配合生活案例，深入浅出地讲解该知识点的核心逻辑，适合家长讲给孩子听）

# 🌍 生活应用场景
（列举3-5个日常生活中的具体应用场景，让知识变得有用、有趣）

# 👨‍👩‍👧 亲子互动案例
（设计一个具体的对话或互动游戏脚本，帮助家长指导孩子）

# ✏️ 实战小测验
（3道精选练习题，附带答案和解析）
1. [题目]
   * 答案：
   * 解析：
`;

export const generateKnowledgeContent = async (
    topic: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('AI 配置未找到');
    }

    const prompt = KNOWLEDGE_PROMPT(topic, context);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }

    if (!config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = createOpenAIClient(config);
    try {
        const stream = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onStream(content);
            }
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
    }
};

// Internal helper exported for tests only.
export type { AIConfig };
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/knowledge.ts
git commit -m "refactor(ai): extract knowledge.ts generator"
```

### Task 8: 创建 services/ai/tutorial.ts

**Files:**
- Create: `src/services/ai/tutorial.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts L137-228 提取 generateTutorialContent）**

```ts
// src/services/ai/tutorial.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 prompt 模板从 ai.ts L137-228 完整复制；行为不变约束
const TUTORIAL_PROMPT = (unitTitle: string, context: string) => `...`;

export const generateTutorialContent = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) throw new Error('AI 配置未找到');

    const prompt = TUTORIAL_PROMPT(unitTitle, context);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }
    if (!config.apiKey) throw new Error('API Key not configured');

    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onStream(content);
    }
};
```

注：`TUTORIAL_PROMPT` 的具体内容由实现者从原 `src/services/ai.ts` L137-228 完整复制；spec 承诺行为不变，逐字保留。复制时注意 prompt 字符串里的换行符和 unicode emoji。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/tutorial.ts
git commit -m "refactor(ai): extract tutorial.ts generator"
```

### Task 9: 创建 services/ai/practice.ts

**Files:**
- Create: `src/services/ai/practice.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts L228-323 提取 generatePracticeQuestions）**

```ts
// src/services/ai/practice.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 PRACTICE_PROMPT 从 ai.ts L228-323 完整复制
const PRACTICE_PROMPT = (unitTitle: string, context: string) => `...`;

export const generatePracticeQuestions = async (
    unitTitle: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) throw new Error('AI 配置未找到');

    const prompt = PRACTICE_PROMPT(unitTitle, context);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }
    if (!config.apiKey) throw new Error('API Key not configured');

    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onStream(content);
    }
};
```

注：原 prompt 字符串从 `ai.ts` L228-323 完整复制（含 emoji 与中文标点）。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/practice.ts
git commit -m "refactor(ai): extract practice.ts generator"
```

### Task 10: 创建 services/ai/classical.ts

**Files:**
- Create: `src/services/ai/classical.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts L323-383 提取 generateClassicalInterpretation）**

```ts
// src/services/ai/classical.ts
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 CLASSICAL_PROMPT 从 ai.ts L323-383 完整复制
const CLASSICAL_PROMPT = (passage: string, question: string) => `...`;

export const generateClassicalInterpretation = async (
    passage: string,
    question: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) throw new Error('AI 配置未找到');

    const prompt = CLASSICAL_PROMPT(passage, question);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }
    if (!config.apiKey) throw new Error('API Key not configured');

    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onStream(content);
    }
};
```

注：原 prompt 字符串从 `ai.ts` L323-383 完整复制。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/classical.ts
git commit -m "refactor(ai): extract classical.ts generator"
```

### Task 11: 创建 services/ai/template.ts

**Files:**
- Create: `src/services/ai/template.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts L706-770 提取 generateFromTemplate）**

```ts
// src/services/ai/template.ts
import type { PromptTemplate } from '../../data/prompts/types';
import { callGateway } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

// 原 TEMPLATE_PROMPT 从 ai.ts L706-770 完整复制
const TEMPLATE_PROMPT = (template: PromptTemplate, variables: Record<string, string>) => `...`;

export const generateFromTemplate = async (
    template: PromptTemplate,
    variables: Record<string, string>,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) throw new Error('AI 配置未找到');

    const prompt = TEMPLATE_PROMPT(template, variables);

    if (config.provider === 'gateway') {
        await callGateway({ prompt }, onStream);
        return;
    }
    if (!config.apiKey) throw new Error('API Key not configured');

    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onStream(content);
    }
};
```

注：`PromptTemplate` 类型从 `src/data/prompts/types` import（与原 ai.ts 路径一致）。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/template.ts
git commit -m "refactor(ai): extract template.ts generator"
```

### Task 12: 创建 services/ai/chat.ts

**Files:**
- Create: `src/services/ai/chat.ts`

- [ ] **Step 1: 创建文件（从原 ai.ts L770-812 提取 generateChat）**

```ts
// src/services/ai/chat.ts
import { chatGateway, type ChatMessage } from '../gateway';
import { createOpenAIClient } from './client';
import { getAIConfig } from './storage';

export const generateChat = async (
    messages: ChatMessage[],
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) throw new Error('AI 配置未找到');

    if (config.provider === 'gateway') {
        await chatGateway({ messages }, onStream);
        return;
    }
    if (!config.apiKey) throw new Error('API Key not configured');

    const client = createOpenAIClient(config);
    const stream = await client.chat.completions.create({
        model: config.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) onStream(content);
    }
};
```

注：`ChatMessage` 从 `services/gateway.ts` 导入（与原 ai.ts 一致）。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/chat.ts
git commit -m "refactor(ai): extract chat.ts generator"
```

### Task 13: 创建 services/ai/index.ts barrel

**Files:**
- Create: `src/services/ai/index.ts`

- [ ] **Step 1: 创建 barrel**

```ts
// src/services/ai/index.ts
// Barrel — explicit re-exports only.
// Internal helpers (createOpenAIClient) and removed generators are NOT exported.

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

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/index.ts
git commit -m "refactor(ai): add barrel index.ts with explicit re-exports"
```

### Task 14: 删除 src/services/ai.ts + 验证

**Files:**
- Delete: `src/services/ai.ts`

- [ ] **Step 1: 删除原 ai.ts**

```bash
rm src/services/ai.ts
```

- [ ] **Step 2: 验证 import 路径不变（grep 应当与拆前一致）**

```bash
grep -rn "from '.*services/ai'" src/
```

Expected: 8 处调用，全部路径为 `'../services/ai'` 或 `'../../services/ai'`，与拆前完全一致。

- [ ] **Step 3: 验证 build + test**

```bash
npm run build && npm test
```

Expected: tsc -b 通过 + vite build 0 错 + 132 个 vitest 测试全过。

- [ ] **Step 4: 验证 4 个被删 generator 无残留**

```bash
grep -rn "generateExamQuestions\|generateErrorAnalysis\|generateStudyPlan\|generateFormulaDerivation" src/
```

Expected: 零输出。

- [ ] **Step 5: Commit**

```bash
git add -A src/services/
git commit -m "refactor(ai): delete obsolete monolithic ai.ts

All 8 generators + config/storage/client helpers now live in src/services/ai/.
Removed 4 unused generators (generateExamQuestions, generateErrorAnalysis,
generateStudyPlan, generateFormulaDerivation). External import paths
preserved via barrel index.ts."
```

---

## Phase 3: 拆 src/components/KnowledgeDetail.tsx

### Task 15: 创建 KnowledgeDetail/Header.tsx

**Files:**
- Create: `src/components/KnowledgeDetail/Header.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/Header.tsx
import React from 'react';

type HeaderProps = {
    point: { title: string; description: string; tags?: string[] };
    subject: { icon: string; name: string };
};

export const Header: React.FC<HeaderProps> = ({ point, subject }) => {
    return (
        <div className="p-8 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[#1F2329]">{point.title}</h1>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {subject.name}
                        </span>
                    </div>
                    <p className="text-[#646A73] mt-2 text-lg">{point.description}</p>
                </div>
            </div>
            {point.tags && (
                <div className="flex gap-2 mt-4">
                    {point.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-white border border-blue-100 text-[#3370FF] text-sm rounded-full shadow-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error（仅 tsc check，Header 未挂载）。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/Header.tsx
git commit -m "refactor(KnowledgeDetail): extract Header.tsx"
```

### Task 16: 创建 KnowledgeDetail/TutorialSection.tsx

**Files:**
- Create: `src/components/KnowledgeDetail/TutorialSection.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/TutorialSection.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

type TutorialSectionProps = {
    content: string;
};

export const TutorialSection: React.FC<TutorialSectionProps> = ({ content }) => {
    return (
        <section className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100">
                <h3 className="flex items-center text-lg font-bold text-indigo-800">
                    <span className="mr-2">📚</span> 系统教程
                </h3>
            </div>
            <div className="p-6 prose prose-indigo max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </section>
    );
};
```

注：原 KnowledgeDetail 中 tutorialContent 的 markdown 渲染整体逻辑（从 `<ReactMarkdown>` 调用到内嵌样式）由实现者从 `src/components/KnowledgeDetail.tsx` 系统教程 section 完整复制。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/TutorialSection.tsx
git commit -m "refactor(KnowledgeDetail): extract TutorialSection.tsx"
```

### Task 17: 创建 KnowledgeDetail/PracticeQuestions.tsx

**Files:**
- Create: `src/components/KnowledgeDetail/PracticeQuestions.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/PracticeQuestions.tsx
import React from 'react';

type PracticeQuestionsProps = {
    questions: Array<{ question: string; answer: string }>;
};

export const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({ questions }) => {
    if (questions.length === 0) return null;

    return (
        <div>
            <h3 className="flex items-center text-xl font-bold text-green-900 mb-4">
                <span className="mr-2">✏️</span> 实战练习
            </h3>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="bg-green-50 p-4 border-b border-green-100">
                            <p className="font-bold text-green-900">
                                Q{idx + 1}: {q.question}
                            </p>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-[#646A73]">
                                <span className="font-medium text-[#1F2329] bg-[#F5F6F7] px-2 py-0.5 rounded mr-2">
                                    参考答案
                                </span>
                                {q.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/PracticeQuestions.tsx
git commit -m "refactor(KnowledgeDetail): extract PracticeQuestions.tsx"
```

### Task 18: 创建 KnowledgeDetail/FunCorner.tsx

**Files:**
- Create: `src/components/KnowledgeDetail/FunCorner.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/FunCorner.tsx
import React from 'react';

type FunCornerProps = {
    funFact?: string;
    funStory?: string;
    funQuestion?: string;
    funQuestionAnswer?: string;
};

export const FunCorner: React.FC<FunCornerProps> = ({
    funFact,
    funStory,
    funQuestion,
    funQuestionAnswer,
}) => {
    if (!funFact && !funStory && !funQuestion) return null;

    return (
        <div className="pt-8 border-t border-[#F0F1F2]">
            <h3 className="flex items-center text-xl font-bold text-amber-900 mb-4">
                <span className="mr-2">🌟</span> 趣味角
            </h3>
            <div className="space-y-4">
                {funFact && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <span>🧊</span> 冷知识
                        </h4>
                        <p className="text-amber-800 leading-relaxed">{funFact}</p>
                    </div>
                )}

                {funStory && (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                            <span>📖</span> 生活中的数学
                        </h4>
                        <p className="text-green-800 leading-relaxed">{funStory}</p>
                    </div>
                )}

                {funQuestion && (
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                            <span>❓</span> 互动问答
                        </h4>
                        <p className="text-purple-800 mb-3">{funQuestion}</p>
                        <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-800 list-none flex items-center gap-1">
                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                点击揭晓答案
                            </summary>
                            <div className="mt-3 p-3 bg-white rounded-xl border border-purple-100">
                                <p className="text-purple-700">
                                    {funQuestionAnswer || '暂无答案'}
                                </p>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/FunCorner.tsx
git commit -m "refactor(KnowledgeDetail): extract FunCorner.tsx"
```

### Task 19: 创建 KnowledgeDetail/RelatedPractice.tsx

**Files:**
- Create: `src/components/KnowledgeDetail/RelatedPractice.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/RelatedPractice.tsx
import React from 'react';

type RelatedPracticeProps = {
    pointId: string;
    relatedCount: number;
};

export const RelatedPractice: React.FC<RelatedPracticeProps> = ({
    pointId,
    relatedCount,
}) => {
    if (relatedCount === 0) return null;

    const handleStartPractice = () => {
        const params = new URLSearchParams({ view: 'practice', kp: pointId });
        window.location.href = `/?${params.toString()}`;
    };

    return (
        <div className="pt-8 border-t border-[#F0F1F2]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-green-900">
                    <span className="mr-2">✏️</span> 巩固练习
                    <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {relatedCount} 道题
                    </span>
                </h3>
                <button
                    onClick={handleStartPractice}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all"
                >
                    开始练习
                </button>
            </div>
        </div>
    );
};
```

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/RelatedPractice.tsx
git commit -m "refactor(KnowledgeDetail): extract RelatedPractice.tsx"
```

### Task 20: 创建 KnowledgeDetail/AIGenerator.tsx（stateful）

**Files:**
- Create: `src/components/KnowledgeDetail/AIGenerator.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/AIGenerator.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateKnowledgeContent } from '../../services/ai';

type AIGeneratorProps = {
    topic: string;
    context: string;
    knowledgePointTitle: string;
    knowledgePointGrade: string;
    onPromptModalOpen: () => void;
};

export const AIGenerator: React.FC<AIGeneratorProps> = ({
    topic,
    context,
    knowledgePointTitle,
    knowledgePointGrade: _knowledgePointGrade,
    onPromptModalOpen,
}) => {
    const [aiContent, setAiContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        setAiContent('');
        try {
            await generateKnowledgeContent(topic, context, (chunk) => {
                setAiContent((prev) => prev + chunk);
            });
        } catch (error) {
            console.error(error);
            alert('生成失败，请检查 API 配置');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pt-8 border-t border-[#F0F1F2]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-purple-900">
                    <span className="mr-2">✨</span> AI 智能助教
                    <span className="ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        家长辅导助手
                    </span>
                </h3>
                {!aiContent && !isGenerating && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerateAI}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
                        >
                            <span>生成深度辅导指南</span>
                        </button>
                        <button
                            onClick={onPromptModalOpen}
                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center gap-2"
                        >
                            <span>📝 模板模式</span>
                        </button>
                    </div>
                )}
            </div>

            {isGenerating && !aiContent && (
                <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse">
                    <p className="text-purple-800 font-medium">
                        正在思考中，为您生成专属辅导内容...
                    </p>
                </div>
            )}

            {(aiContent || (isGenerating && aiContent)) && (
                <div className="bg-white border border-purple-100 rounded-2xl p-8 shadow-sm ring-4 ring-purple-50/50">
                    <div className="prose prose-purple max-w-none">
                        <ReactMarkdown>{aiContent}</ReactMarkdown>
                    </div>
                    {isGenerating && (
                        <p className="mt-4 text-purple-500 animate-pulse text-sm">正在撰写...</p>
                    )}
                </div>
            )}
        </div>
    );
};
```

注：
- `knowledgePointGrade` 暂时未在 AIGenerator 内部使用（容器传给 PromptModal 用，AIGenerator 不直接渲染），用 `_` 前缀避免 `noUnusedParameters` lint 错误；同时它仍属于 props 接口（未来 AIGenerator 可能使用）。
- 流式渲染时 `setAiContent((prev) => prev + chunk)` 行为与拆前一致。
- `alert('生成失败，请检查 API 配置')` 错误提示文案保留（行为不变）。

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: Commit**

```bash
git add src/components/KnowledgeDetail/AIGenerator.tsx
git commit -m "refactor(KnowledgeDetail): extract AIGenerator.tsx (stateful)"
```

### Task 21: 创建 KnowledgeDetail/index.tsx（容器 + 删除 SettingsModal 死代码）

**Files:**
- Create: `src/components/KnowledgeDetail/index.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/components/KnowledgeDetail/index.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KNOWLEDGE_DATA } from '../../data/knowledge';
import { getQuestionsByKnowledgePoint } from '../../data/questions';
import { PromptModal } from '../prompts/PromptModal';
import type { KnowledgePoint, Subject } from '../../data/types';
import { AIGenerator } from './AIGenerator';
import { FunCorner } from './FunCorner';
import { Header } from './Header';
import { PracticeQuestions } from './PracticeQuestions';
import { RelatedPractice } from './RelatedPractice';
import { TutorialSection } from './TutorialSection';

type KnowledgeDetailData = {
    point: KnowledgePoint;
    subject: Subject;
    grade: { name: string };
};

export const KnowledgeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const data = useMemo<KnowledgeDetailData | null>(() => {
        if (!id) return null;
        for (const grade of KNOWLEDGE_DATA) {
            for (const subject of grade.subjects) {
                const point = subject.knowledgePoints.find((p) => p.id === id);
                if (point) {
                    return { point, subject, grade };
                }
            }
        }
        return null;
    }, [id]);

    if (!data) {
        return (
            <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800 flex items-center justify-center">
                <p>未找到该知识点</p>
            </div>
        );
    }

    const { point, subject, grade } = data;
    const context = `年级：${grade.name}，学科：${subject.name}，知识点：${point.title}，描述：${point.description}`;
    const relatedQuestions = getQuestionsByKnowledgePoint(point.id);

    return (
        <div className="min-h-screen bg-[#F5F6F7] font-sans text-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-[#646A73] hover:text-[#3370FF] transition-colors"
                    aria-label="返回首页"
                >
                    <span className="mr-2">←</span> 返回列表
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-[#F0F1F2] overflow-hidden">
                    <Header point={point} subject={subject} />
                    <div className="p-8 space-y-8">
                        {point.tutorialContent && (
                            <TutorialSection content={point.tutorialContent} />
                        )}
                        {point.practiceQuestions && point.practiceQuestions.length > 0 && (
                            <PracticeQuestions questions={point.practiceQuestions} />
                        )}
                        {relatedQuestions.length > 0 && (
                            <RelatedPractice
                                pointId={point.id}
                                relatedCount={relatedQuestions.length}
                            />
                        )}
                        <FunCorner
                            funFact={point.funFact}
                            funStory={point.funStory}
                            funQuestion={point.funQuestion}
                            funQuestionAnswer={point.funQuestionAnswer}
                        />
                        <AIGenerator
                            topic={point.title}
                            context={context}
                            knowledgePointTitle={point.title}
                            knowledgePointGrade={grade.name}
                            onPromptModalOpen={() => setIsPromptModalOpen(true)}
                        />
                    </div>
                </div>
            </div>
            <PromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                knowledgePointTitle={point.title}
                knowledgePointGrade={grade.name}
            />
        </div>
    );
};
```

注：
- 容器不持有 `aiContent` / `isGenerating`（已下沉到 AIGenerator）
- 容器不持有 `isSettingsOpen`（SettingsModal 死代码删除）
- `useMemo` 包裹 `findKnowledgePoint` 查询逻辑（性能微优化，属"顺手清理"允许范围）
- 返回按钮增加 `aria-label`（属 a11y 微调）
- `Point not found` fallback 文案 "未找到该知识点" 是新加的；如不希望行为有最小差异，可改为 `return null` 或拆前一致的占位（容器旧版无 fallback 渲染，原行为是访问不存在的 id 会显示空 div，但 `data` 为 null 时后续 `data.point` 会 throw — 旧版实际是 broken 状态；本计划加 fallback 是修正既有潜在崩溃，属于 a11y/robustness 微调）

- [ ] **Step 2: 验证 tsc**

```bash
npx tsc -b --noEmit
```

Expected: 零 error。

- [ ] **Step 3: 验证 import 路径不变**

```bash
grep -rn "from '.*KnowledgeDetail'" src/
```

Expected: 仅 `src/App.tsx` 一处 import `'./components/KnowledgeDetail'`，路径不变。

- [ ] **Step 4: Commit**

```bash
git add src/components/KnowledgeDetail/index.tsx
git commit -m "refactor(KnowledgeDetail): add index.tsx container

Removes isSettingsOpen state (dead code: never set to true).
Mounts 6 section components + PromptModal."
```

### Task 22: 删除 src/components/KnowledgeDetail.tsx + 验证

**Files:**
- Delete: `src/components/KnowledgeDetail.tsx`

- [ ] **Step 1: 删除原文件**

```bash
rm src/components/KnowledgeDetail.tsx
```

- [ ] **Step 2: 验证 build + test**

```bash
npm run build && npm test
```

Expected: tsc -b 通过 + vite build 0 错 + 132 个 vitest 测试全过。

- [ ] **Step 3: 验证 import 路径不变**

```bash
grep -rn "from '.*KnowledgeDetail'" src/
```

Expected: 仅 `src/App.tsx` 一处，路径 `'./components/KnowledgeDetail'`，与拆前完全一致。

- [ ] **Step 4: 验证 dev server 启动**

```bash
npm run dev &
sleep 5
curl -s http://localhost:5173/ | head -20
kill %1 2>/dev/null
```

Expected: 渲染首页 HTML。

- [ ] **Step 5: Commit**

```bash
git add -A src/components/
git commit -m "refactor(KnowledgeDetail): delete obsolete monolithic component

Replaced by src/components/KnowledgeDetail/ subdirectory (7 files).
External import path preserved."
```

---

## Phase 4: 独立 vitest.config.ts

### Task 23: 创建 vitest.config.ts

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: 创建独立 vitest 配置**

```ts
// vitest.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/',
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
            },
        },
    },
    test: {
        environment: 'happy-dom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', 'scripts/**', 'worker/**'],
    },
});
```

注：把原 `vite.config.ts` 的 plugins/server proxy + 新增的 test 块集中到 `vitest.config.ts`，单一来源。

- [ ] **Step 2: 删除 vite.config.ts 中的 test 块**

打开 `vite.config.ts`，删除 `test: { environment: 'happy-dom' }` 块，保留 plugins + server proxy：

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: '/',
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
            },
        },
    },
});
```

- [ ] **Step 3: 验证 build 仍走 vite.config.ts（不读 vitest.config.ts）**

```bash
npm run build
```

Expected: vite build 0 错（vite build 命令只读 `vite.config.ts`，与 vitest.config.ts 共存无冲突）。

- [ ] **Step 4: 验证 test 走 vitest.config.ts，include 只匹配 src/**

```bash
npm test
```

Expected: 132 个测试全过；零 "No test suite found" 警告（之前 scripts/根 .test.mjs 已删，scripts 子包测试用各自 runner）。

- [ ] **Step 5: 验证 scripts 子包测试不受影响**

```bash
cd scripts/pi-agent-edu && npm test && cd ../..
cd scripts/ingest-data && npm test && cd ../..
```

Expected: 两个子包测试仍全过。

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vite.config.ts
git commit -m "chore(test): extract vitest config with src/-only include"
```

---

## Phase 5: 8 个 generator happy-path 单测

### Task 24: knowledge.test.ts

**Files:**
- Create: `src/services/ai/knowledge.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/knowledge.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({
    default: vi.fn(),
}));
vi.mock('../gateway', () => ({
    callGateway: vi.fn(),
}));

import OpenAI from 'openai';
import { callGateway } from '../gateway';
import { generateKnowledgeContent } from './knowledge';

describe('generateKnowledgeContent', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();

        // Reset callGateway mock between tests
        vi.mocked(callGateway).mockReset();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback (happy path)', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'Hello ' } }] };
                yield { choices: [{ delta: { content: 'world' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generateKnowledgeContent('加法', '小学一年级 数学', onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'gpt-4o',
                messages: expect.arrayContaining([
                    expect.objectContaining({ role: 'user' }),
                ]),
                stream: true,
            }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Hello ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'world');
    });

    it('uses callGateway when provider is gateway', async () => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'gateway',
                apiKey: '',
                baseUrl: '',
                model: '',
            }),
        );
        vi.mocked(callGateway).mockResolvedValue(undefined);

        await generateKnowledgeContent('加法', 'context', onStream);

        expect(callGateway).toHaveBeenCalledTimes(1);
        expect(callGateway).toHaveBeenCalledWith(
            expect.objectContaining({ prompt: expect.any(String) }),
            onStream,
        );
    });
});
```

- [ ] **Step 2: 运行测试验证**

```bash
npm test -- src/services/ai/knowledge.test.ts
```

Expected: 2 个测试全过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/knowledge.test.ts
git commit -m "test(ai): add happy-path coverage for generateKnowledgeContent"
```

### Task 25: tutorial.test.ts

**Files:**
- Create: `src/services/ai/tutorial.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/tutorial.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generateTutorialContent } from './tutorial';

describe('generateTutorialContent', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: '# Tutorial ' } }] };
                yield { choices: [{ delta: { content: 'content' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generateTutorialContent('Unit 1', 'context', onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
    });
});
```

- [ ] **Step 2: 运行测试**

```bash
npm test -- src/services/ai/tutorial.test.ts
```

Expected: 1 个测试通过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/tutorial.test.ts
git commit -m "test(ai): add happy-path coverage for generateTutorialContent"
```

### Task 26: practice.test.ts

**Files:**
- Create: `src/services/ai/practice.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/practice.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generatePracticeQuestions } from './practice';

describe('generatePracticeQuestions', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'Q1. ' } }] };
                yield { choices: [{ delta: { content: 'Q2.' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generatePracticeQuestions('Unit 1', 'context', onStream);

        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Q1. ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'Q2.');
    });
});
```

- [ ] **Step 2: 运行测试**

```bash
npm test -- src/services/ai/practice.test.ts
```

Expected: 1 个测试通过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/practice.test.ts
git commit -m "test(ai): add happy-path coverage for generatePracticeQuestions"
```

### Task 27: classical.test.ts

**Files:**
- Create: `src/services/ai/classical.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/classical.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generateClassicalInterpretation } from './classical';

describe('generateClassicalInterpretation', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: '古文解读：' } }] };
                yield { choices: [{ delta: { content: '...' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generateClassicalInterpretation('古文', '问题', onStream);

        expect(onStream).toHaveBeenCalledTimes(2);
    });
});
```

- [ ] **Step 2: 运行测试**

```bash
npm test -- src/services/ai/classical.test.ts
```

Expected: 1 个测试通过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/classical.test.ts
git commit -m "test(ai): add happy-path coverage for generateClassicalInterpretation"
```

### Task 28: template.test.ts

**Files:**
- Create: `src/services/ai/template.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/template.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({ callGateway: vi.fn() }));

import OpenAI from 'openai';
import { generateFromTemplate } from './template';

const MOCK_TEMPLATE = {
    id: 'tpl-test',
    title: 'Test Template',
    scenario: 'test',
    content: 'Hello {{name}}',
};

describe('generateFromTemplate', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'Hello ' } }] };
                yield { choices: [{ delta: { content: 'World' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generateFromTemplate(MOCK_TEMPLATE, { name: 'World' }, onStream);

        expect(onStream).toHaveBeenCalledTimes(2);
        expect(onStream).toHaveBeenNthCalledWith(1, 'Hello ');
        expect(onStream).toHaveBeenNthCalledWith(2, 'World');
    });
});
```

- [ ] **Step 2: 运行测试**

```bash
npm test -- src/services/ai/template.test.ts
```

Expected: 1 个测试通过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/template.test.ts
git commit -m "test(ai): add happy-path coverage for generateFromTemplate"
```

### Task 29: chat.test.ts

**Files:**
- Create: `src/services/ai/chat.test.ts`

- [ ] **Step 1: 创建测试文件**

```ts
// src/services/ai/chat.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({ default: vi.fn() }));
vi.mock('../gateway', () => ({
    chatGateway: vi.fn(),
}));

import OpenAI from 'openai';
import { chatGateway } from '../gateway';
import { generateChat } from './chat';

const MESSAGES = [
    { role: 'user' as const, content: 'Hi' },
    { role: 'assistant' as const, content: 'Hello!' },
];

describe('generateChat', () => {
    let onStream: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'openai',
                apiKey: 'test-key',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o',
            }),
        );
        onStream = vi.fn();
        vi.mocked(chatGateway).mockReset();
    });

    afterEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('streams chat completion chunks through onStream callback', async () => {
        const mockCreate = vi.fn().mockResolvedValue({
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: 'AI: ' } }] };
                yield { choices: [{ delta: { content: 'response' } }] };
            },
        });
        vi.mocked(OpenAI).mockImplementation(
            () =>
                ({
                    chat: { completions: { create: mockCreate } },
                }) as unknown as OpenAI,
        );

        await generateChat(MESSAGES, onStream);

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ stream: true }),
        );
        expect(onStream).toHaveBeenCalledTimes(2);
    });

    it('uses chatGateway when provider is gateway', async () => {
        window.localStorage.setItem(
            'school_formula_ai_config',
            JSON.stringify({
                provider: 'gateway',
                apiKey: '',
                baseUrl: '',
                model: '',
            }),
        );
        vi.mocked(chatGateway).mockResolvedValue(undefined);

        await generateChat(MESSAGES, onStream);

        expect(chatGateway).toHaveBeenCalledTimes(1);
        expect(chatGateway).toHaveBeenCalledWith(
            expect.objectContaining({ messages: MESSAGES }),
            onStream,
        );
    });
});
```

- [ ] **Step 2: 运行测试**

```bash
npm test -- src/services/ai/chat.test.ts
```

Expected: 2 个测试通过。

- [ ] **Step 3: Commit**

```bash
git add src/services/ai/chat.test.ts
git commit -m "test(ai): add happy-path coverage for generateChat"
```

### Task 30: 最终全量验证

- [ ] **Step 1: 完整 build + test**

```bash
npm run lint && npm run build && npm test
```

Expected: lint 零错、build 通过、140 个测试全过。

- [ ] **Step 2: 验证 scripts 子包测试不受影响**

```bash
cd scripts/pi-agent-edu && npm test && cd ../..
cd scripts/ingest-data && npm test && cd ../..
```

Expected: 两个子包测试仍全过。

- [ ] **Step 3: 验证 17 条 AC**

逐条对照 `docs/superpowers/specs/2026-09-29-architecture-refactor-design.md` 验收清单（AC-1 到 AC-17）：

```bash
# AC-1: lint
npm run lint

# AC-2: build
npm run build

# AC-3: vitest 测试数
npm test 2>&1 | grep -E "Test Files|Tests"

# AC-8: import 路径不变
grep -rn "from '.*services/ai'" src/

# AC-9: import 路径不变
grep -rn "from '.*KnowledgeDetail'" src/

# AC-10: dead code 文件不存在
ls src/services/ai.ts src/components/KnowledgeDetail.tsx src/App.css 2>&1

# AC-11: 4 个被删 generator 无残留
grep -rn "generateExamQuestions\|generateErrorAnalysis\|generateStudyPlan\|generateFormulaDerivation" src/

# AC-12: scripts/根 .mjs 无残留
ls scripts/*.mjs scripts/*.test.mjs 2>&1 | head -20
```

- [ ] **Step 4: Manual smoke（dev server）**

```bash
npm run dev &
sleep 5
# 浏览器访问 http://localhost:5173/
# 进入任意知识点详情页，点击"生成深度辅导指南"按钮，验证流式 Markdown 渲染
kill %1 2>/dev/null
```

Expected: AI 智能助教 section 触发流式渲染，文案正确。

- [ ] **Step 5: 写 PR 描述（如最终需要）**

PR 标题：`refactor: A 子项目 · 架构与代码质量重构（spec 15f1c5c）`

PR 描述包含：
- 引用 spec commit hash `15f1c5c`
- 列出 5 phase 的 commit hash
- 列出删除清单（4 个 generator + App.css + 16 个 scripts/根 .mjs）
- 列出新增文件清单（10 个 ai/ + 7 个 KnowledgeDetail/ + vitest.config.ts + 8 个 test）
- 列出行为不变约束已遵守
- 列出顺手清理范围（注释 typo、a11y 等）

---

## Self-Review Checklist

执行完所有 task 后，对照以下清单：

- [ ] AC-1 到 AC-17 全部通过
- [ ] 5 个 phase 的 commit 全部存在，message 符合约定
- [ ] 8 个 generator 测试全过
- [ ] 无 "No test suite found" 警告
- [ ] scripts/pi-agent-edu + scripts/ingest-data 测试仍全过
- [ ] dev server 启动 + KnowledgeDetail 详情页可访问 + 流式渲染正常
- [ ] import 路径与拆前完全一致
- [ ] 4 个被删 generator 无残留
- [ ] src/App.css 不存在
