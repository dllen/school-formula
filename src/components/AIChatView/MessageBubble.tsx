import Markdown from 'react-markdown';
import type { ChatMessage } from '../../services/chat-history';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-[accent] text-white rounded-br-sm'
          : 'bg-white border border-[divider] text-[ink] rounded-bl-sm shadow-sm'
      }`}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none prose-headings:text-[ink] prose-p:text-[ink] prose-strong:text-[ink] prose-code:text-[accent] prose-a:text-[accent] prose-li:marker:text-[ink-3]">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        <div className={`mt-1 text-[10px] ${isUser ? 'text-white/60' : 'text-[ink-3]'}`}>
          {message.timestamp > 0 ? new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : null}
        </div>
      </div>
    </div>
  );
}
