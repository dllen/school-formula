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
    <div className="w-[280px] bg-white border-r border-[#E5E6EB] flex flex-col h-full">
      <div className="p-4 border-b border-[#F0F1F2]">
        <button
          type="button"
          onClick={onNewSession}
          className="w-full px-4 py-2.5 bg-[#3370FF] text-white text-sm font-medium rounded-lg hover:bg-[#2454D8] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建对话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1" role="list" aria-label="对话列表">
        {sorted.length === 0 && (
          <p className="text-sm text-[#8F959E] text-center py-8">暂无对话记录</p>
        )}
        {sorted.map(session => (
          <div
            key={session.id}
            role="listitem"
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              session.id === activeSessionId
                ? 'bg-[#E1EAFF] text-[#3370FF]'
                : 'text-[#1F2329] hover:bg-[#F5F6F7]'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z" />
            </svg>
            <span className="flex-1 text-sm truncate">{session.title}</span>
            <button
              type="button"
              aria-label="删除对话"
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
              onClick={e => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
            >
              <svg className="w-3.5 h-3.5 text-[#8F959E] hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
