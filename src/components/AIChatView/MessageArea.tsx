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
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F1F2]">
        <div>
          <h2 className="text-lg font-bold text-[#1F2329]">AI 助教</h2>
          <p className="text-xs text-[#8F959E]">智能问答助手</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 text-xs text-[#646A73] hover:text-[#1F2329] hover:bg-[#F5F6F7] rounded-lg transition-colors border border-[#E5E6EB]"
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
              <span className="w-2 h-2 bg-[#3370FF] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#3370FF] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#3370FF] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-sm text-[#8F959E]">思考中...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-6 mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="px-6 pb-4">
        <div className="border border-[#E5E6EB] rounded-xl bg-white p-3 shadow-sm focus-within:border-[#3370FF] focus-within:ring-2 focus-within:ring-[#E1EAFF] transition-all">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题...（Shift+Enter 换行）"
              rows={1}
              className="flex-1 resize-none outline-none text-sm text-[#1F2329] placeholder:text-[#8F959E] max-h-40"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-[#3370FF] text-white text-sm font-medium rounded-lg hover:bg-[#2454D8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
