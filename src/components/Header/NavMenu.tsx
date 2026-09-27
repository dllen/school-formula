import { useEffect, useRef, useState } from 'react';
import type { ViewType } from './types';

interface NavGroup {
  label: string;
  views: { value: ViewType; label: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: '学科学习',
    views: [
      { value: 'knowledge', label: '知识点' },
      { value: 'formula', label: '公式宝典' },
      { value: 'mental-math', label: '速算口诀' },
      { value: 'tutorial', label: '教程' },
    ],
  },
  {
    label: '工具速查',
    views: [
      { value: 'cheatsheet', label: '速查表' },
      { value: 'practice', label: '专题练习' },
      { value: 'mastery', label: '融会贯通' },
      { value: 'notes', label: '学习笔记' },
    ],
  },
  {
    label: '古籍阅读',
    views: [
      { value: 'zizhi', label: '资治通鉴' },
      { value: 'shiji', label: '史记' },
    ],
  },
  {
    label: 'AI 助手',
    views: [
      { value: 'ai-chat', label: 'AI 助教' },
    ],
  },
];

interface NavMenuProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function NavMenu({ activeView, onViewChange }: NavMenuProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // hover intent：移出后延迟关闭，给用户斜向移动留出时间；移入则取消关闭
  const open = (label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenGroup(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 200);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <nav aria-label="主导航" className="hidden md:flex gap-1 bg-[#F5F6F7] p-1 rounded-lg">
      {NAV_GROUPS.map((group) => {
        const isOpen = openGroup === group.label;
        const isActive = group.views.some((v) => v.value === activeView);

        return (
          <div
            key={group.label}
            className="relative"
            onMouseEnter={() => open(group.label)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              onClick={() => (isOpen ? setOpenGroup(null) : open(group.label))}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1 ${
                isActive ? 'bg-white text-[#3370FF] shadow-sm' : 'text-[#646A73] hover:text-[#1F2329]'
              }`}
            >
              {group.label}
              <svg
                className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div
                role="menu"
                aria-label={group.label}
                className="absolute left-0 top-full pt-1 w-40 z-50"
              >
                <div className="bg-white rounded-lg shadow-lg border border-[#F0F1F2] py-1">
                {group.views.map((view) => (
                  <button
                    key={view.value}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onViewChange(view.value);
                      setOpenGroup(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeView === view.value
                        ? 'text-[#3370FF] bg-[#E1EAFF] font-medium'
                        : 'text-[#1F2329] hover:bg-[#F5F6F7] hover:text-[#1F2329]'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
