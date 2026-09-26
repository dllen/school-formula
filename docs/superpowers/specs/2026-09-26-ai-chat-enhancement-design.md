# AI 助教聊天页面增强设计

> 日期：2026-09-26
> 状态：已批准

## 概述

增强现有 `AIChatView` 组件，实现：
1. **聊天历史持久化**：localStorage 存储，页面刷新不丢失
2. **多轮对话优化**：滑动窗口（最近 20 条），防止 token 溢出
3. **对话管理**：左侧对话列表，支持新建/切换/删除多对话
4. **UI 美化**：ChatGPT/Claude 风格双栏布局

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 存储方案 | localStorage | 纯前端，无需后端改动 |
| 模型切换 | 保持全局设置 | 现有 SettingsModal 已满足 |
| UI 风格 | ChatGPT/Claude 双栏 | 用户选择，体验最佳 |
| 滑动窗口 | 20 轮（40 条消息） | 平衡上下文长度与 token 限制 |

## 架构

### 文件结构

```
src/
├── services/
│   └── chat-history.ts              ← 新增：对话持久化层
│       ├── ChatSession 接口
│       ├── loadSessions() / saveSessions()
│       └── applySlidingWindow()
│
└── components/AIChatView/          ← 重构为子目录
    ├── index.tsx                    ← 组合入口（替代原 AIChatView.tsx）
    ├── ConversationList.tsx         ← 新增：左侧对话列表
    ├── MessageArea.tsx              ← 新增：右侧消息区
    ├── MessageBubble.tsx            ← 新增：消息气泡
    └── types.ts                     ← 共享类型
```

### 数据模型

```typescript
// src/services/chat-history.ts

interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;                    // 会话唯一 ID
  title: string;                // 对话标题（首条用户消息前 20 字）
  messages: ChatMessage[];      // 消息列表
  createdAt: number;            // 创建时间
  updatedAt: number;            // 最后更新时间
}
```

### 滑动窗口逻辑

```typescript
// 保留最近 20 轮对话（40 条消息），system prompt 始终保留
function applySlidingWindow(messages: ChatMessage[], maxRounds = 20): ChatMessage[] {
  const system = messages.filter(m => m.role === 'system');
  const conversation = messages.filter(m => m.role !== 'system');
  const recent = conversation.slice(-maxRounds * 2);
  return [...system, ...recent];
}
```

### localStorage 交互

```
Key: sf_chat_sessions
Value: ChatSession[] (JSON)

读取时机：组件挂载时
写入时机：每次消息发送后
错误处理：写入失败静默降级（console.warn），不阻塞发送
```

## 实现步骤

### 第一步：数据层 + 持久化

**新增文件**：`src/services/chat-history.ts`
- 实现 `loadSessions()` / `saveSessions()`
- 实现 `applySlidingWindow()`
- 实现 `generateSessionId()` / `generateMessageTitle()`

**修改文件**：`src/components/AIChatView.tsx`
- 引入 `chat-history.ts`
- 消息状态改为从 localStorage 加载
- 发送后保存到 localStorage
- 发送前应用滑动窗口

### 第二步：对话列表 + 双栏布局

**新增文件**：
- `src/components/AIChatView/index.tsx`（组合入口）
- `src/components/AIChatView/ConversationList.tsx`
- `src/components/AIChatView/MessageArea.tsx`
- `src/components/AIChatView/MessageBubble.tsx`
- `src/components/AIChatView/types.ts`

**删除文件**：`src/components/AIChatView.tsx`（原单文件）

**功能**：
- 左侧列表：显示所有对话，支持新建/切换/删除
- 右侧区域：消息气泡 + 输入框
- 对话标题自动取首条用户消息前 20 字

### 第三步：UI 美化

**修改文件**：第二步中所有新增组件

**样式要点**：
- 对话列表：280px 窄栏，白底，hover 高亮，当前对话蓝底
- 消息气泡：用户右对齐蓝色圆角，助手左对齐白底圆角带浅边框
- 输入区：底部固定，圆角矩形，聚焦蓝色光晕
- 动画：新消息淡入

## 不改动的部分

- `src/services/gateway.ts`：后端通信逻辑不变
- `src/services/ai.ts`：AI 调用入口不变
- `worker/routes/ai.ts`：后端 API 不变
- `src/components/SettingsModal.tsx`：设置弹窗不变
- `src/components/Home.tsx`：视图切换逻辑不变（仍用 `ai-chat`）

## 测试策略

- 发送消息 → 刷新页面 → 消息仍在（持久化验证）
- 发送超过 20 轮 → 验证滑动窗口截断
- 新建对话 → 切换 → 删除（对话管理验证）
- localStorage 不可用 → 静默降级，不报错

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| localStorage 空间不足 | 限制最多 50 个对话，超出时删除最旧 |
| 滑动窗口丢失重要上下文 | system prompt 始终保留，用户可查看历史 |
| JSON 解析失败 | try-catch 回退到空列表 |
