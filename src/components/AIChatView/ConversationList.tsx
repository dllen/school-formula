import { Icon } from '../icons/Icon';
import type { ConversationListProps } from './types';

export function ConversationList({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: ConversationListProps) {
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="chat-list">
      <div className="chat-list__head">
        <button type="button" onClick={onNewSession} className="btn btn-primary w-full">
          新建对话
        </button>
      </div>

      <div className="chat-list__scroll">
        {sorted.length === 0 ? (
          <p className="px-2 py-6 text-center text-body-s text-ink-3">暂无对话记录</p>
        ) : (
          <ul className="chat-list__list" aria-label="对话列表">
            {sorted.map(session => (
              <li key={session.id} className="chat-list__row">
                <button
                  type="button"
                  aria-current={session.id === activeSessionId ? 'true' : undefined}
                  onClick={() => onSelectSession(session.id)}
                  className="chat-list__item"
                >
                  {session.title}
                </button>
                <button
                  type="button"
                  aria-label="删除对话"
                  onClick={() => onDeleteSession(session.id)}
                  className="chat-list__delete"
                >
                  <Icon name="cross" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
