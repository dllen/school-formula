import Markdown from 'react-markdown';
import type { ChatMessage } from '../../services/chat-history';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
          isUser ? 'bg-accent text-accent-ink' : 'bg-paper-2 text-ink'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-body-s">{message.content}</p>
        ) : (
          <div className="prose-body max-w-none text-body-s">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        <div className={`mt-1 text-caption ${isUser ? 'text-accent-ink/75' : 'text-ink-3'}`}>
          {message.timestamp > 0
            ? new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            : null}
        </div>
      </div>
    </div>
  );
}
