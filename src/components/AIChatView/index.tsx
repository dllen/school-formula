import { useState, useEffect, useCallback } from 'react';
import { ConversationList } from './ConversationList';
import { MessageArea } from './MessageArea';
import { generateChat, getAIConfig } from '../../services/ai';
import {
  loadSessions,
  saveSessions,
  applySlidingWindow,
  generateSessionId,
  generateMessageTitle,
  type ChatSession,
  type ChatMessage,
} from '../../services/chat-history';

const SYSTEM_PROMPT = `你是一位专业的中小学教育顾问 AI 助手，名叫「拾艺院助教」。

你的职责是帮助家长和学生：
- 解答学科知识疑问（数学、语文、英语、物理、化学、生物、历史、地理、政治）
- 讲解重难点，用通俗易懂的语言配合生活案例
- 提供学习方法和解题思路
- 设计练习题并给出解析
- 分享亲子互动学习游戏

回答要求：
- 用中文回答，语言亲切自然
- 回答简洁有条理，善用标题和列表
- 涉及公式时用 LaTeX 格式（行内 $...$，块级 $$...$$）
- 不要输出与教育无关的内容`;

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: '你好！我是 **拾艺院助教** 👋\n\n我可以帮助你解答学科疑问、讲解知识点、设计练习题，或者分享学习方法。\n\n请问有什么可以帮你的？',
  timestamp: Date.now(),
};

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AIChatView() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [WELCOME_MESSAGE];

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const updateSessionMessages = useCallback((sessionId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, messages: updater(s.messages), updatedAt: Date.now() }
          : s
      )
    );
  }, []);

  const handleSend = async (content: string) => {
    if (isLoading) return;

    const config = getAIConfig();
    if (!config) {
      setError('请先配置 AI 服务。点击右上角设置按钮，选择「Cloudflare 网关（VIP）」或其他提供商。');
      return;
    }

    setError(null);

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = generateSessionId();
      const newSession: ChatSession = {
        id: sessionId,
        title: content.slice(0, 20),
        messages: [WELCOME_MESSAGE],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(sessionId);
    }

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    updateSessionMessages(sessionId, msgs => [...msgs, userMessage]);

    const assistantMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    updateSessionMessages(sessionId, msgs => [...msgs, assistantMessage]);

    setIsLoading(true);

    try {
      const currentSession = sessions.find(s => s.id === sessionId);
      const allMessages = [...(currentSession?.messages ?? []), userMessage];
      const windowedMessages = applySlidingWindow(allMessages, 20);

      const history = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...windowedMessages.map(m => ({ role: m.role, content: m.content })),
      ];

      await generateChat(history, (chunk: string) => {
        updateSessionMessages(sessionId, msgs =>
          msgs.map(m =>
            m.id === assistantMessage.id
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      });

      if (currentSession && currentSession.title === '新对话') {
        setSessions(prev =>
          prev.map(s =>
            s.id === sessionId
              ? { ...s, title: generateMessageTitle([...allMessages, assistantMessage]) }
              : s
          )
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 调用失败';
      setError(message);
      updateSessionMessages(sessionId, msgs =>
        msgs.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: `⚠️ 出错了：${message}` }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setError(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setError(null);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  const handleClear = () => {
    if (activeSessionId) {
      updateSessionMessages(activeSessionId, () => [WELCOME_MESSAGE]);
    } else {
      setActiveSessionId(null);
    }
    setError(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-[#E5E6EB]">
      <ConversationList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
      />
      <MessageArea
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSend={handleSend}
        onClear={handleClear}
      />
    </div>
  );
}
