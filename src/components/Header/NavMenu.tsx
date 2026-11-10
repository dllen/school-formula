import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ViewType } from './types';
import { pathForView } from '../../view-routes';
import { Icon } from '../icons/Icon';

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
    label: '经典阅读',
    views: [
      { value: 'zizhi', label: '资治通鉴' },
      { value: 'shiji', label: '史记' },
      { value: 'poetry', label: '古诗词' },
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
}

export function NavMenu({ activeView }: NavMenuProps) {
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
    <nav aria-label="主导航" className="nav">
      {NAV_GROUPS.map((group) => {
        const isOpen = openGroup === group.label;
        const isActive = group.views.some((v) => v.value === activeView);

        return (
          <div
            key={group.label}
            className="nav-wrap"
            onMouseEnter={() => open(group.label)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              data-active={isActive ? 'true' : undefined}
              onClick={() => (isOpen ? setOpenGroup(null) : open(group.label))}
              className="nav-link"
            >
              {group.label}
              <Icon name="chevron-down" className="w-3 h-3" />
            </button>

            {isOpen && (
              <div role="menu" aria-label={group.label} className="nav-panel">
                {group.views.map((view) => (
                  <Link
                    key={view.value}
                    to={pathForView(view.value)}
                    role="menuitem"
                    data-active={activeView === view.value ? 'true' : undefined}
                    onClick={() => setOpenGroup(null)}
                  >
                    {view.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
