const STORAGE_KEY = 'sf_chat_sessions';
const MAX_SESSIONS = 50;

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  try {
    const trimmed = sessions.slice(-MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Failed to save chat sessions:', err);
  }
}

export function applySlidingWindow(
  messages: ChatMessage[],
  maxRounds: number = 20
): ChatMessage[] {
  const system = messages.filter(m => m.role === 'system');
  const conversation = messages.filter(m => m.role !== 'system');
  const recent = conversation.slice(-maxRounds * 2);
  return [...system, ...recent];
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateMessageTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return '新对话';
  return firstUser.content.slice(0, 20);
}
