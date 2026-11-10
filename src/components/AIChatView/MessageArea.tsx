import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import type { MessageAreaProps } from './types';

export function MessageArea({ messages, isLoading, error, onSend, onClear }: MessageAreaProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[divider]">
        <div>
          <h2 className="text-lg font-bold text-[ink]">AI 助教</h2>
          <p className="text-xs text-[ink-3]">智能问答助手</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 text-xs text-[ink-2] hover:text-[ink] hover:bg-[paper-2] rounded-lg transition-colors border border-[rule]"
        >
          清空对话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:300ms]" />
            </div>
            <span className="text-sm text-[ink-3]">思考中…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-6 mb-3 px-4 py-3 bg-error-bg border border-error-bg rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      <div className="px-6 pb-4">
        <div className="border border-[rule] rounded-xl bg-white p-3 shadow-sm focus-within:border-[accent] focus-within:ring-2 focus-within:ring-[accent-soft] transition-colors">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题…（Shift+Enter 换行）"
              rows={1}
              className="flex-1 resize-none outline-none text-sm text-[ink] placeholder:text-[ink-3] max-h-40"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-[accent] text-white text-sm font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
