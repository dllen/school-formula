import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadSessions,
  saveSessions,
  applySlidingWindow,
  generateSessionId,
  generateMessageTitle,
  type ChatSession,
  type ChatMessage,
} from './chat-history';

function makeMessage(id: string, role: ChatMessage['role'], content: string): ChatMessage {
  return { id, role, content, timestamp: Date.now() };
}

function makeMessages(count: number): ChatMessage[] {
  return Array.from({ length: count }, (_, i) =>
    makeMessage(`msg-${i}`, i % 2 === 0 ? 'user' : 'assistant', `Message ${i}`)
  );
}

describe('chat-history', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadSessions', () => {
    it('returns empty array when no sessions stored', () => {
      expect(loadSessions()).toEqual([]);
    });

    it('returns parsed sessions from localStorage', () => {
      const sessions: ChatSession[] = [{
        id: 'test-1',
        title: 'Test',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }];
      localStorage.setItem('sf_chat_sessions', JSON.stringify(sessions));
      expect(loadSessions()).toEqual(sessions);
    });

    it('returns empty array on JSON parse error', () => {
      localStorage.setItem('sf_chat_sessions', 'invalid json{{');
      expect(loadSessions()).toEqual([]);
    });
  });

  describe('saveSessions', () => {
    it('saves sessions to localStorage', () => {
      const sessions: ChatSession[] = [{
        id: 'test-1',
        title: 'Test',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }];
      saveSessions(sessions);
      const stored = JSON.parse(localStorage.getItem('sf_chat_sessions')!);
      expect(stored).toEqual(sessions);
    });

    it('limits to 50 sessions, removing oldest', () => {
      const sessions: ChatSession[] = Array.from({ length: 55 }, (_, i) => ({
        id: `session-${i}`,
        title: `Session ${i}`,
        messages: [],
        createdAt: Date.now() + i,
        updatedAt: Date.now() + i,
      }));
      saveSessions(sessions);
      const stored = loadSessions();
      expect(stored).toHaveLength(50);
      expect(stored[0].id).toBe('session-5');
    });
  });

  describe('applySlidingWindow', () => {
    it('keeps all messages within limit', () => {
      const messages = makeMessages(30);
      const result = applySlidingWindow(messages, 20);
      expect(result).toHaveLength(30);
    });

    it('truncates to keep only recent 20 rounds (40 messages)', () => {
      const messages = makeMessages(60);
      const result = applySlidingWindow(messages, 20);
      expect(result).toHaveLength(40);
      expect(result[0].id).toBe('msg-20');
    });

    it('always keeps system messages', () => {
      const messages: ChatMessage[] = [
        makeMessage('sys', 'system', 'System prompt'),
        ...makeMessages(60),
      ];
      const result = applySlidingWindow(messages, 20);
      expect(result[0].role).toBe('system');
      expect(result).toHaveLength(41);
    });
  });

  describe('generateSessionId', () => {
    it('generates unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^session-\d+-/);
    });
  });

  describe('generateMessageTitle', () => {
    it('creates title from first user message', () => {
      const messages: ChatMessage[] = [
        makeMessage('1', 'system', 'sys'),
        makeMessage('2', 'user', '什么是二次方程？请帮我解释一下'),
        makeMessage('3', 'assistant', '二次方程是...'),
      ];
      expect(generateMessageTitle(messages)).toBe('什么是二次方程？请帮我解释一下');
    });

    it('returns default title if no user message', () => {
      const messages: ChatMessage[] = [
        makeMessage('1', 'system', 'sys'),
      ];
      expect(generateMessageTitle(messages)).toBe('新对话');
    });
  });
});
