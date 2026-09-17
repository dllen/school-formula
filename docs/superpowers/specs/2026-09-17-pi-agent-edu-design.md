# pi-agent-edu 设计文档

## 概述

交互式 CLI 工具，通过 pi agent SDK 生成中小学教育资源（教程、练习题等）。

**核心特性**：pi agent 全程工具调用需人工确认，保证生成内容严格符合模板规范。

## 用户交互流程

```
启动 → 检查/引导配置 API Key → 加载会话历史（可选恢复）
    ↓
用户输入目标
    ↓
pi agent 分析 → 打印思考过程
    ↓
遇到工具调用 → 暂停，打印确认提示
    ↓
用户输入 y/n/q
    ↓
y=执行，n=跳过，q=中止任务
    ↓
生成结果 → 打印预览 → 询问保存
    ↓
用户确认 → 写入文件
    ↓
继续对话 / 新对话 / 退出
```

## 工具确认策略

| 工具 | 默认行为 | 说明 |
|------|---------|------|
| `read` | 自动放行 | 只读，无风险 |
| `grep` | 自动放行 | 只读，无风险 |
| `find` | 自动放行 | 只读，无风险 |
| `bash` | 需确认 | 可能执行危险命令 |
| `write` | 需确认 | 写入文件 |
| `edit` | 需确认 | 修改文件 |

用户可对单个工具切换默认行为（`y all` / `n all`）。

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

自定义工具集，封装 pi SDK 的 `defineTool`：

```typescript
// 核心工具
read(path: string, encoding?: string)
bash(command: string, cwd?: string)
write(path: string, content: string, encoding?: string)
edit(path: string, find: string, replace: string, occurrence?: number)

// 扩展工具
grep(path: string, pattern: string, options?: GrepOptions)
find(path: string, pattern: string, options?: FindOptions)
```

### `session.ts`

- 封装 `createAgentSession()`
- 实现 `ToolCallInterceptor`：监听工具调用事件，暂停执行，提交用户确认
- 核心方法：
  - `prompt(message: string)`: 发送消息
  - `confirmToolCall(tool, args)`: 工具确认回调
  - `getHistory()`: 获取对话历史

### `io.ts`

终端 I/O 封装：

- 彩色输出（chalk 或 picocolors）
- 确认提示：`[y/n/q/a/b]?` （y=是，n=否，q=退出，a=yes all，b=no all）
- 分页显示（长输出自动分页）
- 进度动画

### `prompts.ts`

System prompt 模板，包含：

- 角色定义（中学教师专家）
- 输出格式规范（TutorialUnit 接口）
- 教育内容质量要求（准确、适龄、分层）
- 工具使用指导

### `index.ts`

CLI 入口：

```bash
pi-agent-edu                    # 新会话
pi-agent-edu --continue         # 恢复最近会话
pi-agent-edu --continue <id>     # 恢复指定会话
pi-agent-edu --sessions          # 列出会话
pi-agent-edu --new               # 强制新会话
pi-agent-edu --help              # 帮助
```

## 输出格式

### 教育内容类型

根据用户输入推断或明确指定：

1. **TutorialUnit**: 教程单元（教/学/练 + 10 题）
2. **Question[]**: 练习题组（可指定数量和难度）
3. **KnowledgePoint**: 知识点讲解
4. **Answer**: 习题答案与解析

### 保存确认

生成完成后：

```
─────────────────────────────────────
📄 生成内容预览（50 行）

[内容预览...]

─────────────────────────────────────
💾 保存到：src/data/tutorials/primary-math.ts
   [追加] 现有内容 / [覆盖] 全部替换 / [放弃]

选择：1
```

## 技术栈

- **Runtime**: Node.js + TypeScript
- **SDK**: `pi-sdk`（@pi-kit/sdk）
- **执行**: `tsx`（直接运行 TS）
- **配置**: JSON（无外部依赖）

## 依赖项

```json
{
  "type": "module",
  "scripts": {
    "pi-agent-edu": "tsx scripts/pi-agent-edu/index.ts"
  },
  "dependencies": {
    "@pi-kit/sdk": "^1.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 错误处理

| 场景 | 处理方式 |
|------|---------|
| API Key 无效 | 提示重新输入，更新配置 |
| 网络错误 | 重试 3 次，提示用户 |
| pi SDK 错误 | 打印错误信息，提供诊断建议 |
| 文件写入失败 | 提示权限问题，建议手动复制 |
| 用户中断（Ctrl+C） | 保存当前会话，优雅退出 |

## 配置示例

`~/.pi-edu/config.json`:

```json
{
  "apiKey": "pk-xxxxx",
  "model": "pi-agent",
  "autoApproveTools": ["read", "grep", "find"],
  "sessionsDir": "~/.pi-edu/sessions/"
}
```

## 后续扩展（不纳入 MVP）

- 支持导出为 Markdown/PDF
- 批量生成模式（读取知识点列表自动生成）
- MCP 服务器模式（供 Claude Code 调用）
- 多语言支持
