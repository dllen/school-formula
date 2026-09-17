# pi-agent-edu 设计文档

## 概述

交互式 CLI 工具，通过本地 `pi` CLI agent 生成中小学教育资源（教程、练习题等）。

**核心特性**：
- 直接调用本地 `pi` CLI（无需单独配置，使用 pi 的认证体系）
- 引导模式让用户选择学段/科目/年级/任务类型/题目数量
- 实时流式输出 pi agent 的思考过程和响应

## 架构变更（2026-09-17）

**原设计**：使用 `@pi-kit/sdk` SDK 调用 AI
**初版实现**：直接调用本地 `pi` CLI（`pi --print --continue`），靠字符串匹配解析 stdout/stderr
**最终实现（已迁移）**：进程内引入 `@earendil-works/pi-coding-agent@0.85.1` SDK

SDK（`createAgentSession` + `session.subscribe()`）负责：
- AI 模型调用（ModelRuntime 直读 `~/.pi/agent/auth.json` + `models.json`）
- 结构化事件流（`thinking_delta` / `text_delta` / `tool_execution_end.isError` / `message_end.stopReason`）
- 工具调用（read/bash/edit/write/grep/find/ls，SDK 内自动执行）
- 会话持久化（pi 原生 SessionManager，弃用自造 `~/.pi-edu/sessions/`）

`pi-agent-edu` 负责：
- 用户交互（引导模式、命令解析、`model`/`thinking` 命令）
- 事件映射与终端渲染（思考/回答/工具/错误着色）
- 流式输出展示

## 用户交互流程

```
启动 → 检查 pi 是否安装 → 检测 Provider
    ↓
引导模式（可跳过）：
  - 选择 Provider
  - 选择学段（小学/初中/高中）
  - 选择科目（动态显示）
  - 选择年级
  - 选择任务类型
  - 选择题目数量（仅练习题）
    ↓
构造 prompt → 调用 pi --print
    ↓
流式输出思考过程和响应
    ↓
交互模式：
  - 普通输入 → 发送给 agent
  - `provider` → 切换 Provider
  - `save` → 保存会话
  - `q` → 退出
```

## Provider 选择

启动时检测 `~/.pi/agent/models.json` 中的可用 Provider：

```json
{
  "providers": {
    "qwen-no-plan": {
      "name": "千问官方",
      "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
      "models": [...]
    },
    "openai": {...}
  }
}
```

- 仅一个 Provider：自动选择
- 多个 Provider：用户选择
- 运行时切换：交互模式输入 `provider` 命令

## 快捷命令

> **注意**：使用 `npm run` 而非 `pnpm`，因为 `pnpm` 在执行脚本前会运行 `pnpm install` 检查，
> 可能遇到 `Ignored build scripts` 错误。如果需要 `pnpm`，先运行 `pnpm approve-builds`。

```bash
npm run gen:dsl          # 启动引导模式
npm run gen:new          # 强制新建会话
npm run gen:continue     # 继续上次会话
npm run gen:sessions     # 列出会话
npm run gen:help         # 查看帮助
```

## 工具确认策略

| 工具 | 默认行为 | 说明 |
|------|---------|------|
| `read` | 自动放行 | 只读，无风险 |
| `grep` | 自动放行 | 只读，无风险 |
| `find` | 自动放行 | 只读，无风险 |
| `ls` | 自动放行 | 只读，无风险 |
| `bash` | 需确认 | 可能执行危险命令 |
| `write` | 需确认 | 写入文件 |
| `edit` | 需确认 | 修改文件 |

用户可对单个工具切换默认行为（`a` = yes all / `b` = no all）。

## 模块设计

### `config.ts`

- 配置文件路径：`~/.pi-edu/config.json`（用户级）
- 支持字段：
  - `apiKey`: pi API Key（必填）
  - `model`: 模型名称（可选，默认 `pi-agent`）
  - `autoApproveTools`: 自动放行的工具列表（默认 `["read", "grep", "find"]`）
  - `sessionsDir`: 会话历史目录（默认 `~/.pi-edu/sessions/`）
- 配置不存在时，交互引导用户输入 API Key 并保存

### `storage.ts`

- 会话历史目录：`~/.pi-edu/sessions/`
- 文件命名：按时间戳 `YYYY-MM-DD-HH-mm-ss.json`
- 会话元数据：`sessions.json`（包含 id、时间、摘要）
- 支持命令：
  - `--continue [sessionId]`: 恢复历史会话
  - `--sessions`: 列出所有会话
  - `--new`: 强制新会话

### `tools.ts`

自定义工具集，使用 typebox schema 匹配 pi SDK API：

```typescript
export function createTools(cwd?: string): ToolInfo[]

// ToolInfo 包含:
interface ToolInfo {
  name: string;
  label: string;
  description: string;
  schema: TObject;      // typebox schema
  execute: (args) => Promise<string>;
}
```

**实现的工具（7 个）：**
- `read` — 读取文件内容（path, offset?, limit?）
- `bash` — 执行 shell 命令（command, cwd?, timeout?）
- `write` — 写入文件（path, content, encoding?）
- `edit` — 编辑文件中的文本（path, find, replace, occurrence?）
- `grep` — 搜索文件内容（pattern, path?, literal?）
- `find` — 查找文件（pattern, path?, limit?）
- `ls` — 列出目录（path?）

### `session.ts`

- `InteractiveSession` 类 — 公共 API
- `InlineAgentSession` — 内联占位符实现（SDK 就绪后替换）
- 核心方法：
  - `prompt(message: string): Promise<string>` — 发送消息
  - `getSessionId(): string` — 获取会话 ID
  - `abort(): void` — 中止会话
  - `subscribe(listener: SessionEventListener): () => void` — 订阅事件

**事件类型（SessionEvent discriminated union）：**
```typescript
| { type: "tool_call"; call: SessionToolCall }
| { type: "tool_result"; toolCallId: string; result: string }
| { type: "agent_thinking"; text: string }
| { type: "agent_speaking"; text: string }
| { type: "error"; error: string }
```

### `io.ts`

终端 I/O 封装（使用 ANSI 转义码）：

- `print(msg, type?)` — 彩色打印（info/success/warn/error/thinking）
- `prompt(message): Promise<string>` — 等待用户输入
- `confirm(message): Promise<boolean>` — Yes/No 确认
- `toolConfirm(tool, args): Promise<'y'|'n'|'q'|'a'|'b'>` — 工具确认
- `pager(lines, limit?)` — 分页显示
- `clearLine()` — 清除当前行

### `prompts.ts`

System prompt 模板，包含：

- 角色定义（中学教师专家）
- 输出格式规范（TutorialUnit、Question 接口）
- 教育内容质量要求（准确、适龄、分层）
- 工具使用指导

### `index.ts`

CLI 入口：

```bash
npx tsx index.ts                    # 新会话
npx tsx index.ts --continue         # 恢复最近会话
npx tsx index.ts --continue <id>   # 恢复指定会话
npx tsx index.ts --sessions        # 列出会话
npx tsx index.ts --new            # 强制新会话
```

交互命令：
- `help` — 显示帮助
- `q` / `quit` — 退出
- `save` — 保存当前会话

## 输出格式

### 教育内容类型

根据用户输入推断或明确指定：

1. **TutorialUnit**: 教程单元（教/学/练 + 10 题）
2. **Question[]**: 练习题组（可指定数量和难度）
3. **KnowledgePoint**: 知识点讲解
4. **Answer**: 习题答案与解析

### 保存确认

生成完成后交互询问是否保存。

## 技术栈

- **Runtime**: Node.js + TypeScript
- **执行**: `tsx`（直接运行 TS）
- **配置**: JSON（无外部依赖）
- **Schema**: typebox（匹配 pi SDK）

## 依赖项

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "typebox": "^0.97.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

## 错误处理

| 场景 | 处理方式 |
|------|---------|
| API Key 无效 | 提示重新输入，更新配置 |
| 网络错误 | 提示用户 |
| pi SDK 错误 | 打印错误信息，提供诊断建议 |
| 文件写入失败 | 提示权限问题，建议手动复制 |
| 用户中断（Ctrl+C） | 保存当前会话，优雅退出 |

## 配置示例

`~/.pi-edu/config.json`:

```json
{
  "apiKey": "pk-xxxxx",
  "model": "pi-agent",
  "autoApproveTools": ["read", "grep", "find", "ls"],
  "sessionsDir": "~/.pi-edu/sessions/"
}
```

## SDK 集成（已完成）

已从 `pi` CLI 子进程迁移到 `@earendil-works/pi-coding-agent` SDK：

1. `config.ts` — 用 `ModelRuntime.create()` + `getAvailable()`/`checkAuth()` 做 provider/模型发现
2. `session.ts` — `createAgentSession` + `session.subscribe()`，映射 SDK 事件到 `SessionEvent`
3. `index.ts` — `--sessions`/`--continue` 走 pi 原生 `SessionManager`，`model`/`thinking` 命令切换
4. 弃用 `storage.ts`（自造会话存储）与 `io.ts` 的 `toolConfirm`（死代码）

## 后续扩展（不纳入 MVP）

- 支持导出为 Markdown/PDF
- 批量生成模式（读取知识点列表自动生成）
- MCP 服务器模式（供 Claude Code 调用）
- 多语言支持
