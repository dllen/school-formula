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
          ? 'bg-[#3370FF] text-white rounded-br-sm'
          : 'bg-white border border-[#F0F1F2] text-[#1F2329] rounded-bl-sm shadow-sm'
      }`}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none prose-headings:text-[#1F2329] prose-p:text-[#1F2329] prose-strong:text-[#1F2329] prose-code:text-[#3370FF] prose-a:text-[#3370FF] prose-li:marker:text-[#8F959E]">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        <div className={`mt-1 text-[10px] ${isUser ? 'text-white/60' : 'text-[#8F959E]'}`}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
