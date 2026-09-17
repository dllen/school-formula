# pi-agent-edu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建交互式 CLI 工具，通过 pi agent SDK 生成中小学教育资源，全程工具调用需人工确认。

**Architecture:** 使用 pi SDK 的事件订阅机制拦截工具调用，终端交互确认后放行。TypeScript + Node.js，`tsx` 直接运行，无需编译。

**Tech Stack:** TypeScript, Node.js, pi-sdk (@pi-kit/sdk), tsx

**Spec:** `docs/superpowers/specs/2026-09-17-pi-agent-edu-design.md`

## Global Constraints

- TypeScript 严格模式，`verbatimModuleSyntax: true`
- 所有路径使用绝对路径或相对于项目根目录
- 配置文件：`~/.pi-edu/config.json`（用户级）
- 会话历史：`~/.pi-edu/sessions/`（JSON 文件）
- 工具确认策略：`read`/`grep`/`find` 自动放行；`bash`/`write`/`edit` 需确认

---

## 文件结构

```
scripts/pi-agent-edu/
├── package.json          # 依赖声明（pi-sdk, tsx, typescript）
├── tsconfig.json         # TS 配置
├── index.ts             # CLI 入口
├── config.ts             # 配置加载 + API Key 管理
├── storage.ts            # 会话历史持久化
├── tools.ts              # 自定义工具集（read/bash/write/edit/grep/find）
├── session.ts            # pi agent 会话封装（含工具确认拦截）
├── io.ts                 # 终端 I/O（彩色输出、确认提示）
└── prompts.ts           # System prompt 模板
```

---

## Task 1: 项目脚手架

**Files:**
- Create: `scripts/pi-agent-edu/package.json`
- Create: `scripts/pi-agent-edu/tsconfig.json`

**Interfaces:**
- Produces: 可通过 `npx tsx` 直接运行项目

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "pi-agent-edu",
  "version": "1.0.0",
  "description": "交互式 CLI 工具，通过 pi agent 生成中小学教育资源",
  "type": "module",
  "bin": {
    "pi-agent-edu": "./index.ts"
  },
  "scripts": {
    "dev": "tsx index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@pi-kit/sdk": "workspace:*"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

> 注：`@pi-kit/sdk` 的 workspace 路径需根据实际安装方式调整。若 SDK 未发布到 npm，使用本地路径或直接安装。

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["."]
}
```

- [ ] **Step 3: 提交**

```bash
git add scripts/pi-agent-edu/package.json scripts/pi-agent-edu/tsconfig.json
git commit -m "feat(pi-agent-edu): init project scaffold"
```

---

## Task 2: 工具函数库（io.ts）

**Files:**
- Create: `scripts/pi-agent-edu/io.ts`

**Interfaces:**
- Produces:
  - `print(msg: string, type?: 'info' | 'success' | 'warn' | 'error' | 'thinking')` — 彩色打印
  - `prompt(message: string): Promise<string>` — 等待用户输入
  - `confirm(message: string): Promise<boolean>` — Yes/No 确认
  - `toolConfirm(tool: string, args: object): Promise<'y' | 'n' | 'q' | 'a' | 'b'>` — 工具确认
  - `pager(lines: string[], limit?: number): Promise<void>` — 分页显示
  - `clearLine()` — 清除当前行

- [ ] **Step 1: 实现 io.ts**

```typescript
import readline from 'node:readline';

type Color = (text: string) => string;
const colors = {
  reset: (t: string) => `\x1b[0m${t}\x1b[0m`,
  dim: (t: string) => `\x1b[2m${t}\x1b[0m`,
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t: string) => `\x1b[33m${t}\x1b[0m`,
  red: (t: string) => `\x1b[31m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
};

export function print(msg: string, type: 'info' | 'success' | 'warn' | 'error' | 'thinking' = 'info') {
  const prefix: Record<string, string> = {
    info: '  ',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    thinking: '🤔',
  };
  const colorFn: Record<string, Color> = {
    info: colors.reset,
    success: colors.green,
    warn: colors.yellow,
    error: colors.red,
    thinking: colors.magenta,
  };
  console.log(`${prefix[type]} ${colorFn[type](msg)}`);
}

export async function prompt(message: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function confirm(message: string): Promise<boolean> {
  const answer = await prompt(`${message} (y/n) `);
  return answer.toLowerCase() === 'y';
}

export async function toolConfirm(tool: string, args: object): Promise<'y' | 'n' | 'q' | 'a' | 'b'> {
  const argsStr = JSON.stringify(args, null, 2).slice(0, 200);
  const answer = await prompt(
    `\n${colors.cyan('🔧')} ${colors.reset('工具调用:')} ${colors.yellow(tool)}\n${colors.dim(argsStr)}\n${colors.reset('[y/n/q/a(yes all)/b(no all)]? ')}`
  );
  return answer.toLowerCase() as 'y' | 'n' | 'q' | 'a' | 'b';
}

export async function pager(lines: string[], limit = 30): Promise<void> {
  if (lines.length <= limit) {
    console.log(lines.join('\n'));
    return;
  }
  for (let i = 0; i < lines.length; i += limit) {
    console.log(lines.slice(i, i + limit).join('\n'));
    if (i + limit < lines.length) {
      const ans = await prompt(colors.dim('-- More -- (q to quit) '));
      if (ans.toLowerCase() === 'q') break;
    }
  }
}

export function clearLine(): void {
  process.stdout.write('\x1b[2K\r');
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/io.ts
git commit -m "feat(pi-agent-edu): add terminal I/O utilities"
```

---

## Task 3: 配置管理（config.ts）

**Files:**
- Create: `scripts/pi-agent-edu/config.ts`

**Interfaces:**
- Produces:
  - `loadConfig(): Promise<Config>` — 加载配置，不存在则引导创建
  - `Config` type — `{ apiKey: string; model: string; autoApproveTools: string[]; sessionsDir: string }`

- [ ] **Step 1: 实现 config.ts**

```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { print, prompt } from './io.js';

export interface Config {
  apiKey: string;
  model: string;
  autoApproveTools: string[];
  sessionsDir: string;
}

const DEFAULT_CONFIG: Omit<Config, 'apiKey'> = {
  model: 'pi-agent',
  autoApproveTools: ['read', 'grep', 'find'],
  sessionsDir: '~/.pi-edu/sessions/',
};

function getConfigPath(): string {
  return join(homedir(), '.pi-edu', 'config.json');
}

function getSessionsDir(): string {
  return join(homedir(), '.pi-edu', 'sessions');
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();
  const configDir = join(homedir(), '.pi-edu');

  // 尝试加载现有配置
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content) as Config;
      if (config.apiKey) return config;
    } catch {
      // 读取失败，引导创建
    }
  }

  // 引导用户创建配置
  print('首次使用，需要配置 pi API Key', 'warn');
  print('请访问 https://pi.dev 获取 API Key', 'info');

  const apiKey = await prompt('请输入 PI_API_KEY: ');
  if (!apiKey.trim()) {
    print('API Key 不能为空', 'error');
    process.exit(1);
  }

  const model = await prompt(`模型名称 (默认: ${DEFAULT_CONFIG.model}): `);

  const config: Config = {
    ...DEFAULT_CONFIG,
    apiKey: apiKey.trim(),
    model: model.trim() || DEFAULT_CONFIG.model,
  };

  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  print('配置已保存到 ' + configPath, 'success');

  return config;
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/config.ts
git commit -m "feat(pi-agent-edu): add config management with interactive setup"
```

---

## Task 4: 会话持久化（storage.ts）

**Files:**
- Create: `scripts/pi-agent-edu/storage.ts`

**Interfaces:**
- Produces:
  - `SessionMeta` type — `{ id: string; createdAt: string; summary: string }`
  - `listSessions(): SessionMeta[]` — 列出所有会话
  - `loadSession(id: string): AgentSession | null` — 加载指定会话
  - `saveSession(id: string, messages: unknown[]): void` — 保存当前会话
  - `newSessionId(): string` — 生成新会话 ID

- [ ] **Step 1: 实现 storage.ts**

```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { print } from './io.js';

export interface SessionMeta {
  id: string;
  createdAt: string;
  summary: string;
}

function getSessionsDir(): string {
  return join(homedir(), '.pi-edu', 'sessions');
}

function getSessionsIndexPath(): string {
  return join(getSessionsDir(), 'sessions.json');
}

export function ensureSessionsDir(): void {
  mkdirSync(getSessionsDir(), { recursive: true });
}

export function listSessions(): SessionMeta[] {
  const indexPath = getSessionsIndexPath();
  if (!existsSync(indexPath)) return [];
  try {
    const content = readFileSync(indexPath, 'utf-8');
    const sessions = JSON.parse(content) as SessionMeta[];
    return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveSession(id: string, summary: string): void {
  ensureSessionsDir();
  const indexPath = getSessionsIndexPath();
  const sessions = listSessions();
  const existing = sessions.findIndex((s) => s.id === id);
  const meta: SessionMeta = { id, createdAt: new Date().toISOString(), summary };

  if (existing >= 0) {
    sessions[existing] = meta;
  } else {
    sessions.unshift(meta);
  }

  writeFileSync(indexPath, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function getSessionPath(id: string): string {
  return join(getSessionsDir(), `${id}.json`);
}

export function saveSessionMessages(id: string, messages: unknown[]): void {
  ensureSessionsDir();
  const path = getSessionPath(id);
  writeFileSync(path, JSON.stringify(messages, null, 2), 'utf-8');
}

export function loadSessionMessages(id: string): unknown[] | null {
  const path = getSessionPath(id);
  if (!existsSync(path)) return null;
  try {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function newSessionId(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/storage.ts
git commit -m "feat(pi-agent-edu): add session persistence"
```

---

## Task 5: System Prompt 模板（prompts.ts）

**Files:**
- Create: `scripts/pi-agent-edu/prompts.ts`

**Interfaces:**
- Produces:
  - `getSystemPrompt(): string` — 返回 system prompt

- [ ] **Step 1: 实现 prompts.ts**

```typescript
export function getSystemPrompt(): string {
  return `你是一位资深中国中学教师，擅长为家庭辅导场景设计完整的教育内容。

【输出格式】
你的输出必须是严格合法的 TypeScript 对象字面量，符合以下接口之一：

// 教程单元
interface TutorialUnit {
  id: string;
  title: string;
  order: number;
  duration: string;
  objectives: string[];
  teach: { hook: string; summary: string; };
  learn: {
    sections: { title: string; content: string; diagrams?: {type:'mermaid'|'svg';content:string;caption?:string}[]; examples?: {title:string;problem:string;solution:string;tip:string}[] }[];
    tips: string[];
  };
  practice: { id: string; type: 'choice'|'fill'|'truefalse'|'solve'; question: string; options?: string[]; answer: string|string[]; explanation: string; difficulty: 'easy'|'medium'|'hard' }[];
  aiContext: string;
}

// 练习题组
interface Question {
  id: string;
  type: 'choice'|'fill'|'truefalse'|'solve';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  difficulty: 'easy'|'medium'|'hard';
}

【规则】
1. 只输出 TS 对象字面量，不要 markdown fences 或解释
2. 字符串用双引号，内部双引号用 \\\\ 转义
3. 数学/物理/化学题必须事实正确，计算需验算
4. 语言风格：初中准确平实有探究感；高中精确严谨体现学科思维
5. 题目覆盖 easy/medium/hard 三个难度等级
6. 善用工具：读取 src/data/tutorials/ 了解现有数据格式，读取 src/data/knowledge/ 了解知识点结构
7. 生成内容先写入临时文件或直接输出，不要覆盖已有内容（除非用户明确要求）
`;
}
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/prompts.ts
git commit -m "feat(pi-agent-edu): add system prompt template"
```

---

## Task 6: 工具集（tools.ts）

**Files:**
- Create: `scripts/pi-agent-edu/tools.ts`

**Interfaces:**
- Produces:
  - `createTools(): Tool[]` — 返回 pi SDK 可用的工具数组

**注意：** pi SDK 的工具定义格式需根据实际 API 调整。以下为伪代码，实际实现需对照 `@pi-kit/sdk` 的 `defineTool` API。

- [ ] **Step 1: 实现 tools.ts**

```typescript
// 注意：以下工具定义需对照 @pi-kit/sdk 的实际 API 调整
// pi SDK 的 defineTool 签名通常是：
// defineTool({ id, description, inputSchema, handler })

export function createTools() {
  return [
    // read 工具
    defineTool({
      id: 'read',
      description: '读取文件内容',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '文件路径' },
          encoding: { type: 'string', default: 'utf-8' },
        },
        required: ['path'],
      },
      handler: async ({ path, encoding = 'utf-8' }: { path: string; encoding?: string }) => {
        const { readFileSync } = await import('node:fs');
        try {
          return readFileSync(path, encoding);
        } catch (e) {
          return `Error reading ${path}: ${(e as Error).message}`;
        }
      },
    }),

    // bash 工具
    defineTool({
      id: 'bash',
      description: '执行 shell 命令',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: '要执行的命令' },
          cwd: { type: 'string', description: '工作目录' },
        },
        required: ['command'],
      },
      handler: async ({ command, cwd }: { command: string; cwd?: string }) => {
        const { execSync } = await import('node:child_process');
        try {
          return execSync(command, { cwd, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        } catch (e) {
          return `Error: ${(e as Error).message}`;
        }
      },
    }),

    // write 工具
    defineTool({
      id: 'write',
      description: '写入文件（覆盖）',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '文件路径' },
          content: { type: 'string', description: '文件内容' },
          encoding: { type: 'string', default: 'utf-8' },
        },
        required: ['path', 'content'],
      },
      handler: async ({ path, content, encoding = 'utf-8' }: { path: string; content: string; encoding?: string }) => {
        const { writeFileSync, mkdirSync } = await import('node:fs');
        const { dirname } = await import('node:path');
        try {
          mkdirSync(dirname(path), { recursive: true });
          writeFileSync(path, content, encoding);
          return `Written to ${path}`;
        } catch (e) {
          return `Error writing ${path}: ${(e as Error).message}`;
        }
      },
    }),

    // edit 工具
    defineTool({
      id: 'edit',
      description: '编辑文件中的文本',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          find: { type: 'string', description: '要替换的文本' },
          replace: { type: 'string', description: '替换后的文本' },
          occurrence: { type: 'number', description: '替换第几个匹配（1-based，默认全部）' },
        },
        required: ['path', 'find', 'replace'],
      },
      handler: async ({ path, find, replace, occurrence }: { path: string; find: string; replace: string; occurrence?: number }) => {
        const { readFileSync, writeFileSync } = await import('node:fs');
        let content = readFileSync(path, 'utf-8');
        if (occurrence !== undefined) {
          let idx = 0;
          let pos = 0;
          while ((pos = content.indexOf(find, pos)) !== -1) {
            idx++;
            if (idx === occurrence) {
              content = content.slice(0, pos) + replace + content.slice(pos + find.length);
              break;
            }
            pos += find.length;
          }
        } else {
          content = content.split(find).join(replace);
        }
        writeFileSync(path, content, 'utf-8');
        return `Edited ${path}`;
      },
    }),

    // grep 工具
    defineTool({
      id: 'grep',
      description: '在文件中搜索文本',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          pattern: { type: 'string' },
          recursive: { type: 'boolean', default: false },
        },
        required: ['path', 'pattern'],
      },
      handler: async ({ path, pattern, recursive }: { path: string; pattern: string; recursive?: boolean }) => {
        const { execSync } = await import('node:child_process');
        const flag = recursive ? '-r' : '';
        try {
          return execSync(`grep ${flag} "${pattern}" ${path}`, { encoding: 'utf-8' });
        } catch {
          return '';
        }
      },
    }),

    // find 工具
    defineTool({
      id: 'find',
      description: '查找文件',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          pattern: { type: 'string' },
        },
        required: ['path', 'pattern'],
      },
      handler: async ({ path, pattern }: { path: string; pattern: string }) => {
        const { execSync } = await import('node:child_process');
        try {
          return execSync(`find ${path} -name "${pattern}" 2>/dev/null`, { encoding: 'utf-8' });
        } catch {
          return '';
        }
      },
    }),
  ];
}
```

> **重要说明**：上述代码中 `defineTool` 是 pi SDK 的导出函数，实际签名需对照 `@pi-kit/sdk` 文档。若 API 不同，需调整参数格式。

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/tools.ts
git commit -m "feat(pi-agent-edu): add tool definitions"
```

---

## Task 7: 会话封装（session.ts）

**Files:**
- Create: `scripts/pi-agent-edu/session.ts`

**Interfaces:**
- Consumes: `Config`, `Tool[]` from tasks 3, 4, 6
- Produces:
  - `InteractiveSession` class — 封装 pi agent 会话，含工具确认拦截

**核心逻辑**：
1. 创建 `createAgentSession()` 时注册工具和确认回调
2. `subscribe()` 监听 `tool_use` 事件，暂停并等待用户确认
3. 确认后执行或拒绝

- [ ] **Step 1: 实现 session.ts**

```typescript
import { createAgentSession } from '@pi-kit/sdk';
import { toolConfirm } from './io.js';
import type { Config } from './config.js';
import type { Tool } from './tools.js';

export interface ToolCall {
  tool: string;
  args: Record<string, unknown>;
}

export class InteractiveSession {
  private session: Awaited<ReturnType<typeof createAgentSession>>;
  private autoApprove: Set<string>;
  private sessionId: string;
  private toolApproveAll = false;
  private toolRejectAll = false;

  constructor(config: Config, tools: Tool[], sessionId: string) {
    this.sessionId = sessionId;
    this.autoApprove = new Set(config.autoApproveTools);

    this.session = createAgentSession({
      apiKey: config.apiKey,
      model: config.model,
      customTools: tools,
      onToolCall: async (tool: string, args: Record<string, unknown>) => {
        return this.interceptToolCall(tool, args);
      },
    });
  }

  private async interceptToolCall(tool: string, args: Record<string, unknown>): Promise<{ approved: boolean; result?: string }> {
    // 自动放行的工具
    if (this.autoApprove.has(tool) && !this.toolApproveAll && !this.toolRejectAll) {
      return { approved: true };
    }

    // 全局 all 模式
    if (this.toolApproveAll) return { approved: true };
    if (this.toolRejectAll) return { approved: false, result: 'skipped by user' };

    // 询问用户
    const answer = await toolConfirm(tool, args);

    switch (answer) {
      case 'y':
        return { approved: true };
      case 'n':
        return { approved: false, result: 'skipped by user' };
      case 'q':
        this.session.abort?.();
        return { approved: false, result: 'aborted by user' };
      case 'a':
        this.toolApproveAll = true;
        return { approved: true };
      case 'b':
        this.toolRejectAll = true;
        return { approved: false, result: 'skipped by user' };
      default:
        return { approved: false };
    }
  }

  async prompt(message: string): Promise<string> {
    const response = await this.session.prompt(message);
    return response.text ?? '';
  }

  getSessionId(): string {
    return this.sessionId;
  }

  subscribe(handler: (event: string, data: unknown) => void): void {
    this.session.subscribe(handler);
  }

  abort(): void {
    this.session.abort?.();
  }
}
```

> **重要说明**：`@pi-kit/sdk` 的实际 API 可能不同。需要确认：
> 1. `createAgentSession` 的参数签名
> 2. `session.prompt()` 的返回类型
> 3. `session.subscribe()` 的事件类型
> 4. `onToolCall` 是否是正确的事件名
> 若 API 不同，此文件需相应调整。

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/session.ts
git commit -m "feat(pi-agent-edu): add interactive session with tool call interception"
```

---

## Task 8: CLI 入口（index.ts）

**Files:**
- Create: `scripts/pi-agent-edu/index.ts`

**Interfaces:**
- Consumes: 所有其他模块
- Produces: 可运行的 CLI 工具

- [ ] **Step 1: 实现 index.ts**

```typescript
#!/usr/bin/env node

import { print, prompt, confirm } from './io.js';
import { loadConfig } from './config.js';
import { listSessions, saveSession, saveSessionMessages, newSessionId, loadSessionMessages } from './storage.js';
import { createTools } from './tools.js';
import { getSystemPrompt } from './prompts.js';
import { InteractiveSession } from './session.js';
import { homedir } from 'node:os';
import { join } from 'node:path';

async function main() {
  print('🎓 pi-agent-edu — 教育资源生成工具', 'info');
  print(`配置目录: ${join(homedir(), '.pi-edu')}`, 'info');

  // 解析命令行参数
  const args = process.argv.slice(2);

  if (args.includes('--sessions') || args.includes('-l')) {
    const sessions = listSessions();
    if (sessions.length === 0) {
      print('暂无历史会话', 'info');
      return;
    }
    print(`共 ${sessions.length} 个会话:`, 'info');
    sessions.forEach((s) => {
      console.log(`  ${s.id}  ${s.createdAt.slice(0, 16)}  ${s.summary || '(无摘要)'}`);
    });
    return;
  }

  // 加载配置
  const config = await loadConfig();

  // 确定会话
  let sessionId: string;
  let existingMessages: unknown[] | null = null;

  const continueIdx = args.findIndex((a) => a === '--continue' || a === '-c');
  if (continueIdx >= 0) {
    const targetId = args[continueIdx + 1];
    if (targetId) {
      sessionId = targetId;
      existingMessages = loadSessionMessages(targetId);
      if (!existingMessages) {
        print(`找不到会话: ${targetId}`, 'error');
        return;
      }
      print(`恢复会话: ${targetId}`, 'success');
    } else {
      const sessions = listSessions();
      if (sessions.length === 0) {
        print('暂无历史会话', 'warn');
        sessionId = newSessionId();
      } else {
        sessionId = sessions[0].id;
        existingMessages = loadSessionMessages(sessionId);
        print(`恢复最近会话: ${sessionId}`, 'success');
      }
    }
  } else if (args.includes('--new') || args.includes('-n')) {
    sessionId = newSessionId();
  } else {
    sessionId = newSessionId();
  }

  // 创建会话
  const tools = createTools();
  const session = new InteractiveSession(config, tools, sessionId);

  // 初始化 system prompt
  await session.prompt(getSystemPrompt());

  print(`\n会话 ID: ${sessionId}`, 'info');
  print('输入你的目标（如：生成初一数学第一章 TutorialUnit）', 'info');
  print('输入 q 或 quit 退出\n', 'info');

  // 主交互循环
  while (true) {
    const input = await prompt('\n> ');
    if (!input.trim() || input.toLowerCase() === 'q' || input.toLowerCase() === 'quit') {
      print('再见！', 'success');
      break;
    }

    if (input.toLowerCase() === 'help') {
      print('可用命令:', 'info');
      print('  help    - 显示帮助', 'info');
      print('  q/quit  - 退出', 'info');
      print('  save    - 保存当前会话', 'info');
      continue;
    }

    try {
      print('思考中...', 'thinking');
      const response = await session.prompt(input);
      console.log('\n' + response + '\n');

      // 询问是否保存
      const shouldSave = await confirm('是否将本次输出保存到文件?');
      if (shouldSave) {
        const path = await prompt('保存路径 (如: src/data/tutorials/primary-math.ts): ');
        if (path.trim()) {
          const { writeFileSync, mkdirSync } = await import('node:fs');
          const { dirname } = await import('node:path');
          mkdirSync(dirname(path.trim()), { recursive: true });
          writeFileSync(path.trim(), response, 'utf-8');
          print(`已保存到 ${path.trim()}`, 'success');
        }
      }

      // 保存会话
      saveSession(sessionId, input.slice(0, 100));
    } catch (e) {
      print(`错误: ${(e as Error).message}`, 'error');
    }
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/index.ts
git commit -m "feat(pi-agent-edu): add CLI entry point with interactive loop"
```

---

## Task 9: 依赖安装与运行验证

**Files:**
- Modify: `scripts/pi-agent-edu/package.json`（调整 pi-sdk 依赖来源）

- [ ] **Step 1: 确认 pi SDK 安装方式**

首先检查 `@pi-kit/sdk` 的实际安装方式：
```bash
npm search @pi-kit/sdk
# 或查看 https://pi.dev/docs/latest/sdk
```

根据实际发布情况调整 package.json 中的依赖路径。

- [ ] **Step 2: 安装依赖并运行**

```bash
cd scripts/pi-agent-edu
npm install
npx tsx index.ts --help
```

- [ ] **Step 3: 验证工具链**

测试以下场景：
1. 无配置 → 引导输入 API Key
2. 有配置 → 直接进入会话
3. `read`/`grep`/`find` 工具自动放行
4. `bash`/`write` 工具暂停确认

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat(pi-agent-edu): complete tool, ready to run"
```

---

## Task 10: README

**Files:**
- Create: `scripts/pi-agent-edu/README.md`

- [ ] **Step 1: 编写 README**

```markdown
# pi-agent-edu

交互式 CLI 工具，通过 pi agent SDK 生成中小学教育资源。

## 安装

```bash
cd scripts/pi-agent-edu
npm install
```

## 运行

```bash
# 新会话
npx tsx index.ts

# 恢复最近会话
npx tsx index.ts --continue

# 恢复指定会话
npx tsx index.ts --continue <session-id>

# 列出会话
npx tsx index.ts --sessions
```

## 配置

首次运行会自动引导配置 `~/.pi-edu/config.json`。

## 使用示例

```
> 生成初一数学第一章 TutorialUnit
> 生成 10 道初中物理练习题（easy:medium:hard = 4:4:2）
> 查看现有的小学英语 TutorialUnit
> 生成高中化学第二章知识点的练习题
```
```

- [ ] **Step 2: 提交**

```bash
git add scripts/pi-agent-edu/README.md
git commit -m "docs(pi-agent-edu): add README"
```

---

## 自我检查清单

**Spec 覆盖检查：**
- [x] 配置文件 `~/.pi-edu/config.json` — Task 3
- [x] 会话历史 `~/.pi-edu/sessions/` — Task 4
- [x] 工具集（read/bash/write/edit/grep/find）— Task 6
- [x] 工具确认拦截 — Task 7
- [x] 彩色输出 + 确认提示 — Task 2
- [x] System prompt 模板 — Task 5
- [x] CLI 入口 — Task 8
- [x] 运行验证 — Task 9

**占位符扫描：**
- Task 6 和 Task 7 中的 `defineTool` 和 `createAgentSession` API 需要对照实际 `@pi-kit/sdk` 调整
- 这些是已知的需适配点，不是遗漏

**类型一致性：**
- 所有模块间接口已在 Interfaces 段落明确定义
- Task 间依赖关系清晰
