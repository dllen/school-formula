import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../icons/Icon';
import { MessageBubble } from './MessageBubble';
import type { MessageAreaProps } from './types';

export function MessageArea({ messages, isLoading, error, onSend, onClear }: MessageAreaProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-divider px-4 py-2">
        <h2 className="text-label font-semibold text-ink-2">对话</h2>
        <button type="button" onClick={onClear} className="btn btn-ghost">
          清空对话
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-label="对话内容"
      >
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && messages[messages.length - 1]?.content === '' && (
          <p className="flex items-center gap-2 text-body-s text-ink-3" role="status">
            <Icon name="ai" className="h-4 w-4 shrink-0 text-accent" />
            正在思考
          </p>
        )}
      </div>

      {error && (
        <p className="mx-4 mb-2 rounded-lg bg-error-bg px-3 py-2 text-body-s text-error-ink" role="alert">
          {error}
        </p>
      )}

      <div className="px-4 pb-3">
        <div className="composer">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题"
            aria-label="输入你的问题"
            rows={1}
            className="composer__input"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary shrink-0"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
