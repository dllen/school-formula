import type { ChatMessage } from '../../services/chat-history';

export type { ChatMessage };

export interface ConversationListProps {
  sessions: import('../../services/chat-history').ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export interface MessageAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onClear: () => void;
}
